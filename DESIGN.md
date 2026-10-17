---
name: Cookbook
description: A personal recipe notebook printed like a bakery production form; form blue for the printed structure, highlighter only for what is active.
colors:
  ink: "#16181d"
  ink-soft: "#5b6170"
  ink-done: "#a3a8b3"
  form: "#2f5fae"
  form-rule: "#c9d6ec"
  highlighter: "#e4f53a"
  paper: "#ffffff"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "3.375rem"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 90"
  display-compact:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "2.625rem"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 90"
  section-label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.16em"
    fontVariation: "'wdth' 125"
  crumb:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.12em"
    fontVariation: "'wdth' 125"
  subhead:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 700
    fontVariation: "'wdth' 112"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 400
    lineHeight: 1.45
  amount:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.14em"
    fontWeight: 800
    fontFeature: "tnum"
  figure:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1em"
    fontWeight: 800
  control:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 600
  note:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
  small:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
rounded:
  control: "4px"
  switch: "15px"
  knob: "50%"
spacing:
  page-max: "1120px"
  gutter: "40px"
  gutter-phone: "18px"
  column-gap: "56px"
  column-gap-stacked: "36px"
  section-gap: "36px"
  row-y: "11px"
  amount-column: "4.6rem"
  amount-gap: "14px"
  step-indent: "34px"
  tap-min: "44px"
components:
  header-bar:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    height: "72px"
  scale-button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.form}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    width: "48px"
    height: "44px"
  scale-button-active:
    backgroundColor: "{colors.highlighter}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    width: "48px"
    height: "44px"
  wake-switch-track:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.switch}"
    width: "52px"
    height: "30px"
  wake-switch-track-on:
    backgroundColor: "{colors.form}"
    rounded: "{rounded.switch}"
    width: "52px"
    height: "30px"
  wake-switch-knob-on:
    backgroundColor: "{colors.highlighter}"
    rounded: "{rounded.knob}"
    size: "20px"
  section-label:
    textColor: "{colors.form}"
    typography: "{typography.section-label}"
    height: "44px"
  ingredient-row:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "11px 0"
  ingredient-row-done:
    textColor: "{colors.ink-done}"
    typography: "{typography.body}"
    padding: "11px 0"
  breadcrumb:
    textColor: "{colors.form}"
    typography: "{typography.crumb}"
---

# Design System: Cookbook

## Overview

**Creative North Star: "Form Ink"**

The standard modern recipe page (title, ingredients on the left, numbered timing on the right, one scale switch, one screen-on switch), printed like a bakery production form. The ground is white bond and the ink is near-black. Everything that is *printed structure* (the header rule, the wide-tracked capital labels, the step numerals, the breadcrumb, links, focus rings) is in one form blue. Everything that is *active right now* (the chosen scale, the switch knob when the screen is being held on, selected text) is marked in highlighter. The cook's own words sit on the form at counter-reading size, with the amounts set heaviest so the eye finds the number first.

The world is ruled, not raised. Rows are divided by thin pale-blue rules, the header by a 3px form-blue rule, and there are no cards, chips, shadows or photographs. A single variable family, Archivo, does all the lettering; its width axis carries role, condensed for the title and expanded for the labels. The site's identity is an oversized whisk, drawn to the owner's own whisk, that dips in from the top-right edge and crosses the header rule. It stands in for a wordmark ("Cookbook" remains only the manifest and document name).

It refuses the food-blog card and the bookish notebook alike. Light mode only: `data-theme="light"` and `color-scheme: light` switch off Bulma's dark scheme, and dark mode is not designed.

Scope of evidence: the recipe page and the shared header and footer are designed. The home and category pages inherit the header, type and colors but have not been designed yet; their current index-list styling is a placeholder, not a pattern. The header nav items are provisional, pending a separate navigation redesign.

**Key Characteristics:**
- One family, Archivo (self-hosted variable woff2, weight 100–900, width 62–125%), with width as a role signal.
- Two-color ink system: form blue for printed structure, highlighter for live state only.
- Amounts in a right-aligned bold tabular column; durations and oven temperatures bolded in running text.
- 22px reading size for anything read mid-task; tap targets at least 44px.
- Ruled rows, square corners or 4px at most, no elevation.
- The whisk mark as identity, cropped by the page edge and cutting the header rule with a white halo.
- Instant state changes; no entrance motion.

## Colors

A two-ink print palette on white: one structural blue and one fluorescent marker, over a cool near-black text ramp.

### Primary
- **Form Blue** (`form`): the printed structure of the form. The 3px header rule, section labels, breadcrumbs, step numerals, square list bullets, link text, the scale buttons' numerals, the switch track outline and its "on" fill, the whisk wires and ferrule, and the 3px focus outline.

### Secondary
- **Highlighter** (`highlighter`): marks only what is live. The selected scale button's fill, the switch knob while the screen is held on, and `::selection`. Always carries Ink text or sits on Form Blue; never used as text color on white (1.2:1).

