---
name: Cookbook
description: A personal baker's notebook of recipes, set large in Crimson Pro for reading at the counter.
colors:
  page: "#ffffff"
  page-edge: "#f9fafb"
  slate-wash: "#f3f4f6"
  rule-gray: "#d6d9e0"
  slate-ink: "#404654"
  deep-slate: "#2e333d"
  faded-ink: "#69748c"
  ink-indigo: "#2942ff"
  indigo-bright: "#4258ff"
  chrome-indigo: "#485fc7"
  weight-crimson: "#cc0029"
  proof-green: "#48c78e"
  proof-green-ink: "#0c271b"
  nudge-amber: "#ffb70f"
  nudge-amber-ink: "#332400"
typography:
  headline:
    fontFamily: "Crimson Pro, serif"
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: 1.125
  title:
    fontFamily: "Crimson Pro, serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1.125
  index:
    fontFamily: "Crimson Pro, serif"
    fontSize: "2rem"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Crimson Pro, serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Crimson Pro, serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.5
  small:
    fontFamily: "Crimson Pro, serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  quantity:
    fontFamily: "Inconsolata, Hack, SF Mono, Roboto Mono, Source Code Pro, Ubuntu Mono, monospace"
    fontSize: "0.875em"
    fontWeight: 600
rounded:
  sm: "0.25rem"
  md: "0.375rem"
  pill: "0.5em"
spacing:
  block: "1.5rem"
  section-y: "3rem"
  section-x: "1.5rem"
  section-x-desktop: "3rem"
components:
  scale-toggle:
    backgroundColor: "{colors.page}"
    textColor: "{colors.slate-ink}"
    rounded: "{rounded.md}"
    padding: "0.5em 1em"
    typography: "{typography.small}"
  scale-toggle-active:
    backgroundColor: "{colors.indigo-bright}"
    textColor: "{colors.page}"
    rounded: "{rounded.md}"
    padding: "0.5em 1em"
  quantity-pill:
    backgroundColor: "{colors.slate-wash}"
    textColor: "{colors.weight-crimson}"
    rounded: "{rounded.pill}"
    padding: "0.25em 0.5em"
    typography: "{typography.quantity}"
  wake-lock-badge-active:
    backgroundColor: "{colors.proof-green}"
    textColor: "{colors.proof-green-ink}"
    rounded: "{rounded.sm}"
    height: "2.5em"
  wake-lock-badge-idle:
    backgroundColor: "{colors.nudge-amber}"
    textColor: "{colors.nudge-amber-ink}"
    rounded: "{rounded.sm}"
    height: "2.5em"
  navbar:
    backgroundColor: "{colors.page-edge}"
    textColor: "{colors.slate-ink}"
    typography: "{typography.label}"
    height: "3.25rem"
  footer:
    backgroundColor: "{colors.page-edge}"
    textColor: "{colors.slate-ink}"
    padding: "3rem 1.5rem 6rem"
    typography: "{typography.small}"
---

# Design System: Cookbook

## Overview

**Creative North Star: "The Baker's Notebook"**

Cookbook is someone's own notebook of ratios they worked hard to get right, not a published
cookbook. It is set in a bookish serif (Crimson Pro) at sizes meant for a page propped
against the backsplash. Body text is half again as large as normal, and the category index
is twice normal size. The notes are terse and the layout is a single plain column: a title,
a few short sections, and the weights picked out in a small monospace pill so the eye finds
the number first.

Most of what isn't type comes straight from Bulma 1.0's stock theme: cool slate neutrals,
indigo links and a crimson code color. **These colors are inherited, not chosen.** They are
recorded here so new work matches what ships today, but they aren't commitments. A future
pass may replace any of them as long as it keeps the notebook character. The deliberate
choices are the typeface, the large reading scale, the monospace quantity pill, and controls
that feel touchable.

The notebook stays away from three nearby looks: the glossy food blog or magazine (hero
photos, card grids, lifestyle imagery), generic app or SaaS UI (sans-serif dashboards, pill
buttons, gradients, shadows everywhere), and faux-rustic kitsch (chalkboard, gingham, script
fonts, wood grain).

The site is designed for light mode only. Bulma currently switches to a dark palette when
the device asks for it, but that is a side effect nobody designed or tested. Future work
doesn't need to keep it working and may turn it off.

**Key Characteristics:**
- One serif voice, Crimson Pro, for everything except the quantities.
- Oversized reading scale: 24px body text and a 32px category index, readable from a step back.
- Weights stand out as monospace pills; when a weight can be scaled, its pill is semibold.
- Flat, white pages with no imagery, no cards and no decorative depth.
- Controls that feel tactile and friendly: obviously tappable, with a clear state change.
- Colors are Bulma 1.0's stock theme and are marked as inherited.

