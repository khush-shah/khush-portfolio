# KhushOS — Portfolio

A fake operating system portfolio. Boots like BIOS, has a desktop with draggable windows, a working terminal, live metrics, and a command palette.

---

## Run Locally

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Build

```bash
npm run build
# output → dist/
```

---

## Deploy Free — 3 Options

### 1. Vercel (Recommended — 2 min)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
npm run build
vercel --prod
```

Or use the dashboard:
1. Push code to GitHub
2. Go to https://vercel.com → New Project → Import repo
3. Framework: **Vite** (auto-detected)
4. Click Deploy → get URL like `khushos.vercel.app`

**Custom domain:** Vercel Dashboard → Project → Settings → Domains → Add your domain (free subdomain included)

---

### 2. Netlify

1. Push to GitHub
2. https://netlify.com → Add new site → Import from Git
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy → get URL like `khushos.netlify.app`

Or drag-and-drop the `dist/` folder at https://app.netlify.com/drop

---

### 3. GitHub Pages

```bash
npm install --save-dev gh-pages
```

Add to `package.json` scripts:
```json
"deploy": "gh-pages -d dist"
```

Update `vite.config.ts`:
```ts
base: '/khushos-react/', // your repo name
```

Then:
```bash
npm run build
npm run deploy
```

Go to repo → Settings → Pages → Source: `gh-pages` branch

---

## Push to GitHub

```bash
git init
git add .
git commit -m "feat: KhushOS portfolio"

# Create repo at github.com/new (name: khushos-react)
git remote add origin https://github.com/YOUR_USERNAME/khushos-react.git
git branch -M main
git push -u origin main
```

---

## What's Inside

| Feature | Description |
|---------|-------------|
| Boot sequence | BIOS POST screen → login |
| Desktop | 7 draggable, resizable windows |
| Terminal | `help`, `neofetch`, `cat resume.txt`, `ping linkedin`, `projects --all` |
| Metrics dashboard | Live counters + animated pipeline + load simulator |
| Command palette | Press `~` — fuzzy search all actions |
| Metric modals | Click any stat → before/after deep dive |
| Konami code | ↑↑↓↓←→←→BA → easter egg |

---

## Update Content

All content lives in `src/data/portfolio.ts` — edit projects, skills, experience, metrics there.
