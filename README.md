# Erendira's Boutique — Tracking Portal (V3, phone-first redesign)

Customer tracking page for track.erendirasboutique.com. Built with Next.js, hosted on Vercel, tracking data from Shippo.

## What's new in V3

- **Phone-first "route map" design** — drawn route from the boutique to the customer, a slide-up panel with the status, and a button bar pinned to the bottom (Ver en USPS · Compartir · Ayuda).
- **Spanish by default.** English is one tap away (ES / EN). A customer's choice is remembered on their phone. Add `?lang=en` to a link to open it in English.
- **Brand colors** — cream `#f5f3ef`, ink `#4a3f33`, taupe `#806a52`, sand `#bda891`. No seasonal orange.
- **Regular logo** (`/public/logo.png`) instead of the fall logo.
- **Full detail** — carrier logo, service (e.g. Ground Advantage), full tracking number with copy button, shipped date, estimated delivery, last scan, and the complete scan history.
- **Friendly scan messages** — common USPS/UPS/FedEx scans are shown in plain Spanish (e.g. "Llegó a una instalación", "Entregado en el buzón"). ALL-CAPS carrier text is cleaned up in English.
- **Every state designed** — search, loading, not found, label created, in transit, out for delivery ("Llega hoy"), delivered, needs attention, returned.
- **Confetti when delivered** in brand colors, plus a thank-you box with "Ver novedades" and "Hacer una devolución". Phones set to reduce motion skip the confetti.
- **Fixes**
  - `/<tracking number>` links now load correctly on the newest Next.js version.
  - Tracking numbers pasted with spaces or dashes work.
  - A number the carrier doesn't know yet shows a clear "No encontramos ese número" screen instead of an empty result.
  - The old version saved "English" for every first visit, so returning customers stayed in English. V3 only remembers a language when the customer taps ES or EN.

## Links that work

- `https://track.erendirasboutique.com/`
- `https://track.erendirasboutique.com/9334620845500054091488`
- `https://track.erendirasboutique.com/?tracking=9334620845500054091488`
- Add `?lang=en` (or `&lang=en`) to any of these to open in English.

## Files changed in V3

| File | What changed |
| --- | --- |
| `app/components/Tracker.js` | New design and all screen states (replaces the old file) |
| `app/globals.css` | All styles for the new design (replaces the old file) |
| `app/layout.js` | New font, Spanish page title, `lang="es"` |
| `app/page.js` | Reads `?tracking=` and `?lang=` |
| `app/[tracking]/page.js` | Fixed for the newest Next.js |
| `app/api/track/route.js` | Strips spaces/dashes from tracking numbers |
| `app/fonts/BricolageGrotesque.woff` | New font file (add it) |
| `app/fonts/BricolageGrotesque-OFL.txt` | The font's free license (add it) |
| `README.md` | This file |

Nothing in `public/` changed, and `package.json` is unchanged — no new packages.

## Vercel environment variable

`SHIPPO_API_TOKEN=your_token_here` (already set if the current site works).

## Easy edits

- **Links** (shop, returns, help…): `LINKS` at the top of `app/components/Tracker.js`.
- **Wording** in Spanish and English: the `T` object right below it.
- **Colors**: the `:root` block at the top of `app/globals.css`.
- **Spanish scan messages**: `SCAN_PHRASES` in `Tracker.js`.

The font is Bricolage Grotesque (SIL Open Font License, free for commercial use).
