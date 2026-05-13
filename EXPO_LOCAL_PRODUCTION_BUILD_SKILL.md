---
name: expo-local-production-build
description: Compile Expo React Native Android production APKs locally on Windows without using EAS cloud, including troubleshooting Metro/runtime bundle errors.
version: 1.0.0
license: MIT
---

# Expo Local Production Build

Use this skill when the user wants to compile an Expo React Native Android app for production on their own Windows PC, without using Expo's cloud build service.

The goal is a release APK/AAB that embeds the JavaScript bundle and does not require Metro Bundler at runtime.

## When To Use

- The user asks to build an APK or AAB locally.
- The user says they do not want to use EAS cloud.
- The user gets `Unable to load script in production mode`.
- The release app tries to connect to `localhost:8081` or a Metro dev server.
- The user has errors involving Java, Android SDK, Gradle, `local.properties`, or missing bundles.

## Core Rule

Production runtime must not use Metro.

Metro can run during compilation because React Native uses it to create the bundle. That is normal. After installation, the release APK must load the embedded file:

```text
assets/index.android.bundle
```

If the installed app needs `npm start`, Metro, `localhost:8081`, or a LAN dev IP, it is not a valid production release build.

## Initial Diagnosis

Check whether the project already has native Android files:

```powershell
Test-Path -LiteralPath "android"
```

Check the required project files:

```powershell
Test-Path -LiteralPath "package.json"
Test-Path -LiteralPath "app.json"
Test-Path -LiteralPath "google-services.json"
```

Check Java and Android SDK:

```powershell
java -version
$env:ANDROID_HOME
Test-Path -LiteralPath "$env:LOCALAPPDATA\Android\Sdk"
```

If `java` is not recognized but Android Studio is installed, use Android Studio's bundled JBR for the current PowerShell session:

```powershell
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME="$env:LOCALAPPDATA\Android\Sdk"
$env:Path="$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:Path"
java -version
```

## Recommended Local Production Flow

Run from the project root.

1. Install dependencies:

```powershell
npm install
```

2. Configure Java and Android SDK for this terminal:

```powershell
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME="$env:LOCALAPPDATA\Android\Sdk"
$env:Path="$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:Path"
```

3. Generate a clean native Android project:

```powershell
npx expo prebuild --platform android --clean --npm
```

4. If Gradle cannot find the SDK, create `android/local.properties`:

```properties
sdk.dir=C:\\Users\\YOUR_USER\\AppData\\Local\\Android\\Sdk
```

5. Compile the release APK locally:

```powershell
cd android
.\gradlew.bat assembleRelease
```

6. The APK should be generated at:

```text
android/app/build/outputs/apk/release/app-release.apk
```

For Google Play, build an AAB instead:

```powershell
cd android
.\gradlew.bat bundleRelease
```

The AAB should be generated at:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

## Verification

Confirm the APK exists:

```powershell
Test-Path -LiteralPath "android\app\build\outputs\apk\release\app-release.apk"
```

Confirm the APK includes the embedded JavaScript bundle:

```powershell
tar -tf "android\app\build\outputs\apk\release\app-release.apk" | findstr "index.android.bundle"
```

Expected output:

```text
assets/index.android.bundle
```

Runtime verification:

1. Close Metro if it is running.
2. Install the APK on a physical device or emulator.
3. Open the app without running `npm start`.
4. The app should open normally without connecting to `localhost:8081`.

## Important Build Types

Do not confuse these commands:

```powershell
npm start
npm run android
npx expo run:android
```

Those are development commands and can depend on Metro.

Use this for a local production APK:

```powershell
cd android
.\gradlew.bat assembleRelease
```

Use this for a local production AAB:

```powershell
cd android
.\gradlew.bat bundleRelease
```

## Troubleshooting

### Unable To Load Script In Production Mode

Symptom:

