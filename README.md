# BK-MBD — Project Page

Anonymous project page for **Koopman-Accelerated Model-Based Diffusion for Real-Time Robot Control** (BK-MBD), submitted to IEEE ICRA 2026.

Built on the [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template). Static site — no build step, just open `index.html` or serve the folder.

```
python -m http.server 8000    # then open http://localhost:8000
```

Live at **https://rcilab.khu.ac.kr/bkmbd/** — GitHub Pages from the `master` branch, repository root.

## TODO

1. **Enable the arXiv button** in the hero once the preprint is posted — it is currently rendered disabled with a "Coming Soon" label. The Code button has been removed; add it back if the implementation is released.
2. Optionally add a 1200×630 `static/images/social_preview.png` for link previews.

## Favicon

There is deliberately none. `index.html` declares `<link rel="icon" href="data:,">`, an empty data URI, so the browser makes no favicon request and the tab shows its own default placeholder.

Do not simply delete that tag to get the same effect: with no `rel="icon"` the browser falls back to `/favicon.ico` at the site root, which belongs to the organization site, not this project page. To adopt a real icon later, drop the file in `static/images/` and point the tag at it.

The page carries no author or institution information, for double-anonymous review.

## Video slots

There are no videos yet. Four slots are written into `index.html` as commented-out markup; drop the file in and uncomment the matching block.

| File | Section | Layout |
| --- | --- | --- |
| `static/videos/overview.mp4` | Overview | full width, under the teaser figure |
| `static/videos/drone_passage.mp4` | Non-Convex Passage | full width, under the two 3D plots |
| `static/videos/hw_bkmbd.mp4` | Validation on the Physical Robot | left half |
| `static/videos/hw_dkmbd.mp4` | Validation on the Physical Robot | right half |

Search `index.html` for `VIDEO SLOT` to find them. Videos autoplay on scroll (muted, looping) via the `IntersectionObserver` in `static/js/index.js`; keep clips under ~10 MB or host them on YouTube instead.

## Figures

The images are rendered from the paper's vector figures in `../_2026__ICRA___MBD__Koopman_/figs/` with `pdftoppm` + ImageMagick (trimmed of whitespace, then padded with a small white border). To regenerate after the paper's figures change:

```bash
cd ../_2026__ICRA___MBD__Koopman_/figs
OUT=../../bk-mbd-page/static/images
mk() { pdftoppm -png -r "$2" -singlefile "$1.pdf" "/tmp/$1"; \
       magick "/tmp/$1.png" -fuzz 1% -trim +repage -bordercolor white -border 12 -strip "$OUT/$1.png"; }
mk figure1 200      # overview / teaser
mk figure2 535      # executed tool paths
mk figure3_a 440    # non-convex passage, BK-MBD
mk figure3_b 440    # non-convex passage, convexified QP-MPC
mk figure5 310      # signed TCP tracking error
# figure3_a/b are then padded to a common canvas so the two panels display at the same scale
# figure4_a..d are photo strips, rendered at 550 dpi and saved as JPEG:
for b in figure4_a figure4_b figure4_c figure4_d; do
  pdftoppm -png -r 550 -singlefile "$b.pdf" "/tmp/$b"
  magick "/tmp/$b.png" -strip -quality 90 "$OUT/$b.jpg"
done
```

`static/pdfs/bkmbd_paper.pdf` is a copy of the compiled `main.pdf`; refresh it whenever the paper is rebuilt.

## Deployment

Pushing to `master` on [RCILab/bkmbd](https://github.com/RCILab/bkmbd) redeploys the site. `.nojekyll` is present, so `static/` is served as-is.

The RCILab organization site carries the custom domain `rcilab.khu.ac.kr`, and project pages inherit it automatically — which is why this page lives at `rcilab.khu.ac.kr/bkmbd/` rather than `rcilab.github.io/bkmbd/` (the latter 301-redirects there). **Do not add a `CNAME` file to this repo**; it would override the inherited domain.

## License

Website content is licensed under [CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/).
