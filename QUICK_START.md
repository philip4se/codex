# ⚡ 빠른 시작 가이드 (10분 완성)

핵심만 빠르게! 경험이 있으신 분들을 위한 간단 가이드입니다.

## 🔧 사전 준비

필요한 프로그램:
- Node.js 18+ (https://nodejs.org)
- PostgreSQL 12+ (https://www.postgresql.org)
- Git (https://git-scm.com)

## 📥 1단계: 코드 다운로드 (1분)

```bash
# 원하는 위치로 이동
cd ~/Projects  # macOS/Linux
cd C:\Projects # Windows

# 코드 다운로드
git clone https://github.com/philip4se/codex.git
cd codex
git checkout claude/survey-matching-platform-011CUwRCgwbb23iLKSxLVruX
```

## 💾 2단계: 데이터베이스 설정 (2분)

```bash
# PostgreSQL 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE survey_platform;
\q
```

## 🖥️ 3단계: 백엔드 실행 (3분)

```bash
# 백엔드 폴더로 이동
cd backend

# 환경 변수 설정
cp .env.example .env

# .env 파일 수정 (필요시)
# DATABASE_PASSWORD=postgres (설치 시 설정한 비밀번호)

# 패키지 설치
npm install

# 서버 실행
npm run start:dev
```

**실행 확인:** http://localhost:3001/api

## 🌐 4단계: 프론트엔드 실행 (3분)

**새 터미널 창 열기**

```bash
# 프론트엔드 폴더로 이동
cd frontend

# 환경 변수 설정
cp .env.local.example .env.local

# 패키지 설치
npm install

# 서버 실행
npm run dev
```

**실행 확인:** http://localhost:3000

## ✅ 5단계: 테스트 (1분)

1. **회원가입**: http://localhost:3000
   - 이메일, 비밀번호, 이름, 전화번호, 생년월일 입력

2. **로그인**: 위에서 만든 계정으로 로그인

3. **대시보드**: 로그인 후 자동 이동

## 🚀 완료!

- 프론트엔드: http://localhost:3000
- API 문서: http://localhost:3001/api

---

## 주요 기능 테스트

### 설문 의뢰자로 테스트

```
대시보드 → "새 설문 만들기" → 정보 입력 → 생성
```

### 설문 참여자로 테스트

```
"참여 가능한 설문" → 설문 선택 → 응답 제출
```

---

## 문제 해결

### 포트 충돌 시

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [번호] /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### PostgreSQL 연결 오류 시

1. PostgreSQL 서비스 실행 확인
2. `.env` 파일의 `DATABASE_PASSWORD` 확인
3. 데이터베이스 이름 확인: `survey_platform`

### npm install 오류 시

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 디렉토리 구조

```
codex/
├── backend/              # NestJS 백엔드
│   ├── src/
│   ├── package.json
│   └── .env
├── frontend/             # Next.js 프론트엔드
│   ├── src/
│   ├── package.json
│   └── .env.local
├── README.md
├── BEGINNER_GUIDE.md    # 초보자용 상세 가이드
└── QUICK_START.md       # 이 문서
```

---

## 주요 API 엔드포인트

| 기능 | 메서드 | 엔드포인트 |
|------|--------|-----------|
| 회원가입 | POST | /users/register |
| 로그인 | POST | /auth/login |
| 설문 목록 | GET | /surveys |
| 설문 생성 | POST | /surveys |
| 맞춤 설문 | GET | /participation/matched-surveys |
| 설문 참여 | POST | /participation/start |
| 응답 제출 | POST | /participation/:id/submit |

---

## 다음 단계

더 자세한 내용은:
- **초보자**: `BEGINNER_GUIDE.md` 참조
- **개발자**: `SETUP_GUIDE.md` 참조
- **DB 스키마**: `DATABASE_SCHEMA.md` 참조

---

**소요 시간:** 약 10분
**난이도:** 중급 이상
**상세 가이드:** BEGINNER_GUIDE.md
