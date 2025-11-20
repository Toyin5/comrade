# Comrade

Comrade is a small web app for creating humorous memes by placing a "comrade" overlay onto images. It uses client-side face detection (face-api.js) to suggest overlay placements and provides a simple editor to add, move, resize, rotate, and export images.

**Key Features**

- **Face detection:** automatically suggests placements using `face-api.js` models stored in `public/models`.
- **Interactive editor:** drag, resize, rotate, select, and delete overlays.
- **Incremental placement:** new overlays are placed incrementally across the image (wraps rows when needed).
- **Export:** save your final meme as a PNG.

**Files of Interest**

- `src/Editor.tsx`: main editor canvas and overlay logic.
- `src/ImageUploader.tsx`: image upload UI.
- `public/models`: pre-downloaded `face-api.js` models used for detection.
- `public/comrade.png`: overlay image used by the editor (place your comrade PNG here).

## Getting Started

Prerequisites

- Node.js (16+) and npm installed.

Install

```bash
npm install
```

Run (development)

```bash
npm run dev
```

Build

```bash
npm run build
npm run preview
```

## Usage

- Open the app in your browser (Vite will print the URL, usually `http://localhost:5173`).
- Upload an image using the uploader.
- The app will attempt to detect faces and add suggested overlays.
- Use the **Add Comrade** button to place additional overlays; they are placed incrementally across the X axis and wrap to the Y axis to avoid stacking.
- Select an overlay to move/resize/rotate it. Press `Delete`/`Backspace` to remove the selected overlay.
- Click **Export Meme** to download the final image as `comrade-meme.png`.

## Notes & Troubleshooting

- If face detection doesn't work, ensure the model files exist at `public/models` and are reachable by the app.
- The overlay image must be available at `public/comrade.png` (or update `src/Editor.tsx` accordingly).
- Linting or Tailwind class warnings do not affect runtime — address them if you want to clean up styles.

## Contributing

- Feel free to open issues or PRs for features or fixes. Recommended work flow:

```bash
git checkout -b my-feature
# make changes
git commit -am "Add feature"
git push origin my-feature
```

## License

MIT

## Acknowledgements

- `face-api.js` for client-side face detection.
- `react-konva` for canvas interactions.
