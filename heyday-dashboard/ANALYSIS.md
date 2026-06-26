# MK CREATIVE'S HEYDAY — 원본 화면 정밀 분석

원본: 빌더 조쉬(김승권) × 김미경 인터뷰 영상의 36분 지점 대시보드 시연.
김미경(MK Creative/MKYU) 팀을 위한 올인원 프로젝트·업무·매출 운영 대시보드.

## 정보 구조 (사이드바)
- 로고: `MK CREATIVE'S`(퍼플) + `HEYDAY`(블랙)
- 검색(⌘K)
- WORKSPACE: 대시보드 / WBS / Our Tasks / 회의록 / 매출
- 구분선 아래: 이용가이드
- 하단: 미경(ADMIN) · 로그아웃
- 활성 메뉴 = 연한 퍼플 배경 + 좌측 퍼플 세로 막대 + 퍼플 텍스트

## 화면별 기능

### ① 대시보드 (메인)
- TEAM MODE 배너 (주차 + 포커스 문구, 좌측 퍼플 accent)
- KPI 4종: ACTIVE PROJECTS 7 / OPEN TASKS 31 / OVERDUE 3(빨강) / MTD REVENUE
- 포트폴리오 테이블
  - 상태 탭: 전체10 / 활성5 / 지연2 / 보류2 / 완료1
  - 카테고리: 전체5 / 강의상품1 / 커뮤니티1 / 도서및굿즈0 / 플랫폼운영0 / 이벤트1 / 기타2
  - 컬럼: PROJECT · STATUS · PROGRESS · OWNER · DUE · TASKS · NEXT UP
- WBS 미니 간트 (2026.05.25 → 2026.07.01, 오늘 마커)

### ② WBS (간트차트)
- 프로젝트별 그룹 간트 (접기/드래그 핸들/그룹 카운트)
- 그룹: 김미경의 원픽(4) / MKTV 채널 운영(6) / MKYU 5월 신규 강좌 런칭(6) /
  김미경 북클럽 시즌3(4) / 5월 멤버십 라이브 특강 / MKTV 쇼츠 프로젝트 / 외부 채널 컬래버
- 카테고리별 색상 바, 세로 "오늘" 라인

### ③ Our Tasks
- 이번주 팀 흐름: 세그먼트 진행 바 + 범례(운영/기획/라이브/마케팅/회의/판매/강의), OPEN 24
- My Task: 오늘 / 이번주 2칼럼 (빈 상태 문구 포함)
- Member's Task: 팀원별 동일 2칼럼 (체크박스 + 제목 + 프로젝트·날짜 + 태그)

### ④ 회의록 (MEETINGS)
- 헤더 + 누적 통계(건/결정/액션) + "+ 새 회의록"
- THIS WEEK / THIS WEEK ACTIONS 카운트 카드
- 검색 + 프로젝트/작성자 필터
- 월 → 주차 계층 그룹
- 회의 카드: 날짜·제목·태그·요약 + DECISIONS / ACTIONS 박스 + SOURCE↗

### ⑤ 매출 (REVENUE)
- 상단 탭: KPI / 일간 / 주간 / 코호트 / 거래
- YTD 카드 (퍼플 틴트)
- 매출 흐름 바차트 (기간 토글: 일간~연간, 점선 목표선)
- 월별 프로젝트 매출(스택바) + 프로젝트 비중(도넛)
- 범례: 5월 신규강좌(퍼플)·북클럽S3(틸)·20분과외(앰버)·라이브특강(블루)·원픽(레드)

## 디자인 시스템
| 역할 | 값(근사치) |
|------|-----------|
| Primary 퍼플 | #7c5cff ~ #7c3aed |
| 퍼플 틴트 | #f1eefe / #ede9fe |
| 배경 | #f6f6f8 |
| 카드 | #ffffff + 옅은 보더/그림자 |
| 헤딩 텍스트 | #15161a |
| 보조 텍스트 | #8a8f98 |
| 위험(Overdue) | #ef4444 |
| 차트 보조 | 틸 #10b981 · 앰버 #f59e0b · 블루 #3b82f6 · 레드 #ef4444 |

- 시그니처: 큰 제목 + 퍼플 마침표(`.`) — REVENUE. MEETINGS. 포트폴리오. WBS.
- 섹션 라벨: 작은 대문자 + 넓은 자간
- 컴포넌트: pill 태그, stat 카드, segmented toggle, 얇은 progress bar,
  이니셜 아바타, 데이터 테이블, 간트, 바/스택/도넛 차트
- 둥근 모서리(8~16px), 넉넉한 여백, 미니멀·고대비 SaaS UI

## 데이터 모델 (추론)
```
Workspace → Members(role: ADMIN/MEMBER)
Project (name, category, status, progress%, owner, due, nextUp)
  └─ Task (title, category, assignee, dateRange, status, tags) → WBS 간트
Meeting (date, title, project[], summary, decisions[], actions[], source)
Revenue (period, byProject[], target, YTD, MTD)
```
회의록의 결정/액션 → Task → WBS → 포트폴리오 진행률 → 대시보드 KPI로
데이터가 한 줄로 연결되는 것이 이 제품의 핵심 설계 사상.

## 권장 기술 스택 (정식 전환 시)
Next.js(App Router)+TS / Tailwind+shadcn/ui / Pretendard / Recharts /
간트는 커스텀 또는 frappe-gantt / lucide-react / mock JSON→Supabase
