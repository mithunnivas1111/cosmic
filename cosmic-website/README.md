# Cosmic — website

Marketing site for Cosmic, a D2C and e-commerce growth agency.
Plain HTML, CSS and vanilla JavaScript. No framework, no build step, no runtime dependencies.

```
cosmic-website/
├── index.html              Page markup (semantic HTML5, all content)
├── css/styles.css          Design tokens + components + responsive rules
├── js/script.js            Interaction modules (nav, reveals, services, orbit, timeline, FAQ, form)
├── assets/
│   ├── logo/               SVG mark + wordmark, dark and light versions
│   ├── icons/favicon.svg
│   ├── images/og-cosmic.png  Social share image (1200×630)
│   └── fonts/              Put the licensed Degular files here (see below)
└── README.md
```

## Run it

Open `index.html` in a browser, or serve the folder so relative paths behave exactly as in production:

```bash
cd cosmic-website
python3 -m http.server 8080     # then visit http://localhost:8080
```

Deploy by uploading the folder as-is to any static host (Netlify, Vercel, Cloudflare Pages, S3, cPanel).

## Fonts — action needed

The brand face is **Degular**, a commercial typeface (OH no Type Co.). The font files were not supplied and are not bundled.

* `styles.css` already declares `@font-face` for Degular 400/500/600/700. Right now it only uses `local()`, so a computer with Degular installed shows it, and nothing 404s for everyone else.
* Until the files are added, the site renders in **Figtree** (loaded from Google Fonts) as a stand-in. It is not Degular and should not be presented as such.

To switch on Degular for every visitor:

1. Export web fonts from your licence as `Degular-Regular.woff2`, `Degular-Medium.woff2`, `Degular-Semibold.woff2`, `Degular-Bold.woff2` and put them in `assets/fonts/`.
2. In `css/styles.css` (section 1), replace each `src: local(...)` line with the commented line beneath it.
3. Optionally delete the three Figtree `<link>` tags in `index.html`.

Re-render `assets/images/og-cosmic.png` once Degular is in place; it was set in a stand-in face.

## Form behaviour

Unchanged from the original site, as requested: a valid submission opens the visitor's email app with a pre-filled message to `mithunnivas1111@gmail.com`. The page itself stores and sends nothing, and the confirmation text says so. Inline validation now covers the five required fields (name, email, phone/WhatsApp, brand, store link).

To receive submissions without relying on the visitor's mail app, connect a form endpoint (Formspree, Basin, Netlify Forms, or your own API) in `initForm()` in `js/script.js`.

## Design system (short version)

| Token | Value | Use |
|---|---|---|
| `--navy-950` | `#030411` | Page background |
| `--blue-500` | `#1B5BFF` | Primary action, active states, the numbers band |
| `--peri-400` | `#7B8CFF` | Labels, rules, secondary accents |
| `--white` | `#FFFFFF` | Text, the light audit section |

* **Frame.** Content sits between two hairline rails that run the full page, crossed at each section by a rule with a small plus mark. This is the structural idea taken from the OMA Operator reference.
* **Type.** Display at 600 weight with tight negative tracking (−0.045em hero, −0.035em section titles), body near 0. Mono uppercase labels (`01 / Why Cosmic`) give the editorial index.
* **Rhythm.** Dark sections, a raised dark tone, one full-bleed electric-blue band (metrics) and one light section (the free audit, the main conversion point).
* **Brand visual.** The planet horizon from the brand guide is drawn in CSS (hero, and again behind the contact form). No raster imagery, no stock photos.
* **Motion.** Restrained entrance and scroll reveals (transform and opacity only), scroll-linked services index, orbit diagram and timeline rail, animated FAQ. Everything respects `prefers-reduced-motion`, `prefers-reduced-transparency` and `prefers-contrast`.

## Logo

`cosmic-mark.svg` is a vector redraw of the planet-C, blade and star from the brand guide image. `cosmic-wordmark.svg` pairs it with "osmic" set from Poppins Bold outlines (OFL), the closest geometric match available. If the original vector logo exists, drop it in with the same filenames and it will be used everywhere.

## Missing assets and integrations

* Degular web font files (licensed).
* The original vector logo files. The current SVGs are faithful redraws, not the master artwork.
* Cosmic's Instagram handle and URL. The copy says "DM the word AUDIT on Instagram", but the source had no link, so none is shown.
* A canonical domain. Add `<link rel="canonical">` and an absolute `og:url`/`og:image` URL once the domain is known (social crawlers need absolute URLs).
* A form backend, if email-app submission isn't enough.
* Privacy policy page. Not in the source; add one if you collect form data through a backend.
