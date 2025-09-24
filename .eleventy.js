const { DateTime } = require("luxon");
// const UglifyJS = require("uglify-js");
const slugify = require("slugify");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginSEO = require("eleventy-plugin-seo");
const htmlmin = require("html-minifier");
const CleanCSS = require("clean-css");
const { minify } = require("terser");
const path = require("path");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const { execSync } = require('child_process');

const is_production = typeof process.env.NODE_ENV === "string" && process.env.NODE_ENV === "production";

function do_minifycss(source, output_path) {
    if(!output_path.endsWith(".css") || !is_production) return source;

const result = new CleanCSS({
        level: 2
    }).minify(source).styles.trim();
    console.log(`MINIFY ${output_path}`, source.length, `→`, result.length, `(${((1 - (result.length / source.length)) * 100).toFixed(2)}% reduction)`);
    return result;
}

module.exports = function (eleventyConfig) {

  eleventyConfig.on('eleventy.after', () => {
      execSync(`npx pagefind --site _site --glob \"**/*.html\"`, { encoding: 'utf-8' })
    })

  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addPlugin(pluginSEO, require("./_data/seo.json"));

  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addLiquidFilter("dateToRfc3339", pluginRss.dateToRfc3339);
  // New in RSS 1.2.0
  eleventyConfig.addLiquidFilter("dateToRfc822", pluginRss.dateToRfc822);

  // https://www.11ty.dev/docs/data-deep-merge/
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  eleventyConfig.addTransform("htmlmin", (content, outputPath) => {
    if (outputPath.endsWith(".html")) {
      return htmlmin.minify(content, {
        collapseWhitespace: true,
        removeComments: true,
        useShortDoctype: true,
      });
    }
    return content;
  });

  eleventyConfig.addNunjucksAsyncFilter("jsmin", async function (
    code,
    callback
  ) {
    try {
      const minified = await minify(code);
      callback(null, minified.code);
    } catch (err) {
      console.error("Terser error: ", err);
      // Fail gracefully.
      callback(null, code);
    }
  });


  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat("LLLL d, yyyy");
  });

  // eleventyConfig.addFilter("readableDate", (dateObj) => {
  //   return DateTime.fromJSDate(dateObj).toFormat("cccc, MMMM dd, yyyy");
  // });

  eleventyConfig.addFilter("machineDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat("yyyy-MM-dd");
  });

  eleventyConfig.addFilter("justYear", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat("yyyy");
  });

  eleventyConfig.addFilter(
    "relative",
    (page, root = "/") =>
      '${require("path").relative(page.filePathStem, root)}/',
  );

  eleventyConfig.addCollection("bySize", (collectionApi) => {
    const allPosts = collectionApi.getAll();

    const countPostsByTag = new Map();
    allPosts.forEach((post) => {
      // short circuit eval sets tags to an empty array if there are no tags set
      const tags = post.data.tags || [];
      tags.forEach((tag) => {
        const count = countPostsByTag.get(tag) || 0;
        countPostsByTag.set(tag, count + 1);
      });
    });

    const sortedArray = [...countPostsByTag].sort((a, b) => b[1] - a[1]);
    return sortedArray;
  });

  eleventyConfig.addCollection("posts", function (collection) {
    const coll = collection.getFilteredByTag("post");

    for (let i = 0; i < coll.length; i++) {
      const prevPost = coll[i - 1];
      const nextPost = coll[i + 1];

      coll[i].data["prevPost"] = prevPost;
      coll[i].data["nextPost"] = nextPost;
    }

    return coll;
  });

  eleventyConfig.addCollection("notes", function (collection) {
    const allNotes = collection.getFilteredByTag("note");

    for (let i = 0; i < allNotes.length; i++) {
      const prevNote = allNotes[i - 1];
      const nextNote = allNotes[i + 1];

      allNotes[i].data["prevNote"] = prevNote;
      allNotes[i].data["nextNote"] = nextNote;
    }

    return allNotes;
  });

  function filterTagList(tags) {
    return (tags || []).filter(
      (tag) => ["all", "nav", "post", "posts"].indexOf(tag) === -1,
    );
  }

  eleventyConfig.addFilter("filterTagList", filterTagList);

  // Create an array of all tags
  eleventyConfig.addCollection("tagList", function (collection) {
    let tagSet = new Set();
    collection.getAll().forEach((item) => {
      (item.data.tags || []).forEach((tag) => tagSet.add(tag));
    });

    return filterTagList([...tagSet]);
  });

  // Universal slug filter strips unsafe chars from URLs
  eleventyConfig.addFilter("slugify", function (str) {
    // console.log(str); use this to find empty tags if the slugify string expected error happens again
    return slugify(str, {
      lower: true,
      replacement: "-",
      remove: /[*+~.·,()'"`´%!?¿:@]/g,
    });
  });

  // Don't process folders with static assets e.g. images
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("static/img");
  eleventyConfig.addPassthroughCopy("static/pdf");
  eleventyConfig.addPassthroughCopy("static/audio");
  eleventyConfig.addPassthroughCopy("static/video");
  eleventyConfig.addPassthroughCopy("static/banners");
  eleventyConfig.addPassthroughCopy("static/webfonts/ShadowGrotesque");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("_includes/assets/");
  eleventyConfig.addPassthroughCopy("api/");
  eleventyConfig.addPassthroughCopy("sitemap.njk");

  /* Markdown Plugins */
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let options = {
    html: true,
    breaks: true,
    linkify: true,
  };
  let opts = {
    permalink: false,
  };

  eleventyConfig.setLibrary(
    "md",
    markdownIt(options).use(markdownItAnchor, opts),
  );

  return {
    templateFormats: ["md", "njk", "html", "liquid"],
    pathPrefix: "/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
};
