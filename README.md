# Steven Lema — Portfolio

Static portfolio at [salema.dev](https://salema.dev). Built with Astro 5, React islands, Tailwind CSS v4, and bilingual routing (`en` / `es`).

## Stack

| Layer | Technology |
|-------|------------|
| Framework | [Astro](https://docs.astro.build/) 5.x |
| UI islands | React 19 (`client:visible` where possible) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Components | shadcn/ui + Radix |
| i18n | Manual locale routes + Astro `i18n` config + sitemap alternates |
| Deploy | Docker → nginx (static `dist/`) |

## Commands

```sh
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # output → dist/
pnpm preview      # preview production build
pnpm check        # TypeScript + Astro diagnostics (@astrojs/check)
```

## Project structure

```text
src/
├── components/       # Astro + React (ui/, sections/)
├── i18n/locales/     # en/es JSON content
├── layouts/          # Layout.astro (SEO, hreflang, theme)
├── pages/
│   ├── index.astro   # locale redirect
│   └── [lang]/       # main page per language
└── styles/global.css # design tokens + Tailwind v4
```

## Performance notes

- **Project gallery** hydrates with `client:visible` (below the fold).
- **Certifications / contact** use `client:visible`.
- **Prefetch** uses Astro `viewport` strategy for in-view links.
- Prefer `pnpm check` before shipping changes.

## Docker

```sh
docker build -t portafolio .
docker run -p 8080:80 portafolio
```
