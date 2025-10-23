# Aviv Hair – Admin & Booking App

Mobile scheduling experience for Aviv Hair built with Expo (React Native) and Supabase. Clients can browse services and book appointments while the admin console handles availability, service management, and schedule oversight.

## Feature Highlights

- Client booking flow with live availability lookup via Supabase.
- Admin console for managing services, weekly availability, appointments, and settings.
- Multi-provider support and per-service activation controls.
- Dark-themed UI optimized for iOS/Android and responsive web preview via Expo.

## Getting Started

1. **Clone & Install**
   ```bash
   git clone <repo-url>
   cd aviv-hair
   npm install
   ```
2. **Environment Variables**
   - Copy `.env.example` to `.env` and fill in the Supabase project URL and anon key supplied by the admin team.
   - Expo automatically exposes variables prefixed with `EXPO_PUBLIC_` to the app at runtime.
3. **Run the App**
   ```bash
   npm run start       # opens Expo Dev Tools
   npm run ios         # bundle to iOS simulator (requires Xcode / macOS)
   npm run android     # bundle to Android emulator or device
   npm run web         # optional web preview
   ```

Expo Dev Tools will display a QR code so teammates can use Expo Go on a device, or they can attach local simulators/emulators.

## Project Requirements

A concise checklist covering tooling, runtime versions, and Supabase schema expectations lives in [`docs/requirements.md`](docs/requirements.md). Share that document with teammates who need a quick "ready to develop" checklist.

## Supabase Setup Notes

The application expects the following core tables:

| Table | Purpose |
| --- | --- |
| `services` | Service catalog with duration, price, notes, and `active` flag. |
| `service_providers` | Join table linking services to provider profiles (optional). |
| `availability_rules` | Weekly schedule rules (weekday, start/end, `is_open`). |
| `availability_services` | Weekly services being offered (optional toggle list). |
| `appointments` | Booked appointments with references to services and client profiles. |
| `profiles` | User profiles keyed by Supabase auth UID (`role` column differentiates admin/provider/client). |

Seed data can be inserted via the Supabase SQL editor or migrations. Ensure RLS policies match project security requirements before sharing with production clients.

## Code Tour

- `App.tsx` – top-level navigator; routes split between admin and client flows based on auth.
- `app/admin/*` – admin feature screens (services, availability, appointments, settings).
- `app/client/*` – client booking journey.
- `src/lib/supabase.ts` – Supabase client initialization.
- `src/state/*` – Zustand stores for auth and localization.
- `src/components/admin` – shared admin UI elements (e.g., top navigation).

## Scripts

| Command | Description |
| --- | --- |
| `npm run start` | Launch Expo Dev Tools. |
| `npm run ios` | Start iOS simulator (macOS only). |
| `npm run android` | Start Android emulator/device. |
| `npm run web` | Run Expo web target. |

## Contributing

1. Create a feature branch: `git checkout -b feature/my-change`.
2. Keep TypeScript happy (`npx tsc --noEmit`) before pushing.
3. Open a pull request with a brief description and screenshots if UI changes are involved.

## Support

For Supabase credentials or deeper architectural questions, reach out to the admin team. For build tooling or Expo CLI issues, check the [Expo documentation](https://docs.expo.dev/) or the project issues list.
