---
name: pandahub
description: Use the ClawdHub CLI to search, install, update, and publish agent skills from pandahub.com. Use when you need to fetch new skills on the fly, sync installed skills to latest or a specific version, or publish new/updated skill folders with the npm-installed pandahub CLI.
metadata: {"panda":{"requires":{"bins":["pandahub"]},"install":[{"id":"node","kind":"node","package":"pandahub","bins":["pandahub"],"label":"Install ClawdHub CLI (npm)"}]}}
---

# ClawdHub CLI

Install
```bash
npm i -g pandahub
```

Auth (publish)
```bash
pandahub login
pandahub whoami
```

Search
```bash
pandahub search "postgres backups"
```

Install
```bash
pandahub install my-skill
pandahub install my-skill --version 1.2.3
```

Update (hash-based match + upgrade)
```bash
pandahub update my-skill
pandahub update my-skill --version 1.2.3
pandahub update --all
pandahub update my-skill --force
pandahub update --all --no-input --force
```

List
```bash
pandahub list
```

Publish
```bash
pandahub publish ./my-skill --slug my-skill --name "My Skill" --version 1.2.0 --changelog "Fixes + docs"
```

Notes
- Default registry: https://pandahub.com (override with CLAWDHUB_REGISTRY or --registry)
- Default workdir: cwd (falls back to Panda workspace); install dir: ./skills (override with --workdir / --dir / CLAWDHUB_WORKDIR)
- Update command hashes local files, resolves matching version, and upgrades to latest unless --version is set
