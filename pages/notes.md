---
layout: layouts/notes-index.njk
title: Notes/Now
date: 2020-07-01
excerpt: "Notes about what's on my mind at this particular moment."
summary: "Notes about what's on my mind at this particular moment."
image: /static/img/notes/gtaIV.jpg
permalink: "/notes/{% if pagination.pageNumber > 0 %}{{ pagination.pageNumber + 1 }}/{% endif %}index.html"
pagination:
  data: collections.note
  size: 8
  alias: notes
  reverse: true
eleventyNavigation:
  key: Notes/Now
  order: 13
---

## Notes:
