const fs = require("fs");
const path = require("path");

/**
 * Runs after the Cloudinary plugin's onPostBuild, which stamps
 * loading="lazy" on EVERY <img> — including hero images that already
 * carry fetchpriority="high". Per web.dev guidance, above-the-fold /
 * priority images should NOT be lazy-loaded (delays LCP). This plugin
 * removes loading="lazy" from any img that has fetchpriority="high".
 */
module.exports = {
  async onPostBuild({ constants }) {
    const publishDir = constants.PUBLISH_DIR;
    if (!publishDir || !fs.existsSync(publishDir)) {
      console.log("[strip-lazy-from-hero] no publish dir, skipping");
      return;
    }

    let htmlFiles = [];
    (function walk(dir) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name.endsWith(".html")) htmlFiles.push(full);
      }
    })(publishDir);

    let fixed = 0;
    for (const file of htmlFiles) {
      const html = fs.readFileSync(file, "utf8");
      const updated = html.replace(/<img\b([^>]*)>/g, (match, attrs) => {
        if (
          /\bfetchpriority\s*=\s*"high"/i.test(attrs) &&
          /\bloading\s*=\s*"lazy"/i.test(attrs)
        ) {
          fixed++;
          return match.replace(/\s+loading\s*=\s*"lazy"/i, "");
        }
        return match;
      });
      if (updated !== html) {
        fs.writeFileSync(file, updated);
      }
    }

    console.log(
      `[strip-lazy-from-hero] removed loading="lazy" from ${fixed} hero image(s) across ${htmlFiles.length} HTML files`
    );
  },
};
