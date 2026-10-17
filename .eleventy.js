import markdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';

export default function(eleventyConfig) {
  // Configure markdown-it with anchor plugin
  const md = markdownIt({
    html: true,
    linkify: true,
    typographer: true
  }).use(markdownItAnchor);

  eleventyConfig.setLibrary("md", md);

  // Add breadcrumb filter. Titles come from the navigation tree (category JSON
  // titles and recipe front matter), falling back to the directory name.
  eleventyConfig.addFilter("buildBreadcrumbs", function(page, navigation = []) {
    const url = page.url;
    if (!url.startsWith('/recipes/')) return [];

    function findTitle(items, itemUrl) {
      for (const item of items) {
        if (item.url === itemUrl) return item.title;
        const found = findTitle(item.children || [], itemUrl);
        if (found) return found;
      }
      return null;
    }

    const segments = url.split('/').filter(Boolean).slice(1); // Remove 'recipes' prefix
    const breadcrumbs = [];
    let currentPath = '/recipes';

    for (let i = 0; i < segments.length; i++) {
      currentPath += '/' + segments[i];
      const crumbUrl = currentPath + '/';
      const fallback = segments[i].replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      breadcrumbs.push({
        title: findTitle(navigation, crumbUrl) || fallback,
        url: crumbUrl,
        tab: i === 0 ? tabSlug(crumbUrl) : null,
        isLast: i === segments.length - 1
      });
    }

    return breadcrumbs;
  });

  // Add title case filter
  eleventyConfig.addFilter("titleCase", function(str) {
    if (!str) return '';
    return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  });

  // Shape the navigation tree into homepage tabs: one per top-level category,
  // each listing its own recipes first, then every nested category flattened
  // into a labelled group ("Sourdough", "Sourdough / Rye").
  eleventyConfig.addFilter("catalogTabs", function(navigation = []) {
    function groupsFor(items, trail = []) {
      const recipes = items.filter(item => !item.isCategory)
        .map(({ title, url }) => ({ title, url }));
      const groups = recipes.length ? [{ title: trail.join(' / '), recipes }] : [];
      for (const item of items.filter(item => item.isCategory)) {
        groups.push(...groupsFor(item.children, [...trail, item.title]));
      }
      return groups;
    }

    const tabs = navigation.filter(item => item.isCategory).map(category => {
      const groups = groupsFor(category.children);
      return {
        title: category.title,
        slug: tabSlug(category.url),
        count: groups.reduce((sum, group) => sum + group.recipes.length, 0),
        groups
      };
    });

    // Recipes filed directly under src/recipes/ still need a home
    const loose = groupsFor(navigation.filter(item => !item.isCategory));
    if (loose.length) {
      tabs.push({ title: 'Other', slug: 'other', count: loose[0].recipes.length, groups: loose });
    }

    return tabs.filter(tab => tab.count);
  });

  // Group a recipe's rendered Markdown into one <section> per h2. Ingredient
  // sections go in the primary column, everything else in the secondary one.
  // Ingredient sections with scalable weights get a 1x/2x/3x control beside
  // their heading; other sections get times and temperatures set in bold.
  eleventyConfig.addFilter("recipeSections", function(html) {
    const chunks = html.split(/(?=<h2[\s>])/);
    const preamble = chunks[0].startsWith('<h2') ? '' : chunks.shift();
    const primary = [];
    const secondary = [];

    for (const chunk of chunks) {
      const match = chunk.match(/^<h2\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/);
      if (!match) {
        secondary.push(chunk);
        continue;
      }

      const [heading, id, inner] = match;
      const label = inner.replace(/<[^>]+>/g, '');
      const isIngredients = /ingredients/i.test(label);
      const isSequence = /timing|method|steps|instructions|directions/i.test(label);
      const isSource = /source/i.test(label);

      let body = chunk.slice(heading.length);
      body = isIngredients ? markQuantityLines(body) : emphasizeFigures(body);

      const control = isIngredients && /<code>\d+g<\/code>/.test(body) ? scaleControl(id) : '';
      const classes = ['recipe-section',
        isIngredients && 'is-ingredients',
        isSequence && 'is-sequence',
        isSource && 'is-source'].filter(Boolean).join(' ');

      const section = `<section class="${classes}" aria-labelledby="${id}">` +
        `<div class="section-head">${heading}${control}</div>${body}</section>`;
      (isIngredients ? primary : secondary).push(section);
    }

    const columns = primary.length
      ? `<div class="recipe-primary">${primary.join('')}</div><div class="recipe-secondary">${secondary.join('')}</div>`
      : `<div class="recipe-secondary">${secondary.join('')}</div>`;

    return `${preamble}<div class="recipe-columns${primary.length ? '' : ' is-single'}">${columns}</div>`;
  });

  // "/recipes/other_baked_goods/" -> "other-baked-goods", the homepage tab id
  function tabSlug(url) {
    return url.split('/').filter(Boolean).pop().replace(/_/g, '-');
  }

  function scaleControl(sectionId) {
    const buttons = [1, 2, 3].map(n =>
      `<button type="button" data-scale="${n}" aria-pressed="${n === 1}">${n}×</button>`
    ).join('');
    return `<div class="scale-control" role="group" aria-label="Scale ingredients" data-section-id="${sectionId}">${buttons}</div>`;
  }

  // Split "<code>200g</code> starter" list items into an amount column and an
  // item column. Items without a leading amount are left alone.
  function markQuantityLines(html) {
    return html.replace(/<li>([\s\S]*?)<\/li>/g, (whole, inner) => {
      const parts = inner.match(/^(~?)\s*(<code>[^<]*<\/code>)\s*([\s\S]*)$/);
      if (!parts || /<(ul|ol|li)[\s>]/.test(parts[3])) return whole;
      return `<li class="has-qty"><span class="qty">${parts[1]}${parts[2]}</span> <span class="item">${parts[3]}</span></li>`;
    });
  }

  // Bold durations ("20 minutes", "4-5 hours") and oven temperatures ("at 450",
  // "400-425") in text, skipping anything inside links or code.
  function emphasizeFigures(html) {
    // A duration, or a bare three-digit number in oven range (not followed by a
    // unit like "g", so weights in notes are left alone).
    const figure = /\b\d+(?:\.\d+)?(?:\s?[-–]\s?\d+(?:\.\d+)?)?\s?(?:minutes?|mins?|hours?|hrs?|seconds?|secs?|days?)\b|\b[2-5]\d{2}(?:\s?[-–]\s?[2-5]\d{2})?(?:\s?[˚°]\s?[FC]?)?(?=[\s.,;:?)]|$)/gi;
    let skipDepth = 0;
    return html.split(/(<[^>]+>)/).map(part => {
      if (part.startsWith('<')) {
        if (/^<(a|code)[\s>]/i.test(part)) skipDepth++;
        else if (/^<\/(a|code)>/i.test(part)) skipDepth = Math.max(0, skipDepth - 1);
        return part;
      }
      if (skipDepth) return part;
      return part.replace(figure, m => `<b class="fig">${m}</b>`);
    }).join('');
  }

  // Transform to mark scalable quantities with data attributes
  eleventyConfig.addTransform("markScalableQuantities", function(content, outputPath) {
    if (!outputPath || !outputPath.endsWith('.html') || !outputPath.includes('/recipes/')) {
      return content;
    }

    // Match <code>NNNg</code> pattern and add data attributes
    return content.replace(
      /<code>(\d+)g<\/code>/g,
      '<code data-original-value="$1" data-scalable="true">$1<span class="unit">g</span></code>'
    );
  });

  // Pass through CSS and JS bundles from Rollup to site root
  eleventyConfig.addPassthroughCopy({ "dist/bundle.css": "bundle.css" });
  eleventyConfig.addPassthroughCopy({ "dist/bundle.js": "bundle.js" });

  // PWA assets
  eleventyConfig.addPassthroughCopy({ "src/manifest.json": "manifest.json" });
  eleventyConfig.addPassthroughCopy({ "src/sw.js": "sw.js" });
  eleventyConfig.addPassthroughCopy({ "src/icon.png": "icon.png" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.svg": "favicon.svg" });
  eleventyConfig.addPassthroughCopy({ "src/fonts": "fonts" });

  // Watch for changes in dist (when Rollup rebuilds)
  eleventyConfig.addWatchTarget("dist/bundle.css");
  eleventyConfig.addWatchTarget("dist/bundle.js");

  // Also watch source CSS/JS to ensure rebuilds trigger
  eleventyConfig.addWatchTarget("src/main.js");
  eleventyConfig.addWatchTarget("src/custom.css");

  // Use passthrough mode for dev server to serve files directly from dist
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

  return {
    pathPrefix: process.env.ELEVENTY_PATH_PREFIX || "/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts"
    },
    templateFormats: ["html", "md", "njk"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
}
