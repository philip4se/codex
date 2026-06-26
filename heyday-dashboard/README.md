# MK CREATIVE'S HEYDAY — 대시보드 재현 프로젝트

빌더 조쉬 × 김미경 인터뷰 영상에 나온 **MK CREATIVE'S HEYDAY** 대시보드를
기능·디자인까지 동일하게 재현하는 프로젝트입니다.

## 폴더 구조
```
heyday-dashboard/
├─ index.html      # 메인 대시보드 화면 (완료)
├─ pages/          # 나머지 화면들 (작업 예정)
│   ├─ wbs.html        # 간트차트
│   ├─ tasks.html      # Our Tasks
│   ├─ meetings.html   # 회의록
│   └─ revenue.html    # 매출
├─ ANALYSIS.md     # 원본 화면 5종 정밀 분석 문서
└─ README.md
```

## 실행 방법
별도 설치·인터넷 불필요. 파일을 더블클릭하면 브라우저에서 바로 열립니다.
(모든 스타일이 파일 안에 인라인되어 있는 단일 HTML)

## 로컬에서 계속 업데이트하는 법
이 저장소는 클라우드에서 작업 후 GitHub로 푸시됩니다.
당신 PC에서는 아래로 받아서 쓰세요.

```bash
# 처음 한 번만
git clone https://github.com/philip4se/codex.git
cd codex
git checkout claude/dashboard-video-analysis-fre73m

# 이후 업데이트를 받을 때마다
git pull
```

`heyday-dashboard/` 폴더 안의 파일들을 브라우저로 열면 됩니다.

## 진행 현황
- [x] 원본 5개 화면 분석 (ANALYSIS.md)
- [x] 메인 대시보드 (index.html)
- [ ] WBS / Our Tasks / 회의록 / 매출 화면
- [ ] Next.js + Tailwind + shadcn/ui 정식 전환

## 디자인 토큰
- Primary 퍼플: `#7c5cff` / 옅은 틴트 `#f1eefe`
- 배경: `#f6f6f8` · 카드: `#ffffff`
- 위험: `#ef4444` · 보조차트: 틸 `#10b981`, 앰버 `#f59e0b`, 블루 `#3b82f6`
- 시그니처: 큰 제목 + 퍼플 마침표(`.`)
- 폰트: Pretendard 우선, 시스템 폰트 폴백
