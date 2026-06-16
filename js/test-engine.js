window.ExamZenTestEngine = function (ctx) {
  const {
    data,
    auth,
    store,
    routes,
    query,
    escapeHtml,
    testUrl,
    toast,
    requireLogin,
    saveTestSession,
    readTestSession,
    clearTestSession,
    toggleBookmark,
    isBookmarked,
    pushResult,
    formatDate,
    formatDuration,
    user
  } = ctx;

  const host = document.getElementById('testHost');
  if (!host) return;

  const testId = query('test');
  const test = data.tests.find((item) => item.id === testId);

  if (!test) {
    host.innerHTML = `
      <div class="container" style="padding:32px 0;">
        <div class="card info-card">
          <h2>Mock not found</h2>
          <p class="muted">The requested mock test does not exist.</p>
          <a class="btn primary" href="${routes.exams}">Back to Exams</a>
        </div>
      </div>
    `;
    return;
  }

  if (test.premium && !auth.isPremium()) {
    host.innerHTML = `
      <div class="container" style="padding:32px 0;">
        <div class="card info-card">
          <span class="tag locked">Premium only</span>
          <h2>${escapeHtml(test.title)}</h2>
          <p class="muted">Upgrade your account to access this premium mock in the full exam-style interface.</p>
          <div class="hero-actions">
            <a class="btn primary" href="${routes.pricing}">View Plans</a>
            <a class="btn secondary" href="${routes.partner}">Apply Coupon</a>
          </div>
        </div>
      </div>
    `;
    return;
  }

  const sections = [...new Set(test.questions.map((question) => question.section || 'General'))];
  const sectionMeta = sections.map((section, idx) => ({
    name: section,
    label: `PART ${String.fromCharCode(65 + idx)}`,
    index: idx,
    indexes: test.questions
      .map((question, qIndex) => ({ question, qIndex }))
      .filter((row) => (row.question.section || 'General') === section)
      .map((row) => row.qIndex)
  }));

  const persisted = readTestSession(test.id);
  let state = {
    current: 0,
    remaining: test.durationMinutes * 60,
    answers: {},
    marked: {},
    visited: {},
    language: 'English',
    startedAt: null,
    phase: 'instructions-1',
    paused: false,
    agreed: false,
    ...persisted
  };

  let timerId = null;
  let submitModal = false;
  let unloadBound = false;

  if (!state.currentOpenedAt) state.currentOpenedAt = Date.now();

  function persist() {
    saveTestSession(test.id, state);
  }

  function getQuestion(index = state.current) {
    return test.questions[index];
  }

  function getSectionMetaByQuestion(index = state.current) {
    return sectionMeta.find((section) => section.indexes.includes(index)) || sectionMeta[0];
  }

  function getQuestionStatus(question) {
    const answered = state.answers[question.id] !== undefined;
    const marked = Boolean(state.marked[question.id]);

    if (answered && marked) return 'answered-marked';
    if (answered) return 'answered';
    if (marked) return 'marked';
    return 'not-answered';
  }

  function getCounts(indexes = test.questions.map((_, idx) => idx)) {
    const counts = {
      total: indexes.length,
      answered: 0,
      notAnswered: 0,
      marked: 0,
      answeredMarked: 0
    };

    indexes.forEach((index) => {
      const status = getQuestionStatus(test.questions[index]);
      if (status === 'answered') counts.answered += 1;
      if (status === 'not-answered') counts.notAnswered += 1;
      if (status === 'marked') counts.marked += 1;
      if (status === 'answered-marked') counts.answeredMarked += 1;
    });

    return counts;
  }

  function totalAttempted() {
    return test.questions.filter((question) => {
      const status = getQuestionStatus(question);
      return status === 'answered' || status === 'answered-marked';
    }).length;
  }

  function currentSectionCounts() {
    return getCounts(getSectionMetaByQuestion().indexes);
  }

  function jumpTo(index) {
    state.current = Math.max(0, Math.min(test.questions.length - 1, index));
    state.currentOpenedAt = Date.now();
    state.visited[getQuestion().id] = true;
    persist();
    render();
  }

  function nextSection() {
    const currentSection = getSectionMetaByQuestion();
    const next = sectionMeta[currentSection.index + 1];
    if (next) {
      jumpTo(next.indexes[0]);
      toast(`${next.label} opened.`, 'success');
    } else {
      openSubmitModal();
    }
  }

  function startTimer() {
    if (state.phase !== 'exam' || state.paused || timerId) return;
    timerId = window.setInterval(() => {
      state.remaining -= 1;
      if (state.remaining <= 0) {
        state.remaining = 0;
        persist();
        stopTimer();
        submitTest(true);
        return;
      }
      persist();
      const live = host.querySelector('[data-ezx-timer]');
      if (live) live.textContent = formatDuration(state.remaining);
      const mini = host.querySelector('.ezx-mini-time');
      if (mini) mini.textContent = `⏱ ${getCurrentQuestionElapsed()}`;
    }, 1000);
  }

  function stopTimer() {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function bindUnloadWarning() {
    if (unloadBound) return;
    unloadBound = true;
    window.addEventListener('beforeunload', (event) => {
      if (state.phase === 'exam') {
        event.preventDefault();
        event.returnValue = '';
      }
    });
  }

  function goToPhase(phase) {
    state.phase = phase;
    if (phase !== 'exam') {
      state.paused = false;
      stopTimer();
    }
    if (phase === 'exam' && !state.startedAt) {
      state.startedAt = new Date().toISOString();
      state.currentOpenedAt = Date.now();
      state.visited[getQuestion().id] = true;
    }
    persist();
    render();
  }

  function getCurrentQuestionElapsed() {
    const elapsed = Math.max(0, Math.floor((Date.now() - (state.currentOpenedAt || Date.now())) / 1000));
    return formatDuration(elapsed);
  }

  function openSubmitModal() {
    submitModal = true;
    render();
  }

  function closeSubmitModal() {
    submitModal = false;
    render();
  }

  function renderInstructionHeader(title) {
    return `
      <div class="ezx-frame">
        <div class="ezx-page-header">
          <div class="ezx-page-logo">EZ</div>
          <div class="ezx-page-brand">EXAMZEN</div>
          <div class="ezx-page-lang">${state.language === 'Hindi' ? 'हि/EN' : 'EN/हि'}</div>
        </div>
        <div class="ezx-page-titlebar">${title}</div>
    `;
  }

  function renderOverviewStep() {
    const sectionTime = Math.max(1, Math.round(test.durationMinutes / Math.max(sectionMeta.length, 1)));
    host.innerHTML = `
      <div class="ezx-stage-wrap">
        ${renderInstructionHeader('INSTRUCTIONS, TERMS & CONDITIONS')}
        <div class="ezx-page-body">
          <div class="ezx-block-title">1. Exam Overview / परीक्षा का संक्षिप्त विवरण</div>
          <ul class="ezx-bullet-list">
            <li><strong>Duration:</strong> ${test.durationMinutes} Minutes</li>
            <li><strong>Total Questions:</strong> ${test.questions.length}</li>
            <li><strong>Correct Marks:</strong> +2</li>
            <li><strong>Negative Marking:</strong> -0.5</li>
          </ul>

          <div class="ezx-table-wrap">
            <table class="ezx-plain-table">
              <thead>
                <tr>
                  <th>Section Name</th>
                  <th>Questions</th>
                  <th>Time(Mins)</th>
                  <th>Marks</th>
                  <th>Negative</th>
                </tr>
              </thead>
              <tbody>
                ${sectionMeta.map((section) => `
                  <tr>
                    <td>${escapeHtml(section.name).toUpperCase()}</td>
                    <td>${section.indexes.length}</td>
                    <td>${sectionTime}</td>
                    <td>+2</td>
                    <td>-0.5</td>
                  </tr>
                `).join('')}
                <tr>
                  <td><strong>Total</strong></td>
                  <td><strong>${test.questions.length}</strong></td>
                  <td><strong>${test.durationMinutes}</strong></td>
                  <td colspan="2"><strong>Total Time: ${test.durationMinutes} Mins</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="ezx-block-title">2. Timing & Submission / समय और जमा करना</div>
          <ul class="ezx-bullet-list compact">
            <li>The timer appears at the top right and will auto-submit the test when time ends.</li>
            <li>You may move across sections and questions using the section tabs and question palette.</li>
            <li>Use <strong>Save & Next</strong>, <strong>Previous</strong>, <strong>Clear</strong>, and <strong>Mark for Review</strong> as needed.</li>
          </ul>

          <div class="ezx-block-title">3. Language / भाषा</div>
          <ul class="ezx-bullet-list compact">
            <li>English is enabled in this MVP. The language selector flow is also prepared.</li>
            <li>You can switch the display selection before starting the test.</li>
          </ul>

          <div class="ezx-block-title">4. Navigation / नेविगेशन</div>
          <ul class="ezx-bullet-list compact">
            <li>All sections are visible using PART tabs.</li>
            <li>Question numbers on the right indicate attempt status by color.</li>
            <li>After the final question, you may still review before submission.</li>
          </ul>

          <div class="ezx-block-title">5. Answering / उत्तर देना</div>
          <ul class="ezx-bullet-list compact">
            <li>Each question has one correct answer.</li>
            <li>Click any option to select it and use Save & Next to continue.</li>
          </ul>

          <div class="ezx-block-title">6. Additional Notes / अतिरिक्त टिप्पणियाँ</div>
          <ul class="ezx-bullet-list compact">
            <li>Do not use unfair means in the examination.</li>
            <li>Do not refresh or close the browser during the test.</li>
            <li>All responses are auto-saved locally while you attempt the paper.</li>
          </ul>

          <div class="ezx-goodluck">GOOD LUCK.</div>
        </div>
        <div class="ezx-footer-actions">
          <a class="ezx-nav-btn orange" href="${routes.exams}">Go to Tests</a>
          <button type="button" class="ezx-nav-btn blue" id="goInstructionStep2">Next</button>
        </div>
      </div>
    `;

    host.querySelector('#goInstructionStep2')?.addEventListener('click', () => goToPhase('instructions-2'));
  }

  function renderSymbolsStep() {
    host.innerHTML = `
      <div class="ezx-stage-wrap">
        ${renderInstructionHeader('SYMBOLS REFERENCE MAP')}
        <div class="ezx-page-body">
          <p class="ezx-step-note">The different symbols used in the next pages are shown below. Please go through them and understand their meaning before you start the test.</p>

          <div class="ezx-table-card">
            <div class="ezx-symbol-banner">The different symbols used in the next pages are shown below. Please go through them and understand their meaning before you start the test.</div>
            <table class="ezx-symbol-table">
              <thead>
                <tr>
                  <th style="width:200px;">Symbol</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><div class="ezx-symbol-demo"><span class="ezx-radio off"></span></div></td>
                  <td>Option not chosen</td>
                </tr>
                <tr>
                  <td><div class="ezx-symbol-demo"><span class="ezx-radio on"></span></div></td>
                  <td>Option chosen as current answer</td>
                </tr>
                <tr>
                  <td><div class="ezx-symbol-demo"><span class="ezx-palette-sample blue">12</span></div></td>
                  <td>Question number shown in blue indicates that you have not yet attempted the question.</td>
                </tr>
                <tr>
                  <td><div class="ezx-symbol-demo"><span class="ezx-palette-sample green">13</span></div></td>
                  <td>Question number shown in green indicates that you have answered the question.</td>
                </tr>
                <tr>
                  <td><div class="ezx-symbol-demo"><span class="ezx-palette-sample red">14</span></div></td>
                  <td>You have not yet answered the question, but marked it for review later.</td>
                </tr>
                <tr>
                  <td><div class="ezx-symbol-demo"><span class="ezx-palette-sample yellow">15</span></div></td>
                  <td>You have answered the question, but marked it for review later.</td>
                </tr>
                <tr>
                  <td><div class="ezx-symbol-demo"><button class="ezx-sample-btn">Save & Next</button></div></td>
                  <td>Clicking on this will take you to the next question.</td>
                </tr>
                <tr>
                  <td><div class="ezx-symbol-demo"><button class="ezx-sample-btn">Previous</button></div></td>
                  <td>Clicking on this will take you to the previous question.</td>
                </tr>
                <tr>
                  <td><div class="ezx-symbol-demo"><button class="ezx-sample-btn">Mark for Review</button></div></td>
                  <td>Use this to mark a question for review later.</td>
                </tr>
                <tr>
                  <td><div class="ezx-symbol-demo"><button class="ezx-sample-btn light">Unmark Review</button></div></td>
                  <td>Use this to remove the review mark from a question.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="ezx-language-box">
            <label>
              <span>Select Test Language</span>
              <select id="instructionLanguage">
                <option value="English" ${state.language === 'English' ? 'selected' : ''}>English</option>
                <option value="Hindi" ${state.language === 'Hindi' ? 'selected' : ''}>Hindi</option>
              </select>
            </label>
            <label class="ezx-agree-row">
              <input type="checkbox" id="agreeBeforeStart" ${state.agreed ? 'checked' : ''}>
              <span>I have read all the instructions carefully and agree not to use unfair means in this examination.</span>
            </label>
          </div>
        </div>
        <div class="ezx-footer-actions">
          <button type="button" class="ezx-nav-btn orange" id="goInstructionStep1">Back</button>
          <button type="button" class="ezx-nav-btn blue" id="startActualTest" ${state.agreed ? '' : 'disabled'}>Start Test</button>
        </div>
      </div>
    `;

    host.querySelector('#goInstructionStep1')?.addEventListener('click', () => goToPhase('instructions-1'));
    host.querySelector('#instructionLanguage')?.addEventListener('change', (event) => {
      state.language = event.target.value;
      persist();
    });
    host.querySelector('#agreeBeforeStart')?.addEventListener('change', (event) => {
      state.agreed = event.target.checked;
      persist();
      render();
    });
    host.querySelector('#startActualTest')?.addEventListener('click', () => {
      if (!state.agreed) return;
      goToPhase('exam');
    });
  }

  function sectionButton(section, active) {
    return `
      <button type="button" class="ezx-part-btn ${active ? 'active' : ''}" data-open-section="${section.index}">${escapeHtml(section.label)}</button>
    `;
  }

  function paletteButton(index) {
    const question = test.questions[index];
    const status = getQuestionStatus(question);
    return `
      <button type="button" class="ezx-qnum ${status} ${state.current === index ? 'current' : ''}" data-jump="${index}">${index + 1}</button>
    `;
  }

  function renderExam() {
    const question = getQuestion();
    const currentSection = getSectionMetaByQuestion();
    const totalCounts = getCounts();
    const partCounts = currentSectionCounts();
    const candidate = user();

    if (!state.visited[question.id]) {
      state.visited[question.id] = true;
      persist();
    }

    host.innerHTML = `
      <div class="ezx-exam-wrap">
        <div class="ezx-exam-top">
          <div class="ezx-exam-title-group">
            <div class="ezx-exam-title">${escapeHtml(test.title)}</div>
            <button type="button" class="ezx-pause-btn" id="togglePauseBtn">${state.paused ? 'Resume' : '|| Pause'}</button>
          </div>
          <div class="ezx-exam-top-right">
            <div class="ezx-user-pill">${escapeHtml(candidate?.name?.split(' ')[0] || 'Guest')}</div>
            <div class="ezx-main-timer" data-ezx-timer>${formatDuration(state.remaining)}</div>
            <button type="button" class="ezx-mode-btn yellow" id="themeMockBtn">☾</button>
            <button type="button" class="ezx-mode-btn blue" id="bookmarkTestBtn">${isBookmarked(test.id) ? '★' : '↕'}</button>
          </div>
        </div>

        <div class="ezx-center-actions">
          <button type="button" class="ezx-top-action" id="prevQuestionBtn" ${state.current === 0 ? 'disabled' : ''}>Previous</button>
          <button type="button" class="ezx-top-action" id="clearQuestionBtn">Clear</button>
          <button type="button" class="ezx-top-action" id="markReviewBtn">Mark for Review</button>
          <button type="button" class="ezx-top-action" id="saveNextBtn">Save & Next</button>
        </div>

        <div class="ezx-exam-body">
          <section class="ezx-left-panel">
            <div class="ezx-part-tabs">
              ${sectionMeta.map((section) => sectionButton(section, section.index === currentSection.index)).join('')}
            </div>

            <div class="ezx-question-shell">
              <div class="ezx-question-topline">
                <div class="ezx-question-count">Question: ${state.current + 1}</div>
                <div class="ezx-mini-time">⏱ ${getCurrentQuestionElapsed()}</div>
                <div class="ezx-right-tools">
                  <label>
                    <span>Select Language:</span>
                    <select id="examLanguageSelect">
                      <option value="English" ${state.language === 'English' ? 'selected' : ''}>English</option>
                      <option value="Hindi" ${state.language === 'Hindi' ? 'selected' : ''}>Hindi</option>
                    </select>
                  </label>
                  <button type="button" class="ezx-icon-save" id="bookmarkQuestionBtn">Save</button>
                  <button type="button" class="ezx-report-btn" id="reportQuestionBtn">Report</button>
                </div>
              </div>

              <div class="ezx-question-textbox">
                <div class="ezx-question-stem">${escapeHtml(question.text)}</div>
              </div>

              <div class="ezx-options-table">
                ${question.options.map((option, index) => `
                  <label class="ezx-option-line ${state.answers[question.id] === index ? 'active' : ''}">
                    <span class="ezx-option-radio"><input type="radio" name="option" value="${index}" ${state.answers[question.id] === index ? 'checked' : ''}></span>
                    <span class="ezx-option-value">${escapeHtml(option)}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          </section>

          <aside class="ezx-right-panel">
            <div class="ezx-arrow-head">▶</div>
            <div class="ezx-sidebar-title">${escapeHtml(currentSection.name).toUpperCase()}</div>
            <div class="ezx-sidebar-grid">
              ${currentSection.indexes.map((index) => paletteButton(index)).join('')}
            </div>

            <div class="ezx-analysis-box">
              <div class="ezx-analysis-title">${escapeHtml(currentSection.label)} Analysis</div>
              <div class="ezx-analysis-row"><span>Answered</span><strong>${partCounts.answered + partCounts.answeredMarked}</strong></div>
              <div class="ezx-analysis-row"><span>Not Answered</span><strong>${partCounts.notAnswered}</strong></div>
              <div class="ezx-analysis-row"><span>Marked</span><strong>${partCounts.marked + partCounts.answeredMarked}</strong></div>
            </div>

            <div class="ezx-submit-stack">
              <button type="button" class="ezx-submit-blue" id="submitSectionBtn">Submit Section</button>
              <button type="button" class="ezx-submit-blue" id="submitFullTestBtn">Submit Test</button>
            </div>
          </aside>
        </div>

        <div class="ezx-bottom-strip">
          <div>Total Attempted: <strong>${totalAttempted()}</strong> / ${test.questions.length}</div>
          <div>Answered: <strong>${totalCounts.answered + totalCounts.answeredMarked}</strong> · Review: <strong>${totalCounts.marked + totalCounts.answeredMarked}</strong></div>
        </div>

        ${submitModal ? `
          <div class="ezx-modal-backdrop">
            <div class="ezx-modal-card">
              <h3>Submit Test</h3>
              <p class="muted">Please review the summary below before final submission.</p>
              <div class="ezx-submit-summary-grid">
                <div class="ezx-submit-summary-box"><span>Answered</span><strong>${totalCounts.answered + totalCounts.answeredMarked}</strong></div>
                <div class="ezx-submit-summary-box"><span>Not Answered</span><strong>${totalCounts.notAnswered}</strong></div>
                <div class="ezx-submit-summary-box"><span>Marked</span><strong>${totalCounts.marked}</strong></div>
                <div class="ezx-submit-summary-box"><span>Answered & Marked</span><strong>${totalCounts.answeredMarked}</strong></div>
                <div class="ezx-submit-summary-box"><span>Total</span><strong>${totalCounts.total}</strong></div>
                <div class="ezx-submit-summary-box"><span>Time Left</span><strong>${formatDuration(state.remaining)}</strong></div>
              </div>
              <div class="ezx-modal-actions">
                <button type="button" class="btn ghost" id="reviewBeforeSubmitBtn">Review Again</button>
                <button type="button" class="btn danger" id="confirmFinalSubmitBtn">Submit Now</button>
              </div>
            </div>
          </div>
        ` : ''}

        ${state.paused ? `
          <div class="ezx-modal-backdrop dark">
            <div class="ezx-modal-card small">
              <h3>Test Paused</h3>
              <p class="muted">Timer is paused in this preview mode. Click resume when you are ready.</p>
              <div class="ezx-modal-actions">
                <button type="button" class="btn primary" id="resumeFromOverlayBtn">Resume Test</button>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    bindExamEvents();
    startTimer();
    bindUnloadWarning();
  }

  function bindExamEvents() {
    const question = getQuestion();

    host.querySelectorAll('input[name="option"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        state.answers[question.id] = Number(radio.value);
        persist();
        render();
      });
    });

    host.querySelectorAll('[data-jump]').forEach((button) => {
      button.addEventListener('click', () => jumpTo(Number(button.dataset.jump)));
    });

    host.querySelectorAll('[data-open-section]').forEach((button) => {
      button.addEventListener('click', () => {
        const section = sectionMeta.find((item) => item.index === Number(button.dataset.open-section));
        if (section) jumpTo(section.indexes[0]);
      });
    });

    host.querySelector('#prevQuestionBtn')?.addEventListener('click', () => jumpTo(state.current - 1));

    host.querySelector('#clearQuestionBtn')?.addEventListener('click', () => {
      delete state.answers[question.id];
      persist();
      render();
    });

    host.querySelector('#markReviewBtn')?.addEventListener('click', () => {
      state.marked[question.id] = true;
      persist();
      if (state.current === test.questions.length - 1) openSubmitModal();
      else jumpTo(state.current + 1);
    });

    host.querySelector('#saveNextBtn')?.addEventListener('click', () => {
      delete state.marked[question.id];
      persist();
      if (state.current === test.questions.length - 1) openSubmitModal();
      else jumpTo(state.current + 1);
    });

    host.querySelector('#togglePauseBtn')?.addEventListener('click', () => {
      state.paused = !state.paused;
      if (state.paused) stopTimer();
      persist();
      render();
    });

    host.querySelector('#resumeFromOverlayBtn')?.addEventListener('click', () => {
      state.paused = false;
      persist();
      render();
    });

    host.querySelector('#themeMockBtn')?.addEventListener('click', () => {
      toast('Theme toggle icon kept here to match the exam layout.', 'warning');
    });

    host.querySelector('#bookmarkTestBtn')?.addEventListener('click', () => {
      if (!requireLogin('Login to save this mock.')) return;
      const saved = toggleBookmark(test.id);
      toast(saved ? 'Mock saved.' : 'Mock removed.', 'success');
      render();
    });

    host.querySelector('#bookmarkQuestionBtn')?.addEventListener('click', () => {
      if (!requireLogin('Login to save this mock.')) return;
      const saved = toggleBookmark(test.id);
      toast(saved ? 'Mock saved.' : 'Mock removed.', 'success');
      render();
    });

    host.querySelector('#reportQuestionBtn')?.addEventListener('click', () => {
      toast('Question reported in preview mode.', 'warning');
    });

    host.querySelector('#examLanguageSelect')?.addEventListener('change', (event) => {
      state.language = event.target.value;
      persist();
      if (state.language === 'Hindi') toast('Hindi selector added. Hindi question content can be mapped next.', 'warning');
    });

    host.querySelector('#submitSectionBtn')?.addEventListener('click', nextSection);
    host.querySelector('#submitFullTestBtn')?.addEventListener('click', openSubmitModal);
    host.querySelector('#reviewBeforeSubmitBtn')?.addEventListener('click', closeSubmitModal);
    host.querySelector('#confirmFinalSubmitBtn')?.addEventListener('click', () => submitTest(false));
  }

  function submitTest(isAutoSubmit) {
    stopTimer();
    submitModal = false;

    const evaluation = test.questions.map((question) => {
      const selected = state.answers[question.id];
      const correct = selected === question.answer;
      return { question, selected, correct };
    });

    const correct = evaluation.filter((item) => item.correct).length;
    const wrong = evaluation.filter((item) => item.selected !== undefined && !item.correct).length;
    const unattempted = evaluation.filter((item) => item.selected === undefined).length;
    const total = test.questions.length;
    const marksObtained = Number((correct * 2 - wrong * 0.5).toFixed(2));
    const percentage = Math.round((correct / total) * 100);
    const accuracy = correct + wrong ? Math.round((correct / (correct + wrong)) * 100) : 0;

    const result = {
      id: store.uid('result'),
      testId: test.id,
      testTitle: test.title,
      total,
      correct,
      wrong,
      unattempted,
      percentage,
      accuracy,
      marksObtained,
      completedAt: new Date().toISOString(),
      remaining: state.remaining,
      autoSubmitted: isAutoSubmit
    };

    if (user()) pushResult(result);
    clearTestSession(test.id);
    renderResult(result, evaluation);
  }

  function renderResult(result, evaluation) {
    const candidate = user();
    const reviewState = {
      mode: 'analysis',
      current: 0
    };

    function evalStatus(item) {
      if (item.selected === undefined) return 'skipped';
      return item.correct ? 'correct' : 'wrong';
    }

    function evalMarks(item) {
      const status = evalStatus(item);
      if (status === 'correct') return '+2';
      if (status === 'wrong') return '-0.5';
      return '0';
    }

    function sectionCounts(section) {
      return section.indexes.reduce((acc, index) => {
        const status = evalStatus(evaluation[index]);
        if (status === 'correct') acc.correct += 1;
        if (status === 'wrong') acc.wrong += 1;
        if (status === 'skipped') acc.skipped += 1;
        return acc;
      }, { correct: 0, wrong: 0, skipped: 0 });
    }

    function moveSolution(offset) {
      reviewState.current = Math.max(0, Math.min(evaluation.length - 1, reviewState.current + offset));
      renderMode();
    }

    function jumpSolution(index) {
      reviewState.current = Math.max(0, Math.min(evaluation.length - 1, index));
      renderMode();
    }

    function renderAnalysisMode() {
      host.innerHTML = `
        <div class="container" style="padding:28px 0 42px;">
          <section class="section" style="padding-top:0;">
            <div class="section-header">
              <div>
                <span class="tag ${result.autoSubmitted ? 'warning' : 'success'}">${result.autoSubmitted ? 'Auto submitted' : 'Submitted successfully'}</span>
                <h1>${escapeHtml(test.title)} — Analysis</h1>
                <p>${result.autoSubmitted ? 'Time expired, so the test was submitted automatically.' : 'Your test is completed. Open Solution Mode to review each question in exam-style layout.'}</p>
              </div>
            </div>
            <div class="result-grid">
              <article class="card result-card"><h3>Marks</h3><p class="score">${result.marksObtained}</p></article>
              <article class="card result-card"><h3>Correct</h3><p class="score">${result.correct}</p></article>
              <article class="card result-card"><h3>Wrong</h3><p class="score">${result.wrong}</p></article>
              <article class="card result-card"><h3>Accuracy</h3><p class="score">${result.accuracy}%</p></article>
            </div>
            <div class="hero-actions" style="margin-top:18px;">
              <button class="btn primary" type="button" id="openSolutionModeBtn">Open Solution Mode</button>
              <a class="btn secondary" href="${testUrl(test.id)}">Reattempt Mock</a>
              <a class="btn ghost" href="${routes.exams}">Back to Exams</a>
            </div>
            <div class="card table-card" style="margin-top:22px;">
              <table class="table">
                <tbody>
                  <tr><th>Total Questions</th><td>${result.total}</td><th>Completed At</th><td>${formatDate(result.completedAt)}</td></tr>
                  <tr><th>Unattempted</th><td>${result.unattempted}</td><th>Time Left</th><td>${formatDuration(result.remaining)}</td></tr>
                  <tr><th>Score %</th><td>${result.percentage}%</td><th>Marks Scheme</th><td>+2 / -0.5</td></tr>
                </tbody>
              </table>
            </div>
            <div class="grid cols-2" style="margin-top:18px;">
              ${sectionMeta.map((section) => {
                const counts = sectionCounts(section);
                return `
                  <article class="card info-card">
                    <h3 style="margin-top:0;">${escapeHtml(section.label)} · ${escapeHtml(section.name)}</h3>
                    <div class="list">
                      <li><span>Correct</span><strong>${counts.correct}</strong></li>
                      <li><span>Wrong</span><strong>${counts.wrong}</strong></li>
                      <li><span>Skipped</span><strong>${counts.skipped}</strong></li>
                    </div>
                  </article>
                `;
              }).join('')}
            </div>
          </section>
        </div>
      `;
      host.querySelector('#openSolutionModeBtn')?.addEventListener('click', () => {
        reviewState.mode = 'solution';
        renderMode();
      });
    }

    function renderSolutionMode() {
      const item = evaluation[reviewState.current];
      const question = item.question;
      const currentSection = getSectionMetaByQuestion(reviewState.current);
      const counts = sectionCounts(currentSection);
      const status = evalStatus(item);
      const syntheticTime = formatDuration(((reviewState.current % 9) + 2) * 6);

      host.innerHTML = `
        <div class="ezx-exam-wrap ezx-solution-wrap">
          <div class="ezx-solution-topbar">
            <div class="ezx-solution-lefthead">
              <button type="button" class="ezx-analysis-pill" id="backToAnalysisBtn">← Analysis</button>
              <div class="ezx-solution-title">Solution Mode</div>
            </div>
            <div class="ezx-exam-top-right">
              <div class="ezx-user-pill">${escapeHtml(candidate?.name?.split(' ')[0] || 'Guest')}</div>
              <button type="button" class="ezx-mode-btn yellow">☾</button>
              <button type="button" class="ezx-mode-btn blue">↕</button>
            </div>
          </div>

          <div class="ezx-center-actions ezx-solution-actions">
            <button type="button" class="ezx-top-action" id="solutionPrevBtn" ${reviewState.current === 0 ? 'disabled' : ''}>Previous</button>
            <button type="button" class="ezx-top-action" id="solutionNextBtn" ${reviewState.current === evaluation.length - 1 ? 'disabled' : ''}>Save & Next</button>
          </div>

          <div class="ezx-exam-body">
            <section class="ezx-left-panel">
              <div class="ezx-solution-partline">
                <span class="ezx-part-btn active static">${escapeHtml(currentSection.label)}</span>
              </div>
              <div class="ezx-question-shell">
                <div class="ezx-question-topline">
                  <div class="ezx-question-count">Question: ${reviewState.current + 1}</div>
                  <div class="ezx-mini-time">⏱ ${syntheticTime}</div>
                  <div class="ezx-right-tools">
                    <label>
                      <span>Select Language:</span>
                      <select disabled>
                        <option>${escapeHtml(state.language)}</option>
                      </select>
                    </label>
                    <button type="button" class="ezx-icon-save">Save</button>
                    <button type="button" class="ezx-report-btn">Report</button>
                  </div>
                </div>

                <div class="ezx-question-textbox">
                  <div class="ezx-question-stem">${escapeHtml(question.text)}</div>
                </div>

                <div class="ezx-options-table ezx-solution-options">
                  ${question.options.map((option, index) => {
                    const isCorrect = index === question.answer;
                    const isSelected = item.selected === index;
                    const optionClass = isCorrect ? 'solution-correct' : (isSelected && !item.correct ? 'solution-wrong' : '');
                    return `
                      <label class="ezx-option-line ${optionClass}">
                        <span class="ezx-option-radio ${isCorrect ? 'is-correct' : ''} ${isSelected && !item.correct ? 'is-wrong' : ''}"><input type="radio" disabled ${isSelected ? 'checked' : ''}></span>
                        <span class="ezx-option-value">${escapeHtml(option)}</span>
                      </label>
                    `;
                  }).join('')}
                </div>

                <div class="ezx-solution-statusbox">
                  <div><strong>Status:</strong> <span class="${status === 'correct' ? 'sol-correct-text' : status === 'wrong' ? 'sol-wrong-text' : 'sol-skip-text'}">${status === 'correct' ? 'Correct' : status === 'wrong' ? 'Wrong' : 'Skipped'} (${evalMarks(item)})</span></div>
                  <div class="ezx-solution-expl"><strong>💡 Explanation:</strong> ${escapeHtml(question.explanation)}</div>
                </div>
              </div>
            </section>

            <aside class="ezx-right-panel ezx-solution-rightpanel">
              <div class="ezx-arrow-head">▶</div>
              <div class="ezx-sidebar-title">${escapeHtml(currentSection.label).replace('PART ', 'PART-')}</div>
              <div class="ezx-sidebar-grid">
                ${currentSection.indexes.map((index) => {
                  const itemStatus = evalStatus(evaluation[index]);
                  return `<button type="button" class="ezx-qnum sol-${itemStatus} ${reviewState.current === index ? 'current' : ''}" data-solution-jump="${index}">${index + 1 - currentSection.indexes[0]}</button>`;
                }).join('')}
              </div>

              <div class="ezx-analysis-box ezx-solution-resultbox">
                <div class="ezx-analysis-title">Section Results</div>
                <div class="ezx-analysis-row"><span>Correct</span><strong class="sol-badge green">${counts.correct}</strong></div>
                <div class="ezx-analysis-row"><span>Wrong</span><strong class="sol-badge red">${counts.wrong}</strong></div>
                <div class="ezx-analysis-row"><span>Skipped</span><strong class="sol-badge beige">${counts.skipped}</strong></div>
              </div>

              <div class="ezx-submit-stack">
                <button type="button" class="ezx-submit-blue" id="backAnalysisBottomBtn">Back to Analysis</button>
              </div>
            </aside>
          </div>
        </div>
      `;

      host.querySelector('#backToAnalysisBtn')?.addEventListener('click', () => {
        reviewState.mode = 'analysis';
        renderMode();
      });
      host.querySelector('#backAnalysisBottomBtn')?.addEventListener('click', () => {
        reviewState.mode = 'analysis';
        renderMode();
      });
      host.querySelector('#solutionPrevBtn')?.addEventListener('click', () => moveSolution(-1));
      host.querySelector('#solutionNextBtn')?.addEventListener('click', () => moveSolution(1));
      host.querySelectorAll('[data-solution-jump]').forEach((button) => {
        button.addEventListener('click', () => jumpSolution(Number(button.dataset.solutionJump)));
      });
    }

    function renderMode() {
      if (reviewState.mode === 'analysis') renderAnalysisMode();
      else renderSolutionMode();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderMode();
  }

  function render() {
    if (state.phase === 'instructions-1') return renderOverviewStep();
    if (state.phase === 'instructions-2') return renderSymbolsStep();
    renderExam();
  }

  render();
};
