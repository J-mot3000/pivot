# SERN + TypeScript Portfolio

This is a static portfolio site built with React + TypeScript (SERN-inspired) and designed for GitHub Pages. All content is loaded from a JSON file so deployment stays static.

## ✨ Features

- **User view**: Resume, portfolio gallery, and contact form.
- **Admin view**: CRUD editing for resume sections, stored locally in the browser.
- **JSON data flow**: Export/import the JSON file used for GitHub Pages.

## 📁 Data source

The live site reads data from:

- `public/data/siteData.json`

When you edit the resume in the admin console, changes are stored in `localStorage`. Use **Export JSON** to save the updated file and replace `public/data/siteData.json` before deploying.

## ✅ Admin access

Visit the admin view by appending `#admin` to the URL:

- `http://localhost:5173/#admin`

## 🚀 Run locally

```powershell
npm install
npm run dev
```

## 📦 Build for GitHub Pages

```powershell
npm run build
```

The `vite.config.ts` is set to `base: './'` for GitHub Pages compatibility. You can deploy the `dist/` folder with any GitHub Pages workflow.

## 🧭 Customize

1. Update `public/data/siteData.json` with your real data.
2. Replace portfolio images with your assets.
3. If you use a form service (Formspree, Basin), add its endpoint in `contact.formAction`.

## 🧪 Checks

- `npm run lint`
- `npm run build`
