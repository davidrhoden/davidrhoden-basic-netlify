---
  title:  I just need the exact date something changed. Is that so much to ask from a computer?
  date: 2024-03-01T00:00:00
  excerpt: The computer could easily tell me the exact date, but the people programming the app want it to seem friendly.
  summary: The computer could easily tell me the exact date, but the people programming the app want it to seem friendly.
  image: /timeline/cloudcannon-date-formatting.png
  tags:
    - noates
    - date formatting
    - relative dates
    - gripes
    - CloudCannon
    - Sublime Merge

---

![alt text](/static/img/timeline/cloudcannon-date-formatting.png)

This is a picture of how CloudCannon (an overall terrific service) formats dates on their dashboard (where you look to see what has mappened on the site lately),

Imagine me asking V, the developer who made this change, "hey, when did you update that testimonails file?"

V answers back: "I dunno, three weeks ago maybe? Is it important?"

An I say "yeah, I need to know the exact date, I'm trying to figure out when such-and-such a bug got introduced....never mind, I'll just look up the exact date on the dashboard."

BUUUUUT NO! The dashboard _COULD_ tell me the exact date; it would be the easiest thing for a computer, easier even than caculating the _approximate_ number of weeks since this event. But the people programming the app want it to seem friendly, so it gives me an un-useful, casual answer, just like the useless one V gave me. An inaccurate one.

And I gotta ask: What if the change happened eight days ago? Is that "a week ago" or "two weeks ago"? Same question goes for "nine days ago". Where do you round off? Where does it end?

What if Joe Codeman, the lead developer, asks me when this change was made and I say "two weeks ago?" -- because when I looked at it yesterday it said "two weeks ago", but now it's tomorrow and it says "three weeks ago"--_I'm off by a week!_ Not a day! I *don't know* exactly how wrong I am!

My git client, Sublime Merge, does this "relative date" thing too. I wouldn't mind it if they gave me the exact date along with the fun, friendly date.
But I just need the date. The actual date. Is that so much to ask from a computer?

If anybody knows a setting I can change to see real dates instead of relative dates, please holler at me.