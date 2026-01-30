#!/usr/bin/env bash
set -euo pipefail

cd /repo

export PANDABOT_STATE_DIR="/tmp/panda-test"
export PANDABOT_CONFIG_PATH="${PANDABOT_STATE_DIR}/panda.json"

echo "==> Seed state"
mkdir -p "${PANDABOT_STATE_DIR}/credentials"
mkdir -p "${PANDABOT_STATE_DIR}/agents/main/sessions"
echo '{}' >"${PANDABOT_CONFIG_PATH}"
echo 'creds' >"${PANDABOT_STATE_DIR}/credentials/marker.txt"
echo 'session' >"${PANDABOT_STATE_DIR}/agents/main/sessions/sessions.json"

echo "==> Reset (config+creds+sessions)"
pnpm panda reset --scope config+creds+sessions --yes --non-interactive

test ! -f "${PANDABOT_CONFIG_PATH}"
test ! -d "${PANDABOT_STATE_DIR}/credentials"
test ! -d "${PANDABOT_STATE_DIR}/agents/main/sessions"

echo "==> Recreate minimal config"
mkdir -p "${PANDABOT_STATE_DIR}/credentials"
echo '{}' >"${PANDABOT_CONFIG_PATH}"

echo "==> Uninstall (state only)"
pnpm panda uninstall --state --yes --non-interactive

test ! -d "${PANDABOT_STATE_DIR}"

echo "OK"
