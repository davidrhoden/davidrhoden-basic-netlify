const { DateTime } = require("luxon");
const slugify = require("slugify");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginSEO = require("eleventy-plugin-seo");
const path = require("path");
const { execSync } = require('child_process');
const pluginRss = require("@11ty/eleventy-plugin-rss");

const is_production = typeof process.env.NODE_ENV === "string" && process.env.NODE_ENV === "production";

module.exports = function (eleventyConfig) {

  eleventyConfig.on('eleventy.after', () => {
      execSync(`npx pagefind --site _site --glob \"**/*.html\"`, { encoding: 'utf-8' })
    })

  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addPlugin(pluginSEO, require("./_data/seo.json"));

  eleventyConfig.addPlugin(pluginRss, {
    type: "rss", // or "atom", "json"
    outputPath: "/feed.xml",
    collection: {
      name: "posts",
      limit: 9,
    },
    metadata: {
      language: "en",
      title: "David Rhoden: Painter and Drawer. New Orleans, Louisiana.",
      subtitle: "New paintings, new drawings, occasional opinions.",
      base: "https://davidrhoden.com/",
      author: {
        name: "David Rhoden",
        email: "david@davidrhoden.com", // Optional
      }
    }
  });

  // https://www.11ty.dev/docs/data-deep-merge/
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat("LLLL d, yyyy");
  });

  eleventyConfig.addFilter("machineDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat("yyyy-MM-dd");
  });

  eleventyConfig.addFilter("justYear", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat("yyyy");
  });

  eleventyConfig.addFilter("shortDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat("LLLL d");
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

  eleventyConfig.addCollection("postsAndNotes", function (collectionApi) {
      const posts = collectionApi.getFilteredByTag("post");
      const notes = collectionApi.getFilteredByTag("note");

      // Combine and sort by date (oldest → newest)
      const combined = posts.concat(notes).sort((a, b) => a.date - b.date);

      return combined;
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

  // Filter to get all images from a directory
  eleventyConfig.addFilter("getImagesFromDir", function(dirPath) {
    const fs = require('fs');
    const path = require('path');
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    
    try {
      // Convert web path to filesystem path
      const fsPath = dirPath.startsWith('/static') 
        ? path.join(__dirname, dirPath.replace(/^\//, ''))
        : path.join(__dirname, 'static', dirPath);
      
      if (!fs.existsSync(fsPath)) {
        console.log(`Directory not found: ${fsPath}`);
        return [];
      }
      
      const files = fs.readdirSync(fsPath);
      
      return files
        .filter(file => {
          const ext = path.extname(file).toLowerCase();
          return imageExtensions.includes(ext);
        })
        .map(file => {
          const stats = fs.statSync(path.join(fsPath, file));
          // Convert back to web path
          const webPath = dirPath.startsWith('/') ? dirPath : '/static/' + dirPath;
          return {
            filename: file,
            path: webPath + (webPath.endsWith('/') ? '' : '/') + file,
            name: path.basename(file, path.extname(file)),
            ext: path.extname(file),
            created: stats.birthtime,
            modified: stats.mtime
          };
        })
        .sort((a, b) => b.created - a.created); // Sort by creation date, newest first
    } catch (err) {
      console.error(`Error reading directory ${dirPath}:`, err);
      return [];
    }
  });

  // Don't process folders with static assets e.g. images
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("static/img");
  eleventyConfig.addPassthroughCopy("static/pdf");
  eleventyConfig.addPassthroughCopy("static/audio");
  eleventyConfig.addPassthroughCopy("static/video");
  eleventyConfig.addPassthroughCopy("static/banners");
  eleventyConfig.addPassthroughCopy("static/webfonts");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("_includes/assets/");
  eleventyConfig.addPassthroughCopy("singapore.html");

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
    incremental: true,
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
