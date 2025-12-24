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
          if (found) return found;
        }
      }
      return [];
    }
    return findCategory(navigation, categoryUrl);
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

  // Pass through CSS and JS bundles from Rollup to site root
  eleventyConfig.addPassthroughCopy({ "dist/bundle.css": "bundle.css" });
  eleventyConfig.addPassthroughCopy({ "dist/bundle.js": "bundle.js" });

  // Watch for changes in dist (when Rollup rebuilds)
  eleventyConfig.addWatchTarget("dist/bundle.css");
  eleventyConfig.addWatchTarget("dist/bundle.js");

  return {
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
