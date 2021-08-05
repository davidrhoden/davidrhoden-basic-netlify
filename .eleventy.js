const { DateTime } = require("luxon");
// const CleanCSS = require("clean-css");
// const UglifyJS = require("uglify-es");
const htmlmin = require("html-minifier");
const slugify = require("slugify");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginSEO = require("eleventy-plugin-seo");
const path = require("path");
const Image = require("@11ty/eleventy-img");

module.exports = function(eleventyConfig) {

  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addPlugin(pluginSEO, {
    title: "David Rhoden",
    description: "The website of New Orleans-based artist David Rhoden.",
    url: "https://davidrhoden.com",
    author: "David Rhoden",
    twitter: "davidrhoden",
    image: "/static/img/paintings/bigface-wide.jpg",
    options: {
      imageWithBaseUrl: true
    }
  });

  // https://www.11ty.dev/docs/data-deep-merge/
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("LLLL d yyyy");
  });

  eleventyConfig.addFilter("machineDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("yyyy-MM-dd");
  });

  eleventyConfig.addFilter("justYear", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("yyyy");
  });

  eleventyConfig.addFilter(
    "relative",
    (page, root = "/") => '${require("path").relative(page.filePathStem, root)}/'
  );

  eleventyConfig.addCollection("posts", function(collection) {
    const coll = collection.getFilteredByTag("post");

      for(let i = 0; i < coll.length ; i++) {
      const prevPost = coll[i-1];
      const nextPost = coll[i + 1];

      coll[i].data["prevPost"] = prevPost;
      coll[i].data["nextPost"] = nextPost;
    }

    return coll;
  });

  eleventyConfig.addCollection("notes", function(collection) {
    const allNotes = collection.getFilteredByTag("note");

    for(let i = 0; i < allNotes.length ; i++) {
      const prevNote = allNotes[i-1];
      const nextNote = allNotes[i + 1];

      allNotes[i].data["prevNote"] = prevNote;
      allNotes[i].data["nextNote"] = nextNote;
    }

    return allNotes;
  });

    eleventyConfig.addCollection("signs", function(collection) {
    const coll = collection.getFilteredByTag("signs");

      for(let i = 0; i < coll.length ; i++) {
      const prevPost = coll[i-1];
      const nextPost = coll[i + 1];

      coll[i].data["prevPost"] = prevPost;
      coll[i].data["nextPost"] = nextPost;
    }

    return coll;
  });

  // Universal slug filter strips unsafe chars from URLs
  eleventyConfig.addFilter("slugify", function(str) {
    return slugify(str, {
      lower: true,
      replacement: "-",
      remove: /[*+~.·,()'"`´%!?¿:@]/g
    });
  });

eleventyConfig.addNunjucksShortcode("myImage", imageShortcode);

function imageShortcode(src, cls, alt, sizes, widths) {
  let options = {
    widths: widths,
    formats: ['jpeg'],
    urlPath: '/static/img/timeline/',
    outputDir: './_site/static/img/timeline/',
    filenameFormat: function (id, src, width, format, options) {
      const extension = path.extname(src);
      const name = path.basename(src, extension);
      return `${name}-${width}w.${format}`;
    }
  };

  // generate images, while this is async we don’t wait
  Image(src, options);

  let imageAttributes = {
    class: cls,
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };
  // get metadata even the images are not fully generated
  metadata = Image.statsSync(src, options);
  return Image.generateHTML(metadata, imageAttributes);
}

  // Don't process folders with static assets e.g. images
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("static/img");
  eleventyConfig.addPassthroughCopy("static/pdf");
  eleventyConfig.addPassthroughCopy("static/audio");
  eleventyConfig.addPassthroughCopy("static/banners");
  eleventyConfig.addPassthroughCopy("static/webfonts/ShadowGrotesque");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("_includes/assets/");

  /* Markdown Plugins */
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let options = {
    html: true,
    breaks: true,
    linkify: true
  };
  let opts = {
    permalink: false
  };

  eleventyConfig.setLibrary("md", markdownIt(options)
    .use(markdownItAnchor, opts)
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
      output: "_site"
    }
  };
};