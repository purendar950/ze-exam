(function () {
  const Store = window.ExamZenStore;
  const KEY_USERS = 'users';
  const KEY_SESSION = 'session';
  const KEY_SETTINGS = 'settings';

  window.EXAMZEN_SUPABASE = window.EXAMZEN_SUPABASE || {
    url: '',
    anonKey: ''
  };

  function isSupabaseConfigured() {
    return Boolean(window.EXAMZEN_SUPABASE.url && window.EXAMZEN_SUPABASE.anonKey && window.supabase);
  }

  function seedUsers() {
    const users = Store.read(KEY_USERS, null);
    if (users && users.length) return users;
    const seeded = [
      {
        id: 'user_demo_student',
        name: 'Demo Student',
        username: 'demo',
        email: 'demo@examzen.app',
        password: 'demo123',
        plan: 'free',
        role: 'student',
        premiumExpiry: null,
        createdAt: new Date().toISOString()
      },
      {
        id: 'user_admin',
        name: 'ExamZen Admin',
        username: 'admin',
        email: 'admin@examzen.app',
        password: 'admin123',
        plan: 'premium',
        role: 'admin',
        premiumExpiry: '2099-12-31T00:00:00.000Z',
        createdAt: new Date().toISOString()
      }
    ];
    Store.write(KEY_USERS, seeded);
    return seeded;
  }

  function getUsers() {
    return Store.read(KEY_USERS, seedUsers());
  }

  function saveUsers(users) {
    Store.write(KEY_USERS, users);
    return users;
  }

  function sanitizeUser(user) {
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
  }

  function getCurrentUser() {
    const session = Store.read(KEY_SESSION, null);
    if (!session?.userId) return null;
    const user = getUsers().find((item) => item.id === session.userId);
    return sanitizeUser(user);
  }

  function getCurrentUserRaw() {
    const session = Store.read(KEY_SESSION, null);
    if (!session?.userId) return null;
    return getUsers().find((item) => item.id === session.userId) || null;
  }

  async function login(identifier, password) {
    if (isSupabaseConfigured()) {
      return { ok: false, message: 'Supabase login wiring placeholder is ready. Add your client integration key handling here.' };
    }

    const user = getUsers().find((item) => {
      return (item.email.toLowerCase() === identifier.toLowerCase() || item.username.toLowerCase() === identifier.toLowerCase()) && item.password === password;
    });

    if (!user) return { ok: false, message: 'Invalid username/email or password.' };
    Store.write(KEY_SESSION, { userId: user.id, loggedInAt: Date.now() });
    return { ok: true, user: sanitizeUser(user) };
  }

  async function register(payload) {
    if (isSupabaseConfigured()) {
      return { ok: false, message: 'Supabase signup wiring placeholder is ready. Add your createUser logic here.' };
    }

    const users = getUsers();
    const exists = users.some((item) => item.email.toLowerCase() === payload.email.toLowerCase() || item.username.toLowerCase() === payload.username.toLowerCase());
    if (exists) return { ok: false, message: 'Username or email already exists.' };

    const user = {
      id: Store.uid('user'),
      name: payload.name.trim(),
      username: payload.username.trim(),
      email: payload.email.trim(),
      password: payload.password,
      plan: 'free',
      role: 'student',
      premiumExpiry: null,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    saveUsers(users);
    Store.write(KEY_SESSION, { userId: user.id, loggedInAt: Date.now() });
    return { ok: true, user: sanitizeUser(user) };
  }

  async function resetPassword(email, password) {
    const users = getUsers();
    const index = users.findIndex((item) => item.email.toLowerCase() === email.toLowerCase());
    if (index < 0) return { ok: false, message: 'No account found with that email.' };
    users[index].password = password;
    saveUsers(users);
    return { ok: true, message: 'Password updated successfully.' };
  }

  function logout() {
    Store.remove(KEY_SESSION);
  }

  function activatePremium({ days = 365, note = 'Manual activation' } = {}) {
    const user = getCurrentUserRaw();
    if (!user) return { ok: false, message: 'Please log in first.' };
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + days);
    const users = getUsers().map((item) => {
      if (item.id === user.id) {
        return {
          ...item,
          plan: 'premium',
          premiumExpiry: expiry.toISOString(),
          upgradedVia: note
        };
      }
      return item;
    });
    saveUsers(users);
    return { ok: true, user: getCurrentUser(), expiry: expiry.toISOString() };
  }

  function isPremium(user = getCurrentUser()) {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.plan !== 'premium') return false;
    if (!user.premiumExpiry) return true;
    return new Date(user.premiumExpiry).getTime() > Date.now();
  }

  function settings() {
    return Store.read(KEY_SETTINGS, { theme: 'light' });
  }

  function updateSettings(next) {
    const merged = { ...settings(), ...next };
    Store.write(KEY_SETTINGS, merged);
    return merged;
  }

  window.ExamZenAuth = {
    login,
    register,
    logout,
    resetPassword,
    getUsers,
    getCurrentUser,
    getCurrentUserRaw,
    activatePremium,
    isPremium,
    settings,
    updateSettings,
    isSupabaseConfigured,
    seedUsers
  };

  seedUsers();
})();
