import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function() {
  const recipesDir = path.join(__dirname, '../recipes');

  function buildTree(dir, urlPath = '/recipes') {
    const items = [];

    if (!fs.existsSync(dir)) {
      return items;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      // Skip hidden files and non-category JSON files
      if (entry.name.startsWith('.') || entry.name === 'recipes.json') {
        continue;
      }

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Check if this directory contains an index.md (recipe) or is a category
        const indexMdPath = path.join(fullPath, 'index.md');
        const isRecipeDir = fs.existsSync(indexMdPath);

        if (isRecipeDir) {
          // This is a recipe directory with index.md
          const recipeName = entry.name;
          const itemUrl = `${urlPath}/${recipeName}/`;

          items.push({
            title: recipeName.replace(/-/g, ' '),
            url: itemUrl,
            order: 999,
            isCategory: false,
            children: []
          });
        } else {
          // This is a category folder
          const categoryName = entry.name;
          const itemUrl = `${urlPath}/${categoryName}/`;

          // Load category metadata from [category].json
          const metaPath = path.join(fullPath, `${categoryName}.json`);
          let meta = {
            title: categoryName.replace(/-/g, ' '),
            order: 999
          };

          if (fs.existsSync(metaPath)) {
            try {
              const metaContent = fs.readFileSync(metaPath, 'utf8');
              meta = { ...meta, ...JSON.parse(metaContent) };
            } catch (err) {
              console.warn(`Failed to parse ${metaPath}:`, err.message);
            }
          }

          items.push({
            title: meta.title,
            description: meta.description || '',
            url: itemUrl,
            order: meta.order,
            isCategory: true,
            children: buildTree(fullPath, itemUrl.slice(0, -1))
          });
        }
      } else if (entry.name.endsWith('.md')) {
        // This is a recipe markdown file
        const recipeName = entry.name.replace('.md', '');
        const itemUrl = `${urlPath}/${recipeName}/`;

        items.push({
          title: recipeName.replace(/-/g, ' '),
          url: itemUrl,
          order: 999,
          isCategory: false,
          children: []
        });
      }
    }

    // Sort by order, then by title
    return items.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return a.title.localeCompare(b.title);
    });
  }

  return buildTree(recipesDir);
}
