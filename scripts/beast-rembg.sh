#!/usr/bin/env bash
# 依赖: pip install rembg
# 从 public/beasts/raw/*.png 生成透明底到 public/beasts/*.png
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/public/beasts"
for id in leon mercury atlas luna pyro volt; do
  rembg i "raw/${id}.png" "${id}.png"
  echo "ok ${id}"
done
