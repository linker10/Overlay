## Image Text Composer

Lightweight browser-based image editor to add and style text overlays on images. Built with Next.js App Router, React, and Konva for high‑performance canvas interactions. State is managed with Zustand, and editor history and assets are persisted locally for a smooth offline‑friendly UX.

### Quick start

Prerequisites:
- Node.js 23.11.0
- A Google Fonts API key

Environment:
1) Create a `.env.local` in the project root with:
```bash
NEXT_PUBLIC_GOOGLE_FONTS_API_KEY=YOUR_API_KEY
```

Install and run:
```bash
npm install
npm run dev
# visit http://localhost:3000
```

Production build:
```bash
npm run build
npm start
```

Lint:
```bash
npm run lint
```

### What you can do
- Upload a PNG image and add multiple text layers
- Select/move/transform text; snap‑to‑center on drag; arrow‑key nudge
- Edit text, font family, size, color, opacity, alignment
- Undo/redo with bounded history; autosave to localStorage
- Export PNG at original image resolution using Konva `pixelRatio`

## Architecture (concise)

- Server boundary
  - `app/page.tsx` is a server component that fetches Google Fonts metadata on the server and passes it to the client (`ImageEditor`). ISR is intentionally not used due to cache size limits (see trade‑offs).

- Client application (React + Zustand)
  - Editor composition: `components/Editor/ImageEditor.tsx` orchestrates autosave managers, the canvas (`CanvasContainer` → `EditorStage`), and the conditional `TextManager` side panel.
  - Canvas runtime: `react-konva` renders the `Stage`, background image layer, and text layers. The editor references the Konva `Stage` via `stores/canvasStore.tsx` for export.
  - State management: Zustand stores split by concern
    - `stores/imageStore.tsx`: selected image element + localStorage persistence
    - `stores/layerStore.tsx`: text layers, selection, history, movement, autosave
    - `stores/fontStore.tsx`: list of available fonts hydrated on load
  - History: `utils/historyManager.ts` keeps a bounded snapshot history enabling undo/redo. Immediate vs debounced updates balance responsiveness with history granularity.
  - Export: `utils/canvasUtils.ts` preserves display/export scale metadata and uses Konva’s `toDataURL({ pixelRatio })` to generate a crisp PNG at original resolution.
  - UI: Radix primitives and shadcn UI components (`components/ui/*`), icons via `lucide-react`.

- Fonts
  - Server fetch of Google Fonts metadata occurs in `app/page.tsx` and hydrates the font store. Client preview uses `<link rel="stylesheet">` injection for selected families (`utils/fontUtility.ts`).

Key files:
- `app/page.tsx` – server entry, fonts fetch, shell layout
- `components/Editor/Canvas/CanvasContainer.tsx` – export controls + stage container
- `components/Editor/Canvas/Stage/EditorStage.tsx` – Konva stage + interactions
- `components/Editor/Layers/Text/TextLayer.tsx` – individual text layer + Transformer
- `components/Editor/Layers/Text/TextManager.tsx` – side panel text properties
- `components/ImageUploader/index.tsx` – PNG upload (drag‑drop or picker)
- `stores/*` – Zustand stores by domain
- `utils/*` – history, fonts, canvas helpers

## Technology choices and trade‑offs

### Konva vs. Fabric.js
- Performance and React model
  - Konva integrates naturally with React via `react-konva`, mapping nodes to components and enabling fine‑grained re‑render control (`React.memo`, selectors). This keeps the data model in React/Zustand, avoiding an imperative scene graph API leaking into component logic.
  - Fabric is feature‑rich but historically more imperative. React bindings exist but are thinner; integrating Fabric’s mutation model with React state often requires adapters and can complicate reconciliation.
- Ecosystem and typing
  - Konva has mature TypeScript types and a focused API for 2D canvas scenes (shapes, transforms, events). The editor’s needs (basic text, transforms, export) align well.
  - Fabric offers broader object types and editing tools; for complex vector features (path editing, object groups with constraints), Fabric may reduce custom code.
- Decision
  - Chose Konva to optimize for React‑first ergonomics, predictable reconciliation, and straightforward high‑DPI exports. The trade‑off is writing small utilities (snapping, history) ourselves rather than relying on heavier built‑ins.

### Font loading strategy (server vs client vs ISR)
- Options considered
  - Client‑side fetch of the entire Google Fonts catalog on app load: simple but shifts a large payload to the browser, increases TTI, and risks rate limiting per user.
  - Server‑side at build time with ISR revalidation: attractive for freshness without cold starts, but Next.js caching imposes a ~2MB per‑entry limit; the Google Fonts catalog payload exceeds this, making ISR unsuitable here.
  - Server‑side fetch per request (no store): keeps the large payload off the client and avoids ISR cache limits; enables central control and potential server‑side filtering.
- Decision
  - Fetch on the server (`app/page.tsx`) and hydrate the client store. Avoid ISR due to the cache entry size limit. Fonts change infrequently, so a build‑time fetch writing a static JSON asset (e.g., `public/fonts.json`) is a solid future optimization; however, it requires a custom build step and manual re‑builds when catalog changes are desired.
- Client preview
  - Only the selected font family is loaded dynamically via a single stylesheet link; this minimizes CSS payloads and avoids preloading hundreds of families.

### State management (Zustand)
- Thin, minimal boilerplate with selector‑driven subscriptions for performance. Stores are scoped by concern (image/layers/fonts) to keep updates localized. History is bounded to control memory.

### Export strategy
- Use Konva’s `toDataURL({ pixelRatio })` with scaling metadata captured at image load time to export at original resolution without re‑rendering the UI at large canvas sizes.

## Known limitations
- Only PNG uploads are supported today.
- Undo/redo history is limited (default 20 snapshots). Long sessions may drop older steps.
- No multi‑select or grouped transforms for text layers yet.
- Font variants are simplified; only common weights are injected for preview by default.
- Fonts metadata is fetched per request and not cached with ISR due to payload size; repeated requests can increase external API calls if upstream caching/CDN is absent.
- Accessibility and keyboard navigation are basic (selection and arrow nudge supported); transform handles are not fully keyboard‑operable.
- Mobile ergonomics are limited for precision transforms; desktop is the primary target.
- LocalStorage persistence only; there is no server‑side project storage or shareable links.

## Development notes
- Directory conventions
  - `components/Editor/*` – canvas, layers, and controls
  - `stores/*` – domain‑specific Zustand stores
  - `utils/*` – stateless helpers (canvas, fonts, history, debounce)
  - `services/*` – API/service wrappers (consider moving all external calls here)

- Clean architecture
  - UI is declarative and stateless where possible. Business rules (history, autosave, scaling) live in utilities and stores, not components. Server data access is isolated to server components/services.

- Potential improvements
  - Introduce a build step to materialize `public/fonts.json` to avoid runtime fetches and remove the need for a public API key.
  - Add tests for `utils/*` and store logic; integrate CI lint/test.
  - Add JPEG support and optional background color for exports.

## Scripts
- `npm run dev` – start dev server (Turbopack)
- `npm run build` – production build
- `npm start` – start production server
- `npm run lint` – run ESLint
