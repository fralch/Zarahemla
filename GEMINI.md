# Zarahemla - "Tinder Social" React Native App

Zarahemla is a mobile application built with React Native and Expo, designed to facilitate social connections through a "swipe and match" mechanic. Unlike traditional dating apps, it focuses on external connection (Instagram/WhatsApp) rather than internal chat.

## Project Overview

- **Purpose:** Connect users through mutual matches and reveal external social links.
- **Main Flow:** Register -> Swipe -> Match -> Connect on Social Media.
- **Language:** Default is Spanish (`es`), with English (`en`) support.

## Tech Stack

- **Framework:** React Native 0.83.6 (Expo 55.0.20)
- **Navigation:** React Navigation (Stack + Bottom Tabs)
- **Styling:** Vanilla StyleSheet, Expo Linear Gradient
- **Internationalization:** i18next, react-i18next
- **Utilities:** Expo Image Picker, Expo Secure Store, Reanimated 4, Gesture Handler
- **Backend Communication:** Custom `ApiService` using `fetch`

## Project Structure

```text
src/
├── components/     # Reusable UI components (Loading, CustomAlert, etc.)
├── data/           # Local mock data (countries, user lists)
├── i18n/           # Localization files (en.json, es.json)
├── navigation/     # Navigation configuration (AppNavigator.js)
├── screens/        # Feature-specific screens
│   ├── Login/      # Login logic
│   ├── Register/   # Multi-step registration
│   ├── Swipe/      # Main matching interface
│   ├── Matches/    # List of mutual matches
│   └── Profile/    # User settings and profile editing
├── services/       # Business logic and API abstraction
│   ├── ApiService.js   # Base API requests (auth, headers, fetch)
│   └── MatchService.js # High-level feature logic (auth, swipes, matches)
└── theme/          # Centralized theme (colors, context)
```

## Building and Running

### Prerequisites
- Node.js & npm
- Expo CLI (`npm install -g expo-cli`)

### Commands
```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

## Development Conventions

### 1. Screen Pattern
Each screen follows a directory-based barrel export pattern:
- `src/screens/[ScreenName]/index.js`: Exports the screen component.
- `src/screens/[ScreenName]/[ScreenName]Screen.js`: Main component logic.
- `src/screens/[ScreenName]/components/`: Screen-specific sub-components.

### 2. Styling
- **Colors:** Always use `src/theme/colors.js`.
- **Patterns:** Prefer `StyleSheet.create()` for performance and clarity.
- **Aspect Ratio:** Profile photos are enforced to 1:1.

### 3. API & Services
- **Service Layer:** Do not use `fetch` directly in components. Use `MatchService` or `ApiService`.
- **Base URL:** `https://megaequipamiento.pe/match-api`
- **Auth:** Managed via `expo-secure-store` and `ApiService` header injection.

### 4. Internationalization
- Use the `useTranslation` hook from `react-i18next`.
- Add new strings to both `src/i18n/es.json` and `src/i18n/en.json`.

## Architecture Notes

- **Supabase Documentation:** Note that `technical_architecture_tinder_social.md` refers to Supabase, but the current implementation uses a custom API hosted at `megaequipamiento.pe`. The custom API should be considered the source of truth for current development.
- **Navigation Flow:**
  - Unauthenticated: `Register` / `Login` stack.
  - Authenticated: `MainTabs` (Swipe, Matches, Profile).
- **Match Mechanic:** When a match is found, the app allows opening Instagram (using `Linking`) or WhatsApp (`wa.me` links).

## TODOs & Roadmap
- [ ] Implement robust error handling in `MatchService`.
- [ ] Replace static card in `SwipeScreen` with a proper swiper library (e.g., `react-native-deck-swiper` or custom Reanimated logic).
- [ ] Ensure all mock data in `src/data/mockData.js` is transitioned to API calls.
- [ ] Implement push notifications for matches.
