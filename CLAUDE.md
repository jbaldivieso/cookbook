# Cookbook

A static site for hosting personal recipes.

## Features

- Display ingredient lists for frequently made recipes
- Scale recipes (double, triple, etc.) with automatic amount conversions

## Tech Stack

- Bulma (CSS framework)
- Rollup (bundler)

## Development

```bash
npm install    # Install dependencies
npm run build  # Build to dist/
npm run dev    # Dev server with live reload at http://localhost:3000
```

## Project Structure

```
src/
  index.html   # Main HTML page
  main.js      # JS entry point (imports CSS)
dist/          # Build output
```
