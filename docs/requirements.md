# Development Requirements

Use this checklist to get a teammate’s workstation ready for the Aviv Hair app.

## Hardware

- macOS, Windows, or Linux laptop with >= 8 GB RAM.
- Optional: iOS device (Expo Go) or Android device/emulator for on-device testing.

## Tooling

| Tool | Version / Notes |
| --- | --- |
| Node.js | 20.x LTS (use [nvm](https://github.com/nvm-sh/nvm) or `fnm` to manage). |
| npm | Ships with Node 20 (`npm -v` should be >= 10). |
| Expo CLI | Install globally for convenience: `npm install -g expo`. |
| Git | Any modern 2.x release. |
| Watchman (macOS) | Recommended for fast file watching (`brew install watchman`). |
| Xcode (macOS) | Required for iOS simulator builds; install from App Store, accept licenses. |
| Android Studio | Required for Android emulator builds; ensure Android SDK Platform Tools installed. |

## Accounts & Access

- **Supabase**: Ask an admin for project access and Supabase environment credentials (URL + anon key).
- **Apple Developer** / **Google Play**: Only needed for production builds. Development uses Expo Go.

## Environment Variables

1. Copy `.env.example` to `.env`.
2. Fill in:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
3. Restart Expo after editing `.env` (Expo reads the file at launch).

## Database Schema Expectations

The app reads/writes the following tables. Ensure they exist before running in a new Supabase project:

- `profiles` (id, full_name, role, etc.)
- `services`
- `service_providers`
- `availability_rules`
- `availability_services`
- `appointments`
- `settings` (slot configuration, etc.)

Review existing policies/migrations from the main project or request exported SQL snapshots.

## First Run Checklist

1. `npm install`
2. `npm run start`
3. Open the Expo Dev Tools page and launch in:
   - Expo Go (scan QR),
   - iOS Simulator (`npm run ios`),
   - or Android Emulator (`npm run android`).
4. Confirm authentication works (supplied credentials) and services load from Supabase.

## Troubleshooting Tips

- If the CLI cannot find Supabase env values, print them with `npx expo config --type public`.
- Clear Expo caches when debugging odd bundler behavior: `expo start -c`.
- For TypeScript issues, run `npx tsc --noEmit` to see the full error list.
