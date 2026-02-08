import pluginTOC from 'eleventy-plugin-toc';
import markdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';

export default function(eleventyConfig) {
  // Configure markdown-it with anchor plugin
  const md = markdownIt({
    html: true,
    linkify: true
  }).use(markdownItAnchor);

  eleventyConfig.setLibrary("md", md);

  // Add TOC plugin
  eleventyConfig.addPlugin(pluginTOC, {
    tags: ['h2', 'h3'],
    ul: true
  });

  // Add breadcrumb filter
  eleventyConfig.addFilter("buildBreadcrumbs", function(page) {
    const url = page.url;
    if (!url.startsWith('/recipes/')) return [];

    const segments = url.split('/').filter(Boolean).slice(1); // Remove 'recipes' prefix
    const breadcrumbs = [];
    let currentPath = '/recipes';

    for (let i = 0; i < segments.length; i++) {
      currentPath += '/' + segments[i];
      breadcrumbs.push({
        title: segments[i].replace(/-/g, ' '),
        url: currentPath + '/',
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

  // Add getChildren filter
  eleventyConfig.addFilter("getChildren", function(navigation, categoryUrl) {
    function findCategory(items, url) {
      for (const item of items) {
        if (item.url === url) return item.children;
        if (item.children.length) {
          const found = findCategory(item.children, url);
          if (found !== null) return found;
        }
      }
      return null;
    }
    return findCategory(navigation, categoryUrl) || [];
  });

  // Add categoriesOnly filter
  eleventyConfig.addFilter("categoriesOnly", function(items) {
    function filterCategories(items) {
      return items
        .filter(item => item.isCategory)
        .map(item => ({
          ...item,
          children: filterCategories(item.children)
        }));
    }
    return filterCategories(items);
  });

  // Transform to inject scaling tabs before ingredient sections
  eleventyConfig.addTransform("injectScalingTabs", function(content, outputPath) {
    // Only process HTML files in /recipes/
    if (!outputPath || !outputPath.endsWith('.html') || !outputPath.includes('/recipes/')) {
      return content;
    }

    // Regex to find h2 headings containing "ingredients" (case-insensitive)
    const ingredientsHeadingRegex = /<h2\s+id="([^"]+)"[^>]*>([^<]*ingredients[^<]*)<\/h2>/gi;

    const matches = [];
    let match;

    // Collect all matches first (to avoid regex index issues during replacement)
    while ((match = ingredientsHeadingRegex.exec(content)) !== null) {
      matches.push({
        fullMatch: match[0],
        sectionId: match[1],
        index: match.index
      });
    }

    // Process in reverse order to preserve indices
    let result = content;
    for (let i = matches.length - 1; i >= 0; i--) {
      const { fullMatch, sectionId, index } = matches[i];

      const tabsHtml = `
<div class="tabs is-toggle scaling-tabs" data-section-id="${sectionId}">
  <ul>
    <li class="is-active" data-scale="1"><a>1x</a></li>
    <li data-scale="2"><a>2x</a></li>
    <li data-scale="3"><a>3x</a></li>
  </ul>
</div>
`;
      result = result.slice(0, index) + tabsHtml + result.slice(index);
    }

    return result;
  });

  // Transform to mark scalable quantities with data attributes
  eleventyConfig.addTransform("markScalableQuantities", function(content, outputPath) {
    if (!outputPath || !outputPath.endsWith('.html') || !outputPath.includes('/recipes/')) {
      return content;
    }

    // Match <code>NNNg</code> pattern and add data attributes
    return content.replace(
      /<code>(\d+)g<\/code>/g,
      '<code data-original-value="$1" data-scalable="true">$1g</code>'
    );
  });

  // Pass through CSS and JS bundles from Rollup to site root
  eleventyConfig.addPassthroughCopy({ "dist/bundle.css": "bundle.css" });
  eleventyConfig.addPassthroughCopy({ "dist/bundle.js": "bundle.js" });

  // PWA assets
  eleventyConfig.addPassthroughCopy({ "src/manifest.json": "manifest.json" });
  eleventyConfig.addPassthroughCopy({ "src/sw.js": "sw.js" });
  eleventyConfig.addPassthroughCopy({ "src/icon.png": "icon.png" });

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
