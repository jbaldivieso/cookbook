# CLAUDE.md

Static recipe site: Eleventy + Nunjucks + Markdown, Bulma for styles, Rollup for bundling.
See [README.md](README.md) for setup and an overview.

## Build

- `npm run build` — Rollup (`build:css`) then Eleventy (`build:html`). Run both; Eleventy
  only passes through `dist/bundle.css` and `dist/bundle.js`, so an Eleventy-only build
  reuses stale bundles.
- `npm run dev` — watch mode for both. There are no tests and no linter; verify changes by
  building and reading the generated HTML in `_site/`.

## Content model

Everything under `src/recipes/` is driven by the folder tree — there is no manual index.

- A directory containing `index.md` is a **recipe**. Its URL mirrors its path
  (`src/recipes/bread/yeasted/standard/index.md` → `/recipes/bread/yeasted/standard/`).
- Any other directory is a **category**, and may nest arbitrarily.
- `src/recipes/recipes.json` is an Eleventy directory data file applying `recipe.njk` to
  everything below it, so recipe front matter needs only `title:` — do not add `layout:`.
- Each category directory needs `<dirname>/<dirname>.json` (e.g. `bread/bread.json`) with
  `title` and optional `order` (default 999; ties break alphabetically). Without it, the
  title falls back to the directory name.
- There are no category pages. The homepage (`src/index.html`) is the whole catalog: one
  tab per **top-level** category, with deeper categories flattened into labelled groups
  inside that tab (`catalogTabs` filter). A name-only search filters across all tabs in the
  browser. The phone layout puts the tabs in a bottom bar that holds about four top-level
  categories; past that, switch phones to stacked full-width tabs (noted in `custom.css`
  and `.impeccable/surfaces/src-index-html.md`).
- A tab's id is its top-level directory name with `_` turned into `-`
  (`other_baked_goods` → `#other-baked-goods`). Recipe breadcrumbs link the top-level
  category to `/#<tab>`; deeper crumbs are plain labels.

`src/_data/navigation.js` walks the tree at build time (reading each recipe's front matter
with gray-matter) and produces the nested tree used by the homepage tabs and breadcrumbs.
Directory naming is inconsistent in existing content (`other_baked_goods` vs
`raisin-pecan-bread`); both work, since underscores and hyphens are only cosmetic in
titles derived from directory names.

## Recipe markdown conventions

```markdown
---
title: Pain de campagne
---

## Ingredients
- `200g` starter (hot)

## Timing
...

## Source
...
```

- Weight amounts must be written as inline code in the exact form `` `<digits>g` `` — the
  `markScalableQuantities` transform in `.eleventy.js` only matches `<code>NNNg</code>`.
  Decimals, units other than grams, and ranges are not scalable, and scaling multiplies the
  number rather than reformatting it.
- `recipe.njk` pipes the rendered Markdown through the `recipeSections` filter, which wraps
  each `<h2>` and what follows it in a `<section>`. Sections whose heading contains
  "ingredients" (case-insensitive) go in the left column and get a 1x/2x/3x control beside
  the heading, but only if they contain a scalable weight; everything else goes in the
  right column. Scaling applies to the `<code>` weights inside that section, so keep
  ingredients in their own section.
- In ingredient sections, list items that start with a weight (optionally `~`) are split
  into an amount column and an item column. Headings matching timing/method/steps/
  instructions/directions get numbered lists. In non-ingredient sections, durations and
  three-digit oven temperatures are bolded automatically.
- `markScalableQuantities` only runs on HTML output paths containing `/recipes/`.
- Recipes generally end with a `## Source` section crediting the original.

### Timing sections

Timing is written as a list of **actions** (things the cook does) alternating with
**rests** (waits), so the schedule can be worked out from any one time of day.
`raisin-pecan-bread` is the reference example:

```markdown
## Timing
- Mix all but the pecans. [5 minutes]
- 15-20 minutes: autolyse
- First fold
- ~2 hours 30 minutes: rest, until the dough is 2.5-3x original size
- Shape and move to pan. [10 minutes]
- 12 hours ± 3: overnight rest in fridge
- Bake for 50 minutes at 425. [50 minutes]
```

- A line that **starts with a duration and a colon** is a rest; every other line is an
  action. The text after the colon is free (`rest`, `autolyse`, `overnight rest in fridge`).
- An action may end with a `[duration]`: how long the cook is busy (mixing, shaping,
  baking). Leave it off for quick steps like folds; it counts as zero. The prose keeps any
  times worth reading ("Bake for 50 minutes"); the bracket is for the clock arithmetic.
- A leading `~` on a rest means the dough decides when it ends, and the duration is an
  estimate. Put the cue on the rest (`~30 minutes: rest, until …`), not on the next action.
