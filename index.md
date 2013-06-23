---
layout: default
---

<ul class="listing">
{% for post in site.posts %}
  {% capture y %}{{post.date | date:"%Y"}}{% endcapture %}
  {% if year != y %}
    {% assign year = y %}
    <li class="listing-seperator">{{ y }}</li>
  {% endif %}
  <li class="listing-item">
    <a href="{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a>
    <time datetime="{{ post.date | date:"%Y-%m-%d" }}">{{ post.date | date:"%Y-%m-%d" }}</time>
  </li>
{% endfor %}
</ul>

<div id="pagination">
<div class="pagenavi">
{% if paginator.previous_page %}
{% if paginator.previous_page == 1 %}
<a href="/" class="current">前一页</a>
{% else %}
<a href="/page{{paginator.previous_page}}">前一页</a>
{% endif %}
{% else %}
<span><<前一页</span>
{% endif %}
{% for count in (2..paginator.total_pages) limit:8 %}
{% if count == paginator.page %}
<span class="current-page">{{count}}</span>
{% else %}
<a href="/page{{count}}">{{count}}</a>
{% endif %}
{% endfor %}
{% if paginator.next_page %}
<a href="/page{{paginator.next_page}}">后一页>></a>
{% else %}
<span>后一页>></span>
{% endif %}
</div>
</div>
