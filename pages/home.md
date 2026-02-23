---
layout: layouts/home.njk
title: Home
date: 2023-05-11T00:00:00.000Z
permalink: /
excerpt: Paintings, illustrations, animations, fun. Based in New Orleans, Louisiana.
summary: Paintings, illustrations, animations, fun. Based in New Orleans, Louisiana.
image: /static/img/homepage-featured/bottlecap.jpg
---
{% set latestItem = collections.postsAndNotes | last %}

<section class="home-latest">
  {% if latestItem %}
    {% set isPost = latestItem.data.tags and ('post' in latestItem.data.tags) %}
    {% set isNote = latestItem.data.tags and ('note' in latestItem.data.tags) %}

    <h1>
      {% if isPost %}Latest post{% elseif isNote %}Latest note{% else %}Latest update{% endif %}
    </h1>

    <article>
      <h2>
        <a href="{{ latestItem.url }}">{{ latestItem.data.title }}</a>
      </h2>

      {% if latestItem.date %}
        <p>
          <time datetime="{{ latestItem.date | machineDate }}">
            {{ latestItem.date | readableDate }}
          </time>
        </p>
      {% endif %}

      {% if latestItem.templateContent %}
        <div class="home-latest-body">
          {{ latestItem.templateContent | safe }}
        </div>
      {% endif %}
    </article>
  {% else %}
    <p>No posts or notes yet.</p>
  {% endif %}
</section>