- A range (`15-20 minutes`) or a `±` (`12 hours ± 3`, the unit carrying over from the
  duration) means any length in that span works. Use `±` when there is a usual value.
  Ranges and `±` are what make a schedule flexible, so put real slack in the duration
  rather than in prose ("probably ± 3 hours").
- Durations are hours and/or minutes: `10 minutes`, `2 hours 30 minutes`, `1.5 hours`.
  "Overnight" alone is not a duration; give the number.
- Prep that has to start ahead of time (feeding a starter, soaking fruit) is just more
  leading lines in the same form, e.g. `Feed the starter`, then `8-12 hours: starter ripens`.
- Keep the list flat. Tasks that overlap a step (preheating, covering with foil partway
  through a bake) stay in that step's prose; the timeline doesn't model them.
- Older recipes still use free-form Timing lists; they render as plain numbered steps.
  Convert them one at a time.

`recipeSections` turns a sequence section into a timeline (`is-timeline` on the section)
when its one list has at least one rest line and no nested lists; anything else, including
the older free-form lists, falls back to the numbered list unchanged. The parse runs before
`emphasizeFigures`. The build emits `<ol class="tl" data-timeline>` with one row per line:
actions are `li.tl-act` with `data-dur` (minutes) and `data-short` (the name used in status
lines: text up to the first `.`, `,`, `(`, " for ", " at " or " when "), rests are
`li.tl-rest` (`is-approx` for `~`) with `data-lo`/`data-hi`/`data-mid` in minutes and a
`--w` spacing weight, then a `tl-end` Done row. The status line already holds the total
time, and the Start now / Plan controls stay `hidden` until JS runs, so without JS the
timeline reads statically.

`initTimeline` in `main.js` reads that data back and adds the clock column: pin any action
or Done to a time, and every other step is worked out from it, with elastic rests (a span
of 60+ minutes) stretching to keep the next action out of the night (9 PM–6 AM, the
`NIGHT_START`/`NIGHT_END` constants). The plan is stored in `localStorage` under
`recipe-plan:<pathname>` as `{ node, time, count }`; it is dropped when `count` (the
build's row count, Done included) no longer matches, or when Done was more than 24 hours
ago. In timelines only `.tl-act` rows cross off.

## Gotchas

- Link building in templates must pipe through the `url` filter (`{{ '/foo' | url }}`) so
  `pathPrefix` is respected. `pathPrefix` comes from `ELEVENTY_PATH_PREFIX` and defaults to
  `/`; the deploy uses a custom subdomain, so it is currently unset in CI.
- `src/manifest.json` and `src/sw.js` are copied verbatim and hard-code root-absolute paths;
  they would need editing if the site ever moved back to a subpath.
- PWA assets are passed through explicitly in `.eleventy.js` (`manifest.json`, `sw.js`,
  `icon.png`, `favicon.svg`, and the self-hosted Archivo files in `src/fonts/`, which
  `sw.js` also precaches). A new static asset in `src/` is *not* copied unless added
  there. `icon.png` (512px, home-screen icon) and `favicon.svg` are drawings of the whisk
  mark in `src/_includes/header.njk`; keep them in step if the mark changes.
- `sw.js` uses a cache-first strategy for static assets keyed on `CACHE_NAME`
  (currently `cookbook-v6`); bump that constant when changing precached assets, or clients will serve
  stale bundles.
- `src/main.js` exposes `enableWakeLock`, `initRecipeScaling`, `initListItemToggle`,
  `initTimeline`, and `initCatalog` on `window`; `recipe.njk` and `index.html` call them from an inline
  `DOMContentLoaded` script. New page-level
  JS needs the same wiring. The keep-screen-on control is `#wake-lock-switch` in the recipe
  title row; it stays `hidden` until `enableWakeLock` runs. Likewise the homepage tabs and
  search field stay `hidden` until `initCatalog` runs, so without JS every category is
  listed in turn.
- Styling lives in `src/custom.css` on top of Bulma, which now only supplies its base
  reset (the navbar is gone; the header is a plain bar with a "Recipes" link off the
  homepage). Avoid Bulma class names such as `.icon`, `.tabs` or `.panel` for new markup. `<html data-theme="light">` turns off Bulma's automatic dark mode,
  since the design is light-only. The whisk mark in the header is absolutely positioned
  and overflows the header on purpose; the header uses `overflow-x: clip` so it never
  causes horizontal scroll.
- There is no per-recipe table of contents. `markdown-it-anchor` still runs, and the heading
  ids it generates are what `recipeSections` keys on — do not remove it.
- Custom Eleventy filters available in templates: `buildBreadcrumbs` (pass `navigation` to
  get real category titles), `catalogTabs`, `titleCase`, `recipeSections`.
