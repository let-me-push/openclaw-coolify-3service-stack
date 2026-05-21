# OpenClaw Coolify 3-Service Stack

Minimal stack with exactly **3 services**:

1. OpenClaw (`ghcr.io/openclaw/openclaw:latest`)
2. Browser (`browserless/chrome`)
3. code-server (`lscr.io/linuxserver/code-server`)

## Goals covered

- No one-click config drift: stable file-based mount `config/openclaw.json`
- Browser works out of the box via `browser.profiles.browserless.cdpUrl`
- Main/admin power enabled (including elevated mode for web + Telegram admin)
- code-server only mounts this project folder (no docker socket mount)

## Quick start

```bash
cp .env.example .env
# fill required vars: OPENCLAW_GATEWAY_TOKEN, BROWSER_TOKEN, CODE_SERVER_PASSWORD, TELEGRAM_BOT_TOKEN, TELEGRAM_ADMIN_ID
docker compose up -d
```

## Coolify deploy

1. Create a new **Docker Compose** resource.
2. Connect this repo.
3. Add env vars from `.env.example`.
4. Expose `18789` (OpenClaw) and `8443` (code-server) as desired.
5. Deploy.

## Verify

```bash
curl -fsS http://<host>:18789/healthz
```

Then in OpenClaw terminal:

```bash
openclaw browser status
```

Expected: browser profile `browserless` reachable.

## Security notes

- `tools.elevated` is intentionally enabled for admin automation. Restrict `TELEGRAM_ADMIN_ID` to one trusted user.
- Rotate all secrets before handing to customers.
- For stricter web UI origin control, set `OPENCLAW_CONTROL_UI_ORIGIN` to exact production URL.
