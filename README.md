# Demeter AI 2.0 — Frontend Template

Multi-tenant React frontend template for the Demeter AI 2.0 platform. Industry-agnostic by design — clone it, customize it per vertical (Cultivos, Comerciantes, Vending, etc.), and deploy to GCP Cloud Run.

## Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| UI | React | 19.2 |
| Build | Vite | 7.3 |
| Language | TypeScript (strict) | 5.9 |
| Styling | Tailwind CSS | 4.1 |
| Auth | Auth0 | @auth0/auth0-react 2.3 |
| Server State | TanStack Query | 5.90 |
| Client State | Zustand | 5.0 |
| Forms | react-hook-form + Zod | 7.55 / 3.25 |
| Charts | Recharts | 2.15 |
| Maps | Leaflet + react-leaflet | 1.9 / 5.0 |
| Icons | Lucide React | 0.511 |
| Testing | Vitest + Testing Library + MSW | 4.0 / 16.3 / 2.7 |
| E2E | Playwright | 1.58 |

## Project Structure

```
src/
  core/                          # Shared infrastructure
    auth/                        # Auth0 wrapper, AuthGuard, RoleGuard, useAuth
    tenant/                      # TenantProvider, TenantTheme, resolver, useTenant
    api/                         # Axios client + interceptors (auth, tenant, error)
    layout/                      # AppLayout, Sidebar, Header, MobileNav, ErrorBoundary
    components/                  # Design system (Button, Input, Modal, DataTable, etc.)
    hooks/                       # useFeatureFlag, usePermissions, usePagination, useDebounce
    config/                      # env.ts, navigation.ts, routes.ts
    types/                       # Enums, global type declarations
  modules/                       # Business modules (each self-contained)
    inventario/                  # Stock batches, movements, lifecycle tracking
    productos/                   # Products, categories, families catalog
    ventas/                      # Sales flow, receipts
    costos/                      # Cost entries, inventory valuation
    usuarios/                    # User management, RBAC (admin/supervisor/worker/viewer)
    ubicaciones/                 # Warehouses, locations, bins (Leaflet maps)
    empaquetado/                 # Packaging catalog (types, materials, colors)
    precios/                     # Price lists, inline editing, CSV bulk upload
    analytics/                   # Dashboard with KPIs, charts, CSV export
    fotos/          [DLC]        # Photo processing sessions, gallery, image comparison
    chatbot/        [DLC]        # AI chat with streaming, markdown, chart rendering
```

Each module follows the same internal structure:

```
modules/<name>/
  types/           # TypeScript interfaces + Zod validation schemas
  services/        # API service functions (axios calls)
  hooks/           # TanStack Query hooks (queries + mutations)
  components/      # Module-specific React components
  pages/           # Route-level page components
  routes.tsx       # Lazy-loaded route definitions
  index.ts         # Barrel export
```

## Multi-Tenancy

Multiple tenants within the same industry share a single GCP Cloud Run deployment. The frontend differentiates them at runtime — no rebuild required.

### Tenant Resolution

The template resolves the current tenant using a priority chain (`core/tenant/tenantResolver.ts`):

1. **Subdomain** — `gobar.demeter.app` (production)
2. **Path prefix** — `demeter.app/gobar/dashboard` (staging)
3. **JWT claim** — `token.tenant_id` (fallback)
4. **Environment variable** — `VITE_DEFAULT_TENANT_ID` (development)

Once resolved, `TenantProvider` fetches the tenant config from `GET /api/v1/tenants/:id/config` and makes it available app-wide via React context.

### Tenant Config Shape

The backend returns a `TenantConfig` object (`core/tenant/types.ts`) that drives all per-tenant behavior:

```typescript
interface TenantConfig {
  id: string                          // "go-bar"
  name: string                        // "Go Bar"
  industry: Industry                  // CULTIVOS | COMERCIANTES | VENDING | ...
  theme: TenantTheme                  // Visual branding (see below)
  enabledModules: string[]            // ["inventario", "productos", ..., "fotos"]
  settings: Record<string, unknown>   // Open bag for custom config per tenant
}

interface TenantTheme {
  primary: string       // "#FF6B35"
  secondary: string     // "#0F172A"
  accent: string        // "#E65100"
  background: string    // "#F8FAFC"
  logoUrl?: string      // "https://cdn.demeter.app/go-bar/logo.png"
  appName: string       // "Go Bar Stock"
}
```