### Neutral
- **Ink** (`ink`): body text, the title, amounts, nav items, and the border of the selected scale button.
- **Soft Ink** (`ink-soft`): secondary text. The Source note, category descriptions, the footer hint, the disabled switch label.
- **Done Ink** (`ink-done`): crossed-off lines (always paired with a 2px line-through) and the disabled switch track and knob. A deliberate low-contrast state for finished items, not a text color.
- **Form Rule** (`form-rule`): 1px row rules between ingredient lines, under the title row and above the footer; the resting border of the scale buttons; the nesting rule in index lists.
- **Paper** (`paper`): the page, the header, button grounds, and the whisk's halo.

### Named Rules
**The Printed Structure Rule.** If it is part of the form (rule, label, numeral, bullet, link, focus ring), it is Form Blue. Text the cook wrote is Ink.

**The Highlighter Is Live Rule.** Highlighter marks state that is currently on: the chosen scale, the held wake lock, selected text. The only resting use is the whisk's grip, which belongs to the identity mark. Nothing else gets highlighter at rest.

## Typography

**Display Font:** Archivo at 90% width (with `system-ui, sans-serif`)
**Body Font:** Archivo at normal width
**Label Font:** Archivo at 125% width, uppercase, wide tracking

**Character:** A single grotesque that changes width the way a printed form changes typesetting: tight and heavy for the job title, wide and spaced for the pre-printed field labels, plain for the handwritten-in content. Self-hosted and precached so it holds offline.

### Hierarchy
- **Display** (800, 3.375rem / 54px, 1.02, -0.015em, 90% width; 2.625rem / 42px at 768px and below): the recipe or category title, one per page, balanced wrapping.
- **Section label** (700, 0.875rem / 14px, 0.16em tracking, 125% width, uppercase, Form Blue): the h2s, Ingredients, Timing, Source. These are the real section headings, not decorative kickers.
- **Crumb** (600, 0.9375rem / 15px, 0.12em, 125% width, uppercase, Form Blue): the parent-category trail above the title, separated by `/`. The current page is omitted because the title follows.
- **Subhead** (700, 1.0625rem / 17px, 112% width): h3s inside a recipe body.
- **Body** (400, 1.375rem / 22px, 1.45 for paragraphs, 1.4 for list items, 1.3 in ingredient rows; 65ch max for paragraphs): every ingredient, step and note.
- **Amount** (800, 1.14em of body, tabular figures): the gram weight in the amount column; its `g` unit drops to 0.72em at 700. Other inline code in a recipe is 700 tabular at body size.
- **Figure** (800, inherits body size): durations and oven temperatures, bolded automatically in non-ingredient sections.
- **Control** (600, 1.1875rem / 19px): nav items; the wake switch label is 600 at 1.125rem; scale button numerals are 800 at 1.1875rem.
- **Note** (400, 1.125rem / 18px, Soft Ink): the Source section.
- **Small** (400, 1rem / 16px, Soft Ink): the footer hint.

### Named Rules
**The One Family Rule.** Archivo is the only face. Role is carried by width, weight and case, not by a second family or a monospace.

**The Amount First Rule.** Amounts, times and temperatures are the heaviest marks in their line (800). The cook should find the number before the word.

**The Arm's-Length Rule.** Anything read mid-task is set at 22px or larger. Below that is reserved for labels, wayfinding and the footer hint.

## Layout

A centered page of 1120px max (`page-max`) with 40px gutters, 18px at 768px and below. The header rule runs full-bleed; header content aligns to the same page edge.

Recipe page, top to bottom: header; breadcrumb; a title row with the title left and the Keep-screen-on switch right, bottom-aligned, closed by a 1px Form Rule; then two columns, Ingredients (up to 400px) and everything else (Timing, other sections, Source) at 56px apart. A recipe without an ingredients section uses one 760px column. At 899px and below the columns stack with 36px between them; at 768px and below the title row stacks too (switch below the title, full width) and loses its rule.

Sections are 36px apart. Each opens with a 44px label row; in Ingredients the scale control sits at the right end of that row. Ingredient rows are a two-column grid: a 4.6rem right-aligned amount column, 14px gap, then the item; lines without an amount indent to the item column so text aligns. Step lists hang their numerals 34px out. The footer shares the page width, separated by a 1px Form Rule.

## Elevation & Depth

Flat. There are no shadows anywhere in the designed surfaces. Separation comes from rules (3px Form Blue under the header, 1px Form Rule between rows and around the title row) and from type weight. The one overlap is the whisk, which sits over the header rule and title row; it reads as printed over the form, not lifted above it, because a 7px Paper halo cuts a gap in whatever it crosses.

### Named Rules
**The Ruled, Not Raised Rule.** Structure is drawn with lines. No cards, panels, raised surfaces or drop shadows.

## Shapes

