# Compilacion de APK Release para Zarahemla

Este proyecto es una app Expo. Para produccion no debe usarse `expo start`, `expo run:android` ni una APK de development client. La build final debe incluir el bundle JavaScript dentro del APK.

## Opcion recomendada: EAS Build

1. Instala dependencias si hace falta:
```powershell
npm install
```

2. Inicia sesion en Expo/EAS:
```powershell
npx eas-cli@latest login
```

3. Compila el APK de produccion:
```powershell
npm run build:android:production
```

El perfil `production` en `eas.json` usa `developmentClient: false`, `NODE_ENV=production` y genera un APK con el bundle embebido.

## Opcion local: EAS Local Build

Usa esta opcion si quieres compilar en tu PC con Android SDK y JDK instalados.

1. Configura Java y Android SDK en PowerShell:
```powershell
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME="$env:LOCALAPPDATA\Android\Sdk"
```

2. Ejecuta la build local de produccion:
```powershell
npm run build:android:local
```

## Si usas prebuild + Gradle manualmente

Solo usa este flujo si realmente necesitas generar la carpeta `android/`.

1. Genera el proyecto nativo limpio:
```powershell
npx expo prebuild --platform android --clean
```

2. Crea `android/local.properties` si Gradle no encuentra el SDK:
```properties
sdk.dir=C:\\Users\\TU_USUARIO\\AppData\\Local\\Android\\Sdk
```

3. Compila release desde `android/`:
```powershell
cd android
.\gradlew assembleRelease
```

El APK quedara en:
```text
android/app/build/outputs/apk/release/app-release.apk
```

## Verificacion

1. Cierra Metro si esta abierto.
2. Instala el APK en un dispositivo o emulador.
3. Abre la app sin ejecutar `npm start`.
4. Si la app abre, el bundle esta embebido correctamente.

Para revisar el contenido del APK:
```powershell
tar -tf android/app/build/outputs/apk/release/app-release.apk | findstr index.android.bundle
```

## Causas comunes del error "Unable to load script in production mode"

- Se instalo una build de desarrollo creada con `expo run:android` o un development client.
- Se ejecuto `assembleDebug` en vez de `assembleRelease`.
- Se compilo con configuracion dev y la app intenta conectarse a Metro en `localhost:8081`.
- Se genero `android/` una vez y quedo desactualizado; en ese caso usa `npx expo prebuild --platform android --clean` antes de recompilar.