### What Changes Per Tenant (runtime)

| Aspect | Mechanism | Source file |
|--------|-----------|-------------|
| **Brand colors** | 4 CSS custom properties (`--color-primary`, `--color-secondary`, `--color-accent`, `--color-background`) injected on `:root` | `core/tenant/TenantTheme.tsx` |
| **Logo** | `theme.logoUrl` rendered in the header; falls back to text `appName` | `core/layout/Header.tsx` |
| **App name** | `theme.appName` shown as header title when no logo is set | `core/layout/Header.tsx` |
| **Enabled modules** | `enabledModules[]` controls which modules (core and DLC) appear in sidebar navigation, mobile nav, and which routes are mounted. All 11 modules are conditional. | `core/config/modules.ts`, `core/config/navigation.ts`, `AppRoutes.tsx` |
| **Data isolation** | Every API request includes `X-Tenant-ID` header — the backend filters via PostgreSQL RLS | `core/api/apiClient.ts` |
| **Role-based access** | JWT roles (`ADMIN`, `SUPERVISOR`, `WORKER`, `VIEWER`) control UI permissions per user | `core/hooks/usePermissions.ts` |
| **Custom settings** | `settings: Record<string, unknown>` — open extension point for arbitrary per-tenant config | `core/tenant/types.ts` |

### Example: Two Tenants, Same Industry

```
Industria: Comerciantes (single Cloud Run service)

         Tenant A (Go Bar)              Tenant B (Central de Bebidas)
         ──────────────────             ─────────────────────────────
Logo:    go-bar.png                     central-bebidas.png
Name:    "Go Bar"                       "Central de Bebidas"
Primary: #FF6B35 (orange)              #2E86C1 (blue)
Accent:  #E65100                        #1565C0
Modules: inventario, productos,         inventario, productos,
         ventas, ubicaciones, fotos     ventas, costos, chatbot
Data:    X-Tenant-ID: go-bar            X-Tenant-ID: central-bebidas
Roles:   admin sees user mgmt           admin sees user mgmt
Font:    Inter (shared)                 Inter (shared)
Layout:  Sidebar + Header (shared)      Sidebar + Header (shared)
Texts:   Spanish (shared)               Spanish (shared)
```

### Module Registry

All 11 modules (9 core + 2 DLC) are defined in a single registry (`core/config/modules.ts`). Each entry maps a module key to its label, path, icon, and type (`core` | `dlc`). Navigation, routing, and local dev config all derive from this registry — no duplication.

Adding a new module means adding one entry to the registry, one lazy import in `AppRoutes.tsx`, and the module directory under `src/modules/`.

### Current Limitations

The following aspects are **not yet customizable** per tenant:

| Limitation | Detail |
|------------|--------|
| **Extended colors** | `surface`, `muted`, `border`, `destructive`, `warning`, `success` are hardcoded in `src/index.css` — `TenantTheme` only overrides 4 of the 10 theme colors |
| **Typography** | All tenants share the Inter font family — no font customization per tenant |
| **Favicon / page title** | Not set dynamically from tenant config |
| **Labels / i18n** | All UI text is hardcoded in Spanish — no per-tenant language or label overrides |
| **Layout variants** | Every tenant sees the same sidebar + header layout — no option for a custom landing dashboard or alternative navigation |
| **Custom fields usage** | The `settings` bag exists in `TenantConfig` but no component currently reads from it |

### Extension Points

To deepen per-tenant customization, the following changes would be needed:

1. **Full color theming** — Expand `TenantTheme` to include all 10 CSS variables (`surface`, `muted`, `border`, `destructive`, `warning`, `success`) and have `TenantTheme.tsx` override them all
2. **Typography** — Add a `fontFamily` field to `TenantTheme` and inject it as `--font-family` on `:root`
3. **Dynamic page title/favicon** — Read `appName` and a `faviconUrl` from tenant config in a `useEffect` that sets `document.title` and the favicon `<link>`
4. **i18n** — Integrate a library like `react-i18next` and load translations keyed by tenant locale
5. **Settings consumption** — Define typed keys within `settings` (currency, timezone, date format, visible columns, etc.) and create hooks like `useTenantSetting('currency')` to consume them
6. **Layout variants** — Use a `settings.layout` key to switch between layout components (sidebar vs. top-nav, custom dashboard landing, etc.)