Square by default. Buttons take a 4px corner (`rounded.control`); rows, rules and the 6px square list bullets have none. The wake switch is the one fully rounded form: a 52 × 30px track (15px radius) with a 20px round knob, because that is the native shape of a toggle switch. The whisk is the only organic silhouette.

## Components

### Scale Control (signature)
*Three printed boxes; the chosen one is highlighted.*
- **Structure:** a 6px-gapped row of three separate buttons, `1×` `2×` `3×`, each at least 48 × 44px, in the Ingredients label row.
- **Default:** Paper ground, 1.5px Form Rule border, 4px corners, Form Blue numerals at 800.
- **Hover:** border darkens to Form Blue.
- **Selected:** Highlighter fill, Ink border and numerals. The change is instant.
- **Behavior:** rescales every whole-gram amount in that section and is remembered per recipe. Only the chosen scale's amounts are ever shown; there are no unused scale columns and no computed totals.

### Keep-Screen-On Switch
*One visible switch that tells the truth.*
- **Structure:** a `role="switch"` button, label then track, at least 44px tall; hidden until the script runs so it never appears dead.
- **Off:** Paper track with a 2px Form Blue outline, Form Blue knob at the left.
- **On:** Form Blue track, Highlighter knob slid 22px right. Reads "on" only while a wake lock is actually held.
- **Unsupported:** disabled, label "Screen may sleep" in Soft Ink, track and knob in Done Ink.
- **Motion:** knob and fill transition at 150ms ease-out, the only transition in the system.

### Ingredient Row
- **Style:** Body text, 11px vertical padding, 1px Form Rule below each line. Amount column right-aligned, 800 tabular, unit reduced.
- **Crossed off:** tapping any ingredient or step toggles Done Ink plus a 2px line-through. Pointer cursor and no text selection make the line read as a control.

### Step List
- **Style:** numbered sequence for Timing, Method, Steps, Instructions or Directions sections. Form Blue numerals at 800 tabular, hung 34px; 15px between steps. Durations and temperatures bolded. Crossed-off steps grey their numeral too.
- **Other lists:** non-sequence, non-ingredient sections use a 6px square Form Blue bullet.

### Whisk Mark (signature identity)
*The owner's whisk, dipping into the page.*
- **Drawing:** two nested balloon loops and a center wire, drawn to the owner's real whisk proportions (about 9.5" overall with a 3.5" handle, the wires tapering slowly and widening near the tip). Form Blue wires (2.5 stroke, round caps), Form Blue ferrule, Highlighter grip outlined in Form Blue. Rotated 220°, head down.
- **Placement:** 240px square, top −61px, right edge 108px beyond the page edge, so it is cropped by the top and right of the viewport and crosses the header rule over the title row's switch. At 768px and below, 180px at −52px / −34px.
- **Halo:** a Paper copy drawn underneath at stroke 7 cuts a gap wherever the whisk crosses the rule.
- **Behavior:** it is the home link (labelled "Cookbook home"); only painted strokes take pointer events; hidden while the mobile menu is open. No entrance or hover animation.
- **Favicon:** the same whisk at 140°, Form Blue with Highlighter grip, on a 48 viewBox.

### Navigation (provisional)
- **Header bar:** 72px Paper bar, items in Control type (600, 19px, Ink), hover to Form Blue with no background; dropdown chevrons in Form Blue; 3px Form Blue bottom rule. Below Bulma's desktop breakpoint, a burger at the left.
- **Status:** the item set (Home plus one dropdown per top-level category) and the dropdown behavior are provisional and will be redesigned separately. Only the bar, its rule and the item type are part of the system.
- **Breadcrumb:** see Crumb type; links in Form Blue, underline on hover.

### Index Lists (placeholder)
Home and category pages currently show nested 24px Ink link lists with a 2px Form Rule nesting line. These pages have not been designed in this world; do not treat the list as a reusable pattern.

## Do's and Don'ts

### Do:
- **Do** draw every piece of form structure (rules, labels, numerals, bullets, links, focus) in Form Blue and the cook's content in Ink.
- **Do** reserve Highlighter for live state: the chosen scale, the held wake lock, selected text.
- **Do** set anything read mid-task at 22px or larger, with amounts, times and temperatures at 800.
- **Do** keep tap targets at least 44px tall and state changes instant.
- **Do** separate rows and regions with 1px Form Rule lines and the 3px Form Blue header rule.
- **Do** keep the whisk as the identity: cropped by the top-right edge, crossing the header rule with its Paper halo.

### Don't:
- **Don't** add cards, shadows, raised panels, chips or pill-shaped buttons; the toggle switch is the only rounded form.
- **Don't** introduce a second typeface or a monospace for amounts; use Archivo's tabular figures.
- **Don't** show amounts for scales other than the chosen one, or computed totals.
- **Don't** use Highlighter at rest outside the whisk grip, or as a text color on white.
- **Don't** add entrance or decorative motion.
- **Don't** design or preserve a dark mode; the site is light only.
- **Don't** treat the current nav items or the home/category index lists as settled patterns.
