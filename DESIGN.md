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
  find:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 400
  find-compact:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 400
  tab:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.1
  tab-compact:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.1
  tab-count:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.75em"
    fontWeight: 600
    fontFeature: "tnum"
  tab-count-compact:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    fontFeature: "tnum"
  section-label-compact:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.16em"
    fontVariation: "'wdth' 125"
  catalog-row:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 700
    lineHeight: 1.15
  catalog-row-compact:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.15
  note:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
  small:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
  readout:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "36px"
    fontWeight: 800
    fontFeature: "tnum"
  clock:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 800
    lineHeight: 1.2
    fontFeature: "tnum"
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
  find-max: "560px"
  find-whisk-clearance: "92px"
  tab-gap: "8px"
  catalog-column-gap: "56px"
  catalog-group-gap: "30px"
  row-catalog: "64px"
  row-catalog-phone: "58px"
  glyph: "24px"
  clock-column: "8rem"
  clock-column-phone: "7rem"
  clock-gap: "14px"
  clock-gap-phone: "8px"
  rail: "30px"
components:
  header-bar:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    height: "72px"
  header-link:
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    height: "44px"
  find-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.find}"
    rounded: "{rounded.control}"
    padding: "0 4px 0 16px"
    width: "560px"
    height: "56px"
  find-clear:
    textColor: "{colors.form}"
    rounded: "{rounded.control}"
    size: "44px"
  catalog-tab:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.form}"
    typography: "{typography.tab}"
    rounded: "{rounded.control}"
    padding: "0 22px"
    height: "58px"
  catalog-tab-active:
    backgroundColor: "{colors.highlighter}"
    textColor: "{colors.ink}"
    typography: "{typography.tab}"
    rounded: "{rounded.control}"
    padding: "0 22px"
    height: "58px"
  catalog-tab-searching:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.tab}"
    rounded: "{rounded.control}"
    padding: "0 22px"
    height: "58px"
  bottom-tab-bar:
    backgroundColor: "{colors.paper}"
    padding: "8px 10px 10px"
  bottom-tab:
    textColor: "{colors.form}"
    typography: "{typography.tab-compact}"
    rounded: "{rounded.control}"
    padding: "4px 6px"
    height: "62px"
  bottom-tab-active:
    backgroundColor: "{colors.highlighter}"
    textColor: "{colors.ink}"
    typography: "{typography.tab-compact}"
    rounded: "{rounded.control}"
    padding: "4px 6px"
    height: "62px"
  catalog-row:
    textColor: "{colors.ink}"
    typography: "{typography.catalog-row}"
    padding: "10px 0"
    height: "64px"
  catalog-row-compact:
    textColor: "{colors.ink}"
    typography: "{typography.catalog-row-compact}"
    padding: "10px 0"
    height: "58px"
  catalog-label:
    textColor: "{colors.form}"
    typography: "{typography.section-label}"
    height: "44px"
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
  timeline-control:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.form}"
    rounded: "{rounded.control}"
    padding: "0 13px"
    height: "44px"
  timeline-clock:
    textColor: "{colors.ink}"
    typography: "{typography.clock}"
    rounded: "{rounded.control}"
    height: "44px"
  timeline-clock-night:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.clock}"
    rounded: "{rounded.control}"
    padding: "4px 6px 5px"
  timeline-slot:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.form}"
    rounded: "{rounded.control}"
    height: "44px"
  timeline-slot-editing:
    backgroundColor: "{colors.highlighter}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "44px"
  timeline-now-chip:
    backgroundColor: "{colors.highlighter}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "3px 6px"
  time-editor-readout:
    textColor: "{colors.ink}"
    typography: "{typography.readout}"
    height: "56px"
  time-editor-stepper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.form}"
    rounded: "{rounded.control}"
    size: "56px"
  time-editor-set:
    backgroundColor: "{colors.form}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    height: "52px"
---

# Design System: Cookbook

## Overview

**Creative North Star: "Form Ink"**