## Colors

The palette is a cool, slate-tinted neutral ramp with two inherited accents: indigo for
anything you can tap and crimson for quantities. All of it is Bulma 1.0's stock theme.

### Primary
- **Ink Indigo** (`ink-indigo`): The color of link text, including breadcrumbs and
  category/recipe links in the index. *Inherited* (Bulma link-on-scheme).
- **Bright Indigo** (`indigo-bright`): The fill behind the active 1x/2x/3x scale tab and the
  mobile burger icon. *Inherited* (Bulma link base).
- **Chrome Indigo** (`chrome-indigo`): Used only for the browser and PWA chrome, through
  `<meta name="theme-color">` and the manifest's `theme_color`. It is the Bulma 0.9 link
  color and has drifted from the in-page indigo. *Inherited / legacy.*

### Secondary
- **Weight Crimson** (`weight-crimson`): The text color of every inline-code quantity, so
  `200g` reads as a figure written in the margin. *Inherited* (Bulma code color), but it is
  now the main way the eye finds the numbers. Keep a distinct color for quantities even if
  this hue changes.

### Tertiary
- **Proof Green** (`proof-green`): The wake-lock badge when the screen is staying on, with
  text in its own darkest tint (`proof-green-ink`). *Inherited* (Bulma success).
- **Nudge Amber** (`nudge-amber`): The wake-lock badge when it's asking for a tap to keep
  the screen on, with text in `nudge-amber-ink`. *Inherited* (Bulma warning).

### Neutral
- **Page** (`page`): The page background.
- **Page Edge** (`page-edge`): The navbar and footer bands, a barely visible tint that marks
  where the page begins and ends.
- **Slate Wash** (`slate-wash`): The background of the quantity pill, and the hairline under
  the navbar.
- **Rule Gray** (`rule-gray`): Borders on the scale toggle and the breadcrumb separators.
- **Slate Ink** (`slate-ink`): Body text and navbar items.
- **Deep Slate** (`deep-slate`): Headings: the recipe title and section h2s.
- **Faded Ink** (`faded-ink`): Weak or secondary text where Bulma uses it. It is rarely
  visible today.

### Named Rules
**The Inherited Palette Rule.** Every color above came from Bulma. Matching them is correct
by default, but no color is sacred. Changing the palette is a design decision to make
deliberately, not drift to avoid at any cost.

**The Quantities Stand Apart Rule.** Quantities always get a color and typeface different
from the surrounding text. Changing the crimson is allowed; making weights look like
ordinary text is not.

## Typography

**Body Font:** Crimson Pro (with `serif`), loaded from Google Fonts across its full weight
range (200–900) with italics.
**Quantity Font:** Bulma's code stack, `Inconsolata, Hack, SF Mono, …, monospace`.
Inconsolata isn't loaded, so Apple devices show SF Mono.

**Character:** a literary serif doing every job, from the 800-weight headings down to the
16px footer note. Against it, the small monospace quantities read like figures written in
the margin of a notebook.

### Hierarchy
- **Headline** (800, 2rem / 32px, 1.125): The recipe or category title, one per page.
- **Title** (800, 1.75rem / 28px, 1.125): Section h2s in a recipe (Ingredients, Timing,
  Source).
- **Index** (400, 2rem / 32px, 1.5): The nested category and recipe lists on the homepage and
  category pages. Category names in the list are bold.
- **Body** (400, 1.5rem / 24px, 1.5): Recipe list items and paragraphs. This is the reading
  size at the counter.
- **Label** (700, 1.25rem / 20px): Navbar items and the "Cookbook" wordmark.
- **Small** (400, 1rem / 16px): Breadcrumbs, the footer hint, the scale toggle and
  subtitles.
- **Quantity** (600 when scalable, 0.875em of its context, so about 21px in a list item):
  Inline gram weights.

### Named Rules
**The Arm's-Length Rule.** Anything a cook needs to read mid-task (ingredients, timings,
temperatures) is set at the 24px body size or larger. The 16px Small size is only for
wayfinding and hints.

**The One Serif Rule.** Crimson Pro is the only text face. Monospace is reserved for
quantities.

## Layout

A single centered column inside Bulma's `.section > .container`. Sections are padded 3rem
top and bottom, with 1.5rem sides on phones and 3rem from 1024px up. The container fills the
viewport below 1024px and is capped at 960 / 1152 / 1344px at Bulma's desktop, widescreen
and fullhd breakpoints (1024 / 1216 / 1408px). Because there's no measure cap, lines can run
long on a wide tablet in landscape.

