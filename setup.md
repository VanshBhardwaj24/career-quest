## Project Setup

This is a Vite + React + TypeScript project.

### Prerequisites
- Node.js 18 or newer
- npm 9+ (comes with Node)

Check versions:

```bash
node -v
npm -v
```

### Install
From the project root (`C:\Users\acer\OneDrive\Desktop\project`):

```bash
npm ci
# or, if package-lock.json is missing
npm install
```

### Run (development)

```bash
npm run dev
```

Vite will print a local URL like `http://localhost:5173/`.

### Build (production)

```bash
npm run build
```

The production build is output to `dist/`.

### Preview (serve the production build locally)

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

### Common Issues (Windows)
- Ensure Node 18+; Vite 5 requires modern Node. If you see engine errors, upgrade Node.
- If port 5173 is busy, Vite will choose the next available port. You can also specify one: `npm run dev -- --port 5174`.
- If OneDrive path protections interfere, try running the terminal as Administrator or move the project to a non-synced folder (e.g., `C:\dev\project`).

### Scripts (from package.json)
- `dev`: start Vite dev server
- `build`: production build
- `preview`: preview production build
- `lint`: run ESLint