The standard modern recipe page (title, ingredients on the left, timing on the right, one scale switch, one screen-on switch), printed like a bakery production form, with timing drawn as a production schedule the cook can pin to the clock, and a homepage catalog filed like a tabbed register: square printed tabs, one category's recipes as large ruled rows, and a find field that reaches across every tab. The ground is white bond and the ink is near-black. Everything that is *printed structure* (the header rule, the wide-tracked capital labels, the step numerals, the breadcrumb, links, focus rings) is in one form blue. Everything that is *active right now* (the chosen scale, the selected catalog tab, the letters a search matched, the switch knob when the screen is being held on, the timing slot being edited, where the clock is now, selected text) is marked in highlighter. The cook's own words sit on the form at counter-reading size, with the amounts set heaviest so the eye finds the number first.

The world is ruled, not raised. Rows are divided by thin pale-blue rules, the header by a 3px form-blue rule, and there are no cards, chips, shadows or photographs. A single variable family, Archivo, does all the lettering; its width axis carries role, condensed for the title and expanded for the labels. The site's identity is an oversized whisk, drawn to the owner's own whisk, that dips in from the top-right edge and crosses the header rule. It stands in for a wordmark ("Cookbook" remains only the manifest and document name).

It refuses the food-blog card and the bookish notebook alike. Light mode only: `data-theme="light"` and `color-scheme: light` switch off Bulma's dark scheme, and dark mode is not designed. Bulma now supplies only its base reset; every visible component is drawn in `custom.css`.

Scope of evidence: the recipe page, the homepage catalog, and the shared header, breadcrumb and footer are designed. There are no category listing pages; a category is reached as a homepage tab.

**Key Characteristics:**
- One family, Archivo (self-hosted variable woff2, weight 100–900, width 62–125%), with width as a role signal.
- Two-color ink system: form blue for printed structure, highlighter for live state only.
- Amounts in a right-aligned bold tabular column; durations and oven temperatures bolded in running text.
- Timing as a form-blue rail of action squares and rests, with a right-aligned clock column that mirrors the amount column once a step is pinned to a time.
- 22px reading size for anything read mid-task; tap targets at least 44px.
- Ruled rows, square corners or 4px at most, no elevation.
- Authored line glyphs (24px, 2.25 stroke, round caps) in Form Blue; no icon font or library.
- The whisk mark as identity, cropped by the page edge and cutting the header rule with a white halo.
- Instant state changes; no entrance motion.

## Colors

A two-ink print palette on white: one structural blue and one fluorescent marker, over a cool near-black text ramp.

### Primary
- **Form Blue** (`form`): the printed structure of the form. The 3px header rule, section labels, breadcrumbs, step numerals, square list bullets, link text, the scale buttons' numerals, the switch track outline and its "on" fill, the whisk wires and ferrule, and the 3px focus outline. In a timeline: the rail (solid, or dotted 5px on / 5px off where the dough decides), the action squares (filled for the pinned step), the Done bar, the dashed pick slots, day-break labels, the editor's 2px frame and readout rule, and its Set button's fill. On the homepage: the find field's 2px border and glyphs, unselected tab labels, the 2px rule under the desktop tabs and the 3px rule over the phone tab bar, the catalog group labels, and the row arrows.

### Secondary
- **Highlighter** (`highlighter`): marks only what is live. The selected scale button's fill, the selected catalog tab's fill, the matched letters in search results, the switch knob while the screen is held on, the timing slot being edited and the editor's chosen day, the "now" chip and the current step's square while a plan is underway, and `::selection`. Always carries Ink text or sits on Form Blue; never used as text color on white (1.2:1).

### Neutral
- **Ink** (`ink`): body text, the title, amounts, catalog rows, the header's Recipes link, clock times, and the border and text of the selected scale button and selected tab. As a ground, Ink appears only in the timeline's night reverse print, a deliberate warning.
- **Soft Ink** (`ink-soft`): secondary text. The Source note, the footer hint, the disabled switch label, the find placeholder, the search status line, tab counts, every tab while a search is running, and in a timeline the rest descriptions, AM/PM, the `±` span, the status line, and window and stretch notes.
- **Done Ink** (`ink-done`): crossed-off lines (always paired with a 2px line-through) and the disabled switch track and knob. A deliberate low-contrast state for finished items, not a text color.
- **Form Rule** (`form-rule`): 1px row rules between ingredient lines, under the title row and above the footer; the resting border of the scale buttons and desktop tabs; the rules above and between catalog rows.
- **Paper** (`paper`): the page, the header, button grounds, and the whisk's halo.

### Named Rules
**The Printed Structure Rule.** If it is part of the form (rule, label, numeral, bullet, link, focus ring), it is Form Blue. Text the cook wrote is Ink.

**The Highlighter Is Live Rule.** Highlighter marks state that is currently on: the chosen scale, the selected catalog tab, the letters a search matched, the held wake lock, the timing slot being edited, the "now" marker on a plan underway, selected text. The only resting use is the whisk's grip, which belongs to the identity mark. Nothing else gets highlighter at rest.

## Typography

**Display Font:** Archivo at 90% width (with `system-ui, sans-serif`)
**Body Font:** Archivo at normal width
**Label Font:** Archivo at 125% width, uppercase, wide tracking

**Character:** A single grotesque that changes width the way a printed form changes typesetting: tight and heavy for the job title, wide and spaced for the pre-printed field labels, plain for the handwritten-in content. Self-hosted and precached so it holds offline.

### Hierarchy
- **Display** (800, 3.375rem / 54px, 1.02, -0.015em, 90% width; 2.625rem / 42px at 768px and below): the recipe title, one per page, balanced wrapping. The homepage uses the 42px size only on phones, as the active category's name above its rows; on wider screens the selected tab names the category and the title is visually hidden.
- **Section label** (700, 0.875rem / 14px, 0.16em tracking, 125% width, uppercase, Form Blue; 0.8125rem / 13px on phones in the catalog): the recipe h2s (Ingredients, Timing, Source) and the catalog's sub-category and search-result group labels. These are real headings, not decorative kickers.
- **Crumb** (600, 0.9375rem / 15px, 0.12em, 125% width, uppercase, Form Blue): the parent-category trail above the title, separated by `/`. The current page is omitted because the title follows.
- **Catalog row** (700, 1.625rem / 26px, 1.15; 1.375rem / 22px on phones, Ink): each recipe name in the homepage catalog.
- **Tab** (700, 1.375rem / 22px, 1.1 on desktop; 1rem / 16px in the phone tab bar): category tab labels. The count beside it is 600 tabular, 0.75em on desktop and 0.8125rem / 13px on phones, in Soft Ink (Ink on the selected tab).
- **Find** (400, 1.3125rem / 21px; 1.1875rem / 19px on phones, Ink, Soft Ink placeholder): the find field's input.
- **Subhead** (700, 1.0625rem / 17px, 112% width): h3s inside a recipe body.
- **Body** (400, 1.375rem / 22px, 1.45 for paragraphs, 1.4 for list items, 1.3 in ingredient rows; 65ch max for paragraphs): every ingredient, step and note.
- **Amount** (800, 1.14em of body, tabular figures): the gram weight in the amount column; its `g` unit drops to 0.72em at 700. Other inline code in a recipe is 700 tabular at body size.
- **Figure** (800, inherits body size): durations and oven temperatures, bolded automatically in non-ingredient sections.
- **Control** (600, 1.1875rem / 19px): the header's Recipes link; the wake switch label is 600 at 1.125rem; scale button numerals are 800 at 1.1875rem.
- **Note** (400, 1.125rem / 18px, Soft Ink): the Source section and the catalog's search status line (its count in 700 Ink).
- **Small** (400, 1rem / 16px, Soft Ink): the footer hint.
- **Clock** (800, body size, 1.2, tabular; AM/PM at 0.6em 700 in Soft Ink, 0.55em on phones): planned times in the timeline's clock column. A rest's duration uses the same 800 tabular figures with `h`/`min` at 0.72em, like the gram unit.
- **Readout** (800, 36px, tabular; AM/PM at 0.5em): the time in the inline time editor, a size used nowhere else. It is the number being set, so it is the largest figure on the screen while the editor is open.

### Named Rules
**The One Family Rule.** Archivo is the only face. Role is carried by width, weight and case, not by a second family or a monospace.

**The Amount First Rule.** Amounts, times and temperatures are the heaviest marks in their line (800). The cook should find the number before the word.

**The Arm's-Length Rule.** Anything read mid-task is set at 22px or larger. Below that is reserved for labels, wayfinding (tabs, counts, find input, status lines, timing windows and notes) and the footer hint.

## Layout

A centered page of 1120px max (`page-max`) with 40px gutters, 18px at 768px and below. The header rule runs full-bleed; header content aligns to the same page edge.

Recipe page, top to bottom: header; breadcrumb; a title row with the title left and the Keep-screen-on switch right, bottom-aligned, closed by a 1px Form Rule; then two columns, Ingredients (up to 400px) and everything else (Timing, other sections, Source) at 56px apart. A recipe without an ingredients section uses one 760px column. At 899px and below the columns stack with 36px between them; at 768px and below the title row stacks too (switch below the title, full width) and loses its rule.

Homepage catalog, top to bottom: header; a find field (560px max, 56px tall); 22px below, a row of square tabs (8px apart) standing on a 2px Form Blue rule; the search status line when there is one; then the active category's panel 28px below, its sub-category groups in two columns 56px apart with 30px between rows of groups. During a search the panels themselves form the two columns, one per category with matches. Without JavaScript the find field and tabs stay hidden and every category is listed in turn, 48px apart, each under its title.

At 768px and below the catalog changes shape: the find field runs full width but stops 92px short of the right edge so it clears the whisk; the category's name heads the page in 42px Display; groups stack in one column 22px apart; and the tabs leave the top and become a bottom tab bar fixed to the screen edge, within thumb reach, with the page padded 120px (plus the safe-area inset) so the last row clears it. The bottom bar's equal cells hold about four top-level categories; past that, phones should switch to stacked full-width tabs (mock `.impeccable/mocks/tabs/b-stacked.html`) rather than squeezing the labels. Changing tabs on a phone scrolls back to the top.

Gutters respect the device's safe areas: the viewport is `viewport-fit=cover`, the gutter is the larger of 40px (18px on phones) and the left or right safe-area inset, and the bottom bar pads by the safe-area insets with a 10px floor.

Sections are 36px apart. Each opens with a 44px label row; in Ingredients the scale control sits at the right end of that row. Ingredient rows are a two-column grid: a 4.6rem right-aligned amount column, 14px gap, then the item; lines without an amount indent to the item column so text aligns. Step lists hang their numerals 34px out. A timeline row is a three-column grid: the clock column (0 until a step is pinned, then 8rem with a 14px gap; 7rem and 8px at 768px and below, wide enough that `~12:10 PM` and a night chip keep the same right edge as every other time), a 30px rail, then the text 12px in. Rests take vertical room on a log scale of their length (12–60px above and below, 0.8× on phones), so a 12-hour rest reads longer than a 10-minute one without the page running to hours. The footer shares the page width, separated by a 1px Form Rule.

## Elevation & Depth

Flat. There are no shadows anywhere in the designed surfaces. Separation comes from rules (3px Form Blue under the header and over the phone tab bar, 2px Form Blue under the desktop tabs, 1px Form Rule between rows and around the title row) and from type weight. The phone tab bar is fixed over the content but stays flat: a Paper ground and its top rule are the only separation. The one overlap is the whisk, which sits over the header rule and title row; it reads as printed over the form, not lifted above it, because a 7px Paper halo cuts a gap in whatever it crosses.

### Named Rules
**The Ruled, Not Raised Rule.** Structure is drawn with lines. No cards, panels, raised surfaces or drop shadows.

## Shapes

Square by default. Buttons, the find field and the clear button take a 4px corner (`rounded.control`); desktop tabs round only their top corners (4px 4px 0 0) and have no bottom border, so they stand on the rule beneath them like file tabs; phone tab cells are 4px all round. Rows, rules, the 6px square list bullets and the timeline's 16px action squares have none; the clock buttons, pick slots, night reverse print, "now" chip and the inline editor's frame take the 4px control corner.

Icons are authored line glyphs on a 24px box: 24px, 2.25 stroke, round caps and joins, no fill, colored by `currentColor` (find, clear, and the row arrow). They are drawn for the site, not taken from a library or icon font. The wake switch is the one fully rounded form: a 52 × 30px track (15px radius) with a 20px round knob, because that is the native shape of a toggle switch. The whisk is the only organic silhouette.

