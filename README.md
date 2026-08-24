# Cryptera

Self-custody crypto wallet — **blue dark UI**, Electron + Web + Capacitor Android.

## Quick start

```bash
npm install
npm run electron:dev    # Windows desktop
npm run dev             # Browser
```

## Builds

| Platform | Command | Output |
|----------|---------|--------|
| **Web** | `npm run build:web` | `dist/` |
| **Windows** | `npm run build:win` | `release/Cryptera Setup 1.0.0.exe`, `release/Cryptera 1.0.0.exe` |
| **Mobile** | `npm run build:mobile` then Android Studio | `android/` project |

See [BUILD.md](./BUILD.md) for details.

## Features

- Splash poster (full image + progress + Skip)
- Create / import wallet, send / receive, networks, tokens
- About us → full-screen poster modal
- Bottom nav, Help, Settings
