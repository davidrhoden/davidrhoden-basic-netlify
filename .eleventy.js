const { DateTime } = require("luxon");
// const CleanCSS = require("clean-css");
// const UglifyJS = require("uglify-es");
const htmlmin = require("html-minifier");
const slugify = require("slugify");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginSEO = require("eleventy-plugin-seo");

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

  // Merge data instead of overriding
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

  // eleventyConfig.addFilter("cssmin", function(code) {
  //   return new CleanCSS({}).minify(code).styles;
  // });

  // eleventyConfig.addFilter("jsmin", function(code) {
  //   let minified = UglifyJS.minify(code);
  //   if (minified.error) {
  //     console.log("UglifyJS error: ", minified.error);
  //     return code;
  //   }
  //   return minified.code;
  // });

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

  

  // Minify HTML output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if (outputPath.indexOf(".html") > -1) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  // Universal slug filter strips unsafe chars from URLs
  eleventyConfig.addFilter("slugify", function(str) {
    return slugify(str, {
      lower: true,
      replacement: "-",
      remove: /[*+~.·,()'"`´%!?¿:@]/g
    });
  });

  // Don't process folders with static assets e.g. images
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("static/img");
  eleventyConfig.addPassthroughCopy("static/pdf");
  eleventyConfig.addPassthroughCopy("static/audio");
  eleventyConfig.addPassthroughCopy("static/webfonts/ShadowGrotesque");
  eleventyConfig.addPassthroughCopy("static/webfonts/NoticiaText-Regular");
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
    markdownTemplateEngine: "liquid",
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
