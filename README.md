# BK-MBD — Project Page

Anonymous project page for **Koopman-Accelerated Model-Based Diffusion for Real-Time Robot Control** (BK-MBD), submitted to IEEE ICRA 2026.

Built on the [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template). Static site — no build step, just open `index.html` or serve the folder.

```
python -m http.server 8000    # then open http://localhost:8000
```

## Before publishing

1. **Replace `ANON_URL_PLACEHOLDER`** (7 occurrences in `index.html`) with the real page URL once the anonymous repo or GitHub Pages site exists. It appears in the Open Graph, Twitter, `citation_pdf_url` and JSON-LD blocks.
2. **Enable the arXiv / Code buttons** in the hero section — they are currently rendered disabled with a "Coming Soon" label.
3. **Replace `static/images/favicon.ico`** — it is still the one shipped with the template.
4. Optionally add a 1200×630 `static/images/social_preview.png` for link previews.

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

## Deploying to GitHub Pages

`.nojekyll` is already present, so `static/` is served as-is. Push the folder contents to the repository root (or to `docs/`) and enable Pages on that branch.

## License

Website content is licensed under [CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/).
