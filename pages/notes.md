---
layout: layouts/notes-index.njk
title: Notes/Now
date: 2020-07-01
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