## Components

### Scale Control (signature)
*Three printed boxes; the chosen one is highlighted.*
- **Structure:** a 6px-gapped row of three separate buttons, `1×` `2×` `3×`, each at least 48 × 44px, in the Ingredients label row.
- **Default:** Paper ground, 1.5px Form Rule border, 4px corners, Form Blue numerals at 800.
- **Hover:** border darkens to Form Blue.
- **Selected:** Highlighter fill, Ink border and numerals. The change is meant to be instant.
- **Known drift (not yet repaired):** these buttons do not override Bulma's default button fade, so they still inherit a 294ms transition; the catalog controls show the intended `transition: none`.
- **Behavior:** rescales every whole-gram amount in that section and is remembered per recipe. Only the chosen scale's amounts are ever shown; there are no unused scale columns and no computed totals of recipe weights.

### Keep-Screen-On Switch
*One visible switch that tells the truth.*
- **Structure:** a `role="switch"` button, label then track, at least 44px tall; hidden until the script runs so it never appears dead.
- **Off:** Paper track with a 2px Form Blue outline, Form Blue knob at the left.
- **On:** Form Blue track, Highlighter knob slid 22px right. Reads "on" only while a wake lock is actually held.
- **Unsupported:** disabled, label "Screen may sleep" in Soft Ink, track and knob in Done Ink.
- **Motion:** knob and fill transition at 150ms ease-out, the only designed transition in the system.

### Ingredient Row
- **Style:** Body text, 11px vertical padding, 1px Form Rule below each line. Amount column right-aligned, 800 tabular, unit reduced.
- **Crossed off:** tapping any ingredient or step toggles Done Ink plus a 2px line-through. Pointer cursor and no text selection make the line read as a control.

### Step List
- **Style:** numbered sequence for Timing, Method, Steps, Instructions or Directions sections that are not written as a timeline (no rest lines, or a nested list). Form Blue numerals at 800 tabular, hung 34px; 15px between steps. Durations and temperatures bolded. Crossed-off steps grey their numeral too.
- **Other lists:** non-sequence, non-ingredient sections use a 6px square Form Blue bullet.

### Timeline (signature)
*The production schedule: a rail of things to do and the waits between them.*
- **Rail:** a 2px Form Blue line in a 30px column, solid through fixed rests and dotted (5px on, 5px off) through approximate ones, where the dough decides. It starts at the first square and stops at Done, a 22 × 4px Form Blue bar.
- **Actions:** a 16px square with a 2.5px Form Blue border on Paper beside the cook's words in Body type. The pinned step's square is filled Form Blue. Tapping the row crosses it off: words in Done Ink with a 2px line-through, square and clock time in Done Ink.
- **Rests:** the duration is the heaviest mark in the row (800 tabular, `h`/`min` units at 0.72em, a `±` span in 700 Soft Ink), followed by what is happening in Soft Ink.
- **Status line:** Note type in Soft Ink with key figures in 700 Ink, announced politely. At rest it gives the total time ("About 16 h 40 min start to finish"); planned, when it ends or what lands in the night; underway, the next step and its countdown.
- **Controls:** Start now and Plan (or Cancel, or Clear) at the right of the Timing label row: 44px buttons with a 1.5px Form Rule border and 4px corners, Form Blue 700 labels at 17px, border to Form Blue on hover. Hidden until the script runs.
- **Clock column:** once planned, each action and Done shows its time right-aligned in Clock type, mirroring the amount column. Times are rounded to 5 minutes except the pinned one, which is exact and underlined in Form Blue; times past an approximate rest carry a Soft Ink `~`. Each time is a button that re-opens the editor; hover underlines it.
- **Windows and notes:** a step on the far side of an elastic rest gets "Window **4:20 AM** – **10:20 AM**" beneath it, and a rest stretched to keep a step out of the night says so ("Planned at **12 h 15 min** to keep bake out of the night"), both in Note type in Soft Ink with times in 700 Ink.
- **Day breaks:** where the calendar day changes, a Section-label weekday in Form Blue followed by a 1px Form Rule across the text column.
- **Night reverse print:** an action that starts between 9 PM and 6 AM prints its time in reverse, Paper on an Ink chip (AM/PM in a light grey), and adds a moon glyph with "In the night" in 700 Ink at 18px. On phones the chip trims its side padding and figures to 0.9em so a time like "~10:40 PM" clears the rail. Rests are never flagged.
- **Now (live):** while a plan is underway, the current action's square fills Highlighter with an Ink border; inside a rest, a Highlighter chip with a 1.5px Ink border shows the time in the clock column with an 18 × 3px Ink tick across the rail, placed proportionally through the rest. It refreshes every 30 seconds while the page is visible.
- **No-JS:** the rail, squares, rest durations, total and Done render statically; no clock column and no controls.

