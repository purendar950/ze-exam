# ExamZen MVP

An original mock-test website inspired by the structure and workflows of modern exam-prep platforms.

## Included

- Homepage with banners and install CTA
- Exams hub
- CGL and CHSL mock listings
- Important series page
- Live test page
- Login / signup / reset password
- Profile page
- Saved tests page
- Coupon / premium activation flow
- Partner dashboard
- Admin vault
- Working timed mock test engine with instant results
- PWA manifest + service worker

## Demo Accounts

- Student: `demo` / `demo123`
- Admin: `admin` / `admin123`

## Backend Mode

The current build works in **local demo mode** using browser localStorage.

To connect Supabase later:

1. Add the Supabase client script in each page or bundle it locally.
2. Update the placeholder config in `js/auth.js`:

```js
window.EXAMZEN_SUPABASE = {
  url: 'https://YOUR-PROJECT.supabase.co',
  anonKey: 'YOUR-ANON-KEY'
};
```

3. Replace the placeholder branches inside:
   - `login()`
   - `register()`
   - `resetPassword()`
   - `activatePremium()`

## Deploy

This is a plain static site. You can deploy it to:

- Cloudflare Pages
- Netlify
- Vercel
- GitHub Pages

Deploy the `examzen` folder as the site root.
