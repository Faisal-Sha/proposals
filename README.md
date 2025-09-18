# Upwork Proposal Builder

A Next.js + TypeScript workspace for drafting Upwork proposals with TipTap, Tailwind, shadcn-inspired UI, and Upwork-safe copy workflows. The editor keeps formatting inside Upwork, ships a plain-text fallback, and includes templates, snippets, and a quality assistant.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 to use the editor. Autosave persists in the current browser.

## Available scripts

- `npm run dev` – start the Next.js dev server
- `npm run build` – create a production build
- `npm run start` – run the production server
- `npm run lint` – run Next.js ESLint rules
- `npm run test` – execute Vitest unit tests for sanitisation, clipboard payloads, and the plain-text renderer

## Features

- TipTap editor restricted to Upwork-safe tags and smart keyboard shortcuts
- Toolbar for bold, italic, underline, lists, blockquotes, code, links, emoji picker, and clear formatting
- Upwork preview vs plain-text fallback toggle with copy buttons for each mode
- Templates, variable slots, snippets library, and quality assistant with score dial, spam detector, and readability metrics
- Paste-test sandbox and “How to paste into Upwork” helper page

## Testing

Run `npm run test` to ensure sanitisation, clipboard payloads, and the plain-text renderer behave as expected.
