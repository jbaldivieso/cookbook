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
      // Parse before emphasizeFigures, whose <b> tags would split the durations
      const timeline = isSequence ? timelineSection(body) : null;
      body = isIngredients ? markQuantityLines(body) : timeline ? timeline.body : emphasizeFigures(body);

      const control = isIngredients && /<code>\d+g<\/code>/.test(body) ? scaleControl(id)
        : timeline ? timelineControl() : '';
      const classes = ['recipe-section',
        isIngredients && 'is-ingredients',
        isSequence && 'is-sequence',
        timeline && 'is-timeline',
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

  // Timing sections written as actions and rests (see CLAUDE.md, "Timing
  // sections") become a timeline: a rail with a square per action and the
  // rests between them, plus the data initTimeline needs to plan clock times.
  //   "15-20 minutes: autolyse"        opens with a duration and a colon: a rest
  //   "~30 minutes: rest, until ..."   a leading ~ means the dough decides
  //   "12 hours ± 3: overnight ..."    a range or ± means any length in it works
  //   "Shape. [10 minutes]"            anything else is an action; [duration] optional
  const TL_UNIT = '(?:hours?|hrs?|minutes?|mins?)';
  const TL_NUM = '\\d+(?:\\.\\d+)?';
  const REST_RE = new RegExp(
    `^(~)?\\s*((?:${TL_NUM}(?:\\s*[-–]\\s*${TL_NUM})?\\s*${TL_UNIT}\\s*)+(?:±\\s*${TL_NUM}\\s*${TL_UNIT}?\\s*)?):\\s*(.*)$`, 'is');
  const TERM_RE = new RegExp(`(${TL_NUM})(?:\\s*[-–]\\s*(${TL_NUM}))?\\s*(${TL_UNIT})`, 'gi');
  const PLUS_RE = new RegExp(`±\\s*(${TL_NUM})\\s*(${TL_UNIT})?`, 'i');
  const unitMinutes = unit => (/^h/i.test(unit) ? 60 : 1);

  // "2 hours 30 minutes", "15-20 minutes", "12 hours ± 3" -> minutes
  function parseDuration(text) {
    const body = text.split('±')[0];
    let lo = 0, hi = 0, big = 1, m;
    TERM_RE.lastIndex = 0;
    while ((m = TERM_RE.exec(body))) {
      const unit = unitMinutes(m[3]);
      big = Math.max(big, unit);
      lo += +m[1] * unit;
      hi += (m[2] ? +m[2] : +m[1]) * unit;
    }
    const pm = text.match(PLUS_RE);
    const plus = pm ? +pm[1] * (pm[2] ? unitMinutes(pm[2]) : big) : 0;
    return { lo: lo - plus, hi: hi + plus, mid: (lo + hi) / 2, plus, ranged: hi > lo };
  }

  // Position in html just past its first n characters of text, skipping tags
  function htmlOffset(html, n) {
    let i = 0;
    while (i < html.length && (n > 0 || html[i] === '<')) {
      if (html[i] === '<') i = html.indexOf('>', i) + 1 || html.length;
      else { i++; n--; }
    }
    return i;
  }

  function timelineSection(body) {
    const lists = body.match(/<(ul|ol)>[\s\S]*?<\/\1>/g);
    if (!lists || lists.length !== 1) return null;
    const list = lists[0];
    const inner = list.slice(4, -5);
    if (/<(ul|ol)[\s>]/.test(inner)) return null;

    const items = [...inner.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(([, html]) => {
      const raw = html.replace(/<[^>]+>/g, '');
      const lead = raw.length - raw.trimStart().length;
      const text = raw.trim();

      const rest = text.match(REST_RE);
      if (rest) {
        const what = html.slice(htmlOffset(html, lead + rest[0].length - rest[3].length)).trim();
        return { kind: 'rest', approx: !!rest[1], ...parseDuration(rest[2]), html: what.replace(/\.$/, '') };
      }

      // Only a bracket that holds a duration is taken off; "[see note]" stays in the text
      const bracket = text.match(/\s*\[([^\]]+)\]$/);
      const tail = bracket && parseDuration(bracket[1]).hi > 0 ? bracket : null;
      const dur = tail ? parseDuration(tail[1]).mid : 0;
      const shown = tail ? html.slice(0, htmlOffset(html, lead + tail.index)) : html.trim();
      const plain = tail ? text.slice(0, tail.index) : text;
      return { kind: 'act', dur, html: shown, short: plain.split(/[.,(]|\s(?:for|at|when)\s/)[0].trim() };
    });
    if (!items.some(item => item.kind === 'rest')) return null;

    const total = items.reduce((sum, item) => sum + (item.kind === 'rest' ? item.mid : item.dur), 0);
    const cells = content => `<div class="t"></div><div class="r">${content}</div>`;
    const rows = items.map(item => {
      if (item.kind === 'act') {
        return `<li class="tl-act" data-dur="${item.dur}" data-short="${item.short}">${cells('<i class="mk"></i>')}` +
          `<div class="c"><span class="txt">${emphasizeFigures(item.html)}</span></div></li>`;
      }
      // Longer rests take more room on the rail, on a log scale
      const weight = Math.min(60, Math.max(12, 4 + 9 * Math.log2(Math.max(item.mid, 5) / 5)));
      return `<li class="tl-rest${item.approx ? ' is-approx' : ''}" data-lo="${item.lo}" data-hi="${item.hi}" ` +
        `data-mid="${item.mid}" style="--w:${weight.toFixed(1)}">${cells('')}` +
        `<div class="c"><span class="dur">${restDurationHTML(item)}</span> <span class="what">${emphasizeFigures(item.html)}</span></div></li>`;
    });
    rows.push(`<li class="tl-end">${cells('<i class="mk"></i>')}<div class="c"><span class="txt">Done</span></div></li>`);

    const timeline = `<p class="tl-status" aria-live="polite">About <b>${spanText(total)}</b> start to finish.</p>` +
      `<ol class="tl" data-timeline>${rows.join('')}</ol>`;
    const [before, after] = [body.slice(0, body.indexOf(list)), body.slice(body.indexOf(list) + list.length)];
    return { body: emphasizeFigures(before) + timeline + emphasizeFigures(after) };
  }

  // Revealed by initTimeline, so it never shows as a dead control without JS
  function timelineControl() {
    return `<div class="tl-controls" role="group" aria-label="Plan the timing" hidden>` +
      `<button type="button" data-start>Start now</button><button type="button" data-plan>Plan</button></div>`;
  }

  function spanHTML(min) {
    const h = Math.floor(min / 60), m = Math.round(min % 60);
    const parts = [];
    if (h) parts.push(`${h}<span class="unit"> h</span>`);
    if (m || !h) parts.push(`${m}<span class="unit"> min</span>`);
    return parts.join(' ');
  }

  function spanText(min) {
    min = Math.round(min / 5) * 5;
    const h = Math.floor(min / 60), m = min % 60;
    return [h && `${h} h`, (m || !h) && `${m} min`].filter(Boolean).join(' ');
  }

  function restDurationHTML(rest) {
    const pre = rest.approx ? '~' : '';
    if (rest.plus) return `${pre}${spanHTML(rest.mid)} <span class="pm">± ${spanText(rest.plus)}</span>`;
    if (rest.ranged && rest.hi < 60) return `${pre}${rest.lo}–${rest.hi}<span class="unit"> min</span>`;
    if (rest.ranged) return `${pre}${spanHTML(rest.lo)}–${spanHTML(rest.hi)}`;
    return pre + spanHTML(rest.mid);
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
