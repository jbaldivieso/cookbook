# Cookbook

A static site for hosting personal recipes, built to be read from a phone or tablet
propped up on the counter.

## Features

- Recipes organized into nested categories, with navigation generated from the folder tree
- Scale ingredient amounts (1x / 2x / 3x) with a per-section toggle; the choice is remembered per recipe
- Tap an ingredient line to cross it out as you go
- Keeps the screen awake while a recipe is open (Wake Lock API, with a silent-video fallback for iOS)
- Installable as a PWA, with offline caching via a service worker

## Tech Stack

- [Eleventy](https://www.11ty.dev/) — static site generator
- [Nunjucks](https://mozilla.github.io/nunjucks/) — templating
- Markdown — recipe content
- [Bulma](https://bulma.io/) — CSS framework
- [Rollup](https://rollupjs.org/) — CSS/JS bundler

## Development

```bash
npm install    # Install dependencies
npm run build  # Build CSS/JS bundles + HTML into _site/
npm run dev    # Rollup watch + 11ty dev server at http://localhost:8080
```

`npm run dev` runs Rollup and Eleventy in parallel; Eleventy watches `dist/` and reloads
when the bundles change.

## Project Structure

```
src/
  _data/         # Global data: navigation.js (folder tree), categories.js
  _includes/     # header.njk, footer.njk, nav-tree.njk
  _layouts/      # base.njk, recipe.njk, category.njk
  recipes/       # Recipe markdown, nested in category folders
  index.html     # Homepage (category list)
  categories.njk # Paginated template that renders one page per category
  main.js        # JS entry point (imports Bulma + custom.css)
  custom.css     # Custom CSS variables and overrides
  manifest.json  # PWA manifest
  sw.js          # Service worker
dist/            # Rollup output (bundle.css, bundle.js) — gitignored
_site/           # Eleventy output — gitignored
```

## Adding a Recipe

Create `src/recipes/<category>/<recipe-name>/index.md`:

```markdown
---
title: Recipe Name
---

## Ingredients

- `250g` flour
- `5g` salt

## Instructions
...
```

The layout is applied automatically and the recipe appears in the navigation on the next
build — there is no index to update by hand. Weight amounts written as `` `250g` `` become
scalable. See [CLAUDE.md](CLAUDE.md) for the full conventions.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds the site and
publishes `_site/` to GitHub Pages.
