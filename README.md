# 설문 플랫폼 (Survey Platform)

설문지를 의뢰하고 참여하는 통합 플랫폼입니다.

## 주요 기능

### 1. 사용자 관리
- **회원가입**: 성명, 나이, 거주지역(국가/도/시군구/읍면동), 연락처, 직업 등 상세 정보 등록
- **로그인/로그아웃**: JWT 기반 인증 시스템
- **개인정보 관리**: 프로필 정보 수정

### 2. 설문 의뢰자 기능
- **설문 등록**: 구글 시트 URL을 통한 설문지 등록
- **타겟 설정**: 나이, 지역, 직업 등 조건별 응답자 타겟팅
- **보상 설정**: 기프티콘, 모바일 문화상품권 등 보상 정보 등록
- **응답 관리**: 완료된 응답자 정보 조회
- **데이터 다운로드**: 완료자 연락처 엑셀 다운로드

### 3. 설문 참여자 기능
- **맞춤 설문 조회**: 개인 정보 기반 맞춤형 설문 추천
- **설문 참여**: 구글 시트 설문 참여
- **보상 정보 확인**: 설문별 보상 내용 확인
- **참여 이력 관리**: 진행중/완료 설문 상태 관리

## 기술 스택

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT (jose)
- **Others**: bcryptjs (비밀번호 해싱)

## 프로젝트 구조

```
codex/
├── prisma/
│   └── schema.prisma          # 데이터베이스 스키마
├── src/
│   ├── app/
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # 인증 API
│   │   │   └── surveys/       # 설문 API
│   │   ├── auth/              # 인증 페이지
│   │   ├── requester/         # 설문 의뢰자 페이지
│   │   ├── participant/       # 설문 참여자 페이지
│   │   ├── globals.css        # 전역 스타일
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   └── page.tsx           # 메인 페이지
│   ├── lib/
│   │   ├── prisma.ts          # Prisma 클라이언트
│   │   └── regions.ts         # 한국 행정구역 데이터
│   └── middleware.ts          # 인증 미들웨어
├── .env.example               # 환경변수 예시
├── package.json
└── README.md
```

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env` 파일을 생성하고 다음 내용을 설정하세요:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/survey_platform"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### 3. 데이터베이스 설정

```bash
# Prisma 마이그레이션 실행
npx prisma migrate dev --name init

# Prisma Client 생성
npx prisma generate
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 에 접속하세요.

## 데이터베이스 스키마

### User (사용자)
- 기본 정보: 이메일, 비밀번호, 이름, 나이, 연락처, 직업
- 주소 정보: 국가, 도/시, 시/군/구, 읍/면/동

### Survey (설문)
- 기본 정보: 제목, 설명, 구글 시트 URL
- 타겟팅: 나이 범위, 지역, 직업
- 보상: 보상 종류, 내용, 지급 조건
- 상태: active, closed, draft

### Response (응답)
- 응답 데이터 (JSON)
- 완료 상태 및 완료 시간
- 사용자 및 설문 연결

## 주요 API 엔드포인트

### 인증
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인

### 설문
- `POST /api/surveys` - 설문 등록
- `GET /api/surveys` - 설문 목록 조회 (타겟팅 필터링)
- `GET /api/surveys/my-surveys` - 내가 등록한 설문 목록
- `GET /api/surveys/[id]/responses` - 설문 응답 목록
- `GET /api/surveys/[id]/export` - 응답자 데이터 CSV 다운로드

## 향후 개발 계획

### 구글 시트 연동 (우선순위 높음)
- [ ] 엑셀/CSV 파일 업로드 및 구글 시트 자동 변환
- [ ] 구글 시트 API 연동
- [ ] 설문 응답 데이터 구글 시트에 자동 저장

### 추가 기능
- [ ] 설문 상세 페이지
- [ ] 설문 수정/삭제 기능
- [ ] 설문 임시저장 기능
- [ ] 이메일 알림 시스템
- [ ] 관리자 대시보드
- [ ] 통계 및 분석 기능

## 라이선스

MIT

## 기여

이슈 및 Pull Request는 언제든지 환영합니다!
