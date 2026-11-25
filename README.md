# Cosmic

Marketing website for **Cosmic**, a D2C and e-commerce growth agency. Built with semantic HTML5, CSS, and vanilla JavaScript — no framework, no build step, and no runtime dependencies.

## Project Structure

```text
cosmic/
├── index.html                        # Page markup and all sections
├── css/
│   └── styles.css                    # Design tokens, layout frame, components, responsive & preference rules
├── js/
│   └── script.js                     # Interactive modules (nav, reveals, services, orbit, timeline, FAQ, form)
├── assets/
│   ├── fonts/                        # Licensed Degular .woff2 files go here (currently empty)
│   ├── icons/
│   │   └── favicon.svg
│   ├── images/
│   │   ├── hero-horizon.jpg          # Hero background artwork
│   │   └── og-cosmic.png             # Open Graph share image (1200×630)
│   └── logo/
│       ├── cosmic-mark.svg
│       ├── cosmic-mark-light.svg
│       ├── cosmic-wordmark.svg
│       └── cosmic-wordmark-light.svg
├── package.json
└── README.md
```

## Local Development & Deployment

Open `index.html` directly, or serve the folder locally so relative paths match production:

```bash
npm run dev       # starts npx serve . -l 5173
```

Other options:

```bash
npm start                     # npx serve .
python3 -m http.server 8080   # http://localhost:8080
```

Deploy by uploading the repository root as-is to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3, etc.).

## Audit Form (`#audit-form`)

The contact/audit request form in [`index.html`](index.html) is handled in JavaScript by `initForm()` in [`js/script.js`](js/script.js), which submits the form fields as JSON via `fetch` to FormSubmit's AJAX endpoint for `mithunnivas1111@gmail.com`.

* **Submitted fields:** `name`, `email`, `phone`, `brand`, `website`, `platform`, `spend`, `need`, and `message`.
* **Request metadata added in `js/script.js`:** `_replyto`, `_subject` (`"Audit request from <brand>"`), `_template: "table"`, and `_captcha: "false"`.
* **Client-side handling (`initForm()` in [`js/script.js`](js/script.js)):**
  * Validates the five required fields (`f-name`, `f-email`, `f-phone`, `f-brand`, `f-website`) inline on blur/input and before sending.
  * Submits in the background without leaving the page, displays confirmation in `#form-status`, and resets the form on success (with a `mailto:` fallback if the request fails).

> **First-time activation:** On the first live submission, FormSubmit will send a confirmation email to `mithunnivas1111@gmail.com`. Click the activation link in that email once to enable submissions.

## Fonts

The brand typeface is **Degular** (weights `400` and `500`), which is not bundled in the repo:

* [`css/styles.css`](css/styles.css) declares `@font-face` rules for Degular `400` and `500` using `local()` first, so machines without Degular fall back cleanly to **Figtree** (loaded from Google Fonts alongside **Instrument Serif** in [`index.html`](index.html)) with no 404s.
* To enable Degular for all visitors:
  1. Place `Degular-Regular.woff2` and `Degular-Medium.woff2` in `assets/fonts/`.
  2. In section 1 of [`css/styles.css`](css/styles.css), swap each `src: local(...)` line with the commented `url("../assets/fonts/...")` line below it.
  3. Optionally remove the Figtree `<link>` tags in [`index.html`](index.html) if Instrument Serif is no longer needed either.

## Design & Interactive Modules

| Token | Value | Role |
|---|---|---|
| `--navy-950` | `#010106` | Primary dark background |
| `--blue-500` | `#1B5BFF` | Primary brand blue and metrics band |
| `--peri-400` | `#7B8CFF` | Labels, rules, and accents |
| `--white` | `#FFFFFF` | Primary text and light bands |

* **Layout & rhythm:** Content sits inside a hairline `.frame` with corner plus marks across alternating dark, light (`.section--light` on sections 01, 03, 05, 07, 09), and blue (`.section--blue` on section 06) bands.
* **JavaScript modules ([`js/script.js`](js/script.js)):** Header scroll state, accessible mobile drawer with focus trap, nav scroll-spy, hero entrance, staggered scroll reveals, mobile comparison switcher (`data-compare`), scroll-linked services index, interactive 4-stage growth orbit (`data-orbit`), scroll-driven 90-day timeline rail (`data-timeline`), keyboard-accessible FAQ accordion (`data-accordion`), and inline form validation.
* **Accessibility & user preferences:** Respects `prefers-reduced-motion`, `prefers-reduced-transparency`, and `prefers-contrast`.

## Remaining Setup Checklist

* Confirm the FormSubmit activation email on `mithunnivas1111@gmail.com` after the first live form submission.
* Add licensed Degular `.woff2` files to `assets/fonts/` and re-render `assets/images/og-cosmic.png` if needed.
* Replace the redrawn SVGs in `assets/logo/` with master vector exports if available.
* Add the Cosmic Instagram URL in the contact section (`#contact` copy mentions DMing `AUDIT` on Instagram).
* Add `<link rel="canonical">` and absolute `og:url` / `og:image` URLs once the production domain is configured.
