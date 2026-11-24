# Leecycle landing page

Static site: no build step, no dependencies.

## Run it locally
Open a terminal in this folder and run:

    python3 -m http.server 8080

Then visit http://localhost:8080. Do not just double-click index.html: browsers block
the video loader on file:// pages, so the scroll scrubbing can stutter or fail.

## Put it online
Upload the whole folder (index.html, css/, js/, assets/) to any static host (Netlify,
Vercel, Cloudflare Pages, GitHub Pages, or your own server). Keep the folder structure.
Serve the .mp4 with normal range-request support (all of the hosts above do this).

## Where things are
- index.html: all the content and text (header, scroll story, sections, footer)
- css/style.css: colours (top of the file, :root), layout, type
- js/main.js: video scrubbing, text animation, snake lines
- assets/leecycle-scroll.mp4: the scroll video (1080p, every frame is a keyframe)

## Common changes
- Scroll length: in css/style.css change #story{height:1900vh}. Bigger = slower.
- Swap the video: replace assets/leecycle-scroll.mp4. Encode it so every frame is a keyframe:
  ffmpeg -i in.mp4 -an -c:v libx264 -crf 22 -x264-params keyint=1:min-keyint=1 -pix_fmt yuv420p -movflags +faststart out.mp4
  The frame count is read from the video automatically (24 fps assumed, see FPS in js/main.js).
- Text beats: the six blocks with class "beat" in index.html. data-s and data-e are the
  start and end of each block (0 to 1 through the scroll).
- Brand colours: --g, --g2, --mint, --ink in css/style.css.
- Sample content to replace: all copy, the stats (30%, 2x, 0), hello@leecycle.example,
  and the footer links.

## Notes
- The Inter font loads from Google Fonts. To self-host it, download Inter and add an
  @font-face rule in css/style.css, then remove the <link> in index.html.
- The video is about 18.7 MB. Consider a CDN if you expect a lot of traffic.