Recipe pages are, in order: breadcrumbs, title, and then the Markdown sections (Ingredients,
Timing, Source), each opened by an h2. The scale toggle sits directly above each Ingredients
heading. Lists use disc bullets indented 2em, and the index lists nest with the category
tree. There's no grid, sidebar or multi-column layout. Below 1024px the navbar collapses
into a burger menu whose category dropdowns open on tap.

## Elevation & Depth

Flat. Pages are white sheets with tinted bands at top and bottom (Page Edge). The only edges
are a 0.125em Slate Wash line under the navbar and the 1px borders on the scale toggle.
Bulma's own soft drop shadow appears under the desktop category dropdown, and that's the
only shadow on the site.

**The Flat Page Rule.** Nothing rises off the page. Don't add cards, raised panels or
decorative shadows. Show hierarchy with type size and weight.

## Shapes

Gently softened rectangles. The scale toggle and badge use Bulma's small radii (0.25rem and
0.375rem, with the toggle rounded only at its outer ends). The quantity pill is the roundest
shape on the page (0.5em), which gives each weight a small lozenge. There are no circles, no
fully rounded pill buttons and no ornament. Shapes stay quiet so the type carries the page.

## Components

### Scale Toggle (signature)
*Tactile and friendly: a row of three segmented tabs, so it's obvious which one is
selected.*
- **Structure:** Bulma `tabs is-toggle`. Three joined segments, `1x` `2x` `3x`, in a
  Rule Gray 1px outline, rounded at the outer ends (0.375rem).
- **Default:** white with Slate Ink text at the Small size, padded 0.5em 1em.
- **Active:** filled with Bright Indigo and white text.
- **Behavior:** tapping a segment rescales every weight pill in that Ingredients section,
  and the choice is remembered per recipe.

### Quantity Pill (signature)
- **Style:** the monospace stack at 0.875em, Weight Crimson on Slate Wash, padded
  0.25em 0.5em, with a 0.5em radius.
- **Scalable:** semibold (600). Only whole-gram weights scale. Other inline code keeps the
  same pill at normal weight.

### Crossed-Off Line
*The notebook's tick-mark.* Tapping any ingredient or step line toggles a line-through and
drops it to 60% opacity. A pointer cursor and `user-select: none` make it feel like a
control, not text. The footer explains it in one line: "Tap ingredient lines or recipe
steps to cross them out."

### Wake-Lock Badge
- **Style:** a small Bulma button (`is-small`, 0.25rem radius) in the recipe-page footer.
- **States:** Proof Green "Screen staying on". Nudge Amber "Tap to keep screen on" (idle or
  denied; tapping it asks for the lock again). Light gray "Screen may sleep" when the
  browser doesn't support wake lock.

### Navigation
- **Navbar:** a Page Edge band 3.25rem tall, bold at the 20px Label size, with the "Cookbook"
  wordmark plus one dropdown per top-level category. Each dropdown lists that category's
  children and ends with a "View all …" link. On desktop the dropdowns open on hover; on
  mobile they open with a tap inside the burger menu.
- **Breadcrumbs:** Small size, Ink Indigo links with Rule Gray `/` separators. The current
  page is shown but isn't a link.
- **Index lists:** 32px disc lists that mirror the category tree. Categories are bold and
  recipes are regular weight.

### Footer
A Page Edge band (3rem 1.5rem 6rem padding) holding the tap-to-cross-off hint and, on recipe
pages, the wake-lock badge, stacked with a 0.75rem gap.

## Do's and Don'ts

### Do:
- **Do** set every new text element in Crimson Pro, at 24px (Body) or larger if a cook
  reads it mid-task.
- **Do** write gram weights as inline code so they render as quantity pills and can scale.
- **Do** make interactive elements look obviously tappable and change state clearly
  (filled versus outlined, struck through versus not), in line with the tactile, friendly
  control style.
- **Do** keep pages flat and in a single column. Show hierarchy with type size and weight.
- **Do** treat the Bulma colors as the current default. A deliberate palette change is
  allowed; keep quantities in their own color either way.
- **Do** keep `chrome-indigo` (theme-color and manifest) in mind whenever the in-page
  palette changes. They have already drifted apart.

### Don't:
- **Don't** drift toward a glossy food blog or magazine: no hero photos, card grids or
  lifestyle imagery.
- **Don't** drift toward generic app or SaaS UI: no sans-serif dashboards, pill buttons,
  gradients or shadows everywhere.
- **Don't** drift toward faux-rustic kitsch: no chalkboard textures, gingham, handwritten
  script fonts or wood grain.
- **Don't** add a second text typeface. Monospace is only for quantities.
- **Don't** add raised cards or decorative shadows. Bulma's dropdown shadow is the only one.
- **Don't** spend effort designing or preserving dark mode. The site is designed for light
  mode only.
