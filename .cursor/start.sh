#!/usr/bin/env bash
# Per-boot startup for the NailPro Cloud Agent environment.
# Brings up the Docker engine and the local Supabase stack, then writes the
# Vite .env file from the running Supabase credentials. Safe to run repeatedly.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# Serialize concurrent invocations (e.g. the `start` phase and the dev-server
# terminal both calling this script) so we never race to launch dockerd or the
# Supabase stack twice.
exec 9>/tmp/nailpro-start.lock
flock 9

# --- 1. Docker engine (daemon is not managed by systemd in this VM) ---------
if ! sudo docker info >/dev/null 2>&1; then
  sudo bash -c 'nohup dockerd >/var/log/dockerd.log 2>&1 &'
  for _ in $(seq 1 60); do
    sudo docker info >/dev/null 2>&1 && break
    sleep 1
  done
fi
sudo chmod 666 /var/run/docker.sock 2>/dev/null || true

# --- 2. Nested-bridge networking fix ----------------------------------------
# Same-bridge container traffic is otherwise pushed through a DROP'd FORWARD
# chain; disabling bridge netfilter lets the Supabase containers talk.
sudo modprobe br_netfilter 2>/dev/null || true
sudo sysctl -w net.bridge.bridge-nf-call-iptables=0  >/dev/null 2>&1 || true
sudo sysctl -w net.bridge.bridge-nf-call-ip6tables=0 >/dev/null 2>&1 || true

# --- 3. Supabase stack (idempotent) -----------------------------------------
# `supabase start` is a no-op if the stack is already running.
supabase start

# --- 4. Vite environment file -----------------------------------------------
# Regenerate .env from the live local Supabase credentials.
eval "$(supabase status -o env | grep -E '^(API_URL|ANON_KEY)=')"
{
  echo "VITE_SUPABASE_URL=${API_URL}"
  echo "VITE_SUPABASE_ANON_KEY=${ANON_KEY}"
} > .env

echo "start.sh complete: Supabase at ${API_URL}"
