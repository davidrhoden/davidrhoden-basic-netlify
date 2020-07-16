---
layout: layouts/page.njk
title: Timeline of all posts
date: 2019-07-15
permalink: "/timeline-unpaginated/index.html"

---

<article class="flex flex-wrap">
{% for year, posts in posts | groupby("post.data.date.year") %}
  justYear: {{ date | justYear }},
  date.year: {{ date.year }},
  year: {{ year }}:
  {% for post in posts %}
    <div class="left">
      {{ post.data.date.year }}
      <a href="{{ post.url | url }}">
        {% if post.data.image %}
        <img class="tiny-thumbnail" src="{{ post.data.image }}?nf_resize=smartcrop&h=32&w=32">
        {% endif %}
      </a>
    </div>
  {% endfor %}
{% endfor %}
</article>