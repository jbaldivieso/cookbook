---
version: 1
slug: "src-index-html"
primary_target: "src/index.html"
related_targets: ["src/_includes/header.njk","src/custom.css","src/main.js"]
---

# Homepage (recipe catalog)

Scope: the homepage `src/index.html`, which replaces the old nested link list and every category listing page. The shared header changes with it: the provisional Bulma navbar and its category dropdowns go away. Mode: Operate. The visitor's job is to get to a recipe.

Audience and job: the owner usually knows what they're about to cook and wants it in one or two taps, often from the installed PWA on a phone. Friends the owner shows the site to should see what's in it at a glance and want to bookmark it. Shared recipe links still land cold on recipe pages.

Constraints: no new front matter, so titles and the folder tree only. Search matches recipe names only. There's no "All" tab. It's a static site, so filtering happens in the browser over markup rendered at build time, and every recipe stays reachable without JS (all panels render; tabs and search are enhancements).

## Direction contract

THESIS: The catalog as a tabbed register. Top-level categories are square printed tabs, one tab's recipes fill the page as large ruled tap rows, and a name-only find field reaches across every tab. It refuses both the nested link tree and per-category listing pages.

OWN-WORLD: Form Ink unchanged: white paper, ink #16181d, form blue #2f5fae for tabs, rules, labels and arrows, highlighter #e4f53a only on the live tab and on matched letters. Square tabs with 4px corners, 1px pale-blue row rules, Archivo throughout. No cards or shadows.

STORY: The owner opens the site, the last tab used is already selected, and they tap the recipe. A friend sees the categories as tabs with counts and every name as a big row. Typing narrows names across all tabs.

FIRST VIEWPORT: Phone: the header rule with the whisk dipping in, a find field that stops short of the whisk, the active category's name as a 42px display title, its recipes in 58px ruled rows under blue sub-category labels, and a bottom tab bar fixed to the screen edge with a 3px form-blue top rule, equal-width cells, the active one highlighted with an ink border. Tablet and desktop: a 560px find field, a row of square tabs on a 2px form-blue rule, and the active panel's sub-categories in two columns.

FORM: Category Tabs, bottom-bar variant (mock `.impeccable/mocks/tabs/c-bottom-bar.html`), #6 on the ordered list, chosen by the user over the dealt lead. seed:0ca0209e738ed27d
Signature interaction: tab changes are instant and remembered (URL hash plus last tab). Searching greys the tabs, regroups matches under category labels and highlights the matched letters. Motion grammar: no motion; state changes are instant.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
- **Bottom bar capacity:** the phone bottom bar fits about four top-level categories. If the count grows past that, switch phones (at least) to the stacked full-width tabs in `.impeccable/mocks/tabs/b-stacked.html`. The owner asked for this to be noted.
- A "Desserts/Breakfast" top-level category is planned but not created; pancakes and granola still live under Other Baked Goods.
