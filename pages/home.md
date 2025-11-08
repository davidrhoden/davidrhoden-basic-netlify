---
layout: layouts/home-index.njk
title: Notes/Now
date: 2025-10-25
excerpt: "Notes about what's on my mind at this particular moment."
summary: "Notes about what's on my mind at this particular moment."
image: /static/img/notes/gtaIV.jpg
permalink: "/{% if pagination.pageNumber > 0 %}{{ pagination.pageNumber + 1 }}/{% endif %}index.html"
pagination:
  data: collections.posts
  size: 3
  alias:
  reverse: true
---

## Notes:
