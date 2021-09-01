---
layout: layouts/archive-by-year.njk
title: Timeline By Year
date: 2020-01-01
permalink: "/timeline-by-year/{% if pagination.pageNumber > 0 %}{{ pagination.pageNumber + 1 }}/{% endif %}index.html"
pagination:
  data: collections.post
  size: 8
  alias: posts
  reverse: true
eleventyNavigation:
  key: Timeline
  order: 0

---
