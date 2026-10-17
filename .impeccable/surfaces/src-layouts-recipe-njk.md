---
version: 1
slug: "src-layouts-recipe-njk"
primary_target: "src/_layouts/recipe.njk"
related_targets: ["src/_includes/header.njk","src/custom.css"]
---

# Recipe page

Scope: the recipe page (`src/_layouts/recipe.njk`) and the shared header/footer it sits in. Mode: Read, a glanceable reference used at the counter. Home and category pages inherit the header, type and color, but have not been redesigned yet.

Audience and job: the owner, mid-task with messy hands, needs an amount, time or temperature at arm's length. Friends open a shared link cold. The tools are scaling, crossing off lines and keeping the screen on.

Constraints: the nav items in the header are provisional, because navigation will be rethought separately. Only the chosen scale's amounts are shown, with no unused scale columns. There are no computed totals. Recipe content is never rewritten.

## Direction contract

THESIS: The standard modern recipe page (title, ingredients on the left, numbered timing on the right, one scale switch, one screen-on switch), printed as a bakery production form. It refuses the food-blog card and the bookish notebook alike.

OWN-WORLD: White bond ground and near-black ink #16181d. Form blue #2f5fae is the printed structure: wide tracked capital labels, the header rule, step numerals. Highlighter #e4f53a marks only what is active: the chosen scale and the switch knob. Archivo throughout, with expanded caps for labels and bold tabular amounts. Thin pale-blue rules #c9d6ec divide the rows. There are no pills, cards or shadows.

STORY: The visitor sees the title and the amounts first, taps 1×/2×/3×, and crosses lines off as they go. The screen stays on, with one visible switch.

FIRST VIEWPORT: A white header with a 3px form-blue rule and provisional nav at the left. An oversized form-blue whisk (40° head-down, highlighter handle) enters from the top-right edge, crosses the rule with a white gap cut around its wires, and hovers over the Keep-screen-on switch. Below the rule are the breadcrumb in blue capitals, a 54px Archivo 800 title, then Ingredients (amounts in a right-aligned tabular column, scale control on the label row) beside numbered Timing. On a phone everything stacks, and the whisk crops at the top-right corner.

FORM: Form Ink. This is a user-steered fusion of the category standard and the Production Sheet, which was #1 on the ranked list. seed:9fb4822a54be55aa
Signature interaction: the whisk mark dipping in over the switch. Motion grammar: instant state changes on the scale and switch, no entrance motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
- How navigation works (header nav items, category browsing).
- Home and category page layouts in the new world.
- App name. The whisk stands in for it for now.
