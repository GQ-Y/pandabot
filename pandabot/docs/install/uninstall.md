---
summary: "Uninstall Pandabot completely (CLI, service, state, workspace)"
read_when:
  - You want to remove Pandabot from a machine
  - The gateway service is still running after uninstall
---

# Uninstall

Two paths:
- **Easy path** if `panda` is still installed.
- **Manual service removal** if the CLI is gone but the service is still running.

## Easy path (CLI still installed)

Recommended: use the built-in uninstaller:

```bash
panda uninstall
```

Non-interactive (automation / npx):

```bash
panda uninstall --all --yes --non-interactive
npx -y panda uninstall --all --yes --non-interactive
```

Manual steps (same result):

1) Stop the gateway service:

```bash
panda gateway stop
```

2) Uninstall the gateway service (launchd/systemd/schtasks):

```bash
panda gateway uninstall
```

3) Delete state + config:

```bash
rm -rf "${PANDABOT_STATE_DIR:-$HOME/.pandabot}"
```

If you set `PANDABOT_CONFIG_PATH` to a custom location outside the state dir, delete that file too.

4) Delete your workspace (optional, removes agent files):

```bash
rm -rf ~/panda
```

5) Remove the CLI install (pick the one you used):

```bash
npm rm -g pandabot
pnpm remove -g pandabot
bun remove -g pandabot
```

6) If you installed the macOS app:

```bash
rm -rf /Applications/Pandabot.app
```

Notes:
- If you used profiles (`--profile` / `PANDABOT_PROFILE`), repeat step 3 for each state dir (defaults are `~/.pandabot-<profile>`).
- In remote mode, the state dir lives on the **gateway host**, so run steps 1-4 there too.

## Manual service removal (CLI not installed)

Use this if the gateway service keeps running but `panda` is missing.

### macOS (launchd)

Default label is `bot.molt.gateway` (or `bot.molt.<profile>`; legacy `com.pandabot.*` may still exist):

```bash
launchctl bootout gui/$UID/bot.molt.gateway
rm -f ~/Library/LaunchAgents/bot.molt.gateway.plist
```

If you used a profile, replace the label and plist name with `bot.molt.<profile>`. Remove any legacy `com.pandabot.*` plists if present.

### Linux (systemd user unit)

Default unit name is `panda-gateway.service` (or `panda-gateway-<profile>.service`):

```bash
systemctl --user disable --now panda-gateway.service
rm -f ~/.config/systemd/user/panda-gateway.service
systemctl --user daemon-reload
```

### Windows (Scheduled Task)

Default task name is `Pandabot Gateway` (or `Pandabot Gateway (<profile>)`).
The task script lives under your state dir.

```powershell
schtasks /Delete /F /TN "Pandabot Gateway"
Remove-Item -Force "$env:USERPROFILE\.pandabot\gateway.cmd"
```

If you used a profile, delete the matching task name and `~\.pandabot-<profile>\gateway.cmd`.

## Normal install vs source checkout

### Normal install (install.sh / npm / pnpm / bun)

If you used `https://molt.bot/install.sh` or `install.ps1`, the CLI was installed with `npm install -g panda@latest`.
Remove it with `npm rm -g panda` (or `pnpm remove -g` / `bun remove -g` if you installed that way).

### Source checkout (git clone)

If you run from a repo checkout (`git clone` + `panda ...` / `bun run panda ...`):

1) Uninstall the gateway service **before** deleting the repo (use the easy path above or manual service removal).
2) Delete the repo directory.
3) Remove state + workspace as shown above.
