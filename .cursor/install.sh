#!/usr/bin/env bash
# Idempotent repository bootstrap for the NailPro Cloud Agent environment.
# Installs system prerequisites (Docker + Supabase CLI), Node dependencies, and
# primes the Supabase service images so the first `start` is fast and offline-safe.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# --- System prerequisites: Docker engine + Supabase CLI --------------------
if ! command -v docker >/dev/null 2>&1; then
  sudo apt-get update -qq
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq \
    docker.io fuse3 fuse-overlayfs uidmap iptables
  # fuse3 ships an interactive conffile prompt; force the packaged default.
  sudo DEBIAN_FRONTEND=noninteractive dpkg --configure --force-confold \
    fuse3 fuse-overlayfs || true
fi

if ! command -v supabase >/dev/null 2>&1; then
  ARCH="$(dpkg --print-architecture)"
  DEB_URL="$(curl -fsSL https://api.github.com/repos/supabase/cli/releases/latest \
    | grep -oE "https://[^\"]*supabase_[0-9.]+_linux_${ARCH}\.deb" | head -1)"
  curl -fsSL -o /tmp/supabase.deb "$DEB_URL"
  sudo dpkg -i /tmp/supabase.deb
fi

# Docker engine config tuned for the nested Cloud Agent VM.
sudo mkdir -p /etc/docker
printf '{\n  "storage-driver": "fuse-overlayfs",\n  "iptables": true\n}\n' \
  | sudo tee /etc/docker/daemon.json >/dev/null

# Use legacy iptables: the nftables backend does not wire up nested-bridge
# container-to-container traffic reliably in this VM.
sudo update-alternatives --set iptables /usr/sbin/iptables-legacy || true
sudo update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy || true

# --- Node dependencies ------------------------------------------------------
npm ci

# --- Prime Supabase service images -----------------------------------------
# Bring the stack up once so the (large) service images are pulled and cached
# on disk, then stop it. `start` recreates the stack cleanly on every boot.
bash .cursor/start.sh
supabase stop --no-backup >/dev/null 2>&1 || true

echo "install.sh complete."
