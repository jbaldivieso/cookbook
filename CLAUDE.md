# Cookbook

A static site for hosting personal recipes.

## Features

- Display ingredient lists for frequently made recipes
- Auto-generated table of contents for each recipe
- Reusable header/footer components
- Scale recipes (double, triple, etc.) with automatic amount conversions

## Tech Stack

- 11ty (Eleventy) - Static site generator
- Bulma (CSS framework)
- Rollup (CSS/JS bundler)
- Nunjucks (Templating)
- Markdown for recipe content

## Development

```bash
npm install    # Install dependencies
npm run build  # Build CSS/JS + HTML to _site/
npm run dev    # Dev server with live reload at http://localhost:8080
```

## Project Structure

```
src/
  _layouts/      # 11ty layouts (base.njk, recipe.njk)
  _includes/     # Reusable components (header.njk, footer.njk)
  recipes/       # Recipe markdown files
  index.html     # Homepage
  main.js        # JS entry point (imports CSS)
  custom.css     # Custom CSS variables
dist/            # Rollup output (CSS/JS bundles)
_site/           # 11ty output (final static site)
```

## Adding a New Recipe

1. Create a new directory in `src/recipes/recipe-name/`
2. Add an `index.md` file with front matter:
   ```markdown
   ---
   layout: recipe.njk
   title: Recipe Name
   ---

   ## Ingredients
   - Item 1
   - Item 2

   ## Instructions
   ### Step 1
   Do something...
   ```
3. The TOC will be auto-generated from h2/h3 headings
4. Add a link to the recipe on the homepage
