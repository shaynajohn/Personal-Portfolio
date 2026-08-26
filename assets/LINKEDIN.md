# LinkedIn Assets

## Banner (profile cover)

| File | Size | Use |
|------|------|-----|
| `linkedin-banner.png` | 1584×396 | Upload as LinkedIn **background photo** — exact portfolio pink aura + dot grid |
| `linkedin-banner.html` | — | Same background as the site (`#fffbfc`, 3 aura blobs, dot grid from `styles.css`) |

### Upload banner
1. LinkedIn profile → **Edit** (pencil icon on banner)
2. **Upload photo** → choose `assets/linkedin-banner.png`
3. Adjust crop if needed → **Apply**

Left side is the same background as the site — no extra overlays or text.

To re-export: open `linkedin-banner.html` in Chrome and screenshot at 1584×396, or run headless Chrome on that file.

---

## Featured section thumbnail

Use these assets when adding your portfolio to LinkedIn **Featured**.

## Files

| File | Use |
|------|-----|
| `linkedin-featured.png` | Upload as custom thumbnail (1200×630) |
| `linkedin-featured.html` | Open in browser to screenshot a pixel-perfect version with your exact fonts |

## Steps on LinkedIn

1. Go to your profile → **Add profile section** → **Recommended** → **Add featured**
2. Choose **Links**
3. Paste your portfolio URL: `https://shaynajohn.github.io/Personal-Portfolio/`
4. **Title:** `Portfolio` or `Shayna John — ML Portfolio`
5. **Description:** `Applied ML Engineer · RAG & data systems. Interactive semantic search.`
6. Click **Add thumbnail** → upload `assets/linkedin-featured.png`
7. Save

## Optional: regenerate thumbnail

Open `assets/linkedin-featured.html` in Chrome, zoom so the card fills the view, screenshot at 1200×630 (or use DevTools → capture node screenshot on `#thumbnail`).

## Link preview

`index.html` includes Open Graph tags pointing to `assets/linkedin-featured.png` so LinkedIn may auto-pull this image when you paste the URL.

**Note:** For OG images on GitHub Pages, use the full absolute URL in meta tags once deployed, e.g.  
`https://shaynajohn.github.io/Personal-Portfolio/assets/linkedin-featured.png`
