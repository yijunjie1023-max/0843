#!/usr/bin/env bash
#
# =============================================================================
# 会议白板助手 — 一键启动脚本（macOS / Linux）
# =============================================================================
#
# 功能概要
#   · 自动 cd 到本项目根目录（脚本所在目录即项目根）
#   · 检测 TCP 端口占用：默认优先 3040，被占用则自动顺延到下一个空闲端口（不强行杀进程）
#   · 启动 Next.js 开发服务：浏览器中的页面为「前端」；SSR / Route Handlers / API 路由由同一
#     Node 进程提供，视为「后端」随之就绪（无需第二个命令即可全栈开发）
#   · 可选：通过环境变量再启动一条独立后端命令（例如自建 WebSocket / 其他语言服务）
#   · 前端 URL（及可选后端就绪条件）满足后，自动用系统默认浏览器打开本地地址
#
# 【使用方法】
#   1) 赋予执行权限（仅需一次）：
#        chmod +x "/Users/bytedance/Desktop/fit/会议白板助手.sh"
#   2) 在终端执行（可从任意当前目录调用，脚本会自动进入项目根目录）：
#        "/Users/bytedance/Desktop/fit/会议白板助手.sh"
#   3) 可选环境变量：
#        MEETING_WHITEBOARD_SKIP_BROWSER=1
#          只启动服务，不自动打开浏览器（自动化 / CI 用）
#        MEETING_WHITEBOARD_BACKEND_CMD='你的后端启动命令'
#          在后台启动独立后端；脚本会 export BACKEND_PORT（在 3050–3099 中选空闲端口，
#          且避开前端端口）。后端程序需读取 $BACKEND_PORT 绑定监听（若写死端口请自行改命令）
#        MEETING_WHITEBOARD_BACKEND_READY_URL='http://127.0.0.1:xxxx/health'
#          若设置则 curl 直到 HTTP 200 视为后端就绪；不设置则在启动后端后固定等待 2 秒
#
# 【停止方式】在运行本脚本的终端窗口按 Ctrl+C，子进程会一并结束。
#
# 【依赖】已安装 Node.js；在本项目根目录执行过 npm install。
# =============================================================================

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

ulimit -n 10240 2>/dev/null || true

NEXT_BIN="$ROOT/node_modules/.bin/next"
if [[ ! -x "$NEXT_BIN" ]]; then
  echo ">>> [会议白板助手] 未找到 Next CLI，请先在项目目录执行: npm install"
  exit 1
fi

port_in_use() {
  local p="$1"
  if command -v lsof >/dev/null 2>&1; then
    if lsof -iTCP:"$p" -sTCP:LISTEN -P -n >/dev/null 2>&1; then
      return 0
    fi
    if lsof -i ":${p}" -sTCP:LISTEN -P -n >/dev/null 2>&1; then
      return 0
    fi
    return 1
  elif command -v ss >/dev/null 2>&1; then
    ss -tuln 2>/dev/null | grep -q ":${p} "
    return $?
  else
    return 1
  fi
}

pick_frontend_port() {
  local candidates=(
    3040 3000 3001 3002 3003 3004 3005 3006 3007 3008 3009 3010
  )
  local p
  for p in "${candidates[@]}"; do
    if ! port_in_use "$p"; then
      echo "$p"
      return 0
    fi
  done
  local start=3011
  local end=3049
  for ((p = start; p <= end; p++)); do
    if ! port_in_use "$p"; then
      echo "$p"
      return 0
    fi
  done
  echo ">>> [会议白板助手] 错误: 在常用范围内未找到可用前端端口，请手动释放端口后重试。" >&2
  return 1
}

pick_backend_port() {
  local avoid="$1"
  local p
  for ((p = 3050; p <= 3099; p++)); do
    if [[ "$p" == "$avoid" ]]; then
      continue
    fi
    if ! port_in_use "$p"; then
      echo "$p"
      return 0
    fi
  done
  echo ">>> [会议白板助手] 错误: 3050–3099 内无可用后端端口（或未设置 BACKEND_CMD）。" >&2
  return 1
}

