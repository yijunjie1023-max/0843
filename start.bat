@echo off
setlocal EnableExtensions
REM =============================================================================
REM 游戏化运动激励工具 — Windows 一键部署（生产构建 + 本机/局域网访问）
REM =============================================================================
REM
REM 【使用方法】
REM   1. 安装 Node.js LTS：https://nodejs.org/
REM   2. 双击本文件，或在「命令提示符」中执行：
REM        cd /d "本文件所在文件夹"
REM        start.bat
REM   3. 脚本会自动 cd 到项目根目录（与 start.bat 同级）。
REM   4. 首次运行会执行 npm install（如需）、npm run build，可能需要几分钟。
REM   5. 启动成功后：
REM        · 本机浏览器打开：http://127.0.0.1:3040/
REM        · 同一 WiFi/局域网内他人打开：http://你的电脑局域网IP:3040/
REM      （若 Windows 防火墙弹出提示，请允许 Node.js 专用网络访问。）
REM   6. 需要公网任意地点访问时，请使用 Vercel / 云服务器等托管方式（本脚本仅适合局域网演示）。
REM
REM 【端口占用】默认 3040（环境变量 PORT）；若被占用，请修改下方 set PORT=，或结束占用进程后重试。
REM
REM =============================================================================

chcp 65001 >nul 2>&1
cd /d "%~dp0"

set "PORT=3040"

echo.
echo === 游戏化运动激励工具 — 正在准备生产环境 ===
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [错误] 未检测到 Node.js，请先安装：https://nodejs.org/
  goto :fail
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [错误] 未检测到 npm。
  goto :fail
)

if not exist "node_modules\next\package.json" (
  echo [提示] 正在安装依赖 npm install ...
  call npm install
  if errorlevel 1 goto :fail
)

echo [提示] 正在执行生产构建 npm run build ...
call npm run build
if errorlevel 1 goto :fail

echo.
echo === 构建完成，即将启动服务（监听 0.0.0.0:%PORT%，局域网可访问）===
echo === 本机访问： http://127.0.0.1:%PORT%/ ================================
echo === 局域网示例（按你机器实际 IP 为准）： =================================

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$port=$env:PORT; Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '127.*' } | ForEach-Object { Write-Host ('    http://{0}:{1}/' -f $_.IPAddress, $port) }" 2>nul

if errorlevel 1 (
  echo    （未能自动列出 IP，请在 cmd 中执行 ipconfig 查看「IPv4 地址」）
  echo    然后让其他人访问  http://你的IPv4:%PORT%/
)

echo.
echo === 按 Ctrl+C 可停止服务 ==================================================
echo.

call npm run start:lan
set "EXITCODE=%ERRORLEVEL%"
if not "%EXITCODE%"=="0" (
  echo.
  echo [错误] 服务异常退出，代码 %EXITCODE%。若提示端口占用，请修改文件开头的 PORT 或关闭占用进程。
)
goto :eof

:fail
echo.
pause
exit /b 1
