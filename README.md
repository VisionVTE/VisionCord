# VisionCord

A Discord-style clone with the same design and feel, built with React + TypeScript + Vite. **Runs as a static website.**

## Features

- **Server list** – Left sidebar with server icons; click the home icon for DMs
- **Channels** – Text and voice channel categories, collapsible
- **Direct messages** – DM list with search and unread indicators
- **Chat** – Message list, timestamps, reactions, welcome banner
- **Message input** – Send messages (Enter to send, Shift+Enter for new line)
- **Member list** – Online members with status (online, idle, dnd, offline)
- **User panel** – Current user with mute/deafen/settings at bottom of sidebar

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build for production (static website)

```bash
npm run build
```

Output is in the `dist/` folder. Serve that folder with any static host to run VisionCord as a website.

**Preview the production build locally:**

```bash
npm run preview
```

Then open the URL shown (e.g. [http://localhost:4173](http://localhost:4173)).

## Deploy as a website

- **Vercel:** Push the repo to GitHub and import at [vercel.com](https://vercel.com). `vercel.json` is already set up.
- **Netlify:** Drag and drop the `dist` folder at [app.netlify.com/drop](https://app.netlify.com/drop), or connect the repo; `netlify.toml` is configured.
- **GitHub Pages:** Run `npm run build`, then upload the contents of `dist/` to a `gh-pages` branch or use the GitHub Actions workflow for static sites.

## Tech stack

- React 19 + TypeScript
- Vite 7
- CSS (Discord-like theme: dark UI, blurple accent)