LISTEN_PORT="$(pick_frontend_port)"
export PORT="$LISTEN_PORT"
BASE_URL="http://127.0.0.1:${LISTEN_PORT}"

BACKEND_PID=""
BACKEND_PORT=""
if [[ -n "${MEETING_WHITEBOARD_BACKEND_CMD:-}" ]]; then
  BACKEND_PORT="$(pick_backend_port "$LISTEN_PORT")"
  export BACKEND_PORT
fi

echo ""
echo ">>> [会议白板助手] 开发环境"
echo ">>> 前端（Next.js）监听: ${LISTEN_PORT} （3040 被占用时会自动顺延）"
echo ">>> 本地访问: ${BASE_URL}"
if [[ -n "${MEETING_WHITEBOARD_BACKEND_CMD:-}" ]]; then
  echo ">>> 附加后端: 已配置 MEETING_WHITEBOARD_BACKEND_CMD"
  echo ">>> BACKEND_PORT=${BACKEND_PORT}"
fi
echo ""

cleanup() {
  if [[ -n "${NEXT_PID:-}" ]] && kill -0 "$NEXT_PID" 2>/dev/null; then
    kill "$NEXT_PID" 2>/dev/null || true
  fi
  if [[ -n "${BACKEND_PID:-}" ]] && kill -0 "${BACKEND_PID}" 2>/dev/null; then
    kill "${BACKEND_PID}" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

if [[ -n "${MEETING_WHITEBOARD_BACKEND_CMD:-}" ]]; then
  echo ">>> 正在启动独立后端…"
  (
    cd "$ROOT"
    exec bash -c "${MEETING_WHITEBOARD_BACKEND_CMD}"
  ) &
  BACKEND_PID=$!
fi

"$NEXT_BIN" dev -p "$LISTEN_PORT" -H 0.0.0.0 &
NEXT_PID=$!

wait_for_http() {
  local url="$1"
  local deadline=$((SECONDS + 120))
  local code=""
  if ! command -v curl >/dev/null 2>&1; then
    echo ">>> [会议白板助手] 未安装 curl，改为固定等待 10 秒后继续…"
    sleep 10
    return 0
  fi
  while ((SECONDS < deadline)); do
    code="$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 1 "$url" 2>/dev/null || true)"
    if [[ "$code" == "200" ]] || [[ "$code" == "304" ]]; then
      return 0
    fi
    sleep 0.4
  done
  echo ">>> [会议白板助手] 警告: 120 秒内未检测到 ${url} 返回 200/304，仍将尝试打开浏览器。"
}

wait_backend_ready() {
  if [[ -z "${MEETING_WHITEBOARD_BACKEND_CMD:-}" ]]; then
    return 0
  fi
  if [[ -n "${MEETING_WHITEBOARD_BACKEND_READY_URL:-}" ]]; then
    echo ">>> 等待后端就绪: ${MEETING_WHITEBOARD_BACKEND_READY_URL}"
    wait_for_http "${MEETING_WHITEBOARD_BACKEND_READY_URL}"
    return 0
  fi
  echo ">>> 独立后端已启动，等待 2 秒（可设置 MEETING_WHITEBOARD_BACKEND_READY_URL 精确等待）"
  sleep 2
}

wait_for_http "${BASE_URL}/"
wait_backend_ready

open_url() {
  local url="$1"
  case "$(uname -s)" in
    Darwin) open "$url" ;;
    Linux)
      if command -v xdg-open >/dev/null 2>&1; then
        xdg-open "$url" >/dev/null 2>&1 || true
      elif command -v sensible-browser >/dev/null 2>&1; then
        sensible-browser "$url" >/dev/null 2>&1 || true
      else
        echo ">>> 请手动在浏览器打开: $url"
      fi
      ;;
    *) echo ">>> 请手动在浏览器打开: $url" ;;
  esac
}

if [[ -z "${MEETING_WHITEBOARD_SKIP_BROWSER:-}" ]]; then
  echo ">>> 正在打开默认浏览器…"
  open_url "${BASE_URL}/"
fi

wait "$NEXT_PID" || true