```text
Unable to load script in production mode.
The app is attempting to load the JavaScript bundle from Metro Bundler instead of the embedded bundle.
```

Most likely causes:

- The installed app is a debug build.
- The installed app was created with `expo run:android`.
- The app is a development client.
- `assembleDebug` was used instead of `assembleRelease`.
- The release APK was not rebuilt after changing native configuration.
- The APK being installed is not the APK from `android/app/build/outputs/apk/release/`.

Fix:

```powershell
npx expo prebuild --platform android --clean --npm
cd android
.\gradlew.bat assembleRelease
```

Then verify:

```powershell
tar -tf "app\build\outputs\apk\release\app-release.apk" | findstr "index.android.bundle"
```

### Metro Starts During Build

This is normal during compilation. Gradle runs a task similar to:

```text
:app:createBundleReleaseJsAndAssets
Starting Metro Bundler
Writing bundle output to: android\app\build\generated\assets\react\release\index.android.bundle
```

That does not mean the installed app will use Metro. It means Metro was used to produce the embedded production bundle.

### `java` Is Not Recognized

Use Android Studio's bundled Java for the terminal session:

```powershell
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
$env:Path="$env:JAVA_HOME\bin;$env:Path"
java -version
```

If Android Studio is not installed, install JDK 17 or use the JBR bundled with Android Studio.

### SDK Location Not Found

Set `ANDROID_HOME`:

```powershell
$env:ANDROID_HOME="$env:LOCALAPPDATA\Android\Sdk"
```

Or create `android/local.properties`:

```properties
sdk.dir=C:\\Users\\YOUR_USER\\AppData\\Local\\Android\\Sdk
```

### Gradle Build Times Out Or Looks Stuck

Native modules such as Reanimated, Worklets, Gesture Handler, and Expo Modules can take a long time to compile the first time.

Re-run with more detail:

```powershell
cd android
.\gradlew.bat assembleRelease --stacktrace
```

If it failed close to a native CMake task, rerun once. The second run often continues from cached tasks.

### Warnings About Hard Links Failed

Example:

```text
C/C++: Hard link from ... failed. Doing a slower copy instead.
```

This is usually not fatal on Windows. Continue unless Gradle ends with `BUILD FAILED`.

### Warnings About Deprecated APIs Or Kotlin

Warnings from dependencies are common and usually not fatal. Continue unless the build ends with `BUILD FAILED`.

### Missing `google-services.json`

If the app uses Firebase or React Native Firebase, ensure `google-services.json` exists at the root and is referenced by `app.json`:

```json
{
  "expo": {
    "android": {
      "googleServicesFile": "./google-services.json"
    }
  }
}
```

### Package Name Case Problems

Android package names should be lowercase. Prefer:

```json
"package": "com.example.myapp"
```

Avoid uppercase package segments such as:

```json
"package": "com.example.MyApp"
```

### Need A Fresh Native Project

If native files were generated with old settings, regenerate them:

```powershell
npx expo prebuild --platform android --clean --npm
```

This deletes and recreates `android/`. Do not run it if the project has manual native changes unless those changes are backed up or intentionally reproducible.

## Optional Project Scripts

Add scripts to `package.json` for convenience:

```json
{
  "scripts": {
    "prebuild:android:clean": "expo prebuild --platform android --clean --npm",
    "build:android:release": "cd android && gradlew.bat assembleRelease",
    "build:android:bundle": "cd android && gradlew.bat bundleRelease"
  }
}
```

On PowerShell, running Gradle directly from `android/` is often clearer:

```powershell
cd android
.\gradlew.bat assembleRelease
```

## Success Criteria

A local production Android build is successful only when all are true:

- Gradle ends with `BUILD SUCCESSFUL`.
- The APK exists at `android/app/build/outputs/apk/release/app-release.apk`.
- The APK contains `assets/index.android.bundle`.
- The APK opens while Metro is closed.
- The app does not try to connect to `localhost:8081` or a dev server IP.
