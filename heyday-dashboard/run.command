#!/bin/bash
# MK CREATIVE'S HEYDAY — 로컬 실행 스크립트 (macOS)
# 더블클릭하면 로컬 서버를 켜고 브라우저로 대시보드를 엽니다.
cd "$(dirname "$0")" || exit 1
PORT=8080
echo "▶ HEYDAY 대시보드 서버 시작 → http://localhost:$PORT"
echo "  (종료하려면 이 창에서 Ctrl + C)"
# 브라우저 자동 오픈 (서버 뜨는 시간 잠깐 대기)
( sleep 1; open "http://localhost:$PORT/index.html" ) &
# 파이썬 내장 서버로 정적 파일 서빙
python3 -m http.server "$PORT"
