(function () {
  const prefix = 'examzen_';

  const Store = {
    read(key, fallback) {
      try {
        const raw = localStorage.getItem(prefix + key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (error) {
        return fallback;
      }
    },
    write(key, value) {
      localStorage.setItem(prefix + key, JSON.stringify(value));
      return value;
    },
    remove(key) {
      localStorage.removeItem(prefix + key);
    },
    uid(seed = 'ez') {
      return `${seed}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
    }
  };

  window.ExamZenStore = Store;
})();
