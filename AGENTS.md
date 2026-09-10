# Project notes

## Image handling / Git LFS / Netlify Large Media (2026-09)

**Situation:** ~3,045 images under `static/img/` (plus audio/pdf/video) are tracked in
Git LFS (`.gitattributes`: `static/img/** filter=lfs`). Netlify's Large Media service —
which smudges LFS files at deploy time — was **deprecated Sept 1, 2023** and is at risk
of removal.

**Consequences:**

1. **Width/height transform can't work on Netlify.** At build time, Netlify checks out
   LFS *pointer files* (text, ~130 bytes), not real images. `image-size` then fails with
   `unsupported file type: undefined` (and `exists: true`). The transform works locally
   (Node 26, real smudged files) but never on Netlify. This is not a code bug — it's LFS.
   - `eleventy.config.js` currently contains `addTransform("img-dimensions", ...)` with
     debug `console.log`s. Decide later: remove it, or fix via a committed dimensions
     manifest (generated locally where files are real).
2. **Data-loss risk:** LFS files live in Netlify's Large Media store, not GitHub. If the
   site is deleted or Large Media shuts down, originals could be lost. Cloudinary has
   copies via fetch delivery, providing some redundancy.

**Long-term migration (when time allows):** un-LFS the images (`git lfs migrate` /
un-track + re-add so real files are committed to GitHub directly). This would fix the
build-time transform and eliminate the data-loss risk.

## Cloudinary plugin (branch `cloudinary-plugin`)

- `netlify-plugin-cloudinary@1.17.0` in `netlify.toml`, `deliveryType = "fetch"`,
  `imagesPath = "/static/img"`.
- Rewrites `<img>` srcs to `res.cloudinary.com` with `f_auto,q_auto` (AVIF/WebP/JPEG
  negotiated per browser; the `.jpeg` in the URL is the source name, not the served
  format).
- Also adds `loading="lazy"` to **every** image, including hero images that carry
  `fetchpriority="high"` — a conflict worth fixing later (strip `loading="lazy"` where
  `fetchpriority="high"` exists).
- jsdom (the plugin's HTML walker) chokes on inline `<style>` blocks with modern CSS
  syntax — one reason CSS was consolidated into a single external file.

## CSS consolidation (done)

- `head.njk` no longer inlines all CSS. All core stylesheets are concatenated at build
  time (in `eleventy.after`) into `_site/_includes/assets/css/site.css` and linked once.
- Deleted unused stylesheets: `bricks.css` (unused — `page-bricks.njk` layout has no
  users), `development.css`, `fake-browser.css`, `flickity.css`, `polaroid.css`, plus
  dead JS (`flickity.pkgd.min.js`, `jquery-cookie.js`, `jquery.magnific-popup.min.js`).

## Build notes

- `incremental` is now only true in serve/watch mode (`ELEVENTY_RUN_MODE` check); production
  builds are full rebuilds. `_site` was removed from Netlify's `[build.cache]` paths —
  caching generated output caused stale-HTML deploys.
- Local builds can fail on untracked stub posts with empty tags (e.g.
  `timeline/art-brat-cousin-vicky-apr-4-2005.md` before it was completed) — `slugify`
  errors on empty tag strings. Netlify builds are unaffected (untracked files aren't there).
- Run full local builds to `/tmp` (e.g. `npx eleventy --output=/tmp/...`) — never to a
  directory inside the project root, or the watch process treats the output as inputs.
