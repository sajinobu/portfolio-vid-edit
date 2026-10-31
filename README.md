# Jennelle Salva — Video editing portfolio

A separate React + Vite portfolio based on the navy/mint palette and typography of the existing software portfolio. The original portfolio and original video files were not modified.

## Working folder

The active repository is `C:/Users/jenne/Documents/GitHub/portfolio-vid-edit`. Run development commands there. The ChatGPT workspace is the preparation copy.

HairPeps and the mini humidifier ad are in the **AI UGC** category (`?type=ai-ugc`).

## Run locally

Use Node.js 22.12 or newer (Node 20.19 is also supported by the installed Vite version).

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. For a production build:

```sh
npm run build
npm run preview
```

## Deploy to Vercel

1. Push this folder as a new GitHub repository (include `public/media/`).
2. In Vercel, add a new project and import that repository.
3. Use the Vite preset, `npm run build`, and `dist` as the output directory. These settings are also in `vercel.json`.
4. Deploy. No environment variables or backend setup are required.

This project is ready for deployment but has **not** been deployed. Create a separate Vercel project to keep the existing software portfolio at its current address.

After choosing a production domain, use its full URL for `og:image` in `index.html` (ending in `/social-preview.jpg`) and add a canonical URL if desired. The included social image is a capture of the portfolio hero.

## Update the portfolio

- `src/content.js`: project titles, descriptions, categories, durations, contact details, services, and tools.
- `src/App.jsx`: page copy and section structure.
- `src/styles.css`: color tokens, typography, spacing, and responsive layouts.
- `public/media/`: web video copies and poster images. Add an MP4 and JPG with the same ID as a project entry.
- `public/media/manifest.json`: source filenames, measured durations, dimensions, and optimized file sizes.

All fourteen portfolio studies appear in the gallery by default, with category filters. The latest additions are Break the Pattern, HairPeps UGC, Make It Move, and the mini humidifier ad. Voynich is refreshed in place without creating a duplicate. Both Trixy Castro videos remain excluded. The hero features Deep Blue, Akon’s Paycheck, and ChrisReel from left to right.

All samples are labeled portfolio studies, as requested. No client relationships, testimonials, view counts, or performance claims are invented. Remotion is included as “Code-based animation.” Email and LinkedIn are reused from the existing portfolio.

## Media and performance

Videos use H.264 / AAC, a browser-friendly pixel format, and fast-start metadata. Portrait web copies are at most 720 pixels wide; the landscape promo is 1280 pixels wide. All original footage remains unchanged.

Only JPG posters load on the page. A video is mounted and requested when a visitor opens a study. The native player supports pause, seeking, volume, and fullscreen. Existing burned-in captions are retained. No additional caption transcripts have been generated.

To regenerate media, use Python with Pillow for the optional inspection script and FFmpeg/FFprobe for conversion:

```sh
python scripts/prepare-media.py --source "PATH_TO_ORIGINAL_VIDEOS" --ffmpeg "PATH_TO_FFMPEG" --ffprobe "PATH_TO_FFPROBE"
```

The converter skips existing MP4 files and refreshes poster images. Use `--refresh voynich` (or another project ID) to replace an existing web copy from its original file.

## Checks

`npm run build` checks the production bundle. `scripts/qa.cjs` runs browser checks using an available Playwright installation and local Chrome. Set `NODE_PATH` to the directory containing Playwright if it is not installed in this project. Optionally set `QA_URL` to a production preview URL.

The checks cover all fourteen gallery entries, playback of the latest uploads, the three hero videos and their order, category counts, actual video playback, dialog focus and Escape, theme persistence, copying the email, shared project links, mobile navigation, reduced motion, runtime errors, and horizontal overflow at 320 / 390 / 768 / 1024 / 1440 pixels. Captures and the test report are written to ignored `artifacts/qa/`.

## Interaction and accessibility

Includes native modal focus management, focus restoration, visible keyboard focus, a skip link, labeled controls, reduced-motion support, and responsive navigation. Theme choice persists locally. Filter and project state can be shared in the URL, for example `?type=motion&project=electric-cars`.

Contact buttons open the visitor's email app; there is no form submission service. Google Fonts supplies the three typefaces, with local system fallbacks if unavailable.
