(function () {
  const data = window.ExamZenData;
  const auth = window.ExamZenAuth;
  const store = window.ExamZenStore;
  const body = document.body;
  const base = body.dataset.base || './';
  const page = body.dataset.page || 'generic';
  const user = () => auth.getCurrentUser();
  const priceBase = 124;
  let installPromptEvent = null;

  const routes = {
    home: `${base}index.html`,
    exams: `${base}exams/index.html`,
    department: `${base}exams/department.html`,
    examHub: `${base}exams/exam.html`,
    cgl: `${base}exams/exam.html?exam=cgl`,
    chsl: `${base}exams/exam.html?exam=chsl`,
    series: `${base}series/index.html`,
    live: `${base}live-test/index.html`,
    pricing: `${base}pricing.html`,
    partner: `${base}apply-coupon.html`,
    login: `${base}login.html`,
    profile: `${base}profile/index.html`,
    saved: `${base}saved/index.html`,
    test: `${base}test.html`,
    about: `${base}about-us.html`,
    contact: `${base}contact-us.html`,
    privacy: `${base}privacy-policy.html`,
    terms: `${base}terms-conditions.html`,
    refund: `${base}refund-policy.html`,
    partnerDashboard: `${base}partner-dashboard.html`,
    admin: `${base}admin-vault.html`
  };

  const icons = {
    ssc: '🏛️', railway: '🚆', state: '🗺️', mock: '📝', series: '🔥', premium: '⭐'
  };

  function escapeHtml(str = '') {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function testUrl(testId) {
    return `${routes.test}?test=${encodeURIComponent(testId)}`;
  }

  function relativeUrl(path) {
    return `${base}${path}`;
  }

  function query(name) {
    return new URLSearchParams(location.search).get(name);
  }

  function setTheme() {
    const theme = auth.settings().theme || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.querySelector('[data-theme-toggle]');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function toggleTheme() {
    const current = auth.settings().theme || 'light';
    auth.updateSettings({ theme: current === 'dark' ? 'light' : 'dark' });
    setTheme();
  }

  function currentUserKey(suffix) {
    return `${suffix}_${user()?.id || 'guest'}`;
  }

  function getBookmarks() {
    return store.read(currentUserKey('bookmarks'), []);
  }

  function setBookmarks(list) {
    store.write(currentUserKey('bookmarks'), list);
  }

  function toggleBookmark(testId) {
    const items = getBookmarks();
    const exists = items.includes(testId);
    const next = exists ? items.filter((id) => id !== testId) : [...items, testId];
    setBookmarks(next);
    return !exists;
  }

  function getResults() {
    return store.read(currentUserKey('results'), []);
  }

  function pushResult(result) {
    const items = [result, ...getResults()];
    store.write(currentUserKey('results'), items);
    return result;
  }

  function saveTestSession(testId, session) {
    store.write(currentUserKey(`testsession_${testId}`), session);
  }

  function readTestSession(testId) {
    return store.read(currentUserKey(`testsession_${testId}`), null);
  }

  function clearTestSession(testId) {
    store.remove(currentUserKey(`testsession_${testId}`));
  }

  function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  }

  function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  function getTest(testId) {
    return data.tests.find((item) => item.id === testId);
  }

  function getExamTests(exam) {
    return data.tests.filter((item) => item.exam === exam);
  }

  function getDepartment(deptId) {
    return (data.departments || []).find((item) => item.id === deptId);
  }

  function getExamMeta(examId) {
    return (data.examCatalog || {})[examId] || null;
  }

  function departmentUrl(deptId) {
    return `${routes.department}?dept=${encodeURIComponent(deptId)}`;
  }

  function examHubUrl(examId) {
    return `${routes.examHub}?exam=${encodeURIComponent(examId)}`;
  }

  function isBookmarked(testId) {
    return getBookmarks().includes(testId);
  }

  function toast(message, type = 'info') {
    const holder = document.getElementById('toastHost') || (() => {
      const div = document.createElement('div');
      div.id = 'toastHost';
      div.style.cssText = 'position:fixed;right:16px;bottom:16px;display:grid;gap:10px;z-index:9999;max-width:min(360px,calc(100vw - 32px));';
      document.body.appendChild(div);
      return div;
    })();
    const item = document.createElement('div');
    item.className = `notice ${type === 'success' ? 'success' : type === 'danger' ? 'danger' : 'warning'}`;
    item.textContent = message;
    holder.appendChild(item);
    setTimeout(() => item.remove(), 3200);
  }

  function requireLogin(message = 'Please log in to continue.') {
    if (user()) return true;
    const returnTo = encodeURIComponent(location.pathname + location.search);
    toast(message, 'warning');
    setTimeout(() => location.href = `${routes.login}?returnTo=${returnTo}`, 600);
    return false;
  }

  function renderHeader() {
    const host = document.getElementById('siteHeader');
    if (!host) return;
    const me = user();
    const isExamSection = ['exams', 'department', 'exam-detail', 'cgl', 'chsl'].includes(page);
    const active = (key) => {
      if (key === 'exams' && isExamSection) return 'active';
      return page === key ? 'active' : '';
    };

    if (page === 'home') {
      host.innerHTML = `
        <div class="home-topbar-shell">
          <div class="container home-topbar">
            <a class="home-brand" href="${routes.home}">
              <img src="${relativeUrl('assets/logo.svg')}" alt="ExamZen logo">
              <div>
                <strong>ExamZen</strong>
                <small>SSC · UP EXAMS</small>
              </div>
            </a>
            <div class="home-topbar-actions">
              ${me ? `<a class="home-login-btn user" href="${routes.profile}">${escapeHtml(me.name.split(' ')[0])}</a><button class="btn ghost sm" id="logoutBtn" type="button">Logout</button>` : `<a class="home-login-btn" href="${routes.login}">LOGIN</a>`}
            </div>
          </div>
        </div>
      `;
    } else {
      host.innerHTML = `
        <div class="app-topbar-shell">
          <div class="container app-topbar">
            <a class="app-brand" href="${routes.home}">
              <img src="${relativeUrl('assets/logo.svg')}" alt="ExamZen logo">
              <div>
                <strong>ExamZen</strong>
                <small>SSC · UP Exams</small>
              </div>
            </a>
            <nav class="app-mini-nav">
              <a class="${active('home')}" href="${routes.home}">Home</a>
              <a class="${active('exams')}" href="${routes.exams}">Exams</a>
              <a class="${active('series')}" href="${routes.series}">Series</a>
              <a class="${active('live')}" href="${routes.live}">Live</a>
            </nav>
            <div class="app-topbar-actions">
              <button class="theme-toggle" data-theme-toggle type="button" aria-label="Toggle theme">🌙</button>
              ${me ? `<a class="app-login-btn user" href="${routes.profile}">${escapeHtml(me.name.split(' ')[0])}</a><button class="btn ghost sm" id="logoutBtn" type="button">Logout</button>` : `<a class="app-login-btn" href="${routes.login}">LOGIN</a>`}
            </div>
          </div>
        </div>
      `;
    }

    const themeBtn = host.querySelector('[data-theme-toggle]');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        auth.logout();
        toast('Logged out successfully.', 'success');
        setTimeout(() => location.href = routes.home, 300);
      });
    }
    setTheme();
  }

  function renderFooter() {
    const host = document.getElementById('siteFooter');
    if (!host) return;
    const isExamSection = ['exams', 'department', 'exam-detail', 'cgl', 'chsl'].includes(page);
    host.innerHTML = `
      <footer class="app-footer-shell">
        <div class="container app-footer-meta">
          <div class="app-footer-links">
            <a href="${routes.about}">About</a>
            <a href="${routes.contact}">Contact</a>
            <a href="${routes.privacy}">Privacy Policy</a>
            <a href="${routes.terms}">Terms</a>
          </div>
          <p>© 2025 ExamZen · t.me/ExamZen</p>
        </div>
        <div class="mobile-dock-spacer"></div>
        <nav class="mobile-app-dock">
          <a class="${page === 'home' ? 'active' : ''}" href="${routes.home}"><span>⌂</span><small>Home</small></a>
          <a class="${isExamSection ? 'active' : ''}" href="${routes.exams}"><span>📝</span><small>Exams</small></a>
          <a class="${page === 'live' ? 'active' : ''}" href="${routes.live}"><span>◉</span><small>Live</small></a>
          <a class="${page === 'profile' ? 'active' : ''}" href="${routes.profile}"><span>◌</span><small>Profile</small></a>
        </nav>
      </footer>
    `;
  }

  function testCard(test) {
    const locked = test.premium && !auth.isPremium();
    return `
      <article class="card test-card">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:start;">
          <div>
            <span class="tag ${test.premium ? 'warning' : ''}">${escapeHtml(test.category)}</span>
            <h3 style="margin:12px 0 8px;">${escapeHtml(test.title)}</h3>
            <p class="muted">${escapeHtml(test.description)}</p>
          </div>
          <button class="icon-btn" type="button" data-bookmark="${test.id}" aria-label="Save test">${isBookmarked(test.id) ? '★' : '☆'}</button>
        </div>
        <div class="pill-row" style="margin:16px 0;">
          <span class="tag">${test.questions.length} Questions</span>
          <span class="tag">${test.durationMinutes} mins</span>
          <span class="tag">${escapeHtml(test.level)}</span>
          ${test.premium ? '<span class="tag locked">Premium</span>' : '<span class="tag success">Free</span>'}
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <a class="btn primary sm" href="${testUrl(test.id)}">${locked ? 'Unlock Mock' : 'Start Mock'}</a>
          <button class="btn ghost sm" type="button" data-share="${test.id}">Copy Link</button>
        </div>
      </article>
    `;
  }

  function attachCardActions(scope = document) {
    scope.querySelectorAll('[data-bookmark]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!requireLogin('Please login to save mocks.')) return;
        const saved = toggleBookmark(btn.dataset.bookmark);
        btn.textContent = saved ? '★' : '☆';
        toast(saved ? 'Mock saved to your list.' : 'Removed from saved list.', 'success');
      });
    });
    scope.querySelectorAll('[data-share]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const url = new URL(testUrl(btn.dataset.share), location.href).toString();
        try {
          await navigator.clipboard.writeText(url);
          toast('Test link copied.', 'success');
        } catch {
          toast(url, 'warning');
        }
      });
    });
  }

  function attachNavCards(scope = document) {
    scope.querySelectorAll('[data-href]').forEach((card) => {
      card.setAttribute('role', 'link');
      if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
      const open = () => { location.href = card.dataset.href; };
      card.addEventListener('click', (event) => {
        if (event.target.closest('a, button, input, select, textarea, label')) return;
        open();
      });
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      });
    });
  }

  function homeExamCard(examId) {
    const exam = getExamMeta(examId);
    if (!exam) return '';
    return `
      <article class="home-exam-card clickable-card" data-href="${examHubUrl(examId)}">
        <div class="home-exam-icon">${escapeHtml(exam.icon || '📚')}</div>
        <h3>${escapeHtml(exam.title)}</h3>
        <p>${escapeHtml(exam.subtitle)}</p>
        <span>${escapeHtml(exam.mockCount)}</span>
        <a href="${examHubUrl(examId)}">Open</a>
      </article>
    `;
  }

  function departmentCard(dept) {
    return `
      <article class="home-exam-card department-card-large clickable-card" data-href="${departmentUrl(dept.id)}">
        <div class="home-exam-icon">${escapeHtml(dept.icon || '📚')}</div>
        <h3>${escapeHtml(dept.title)}</h3>
        <p>${escapeHtml(dept.subtitle)}</p>
        <span>${escapeHtml(dept.mockCount)}</span>
        <a href="${departmentUrl(dept.id)}">Explore</a>
      </article>
    `;
  }

  function renderHome() {
    const statHost = document.getElementById('homeStatGrid');
    const liveHost = document.getElementById('homeLiveCard');
    const exploreHost = document.getElementById('homeExploreGrid');
    const seriesHost = document.getElementById('homeSeriesRow');

    if (statHost) {
      statHost.innerHTML = (data.homeStats || []).map((item) => `
        <article class="home-stat-card">
          <strong>${escapeHtml(item.value)}</strong>
          <span>${escapeHtml(item.label)}</span>
        </article>
      `).join('');
    }

    if (liveHost && data.homeLive) {
      liveHost.innerHTML = `
        <div class="home-live-card">
          <div class="home-live-dot"></div>
          <div>
            <strong>${escapeHtml(data.homeLive.title)}</strong>
            <span>${escapeHtml(data.homeLive.subtitle)}</span>
          </div>
          <a href="${routes.live}">${escapeHtml(data.homeLive.action)}</a>
        </div>
      `;
    }

    if (exploreHost) {
      const featured = ['cgl', 'chsl', 'cpo', 'steno', 'mts', 'up-exams'];
      exploreHost.innerHTML = featured.map(homeExamCard).join('');
      attachNavCards(exploreHost);
    }

    if (seriesHost) {
      seriesHost.innerHTML = data.series.slice(0, 4).map((series, index) => `
        <article class="home-series-card tone-${index + 1}">
          <div class="home-series-emoji">${series.badge === 'Current Affairs' ? '🌍' : series.badge === 'Premium' ? '🌍' : series.badge === 'High accuracy' ? '🔢' : '📖'}</div>
          <small>${escapeHtml(series.badge)}</small>
          <h3>${escapeHtml(series.title)}</h3>
          <p>${escapeHtml(series.description)}</p>
          <a href="${routes.series}">FREE</a>
        </article>
      `).join('');
    }
  }

  function renderExamsHub() {
    const host = document.getElementById('examsGrid');
    if (!host) return;
    host.innerHTML = (data.departments || []).map(departmentCard).join('');
    attachNavCards(host);
  }

  function renderDepartmentPage() {
    const deptId = query('dept');
    const dept = getDepartment(deptId);
    const hero = document.getElementById('departmentHero');
    const grid = document.getElementById('departmentExamGrid');
    if (!hero || !grid) return;
    if (!dept) {
      hero.innerHTML = '<h1>Department not found</h1><p class="muted">Please open a valid department.</p>';
      grid.innerHTML = '<div class="card empty">No exams found.</div>';
      return;
    }
    hero.innerHTML = `
      <span class="tag">${escapeHtml(dept.title)}</span>
      <h1>${escapeHtml(dept.subtitle)}</h1>
      <p class="muted">${escapeHtml(dept.description)}</p>
    `;
    grid.innerHTML = dept.exams.map((examId) => {
      const exam = getExamMeta(examId);
      if (!exam) return '';
      return `
        <article class="home-exam-card department-exam-card clickable-card" data-href="${examHubUrl(examId)}">
          <div class="home-exam-icon">${escapeHtml(exam.icon || '📚')}</div>
          <h3>${escapeHtml(exam.title)}</h3>
          <p>${escapeHtml(exam.subtitle)}</p>
          <span>${escapeHtml(exam.mockCount)}</span>
          <a href="${examHubUrl(examId)}">Open Series</a>
        </article>
      `;
    }).join('');
    attachNavCards(grid);
  }

  function renderExamList(exam) {
    const host = document.getElementById('examTests');
    const title = document.getElementById('examTitle');
    const meta = getExamMeta(exam);
    if (title) title.textContent = meta ? `${meta.title} Practice` : `Recommended ${exam.toUpperCase()} Series`;
    if (!host) return;
    const tests = getExamTests(exam);
    host.innerHTML = tests.map(testCard).join('') || '<div class="card empty">No tests found.</div>';
    attachCardActions(host);
  }

  function renderExamDetail() {
    const examId = query('exam');
    const exam = getExamMeta(examId);
    const hero = document.getElementById('examHero');
    const sectionsHost = document.getElementById('examCategorySections');
    const backLink = document.getElementById('backToDepartmentLink');
    if (!hero || !sectionsHost) return;
    if (!exam) {
      hero.innerHTML = '<h1>Exam not found</h1><p class="muted">Please open a valid exam page.</p>';
      sectionsHost.innerHTML = '<div class="card empty">No categories available.</div>';
      return;
    }

    const dept = getDepartment(exam.department);
    if (backLink && dept) backLink.href = departmentUrl(dept.id);

    hero.innerHTML = `
      <span class="tag">${escapeHtml(exam.title)}</span>
      <h1>${escapeHtml(exam.subtitle)}</h1>
      <p class="muted">Inside ${escapeHtml(exam.title)}, practice by category: Full Test, Previous Year, Sectional and Topic Wise.</p>
    `;

    sectionsHost.innerHTML = exam.categories.map((category) => {
      const tests = (category.testIds || []).map(getTest).filter(Boolean);
      return `
        <section class="exam-category-block card">
          <div class="exam-category-head">
            <div>
              <span class="tag warning">${escapeHtml(category.count)}</span>
              <h3>${escapeHtml(category.title)}</h3>
              <p class="muted">${escapeHtml(category.description)}</p>
            </div>
          </div>
          <div class="grid cols-2 exam-category-test-grid">
            ${tests.length ? tests.map(testCard).join('') : '<div class="card empty">Practice sets will be added soon.</div>'}
          </div>
        </section>
      `;
    }).join('');

    attachCardActions(sectionsHost);
  }

  function renderSeries() {
    const host = document.getElementById('seriesGrid');
    if (!host) return;
    host.innerHTML = data.series.map((series) => {
      const tests = series.testIds.map(getTest).filter(Boolean);
      return `
        <article class="card series-card">
          <span class="tag warning">${escapeHtml(series.badge)}</span>
          <h3 style="margin:12px 0 8px;">${escapeHtml(series.title)}</h3>
          <p class="muted">${escapeHtml(series.description)}</p>
          <ul class="list" style="margin-top:14px;">
            ${tests.map((item) => `<li><span>${escapeHtml(item.title)}</span><a href="${testUrl(item.id)}" class="tag">Open</a></li>`).join('')}
          </ul>
        </article>
      `;
    }).join('');
  }

  function renderLive() {
    const host = document.getElementById('liveHost');
    if (!host) return;
    if (!data.liveTests.length) {
      host.innerHTML = `
        <div class="card info-card">
          <span class="tag warning">No tests available</span>
          <h3>Live test window is currently empty</h3>
          <p class="muted">You can still practice all available free and premium mocks from the exam hubs.</p>
          <div class="hero-actions">
            <a href="${routes.exams}" class="btn primary">Explore Exams</a>
            <a href="${routes.series}" class="btn secondary">Open Important Series</a>
          </div>
        </div>
      `;
      return;
    }
  }

  function renderPricing() {
    const faqHost = document.getElementById('faqList');
    if (faqHost) {
      faqHost.innerHTML = data.faqs.map((item) => `
        <article class="card info-card">
          <h3 style="margin-top:0;">${escapeHtml(item.q)}</h3>
          <p class="muted">${escapeHtml(item.a)}</p>
        </article>
      `).join('');
    }
    const buyBtn = document.getElementById('buyPremiumBtn');
    if (buyBtn) buyBtn.addEventListener('click', () => location.href = routes.partner);
  }

  function renderCouponPage() {
    const form = document.getElementById('couponForm');
    const result = document.getElementById('couponResult');
    const checkoutBtn = document.getElementById('checkoutBtn');
    let finalPrice = priceBase;
    let applied = null;

    if (!form || !result || !checkoutBtn) return;

    const renderResult = () => {
      result.innerHTML = `
        <div class="notice ${applied ? 'success' : 'warning'}">
          <strong>Payable amount:</strong> ₹${finalPrice}
          ${applied ? `<div style="margin-top:8px;">Coupon <strong>${escapeHtml(applied.code)}</strong> applied via ${escapeHtml(applied.partner)}.</div>` : '<div style="margin-top:8px;">Apply a partner coupon to reduce the annual price.</div>'}
        </div>
      `;
    };

    renderResult();

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const code = new FormData(form).get('code').toString().trim().toUpperCase();
      applied = data.coupons.find((item) => item.code === code) || null;
      finalPrice = applied ? Math.max(99, priceBase - applied.discount) : priceBase;
      if (!applied && code) toast('Invalid coupon. Try EXAMZEN25 or PARTNER99.', 'danger');
      if (applied) toast(`Coupon ${applied.code} applied successfully.`, 'success');
      renderResult();
    });

    checkoutBtn.addEventListener('click', () => {
      if (!requireLogin('Please login before activating premium.')) return;
      const premium = auth.activatePremium({ note: applied ? `Coupon:${applied.code}` : 'Direct checkout' });
      if (premium.ok) {
        toast(`Premium activated for 365 days at ₹${finalPrice}.`, 'success');
        setTimeout(() => location.href = routes.profile, 700);
      }
    });
  }

  function renderLogin() {
    const tabButtons = document.querySelectorAll('[data-auth-tab]');
    const forms = document.querySelectorAll('.auth-form');
    const switchTab = (tab) => {
      tabButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.authTab === tab));
      forms.forEach((form) => form.classList.toggle('active', form.dataset.authForm === tab));
    };
    tabButtons.forEach((btn) => btn.addEventListener('click', () => switchTab(btn.dataset.authTab)));
    switchTab(query('tab') || 'login');

    const targetAfterAuth = () => {
      const returnTo = query('returnTo');
      if (!returnTo) return routes.profile;
      if (/^https?:/i.test(returnTo)) return routes.profile;
      if (returnTo.startsWith('/')) return returnTo;
      return `${base}${returnTo}`;
    };

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const resetForm = document.getElementById('resetForm');

    loginForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const fd = new FormData(loginForm);
      const response = await auth.login(fd.get('identifier'), fd.get('password'));
      if (!response.ok) return toast(response.message, 'danger');
      toast('Welcome back!', 'success');
      setTimeout(() => location.href = targetAfterAuth(), 400);
    });

    signupForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const fd = new FormData(signupForm);
      const payload = Object.fromEntries(fd.entries());
      if (!/^[A-Za-z0-9]+$/.test(payload.username)) return toast('Username should contain only A-Z and 0-9.', 'danger');
      if (String(payload.password).length < 6) return toast('Password must be at least 6 characters.', 'danger');
      const response = await auth.register(payload);
      if (!response.ok) return toast(response.message, 'danger');
      toast('Account created successfully.', 'success');
      setTimeout(() => location.href = targetAfterAuth(), 400);
    });

    resetForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const fd = new FormData(resetForm);
      const response = await auth.resetPassword(fd.get('email'), fd.get('password'));
      if (!response.ok) return toast(response.message, 'danger');
      toast(response.message, 'success');
      switchTab('login');
    });
  }

  function renderProfile() {
    const host = document.getElementById('profileHost');
    if (!host) return;
    const me = user();
    if (!me) {
      host.innerHTML = `
        <div class="card info-card">
          <h2>Please login to view your profile</h2>
          <p class="muted">Use demo@examzen.app / demo123 or create a new account.</p>
          <a class="btn primary" href="${routes.login}?returnTo=profile/index.html">Login now</a>
        </div>
      `;
      return;
    }

    const results = getResults();
    const attempts = results.length;
    const avg = attempts ? Math.round(results.reduce((sum, item) => sum + item.percentage, 0) / attempts) : 0;
    const latest = results.slice(0, 5);

    host.innerHTML = `
      <div class="grid cols-2">
        <section class="card info-card">
          <span class="tag ${auth.isPremium(me) ? 'success' : ''}">${auth.isPremium(me) ? 'Premium Member' : 'Free Member'}</span>
          <h2 style="margin-bottom:6px;">${escapeHtml(me.name)}</h2>
          <p class="muted">@${escapeHtml(me.username)} · ${escapeHtml(me.email)}</p>
          <div class="list" style="margin-top:12px;">
            <li><span>Plan</span><strong>${escapeHtml(me.plan.toUpperCase())}</strong></li>
            <li><span>Premium expiry</span><strong>${formatDate(me.premiumExpiry)}</strong></li>
            <li><span>Role</span><strong>${escapeHtml(me.role)}</strong></li>
          </div>
          <div class="hero-actions">
            ${auth.isPremium(me) ? `<a class="btn secondary" href="${routes.saved}">Open Saved Mocks</a>` : `<a class="btn primary" href="${routes.partner}">Upgrade to Premium</a>`}
            ${me.role === 'admin' ? `<a class="btn ghost" href="${routes.admin}">Open Admin Vault</a>` : `<a class="btn ghost" href="${routes.partnerDashboard}">Partner Dashboard</a>`}
          </div>
        </section>
        <section class="card info-card">
          <h2 style="margin-top:0;">Performance overview</h2>
          <div class="kpi-row" style="grid-template-columns:repeat(2,1fr);margin-top:8px;">
            <div class="metric-card card"><span>Total attempts</span><strong>${attempts}</strong></div>
            <div class="metric-card card"><span>Average score</span><strong>${avg}%</strong></div>
          </div>
          <div style="margin-top:18px;">
            <div style="display:flex;justify-content:space-between;"><span class="muted">Progress confidence</span><strong>${Math.max(avg, attempts ? 45 : 12)}%</strong></div>
            <div class="progress" style="margin-top:10px;"><span style="width:${Math.max(avg, attempts ? 45 : 12)}%"></span></div>
          </div>
          <p class="help" style="margin-top:14px;">Tip: attempt 3+ mocks to start building visible history.</p>
        </section>
      </div>
      <section class="section">
        <div class="section-header"><div><h2>Recent results</h2><p>Latest mock submissions from your account.</p></div></div>
        <div class="card table-card">
          ${latest.length ? `<table class="table"><thead><tr><th>Mock</th><th>Score</th><th>Accuracy</th><th>Date</th></tr></thead><tbody>${latest.map((item) => `<tr><td>${escapeHtml(item.testTitle)}</td><td>${item.correct}/${item.total}</td><td>${item.percentage}%</td><td>${formatDate(item.completedAt)}</td></tr>`).join('')}</tbody></table>` : '<div class="empty">No attempts yet. Start a mock to see analytics here.</div>'}
        </div>
      </section>
    `;
  }

  function renderSaved() {
    const host = document.getElementById('savedHost');
    if (!host) return;
    if (!user()) {
      host.innerHTML = `
        <div class="card info-card">
          <h2>Saved list is available after login</h2>
          <p class="muted">Create an account or use demo credentials to save and revisit mocks.</p>
          <a class="btn primary" href="${routes.login}?returnTo=saved/index.html">Login</a>
        </div>
      `;
      return;
    }

    const bookmarks = getBookmarks().map(getTest).filter(Boolean);
    const results = getResults().slice(0, 8);
    host.innerHTML = `
      <section class="section">
        <div class="section-header"><div><h2>Bookmarked mocks</h2><p>Your saved test list.</p></div></div>
        <div id="bookmarkGrid" class="grid cols-2">${bookmarks.length ? bookmarks.map(testCard).join('') : '<div class="card empty">No saved mocks yet.</div>'}</div>
      </section>
      <section class="section">
        <div class="section-header"><div><h2>Recent attempts</h2><p>Fast access to your latest submissions.</p></div></div>
        <div class="card table-card">
          ${results.length ? `<table class="table"><thead><tr><th>Mock</th><th>Score</th><th>Accuracy</th><th>Completed</th></tr></thead><tbody>${results.map((item) => `<tr><td>${escapeHtml(item.testTitle)}</td><td>${item.correct}/${item.total}</td><td>${item.percentage}%</td><td>${formatDate(item.completedAt)}</td></tr>`).join('')}</tbody></table>` : '<div class="empty">No attempts recorded yet.</div>'}
        </div>
      </section>
    `;
    attachCardActions(host);
  }

  function renderPartnerDashboard() {
    const host = document.getElementById('partnerHost');
    if (!host) return;
    if (!requireLogin('Please login to view the partner dashboard.')) return;
    const me = user();
    const results = getResults();
    const premiumUsers = auth.getUsers().filter((item) => item.plan === 'premium').length;
    const code = `${me.username.toUpperCase()}99`;
    host.innerHTML = `
      <div class="kpi-row">
        <div class="card metric-card"><span>Partner code</span><strong>${escapeHtml(code)}</strong></div>
        <div class="card metric-card"><span>Total mock attempts</span><strong>${results.length}</strong></div>
        <div class="card metric-card"><span>Demo premium users</span><strong>${premiumUsers}</strong></div>
        <div class="card metric-card"><span>Estimated earnings</span><strong>₹${premiumUsers * 12}</strong></div>
      </div>
      <section class="section">
        <div class="card info-card">
          <h2 style="margin-top:0;">How this MVP works</h2>
          <p class="muted">This dashboard is ready for future Supabase and referral tracking integration. Right now it shows demo analytics derived from local user activity.</p>
          <div class="hero-actions">
            <button class="btn secondary" id="copyPartnerCode" type="button">Copy Coupon Code</button>
            <a class="btn primary" href="${routes.partner}">Open Coupon Page</a>
          </div>
        </div>
      </section>
    `;
    document.getElementById('copyPartnerCode')?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code);
        toast('Partner code copied.', 'success');
      } catch {
        toast(code, 'warning');
      }
    });
  }

  function renderAdminVault() {
    const host = document.getElementById('adminHost');
    if (!host) return;
    const me = user();
    if (!me || me.role !== 'admin') {
      host.innerHTML = `
        <div class="card info-card">
          <span class="tag locked">Restricted</span>
          <h2>Admin access only</h2>
          <p class="muted">Use the demo admin account to preview this page.</p>
          <div class="notice warning" style="margin:16px 0;">Demo admin credentials: <strong>admin</strong> / <strong>admin123</strong></div>
          <a class="btn primary" href="${routes.login}?returnTo=admin-vault.html">Login as admin</a>
        </div>
      `;
      return;
    }

    const users = auth.getUsers();
    const testsAttempted = new Set(getResults().map((item) => item.testId)).size;
    host.innerHTML = `
      <div class="kpi-row">
        <div class="card metric-card"><span>Total users</span><strong>${users.length}</strong></div>
        <div class="card metric-card"><span>Premium users</span><strong>${users.filter((item) => item.plan === 'premium').length}</strong></div>
        <div class="card metric-card"><span>Available tests</span><strong>${data.tests.length}</strong></div>
        <div class="card metric-card"><span>Attempted tests</span><strong>${testsAttempted}</strong></div>
      </div>
      <section class="section">
        <div class="card table-card">
          <h2 style="margin-top:0;">User list</h2>
          <table class="table">
            <thead><tr><th>Name</th><th>Username</th><th>Plan</th><th>Role</th><th>Created</th></tr></thead>
            <tbody>
              ${users.map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>@${escapeHtml(item.username)}</td><td>${escapeHtml(item.plan)}</td><td>${escapeHtml(item.role)}</td><td>${formatDate(item.createdAt)}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  function renderTest() {
    const host = document.getElementById('testHost');
    if (!host) return;
    const testId = query('test');
    const test = getTest(testId);
    if (!test) {
      host.innerHTML = '<div class="card info-card"><h2>Mock not found</h2><p class="muted">The requested test does not exist.</p></div>';
      return;
    }

    if (test.premium && !auth.isPremium()) {
      host.innerHTML = `
        <div class="card info-card">
          <span class="tag locked">Premium only</span>
          <h2>${escapeHtml(test.title)}</h2>
          <p class="muted">Upgrade your account to access this premium mock test.</p>
          <div class="hero-actions">
            <a class="btn primary" href="${routes.pricing}">View Plans</a>
            <a class="btn secondary" href="${routes.partner}">Apply Coupon</a>
          </div>
        </div>
      `;
      return;
    }

    const persisted = readTestSession(test.id);
    const initial = persisted || {
      current: 0,
      remaining: test.durationMinutes * 60,
      answers: {},
      marked: {}
    };

    let state = initial;
    let timerId = null;

    const renderShell = () => {
      const question = test.questions[state.current];
      const answeredCount = Object.keys(state.answers).length;
      host.innerHTML = `
        <div class="test-layout">
          <section class="card test-shell">
            <div class="question-meta">
              <div>
                <span class="tag">${escapeHtml(test.title)}</span>
                <div class="muted" style="margin-top:8px;">Question ${state.current + 1} of ${test.questions.length} · ${escapeHtml(question.section)}</div>
              </div>
              <div class="tag warning">⏱ ${formatDuration(state.remaining)}</div>
            </div>
            <div class="progress"><span style="width:${(answeredCount / test.questions.length) * 100}%"></span></div>
            <p class="question-title" style="margin-top:18px;">${escapeHtml(question.text)}</p>
            <div class="options">
              ${question.options.map((option, index) => `
                <label class="option ${state.answers[question.id] === index ? 'active' : ''}">
                  <input type="radio" name="option" value="${index}" ${state.answers[question.id] === index ? 'checked' : ''}>
                  <span>${escapeHtml(option)}</span>
                </label>
              `).join('')}
            </div>
            <div class="test-actions">
              <div style="display:flex;gap:10px;flex-wrap:wrap;">
                <button class="btn ghost sm" id="clearAnswerBtn" type="button">Clear</button>
                <button class="btn secondary sm" id="markBtn" type="button">${state.marked[question.id] ? 'Unmark Review' : 'Mark for Review'}</button>
              </div>
              <div style="display:flex;gap:10px;flex-wrap:wrap;">
                <button class="btn ghost sm" id="prevBtn" type="button" ${state.current === 0 ? 'disabled' : ''}>Previous</button>
                <button class="btn primary sm" id="nextBtn" type="button">${state.current === test.questions.length - 1 ? 'Review & Submit' : 'Save & Next'}</button>
              </div>
            </div>
          </section>
          <aside class="card palette-shell">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
              <h3 style="margin:0;">Question Palette</h3>
              <button class="icon-btn" id="bookmarkDuringTest" type="button">${isBookmarked(test.id) ? '★' : '☆'}</button>
            </div>
            <p class="muted">Answered: ${answeredCount} · Marked: ${Object.keys(state.marked).length}</p>
            <div class="palette" id="paletteButtons">
              ${test.questions.map((item, index) => `<button type="button" data-jump="${index}" class="${state.current === index ? 'current' : ''} ${state.answers[item.id] !== undefined ? 'answered' : ''} ${state.marked[item.id] ? 'marked' : ''}">${index + 1}</button>`).join('')}
            </div>
            <div class="hero-actions" style="margin-top:18px;">
              <button class="btn danger block" id="submitTestBtn" type="button">Submit Test</button>
            </div>
          </aside>
        </div>
      `;

      host.querySelectorAll('input[name="option"]').forEach((radio) => {
        radio.addEventListener('change', () => {
          state.answers[question.id] = Number(radio.value);
          persist();
          renderShell();
        });
      });

      host.querySelectorAll('[data-jump]').forEach((btn) => btn.addEventListener('click', () => {
        state.current = Number(btn.dataset.jump);
        persist();
        renderShell();
      }));

      host.querySelector('#clearAnswerBtn')?.addEventListener('click', () => {
        delete state.answers[question.id];
        persist();
        renderShell();
      });

      host.querySelector('#markBtn')?.addEventListener('click', () => {
        if (state.marked[question.id]) delete state.marked[question.id];
        else state.marked[question.id] = true;
        persist();
        renderShell();
      });

      host.querySelector('#prevBtn')?.addEventListener('click', () => {
        state.current = Math.max(0, state.current - 1);
        persist();
        renderShell();
      });

      host.querySelector('#nextBtn')?.addEventListener('click', () => {
        if (state.current === test.questions.length - 1) {
          submit();
        } else {
          state.current += 1;
          persist();
          renderShell();
        }
      });

      host.querySelector('#submitTestBtn')?.addEventListener('click', submit);
      host.querySelector('#bookmarkDuringTest')?.addEventListener('click', () => {
        if (!requireLogin('Login to save this mock.')) return;
        const saved = toggleBookmark(test.id);
        toast(saved ? 'Mock saved.' : 'Mock removed from saved.', 'success');
        renderShell();
      });
    };

    const persist = () => saveTestSession(test.id, state);

    function submit() {
      clearInterval(timerId);
      const evaluation = test.questions.map((question) => {
        const selected = state.answers[question.id];
        const correct = selected === question.answer;
        return { question, selected, correct };
      });
      const correct = evaluation.filter((item) => item.correct).length;
      const wrong = evaluation.filter((item) => item.selected !== undefined && !item.correct).length;
      const unattempted = evaluation.filter((item) => item.selected === undefined).length;
      const total = test.questions.length;
      const percentage = Math.round((correct / total) * 100);
      const result = {
        id: store.uid('result'),
        testId: test.id,
        testTitle: test.title,
        total,
        correct,
        wrong,
        unattempted,
        percentage,
        completedAt: new Date().toISOString(),
        remaining: state.remaining
      };
      if (user()) pushResult(result);
      clearTestSession(test.id);
      renderResult(result, evaluation);
    }

    function renderResult(result, evaluation) {
      host.innerHTML = `
        <section class="section">
          <div class="section-header"><div><h1>${escapeHtml(test.title)} — Result</h1><p>Instant performance analysis.</p></div></div>
          <div class="result-grid">
            <article class="card result-card"><h3>Score</h3><p class="score">${result.percentage}%</p></article>
            <article class="card result-card"><h3>Correct</h3><p class="score">${result.correct}</p></article>
            <article class="card result-card"><h3>Wrong</h3><p class="score">${result.wrong}</p></article>
            <article class="card result-card"><h3>Unattempted</h3><p class="score">${result.unattempted}</p></article>
          </div>
          <div class="hero-actions" style="margin-top:18px;">
            <a class="btn primary" href="${testUrl(test.id)}">Reattempt Mock</a>
            <a class="btn secondary" href="${routes.saved}">Open Saved / Results</a>
          </div>
          <div class="section-header" style="margin-top:26px;"><div><h2>Question review</h2><p>See answers and explanations for each question.</p></div></div>
          <div>
            ${evaluation.map((item, index) => `
              <article class="review-item ${item.correct ? 'correct' : 'wrong'}">
                <div class="tag ${item.correct ? 'success' : item.selected === undefined ? 'warning' : 'locked'}">Question ${index + 1} · ${item.correct ? 'Correct' : item.selected === undefined ? 'Unattempted' : 'Incorrect'}</div>
                <h3>${escapeHtml(item.question.text)}</h3>
                <p><strong>Your answer:</strong> ${item.selected !== undefined ? escapeHtml(item.question.options[item.selected]) : 'Not attempted'}</p>
                <p><strong>Correct answer:</strong> ${escapeHtml(item.question.options[item.question.answer])}</p>
                <p class="muted"><strong>Explanation:</strong> ${escapeHtml(item.question.explanation)}</p>
              </article>
            `).join('')}
          </div>
        </section>
      `;
    }

    timerId = setInterval(() => {
      state.remaining -= 1;
      if (state.remaining <= 0) {
        state.remaining = 0;
        persist();
        submit();
      } else {
        persist();
        const timer = host.querySelector('.tag.warning');
        if (timer) timer.textContent = `⏱ ${formatDuration(state.remaining)}`;
      }
    }, 1000);

    renderShell();
  }

  function wireBeforeInstall() {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      installPromptEvent = event;
    });
  }

  function initStaticYear() {
    document.querySelectorAll('[data-year]').forEach((node) => node.textContent = new Date().getFullYear());
  }

  function initPage() {
    if (page !== 'test') {
      renderHeader();
      renderFooter();
    }
    initStaticYear();
    wireBeforeInstall();

    switch (page) {
      case 'home': renderHome(); break;
      case 'exams': renderExamsHub(); break;
      case 'department': renderDepartmentPage(); break;
      case 'exam-detail': renderExamDetail(); break;
      case 'cgl': renderExamList('cgl'); break;
      case 'chsl': renderExamList('chsl'); break;
      case 'series': renderSeries(); break;
      case 'live': renderLive(); break;
      case 'pricing': renderPricing(); break;
      case 'coupon': renderCouponPage(); break;
      case 'login': renderLogin(); break;
      case 'profile': renderProfile(); break;
      case 'saved': renderSaved(); break;
      case 'partner-dashboard': renderPartnerDashboard(); break;
      case 'admin': renderAdminVault(); break;
      case 'test':
        if (window.ExamZenTestEngine) {
          window.ExamZenTestEngine({
            data,
            auth,
            store,
            base,
            routes,
            query,
            escapeHtml,
            relativeUrl,
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
          });
        } else {
          renderTest();
        }
        break;
      default: break;
    }
  }

  document.addEventListener('DOMContentLoaded', initPage);
})();
