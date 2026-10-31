# Video editing portfolio — design decisions

## Brief and reference lock
Create Jennelle Salva's video editing portfolio for creators and small teams. The visitor should see real edits, understand the services, and contact Jennelle. Keep the existing software portfolio's identity, with more room for video.

Primary reference: the user-provided `portfolio-v2` source. Preserve navy `#0B1120`, mint `#00DC82`, white `#F8FAFC`, slate secondary text, Space Grotesk / Inter / Fira Code typography, the `<JS/>` mark, fine borders, modest corner radii, light/dark mode, and generous spacing.

Live Refero style research was attempted from three angles but unavailable because the connected subscription is inactive. Secondary references: Refero's bundled typography and craft-details guidance for type hierarchy, full aspect ratio media, focus, responsive layout, and performance. The supplied portfolio is the direct-build visual target.

| Decision | Source | Role / rationale |
| --- | --- | --- |
| Navy canvas, mint accents | Existing portfolio | Mint signals primary actions and small metadata; navy remains the main canvas. |
| Display headings, monospace labels | Existing portfolio | Preserve the personal brand while changing the subject to editing. |
| Three real frames in the hero | User's video outputs | Show range immediately; no stock imagery or invented project evidence. |
| Full-aspect posters and on-demand player | Supplied portrait video formats + craft guidance | Preserve captions and compositions; avoid loading every video on entry. |
| Filtered, curated work before services | User's goal and supplied outputs | Let a small body of work demonstrate the services. |
| Portfolio-study labels | User's beginner context; conservative assumption | No unverified client affiliations, results, or testimonials. |
| Remotion in a compact toolkit | User's stated tools | Describe its use for code-based animation without making tooling the pitch. |
| Separate React/Vite project | Existing React/Vite portfolio and Vercel context | Keep this project ready for the user's established hosting workflow. |

Reject: generic gradients, fabricated metrics, stock footage standing in for work, skill percentages, fake testimonials, oversized tool logos, custom cursors, cropped-away video captions.

## QA target
Compare desktop and mobile renderings against the palette/type/media lock. Check light mode, filters, all ten gallery entries, keyboard-accessible video dialog, playback, contact links, reduced motion, and overflow. Original source portfolio and video files are read-only inputs.

## Completed validation

The production build passed. Browser checks passed at 320, 390, 768, 1024, and 1440 pixels, including actual portrait and landscape playback, category filters, all ten gallery entries, Escape dismissal, restored keyboard focus, theme persistence, email copy, direct project URLs, mobile navigation, and reduced motion. No page runtime errors or horizontal overflow were observed.

Desktop, phone, tablet, light-mode, and video-dialog captures were visually reviewed. The rotated hero frames were given more space above the timeline and the product-promo poster was moved to a fully visible frame. The implementation retains the original site's palette, type roles, and identity. Evidence is in ignored `artifacts/qa/`.

The revised selection follows the user's exact ten-video list, excluding both Trixy Castro samples and adding Akon’s Paycheck and the Miyagi short. All ten are visible by default. The hero is keyed by project ID in the explicit order Deep Blue, Akon’s Paycheck, ChrisReel. The new hero links and Miyagi playback passed browser checks; removed media is absent from both public assets and the production output.

## October 31 additions

The updates are now synchronized to the user's active `C:/Users/jenne/Documents/GitHub/portfolio-vid-edit` repository. HairPeps and the mini humidifier ad use a separate AI UGC filter, as confirmed by the user.

Added Break the Pattern and Make It Move to Motion, and HairPeps UGC and the mini humidifier ad to Short-form. Refreshed Voynich from the supplied source without duplicating its project entry. The gallery now shows fourteen unique studies; the hero selection is unchanged. Poster frames were inspected from the actual videos, avoiding empty transition frames. Production asset validation and browser playback checks passed for all five supplied videos, together with the existing responsive and interaction checks.
