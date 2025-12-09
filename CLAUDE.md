# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zarahemla is a React Native dating/matching application built with Expo. The app features a Tinder-style swipe interface, user registration with profile photos, and match management with social media integration (Instagram and WhatsApp).

## Development Commands

### Running the Application
```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run in web browser
npm run web
```

## Architecture

### Navigation Structure

The app uses a hybrid navigation pattern combining Stack and Tab navigators:

1. **Stack Navigator** (Root Level - `src/navigation/AppNavigator.js:30-38`)
   - `Register` screen (initial route)
   - `MainTabs` (post-registration)

2. **Tab Navigator** (Main App - `src/navigation/AppNavigator.js:14-28`)
   - `Swipe` - Main card swiping interface
   - `Matches` - Grid view of matched users
   - `Profile` - User settings and profile management

Navigation flow: Users start at RegisterScreen, and upon completion are navigated to MainTabs via `navigation.replace('MainTabs')`.

### Screen Organization Pattern

Each screen follows a consistent directory structure:
```
src/screens/[ScreenName]/
  ├── index.js              # Barrel export
  ├── [ScreenName]Screen.js # Main screen component
  └── components/           # Screen-specific components
      └── [ComponentName].js
```

### Theme System

Centralized color constants in `src/theme/colors.js` provide consistent styling:
- Primary brand color: `#FF4458` (red/pink)
- Uses semantic naming: `primary`, `background`, `text`, `textSecondary`, `border`, `success`, `error`
- All components import from `src/theme/colors` rather than using hardcoded values

### Data Flow & State Management

Currently uses local component state (React `useState`). No global state management library is implemented.

**Mock Data Pattern:**
- SwipeScreen: Hardcoded users array in component (`SwipeScreen.js:8-11`)
- MatchesScreen: Hardcoded matches array in component (`MatchesScreen.js:29-32`)

**Note:** Registration data is not persisted - `RegisterScreen.js:33-34` notes "In a real app, save data here" before navigating away.

### External Integrations

**Image Handling:**
- Uses `expo-image-picker` for profile photo selection
- Configured for 1:1 aspect ratio, images only
- No backend upload implemented (URIs stored in component state)

**Deep Linking:**
- Instagram: Opens profile URLs via `Linking.openURL(item.instagram)` (`MatchesScreen.js:12`)
- WhatsApp: Uses `wa.me` protocol (`MatchesScreen.js:19`)

## Key Implementation Notes

### Swipe Screen Implementation Gap
The SwipeScreen currently displays a static card. Comment at `SwipeScreen.js:15` indicates: "In a real app, use a Swiper lib here". When implementing swipe functionality, consider libraries like:
- `react-native-deck-swiper`
- `react-native-reanimated` (already included in dependencies)

### Expo Configuration
- New Architecture enabled (`app.json:9`)
- Edge-to-edge enabled on Android (`app.json:23`)
- Portrait orientation only (`app.json:6`)

### Styling Conventions
- All styles use StyleSheet.create() pattern
- Shadow/elevation patterns for cards:
  - `elevation: 2-5` for Android
  - `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius` for iOS
- Border radius: 10px (inputs), 15px (containers), 20px+ (cards)

## Dependencies

**Core:**
- React 19.1.0
- React Native 0.81.5
- Expo ~54.0.27

**Navigation:**
- @react-navigation/native
- @react-navigation/stack
- @react-navigation/bottom-tabs

**UI/Animations:**
- react-native-reanimated ~4.1.1
- react-native-gesture-handler ~2.28.0
- expo-linear-gradient

**Utilities:**
- expo-image-picker (profile photos)
- uuid (ID generation)
