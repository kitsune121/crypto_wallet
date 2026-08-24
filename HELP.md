# Cryptera — Help list

## What Cryptera is
- Self-custody **crypto wallet** (you hold the keys)
- Not a bank, broker, or payment app

## Getting started
1. **Create a wallet** — password + back up 12-word Secret Recovery Phrase
2. **Import a wallet** — paste an existing Secret Recovery Phrase
3. **Unlock** — password on this device only (cannot be recovered by Cryptera)

## Everyday use
| Action | How |
|--------|-----|
| Switch account | Tap account chip → select / add account |
| Switch network | Tap network chip |
| Send | Home → Send |
| Receive | Home → Receive (QR + address) |
| Import token | Settings → Import tokens (or Tokens tab) |
| Lock | Menu → Lock Cryptera |

## Safety
- Never share your Secret Recovery Phrase or private key
- Match the network when sending/receiving
- Use testnets to practice
- Buy / Swap are placeholders (no bank or card)

## What it does **not** do
- Connect to banks or brokers
- Auto-link MetaMask or other wallet apps
- Hide wallet activity behind a fake broker UI

## Open the app
```bash
npm run electron:dev
```
Or browser: `npm run dev` → http://127.0.0.1:5173

In the app: **Menu → Help** or **Settings → Help**