## Conditional Modules

All 11 modules — both core and DLC — are conditional. A tenant's `enabledModules` array controls exactly which modules are visible and routable. The distinction between core and DLC is purely semantic (core = generally applicable, DLC = industry-specific), not mechanical — they use the same gating system.

```typescript
// All routes are data-driven from enabledModules (AppRoutes.tsx)
{enabledModules.map((key) => {
  const Component = routeComponents[key]
  const path = modulePathMap[key]
  if (!Component || !path) return null
  return <Route key={key} path={`${path}/*`} element={<Component />} />
})}

// Navigation also derived from enabledModules (navigation.ts)
export function getNavItems(enabledModules: string[]): NavItem[] {
  return getEnabledModules(enabledModules).map((m) => ({
    label: m.label, path: m.path, icon: m.icon,
  }))
}

// Default redirect goes to first enabled module, not hardcoded /inventario
const defaultPath = getFirstEnabledPath(enabledModules)
```

## Getting Started

```bash
# 1. Clone
git clone <repo-url> demeter-frontend-<industry>
cd demeter-frontend-<industry>

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your Auth0 credentials and API URL

# 4. Start dev server (port 3000)
npm run dev
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API base URL | Yes |
| `VITE_AUTH0_DOMAIN` | Auth0 tenant domain | Yes |
| `VITE_AUTH0_CLIENT_ID` | Auth0 application client ID | Yes |
| `VITE_AUTH0_AUDIENCE` | Auth0 API audience identifier | Yes |
| `VITE_AUTH0_CALLBACK_URL` | OAuth callback URL | Yes |
| `VITE_AUTH_BYPASS` | Skip Auth0 in local dev (`true`/`false`) | No |
| `VITE_DEFAULT_TENANT_ID` | Override tenant resolution for dev | No |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server on port 3000 |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint 9 flat config |
| `npm run format` | Prettier formatting |
| `npm test` | Run Vitest test suites |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Vitest with coverage report |
| `npm run test:e2e` | Playwright E2E tests |

## Build & Deploy

### Docker (local)

```bash
docker-compose up --build
```

Multi-stage build: `node:22-alpine` (build) + `nginx:1.27-alpine` (serve). Nginx handles SPA routing and API proxy.

### GCP Cloud Run

Deploy infrastructure is in `deploy/`:

```
deploy/
  cloudrun/frontend-service.yaml   # Knative service definition
  cloudbuild.yaml                  # CI/CD pipeline (Cloud Build)
  terraform/main.tf                # Cloud Run + infra provisioning
```

Each industry gets its own Cloud Run service (`<industry>-frontend`) serving all tenants within that vertical.

## Path Aliases

Configured in `vite.config.ts` and `tsconfig.app.json`:

```typescript
import { apiClient } from '@core/api/apiClient'
import { useProducts } from '@modules/productos/hooks/useProducts'
```

## Vendor Chunking

Production builds split into optimized chunks:

- `vendor-react` — react, react-dom, react-router
- `vendor-query` — @tanstack/react-query
- `vendor-charts` — recharts
- `vendor-maps` — leaflet, react-leaflet

## Testing

- **Unit/Integration**: Vitest + React Testing Library + MSW (mock API handlers)
- **E2E**: Playwright (placeholder specs for auth, inventario, multi-tenant flows)
- **94 tests** across 10 suites covering auth, tenant, API client, feature flags, module registry, navigation filtering, products, and inventory

## Using as a Template

To create an industry-specific frontend:

1. Clone/fork this template
2. Configure tenant-specific branding via the backend tenant config API
3. Enable/disable DLC modules through feature flags
4. Add industry-specific components under the relevant modules
5. Deploy as a separate Cloud Run service per industry

The template ships with generic business logic. Industry customization happens at the **tenant config level** (branding, modules) and optionally by adding industry-specific components — never by forking core modules.
