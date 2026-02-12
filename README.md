# 🏋️ Havy (Heavy Remote Module)

> Vue 3 + Vite remote that exposes the **PokemonDetailCard** — a rich, animated Pokémon detail view consumed by the Host via Module Federation.

## Architecture

```
Havy (Remote)
├── exposes → PokemonDetailCard.vue
├── shared  → vue (reuses Host instance)
└── output  → dist/v1.0.0/assets/remoteEntry.js (immutable)
```

This remote contains **heavy UI components** that are lazy-loaded only when needed, keeping the Host bundle small.

## Tech Stack

| Layer      | Technology                               |
| ---------- | ---------------------------------------- |
| Framework  | Vue 3                                    |
| Build      | Vite 7                                   |
| Federation | `@originjs/vite-plugin-federation`       |
| Language   | TypeScript                               |
| Deploy     | Vercel (auto-deploy on push to `master`) |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (port 5002)
npx vite dev --port 5002

# Build for production (outputs to dist/v1.0.0/)
npm run build

# Preview production build
npx vite preview --port 5002
```

## Exposed Modules

| Module                | Path                                   | Description                                                    |
| --------------------- | -------------------------------------- | -------------------------------------------------------------- |
| `./PokemonDetailCard` | `src/components/PokemonDetailCard.vue` | Rich Pokémon card with stats, types, abilities, and animations |

### Consuming from the Host

```ts
const PokemonDetailCard = defineAsyncComponent(
  () => import("havy/PokemonDetailCard"),
);
```

## Project Structure

```
havy/
├── src/
│   ├── components/
│   │   ├── PokemonDetailCard.vue  # Exposed — main component
│   │   ├── PokemonCard.vue        # Internal card UI
│   │   ├── PokemonModal.vue       # Detail modal
│   │   ├── PokedexWidget.vue      # Grid widget
│   │   └── HeavyWidget.vue        # Demo widget
│   ├── composables/
│   │   └── usePokedex.ts          # Pokémon data logic
│   ├── types/                     # TypeScript definitions
│   ├── App.vue                    # Standalone dev shell
│   └── main.ts                    # Entry point
├── vite.config.ts                 # Federation + versioned build config
├── vercel.json                    # CORS + cache headers + /latest rewrite
└── .github/workflows/deploy.yml   # CI: validate build + verify artifact
```

## Versioning

Every build generates **immutable artifacts** under a versioned path:

```
dist/
└── v1.0.0/
    └── assets/
        ├── remoteEntry.js    # Federation entry point
        ├── PokemonDetailCard-[hash].js
        └── ...
```

- **Version** is read from `package.json` at build time
- **`/latest/`** is a Vercel rewrite that points to the current version
- Versioned paths (`/v1.0.0/`) are cached for **1 year** (immutable)
- `/latest/` is cached for **5 minutes**

### Bumping the Version

```bash
# Update in package.json
"version": "1.1.0"

# Build produces dist/v1.1.0/
npm run build

# Update /latest rewrite in vercel.json
"/latest/(.*)" → "/v1.1.0/$1"
```

## CI/CD

GitHub Actions workflow (`.github/workflows/deploy.yml`):

1. **Checkout** → **Install** → **Build**
2. **Verify** that `dist/v{VERSION}/assets/remoteEntry.js` exists
3. **Deploy** handled automatically by Vercel GitHub Integration

## CDN & CORS

Configured in `vercel.json`:

- **CORS** — `Access-Control-Allow-Origin: *` on all versioned assets
- **Cache (versioned)** — `max-age=31536000, immutable` (1 year)
- **Cache (latest)** — `max-age=300` (5 minutes)
