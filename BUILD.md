# Cryptera — Build outputs

## Web (browser)
```bash
npm run build
npm run preview
```
- Output: `dist/`
- Also works as a PWA (`manifest.webmanifest`)

## Windows desktop
```bash
npm run electron:build
```
- Installer: `release/Cryptera Setup 1.0.0.exe`
- Portable: `release/Cryptera 1.0.0.exe`
- Unpacked: `release/win-unpacked/Cryptera.exe`

## Mobile (Capacitor)
Android project is in `android/` (synced with `dist/`).

```bash
npm run build
npx cap sync android
npx cap open android
```

Then in **Android Studio**: Build → Build APK(s).

Requires:
- JDK 17+ (`JAVA_HOME` set)
- Android Studio / Android SDK

iOS (`npx cap add ios`) needs a Mac + Xcode.

## Dev
```bash
npm run electron:dev   # desktop
npm run dev            # browser
```
