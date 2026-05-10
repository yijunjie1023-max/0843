#!/usr/bin/env bash
# 强制：释放常见 Next 端口 → 清空缓存 → 固定 PORT=3040 + 监听 0.0.0.0（避免连错端口 / connection refused）
set -eu
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# macOS 默认 fd 上限偏低时，Watchpack 会 EMFILE，导致 .next 半成品 → ChunkLoadError / Cannot find module './*.js'
if ulimit -n 10240 2>/dev/null; then
  :
else
  echo ">>> 提示: ulimit -n 失败，若仍见 EMFILE，请在终端执行: ulimit -n 10240 后再 npm run dev:clean"
fi

NEXT_BIN="$ROOT/node_modules/.bin/next"
if [[ ! -x "$NEXT_BIN" ]]; then
  echo "未找到 $NEXT_BIN ，请先在本目录执行: npm install"
  exit 1
fi

PORTS="3000 3001 3002 3003 3004 3040"
for p in $PORTS; do
  if command -v lsof >/dev/null 2>&1; then
    PIDS="$(lsof -tiTCP:"$p" -sTCP:LISTEN 2>/dev/null || true)"
    if [[ -n "${PIDS}" ]]; then
      kill -9 ${PIDS} 2>/dev/null || true
    fi
  fi
done

rm -rf .next node_modules/.cache

export PORT=3040
echo ""
echo ">>> 开发服固定端口 3040（请勿再打开 3000）"
echo ">>> 浏览器访问:  http://localhost:3040"
echo ">>> 或:          http://127.0.0.1:3040"
echo ""

exec "$NEXT_BIN" dev -p 3040 -H 0.0.0.0