### Pick Slot and Time Editor
*Pin one step; everything else follows.*
- **Pick slot:** in Plan mode every action and Done offers a full-width 44px slot in the clock column: dashed 1.5px Form Blue border, 4px corners, "Set" in Form Blue 700 at 17px; solid on hover. The slot being edited turns solid Highlighter with an Ink border and shows the time being set.
- **Editor:** opens as its own row directly under the step, framed by a 2px Form Blue border with 4px corners and 14px padding. A Note-type heading ("**Shape and move to pan** at"), then: 56px square −15 / +15 steppers (1.5px Form Rule border, Form Blue 800 at 19px) either side of the Readout, which sits on a 2px Form Blue rule and is a transparent native time input underneath, so a tap opens the platform's time wheel; a Today / Tomorrow pair (48px, Form Rule border, the chosen day in Highlighter with an Ink border) and a Now button; and a 52px Form Blue Set button (Ink on hover) with a plain Form Blue Cancel.
- **Keyboard:** focus moves to the readout on open and back to the step's clock button on close; Escape cancels.
- **Motion:** none; every timeline button sets `transition: none`.

### Whisk Mark (signature identity)
*The owner's whisk, dipping into the page.*
- **Drawing:** two nested balloon loops and a center wire, drawn to the owner's real whisk proportions (about 9.5" overall with a 3.5" handle, the wires tapering slowly and widening near the tip). Form Blue wires (2.5 stroke, round caps), Form Blue ferrule, Highlighter grip outlined in Form Blue. Rotated 220°, head down.
- **Placement:** 240px square, top −61px, right edge 108px beyond the page edge, so it is cropped by the top and right of the viewport and crosses the header rule over the title row's switch. At 768px and below, 180px at −52px / −34px.
- **Halo:** a Paper copy drawn underneath at stroke 7 cuts a gap wherever the whisk crosses the rule.
- **Behavior:** it is the home link (labelled "Cookbook home"); only painted strokes take pointer events. No entrance or hover animation.
- **Favicon:** the same whisk at 140°, Form Blue with Highlighter grip, on a 48 viewBox.

### Header Bar
- **Bar:** a 72px Paper bar with a 3px Form Blue bottom rule, content aligned to the page edge. The whisk is the home link and the only mark; there is no menu, burger or dropdown.
- **Recipes link:** off the homepage only, a single "Recipes" link at the left in Control type (600, 19px, Ink), at least 44px tall, turning Form Blue on hover with no background. On the homepage the bar is empty except for the whisk.
- **Breadcrumb:** see Crumb type. The top-level category links to its homepage tab (`/#<tab>`), in Form Blue with underline on hover; deeper categories are plain Form Blue labels, since they have no page of their own.

### Find Field
*A printed box you write a name into.*
- **Structure:** a search landmark holding a find glyph, the input (placeholder "Recipe name", visually hidden label "Find a recipe by name") and a clear button. 560px max, 56px tall, 2px Form Blue border, 4px corners, glyphs in Form Blue. On phones 52px tall, full width, ending 92px short of the edge to clear the whisk.
- **Focus:** the whole box takes the 3px Form Blue focus outline; the input itself shows only a Form Blue caret.
- **Clear:** a 44px square glyph button, Form Blue, Ink on hover, shown only when there is text. Escape also clears; Enter opens the recipe when exactly one matches.
- **Scope:** matches recipe names only, every typed word anywhere in the name, across all tabs.
- **Status line:** Note type in Soft Ink under the tabs, announced politely. With matches: "**N recipes** have "query" in the name, across all tabs." With none: "No recipe names contain "query". Names only: try part of a word, or clear the search." Empty and collapsed when not searching.

