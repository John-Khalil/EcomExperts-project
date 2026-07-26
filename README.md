# EcomExperts Bundle Builder

This project is a headless storefront-style bundle builder built with `React`, `TypeScript`, and `Vite`, backed by a small `Express` mock API. The UI is driven by a single bundle configuration payload, and the selection state is shared across the stepper, product cards, review panel, and checkout summary.

## Frontend Setup

1. Install frontend dependencies from the project root:

```bash
npm install
```

2. Start the frontend dev server:

```bash
npm run dev
```

3. Open the local Vite URL shown in the terminal, typically:

```text
http://localhost:5173
```

## Mock API Setup

1. Open a second terminal.

2. Move into the mock API folder:

```bash
cd mock-api
```

3. Install mock API dependencies:

```bash
npm install
```

4. Start the mock API:

```bash
node server.js
```

5. The API will be available at:

```text
http://localhost:3001/products
```

## Running Both Together

The intended local setup is:

- Frontend on `http://localhost:5173`
- Mock API on `http://localhost:3001`

The frontend fetches bundle data from `http://localhost:3001/products` through the reusable hook in `src/hooks/LoadProducts.ts`.

If the mock API is not running, the frontend falls back to the local file at `src/data/products.json`, so the UI can still render during development.

## Very Quick Demo

[![Very Quick Demo](https://img.youtube.com/vi/Y23nRfQ2DRs/maxresdefault.jpg)](https://www.youtube.com/watch?v=Y23nRfQ2DRs)

links directly to the demo on YouTube.

## What The Project Does

This app simulates a configurable security bundle purchase flow:

- A multi-step selector renders from backend-provided `steps` data.
- The current flow is `cameras`, `plan`, `sensors`, and `protection`.
- Product cards support variant switching where variants exist.
- Quantity rules are enforced in the UI:
  - required items cannot go below `1`
  - `plan` and `protection` items are limited to a single selection
  - zero-priced items are also limited to a single selection
- The active step shows a selected item count and only enables moving forward when at least one item is selected in that step.

## State And Persistence

Bundle state is managed in `src/context/BundleContext.tsx` and includes:

- the active step
- the active variant per product
- the quantity map for selected items

Saved selections are stored in `localStorage` under the key `bundle-state`.

Important behavior:

- saved state is loaded before first paint through the reducer initializer
- the review panel and checkout summary stay in sync with the shared bundle state
- the "Save for later" action persists the current bundle state to `localStorage`

## Data Model

The app is backend-driven from a single bundle config payload that contains:

- `steps`
- `products`
- `review`

That payload currently lives in:

- `mock-api/products.json` for the API response
- `src/data/products.json` for the frontend fallback

## Project Structure

```text
.
|-- mock-api/
|   |-- products.json
|   `-- server.js
|-- src/
|   |-- components/
|   |-- context/
|   |-- data/
|   |-- hooks/
|   `-- types/
|-- package.json
`-- vite.config.ts
```

## Available Frontend Commands

From the project root:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```
