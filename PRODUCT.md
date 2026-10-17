# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary: the owner.** Cooks from the site at their own counter, with a phone or tablet
  propped up nearby, often with flour or dough on their hands. They already know these
  recipes; they come back for exact amounts, timings and temperatures mid-task.
- **Secondary: friends and family the owner sends links to.** They usually land straight on
  one recipe from a shared link, may be visiting for the first time, and won't have the
  owner's context.

## Product Purpose

A personal cookbook that works as a memory aid. Recipes are mostly the details that are easy
to forget: weights, ratios, timing, temperatures, and the odd cue like "when you see the
dough spread out in the tub". Usually there are no step-by-step instructions. The site is
working when a quick glance at the counter answers the question and the cook can go back to
the food.

Fuller step-by-step write-ups are allowed for recipes the owner knows less well. The content
model supports them, but they are the exception.

## Positioning

The owner's own recipe notes, in their own words and as terse as they choose to write them,
with the counter tools built in: scaling, crossing off ingredients, keeping the screen awake,
and working offline. It has no ads, life stories, ratings or accounts. It is a private
notebook that happens to have a URL.

## Operating Context

- Read at arm's length on a phone or tablet propped on the counter, often installed to the
  home screen as a PWA (including on iOS).
- Hands are often wet or messy. People tap; they don't type or do anything fiddly.
- Recipes run long, for example sourdough over many hours, so the screen has to stay on and
  the page has to remember what was crossed off and the chosen scale.
- It should keep working in a kitchen with bad wifi, which is why offline caching matters.
- Shared links are opened cold on whatever device the recipient has.

## Capabilities and Constraints

- Static site: Eleventy + Nunjucks + Markdown, Bulma, Rollup. Deployed to GitHub Pages on a
  custom subdomain. See CLAUDE.md for build and content conventions.
- The folder tree under `src/recipes/` drives navigation. Categories nest arbitrarily and
  there is no hand-maintained index.
- Gram weights written as `` `NNNg` `` can be scaled 1x/2x/3x, with the choice remembered
  per recipe. Tapping an ingredient line crosses it out. A wake lock (with an iOS fallback)
  keeps the screen on. It can be installed as a PWA and cached offline.
- Recipe sections follow the convention Ingredients → Timing (or instructions) → Source.
- **Content will grow** beyond today's 7 recipes, which are mostly bread, into cooking in
  general: more recipes, more categories, deeper nesting. Navigation and category pages must
  hold up at that scale.
- One author, with no login, search or user-generated content today. Whether search is
  needed later is undecided.

## Brand Commitments

- The site is called "Cookbook" (in the manifest, the page titles and the README). No other
  name or logo has been committed to.
- Voice: the owner's own terse, practical notes. Don't pad recipe content or rewrite it into
  something more polished.
- Every recipe credits its origin in a `## Source` section.

## Evidence on Hand

- Real recipes: `src/recipes/` (7 recipes: sourdough, yeasted breads, granola, sourdough
  pancakes).
- No photography exists. Don't invent food imagery, testimonials, ratings or other social
  proof.

## Product Principles

1. **Glanceable at arm's length.** The amount, time or temperature someone needs should be
   readable from a step away, mid-task.
2. **The counter is the context.** Assume a propped-up device, one tap at a time with messy
   hands, and long sessions with the screen kept awake.
3. **Notes, not lessons.** Respect the terse memory-aid format. Fuller instructions can be
   added, but nothing should assume them.
4. **Friendly to a cold visitor.** Someone arriving from a shared link should be able to tell
   what they're looking at and use the tools without explanation.
5. **Structure scales with the collection.** As recipes and categories multiply, finding one
   should stay quick.

## Accessibility & Inclusion

No formal standard has been set. The operating context means big tap targets, high contrast
and large type at reading distance in practice. Interactive behavior (crossing off, scaling)
should also stay usable without precise pointing.