### Category Tabs (signature)
*The register's printed tabs; the open one is highlighted.*
- **Desktop and tablet:** a wrapping row of square tabs, 8px apart, standing on a 2px Form Blue rule. Each is at least 58px tall with 22px side padding, Paper ground, 1.5px Form Rule border with no bottom edge, top corners 4px, label in Tab type in Form Blue, then the recipe count. Hover (pointer devices only) darkens the border to Form Blue.
- **Selected:** Highlighter fill, Ink border, label and count. The change is instant.
- **Phone bottom bar (768px and below):** the tabs are fixed to the bottom edge on a Paper bar with a 3px Form Blue top rule, as equal-width cells 6px apart, each at least 62px tall with the label stacked over its count in Tab-compact type, centered and balanced. Resting cells have a transparent border; the selected cell is Highlighter with a 1.5px Ink border. Padding is 8px on top and at least 10px elsewhere, growing with the safe-area insets.
- **Capacity:** the bottom bar holds about four top-level categories. Past that, phones switch to stacked full-width tabs (mock `.impeccable/mocks/tabs/b-stacked.html`); do not shrink or truncate labels to fit more cells.
- **Searching:** because results come from every tab, no tab reads as chosen: all tabs, including the selected one, drop to Paper with Form Rule borders and Soft Ink labels and counts.
- **Memory:** the selected tab is written to the URL hash and to localStorage; on load the hash wins, then the stored tab, then the first. Arrow keys, Home and End move between tabs.
- **Motion:** none. Bulma's default button fade is overridden (`transition: none`) on the tabs and the clear button so state changes are instant.

### Catalog Rows
- **Style:** each recipe is a full-width link row: name in Catalog row type (700, 26px; 22px on phones) in Ink, a 24px Form Blue arrow glyph at the right end, at least 64px tall (58px on phones) with 10px vertical padding. A 1px Form Rule runs above the first row and below every row.
- **Hover:** the name takes a 2px Form Blue underline.
- **Group labels:** each sub-category heads its rows with a 44px Section label row in Form Blue (40px and 13px on phones); deeper nesting is flattened into one label joined with ` / `. Recipes filed directly in the top-level category come first, without a label.
- **Search results:** matches regroup under their category's name, set as a Section label; sub-category labels are dropped. Matched letters in each name are marked in Highlighter with Ink text and no padding.
- **No-JS fallback:** every category is listed in full, one after another, each headed by its title; the find field and tabs never appear.

## Do's and Don'ts

### Do:
- **Do** draw every piece of form structure (rules, labels, numerals, bullets, links, focus) in Form Blue and the cook's content in Ink.
- **Do** reserve Highlighter for live state: the chosen scale, the selected tab, matched search letters, the held wake lock, the timing slot being edited, the "now" marker, selected text.
- **Do** set anything read mid-task at 22px or larger, with amounts, times and temperatures at 800.
- **Do** keep tap targets at least 44px tall and state changes instant; set `transition: none` on any new button, since Bulma fades buttons by default.
- **Do** separate rows and regions with 1px Form Rule lines and the 3px Form Blue header rule.
- **Do** keep the whisk as the identity: cropped by the top-right edge, crossing the header rule with its Paper halo.
- **Do** draw new icons as 24px line glyphs with a 2.25 stroke and round caps, in `currentColor`.
- **Do** move phones from the bottom tab bar to stacked full-width tabs once there are more than about four top-level categories.

### Don't:
- **Don't** add cards, shadows, raised panels, chips or pill-shaped buttons; the toggle switch is the only rounded form.
- **Don't** introduce a second typeface or a monospace for amounts; use Archivo's tabular figures.
- **Don't** show amounts for scales other than the chosen one, or computed totals of recipe weights. (A timeline's total time is fine; it is a schedule, not a sum of ingredients.)
- **Don't** use Highlighter at rest outside the whisk grip, or as a text color on white.
- **Don't** add entrance or decorative motion.
- **Don't** design or preserve a dark mode; the site is light only.
- **Don't** add per-category listing pages or a nested link tree; categories are homepage tabs.
