# 설문 매칭 플랫폼

설문을 진행하고 싶은 개인·기관(설문 의뢰자)과 자신의 프로필에 맞는 설문에 참여하고 보상을 받고 싶은 일반 사용자(설문 참여자)를 정교한 타깃팅·자동 매칭·보상 관리를 통해 연결하는 통합 설문 매칭·보상 플랫폼입니다.

## 주요 기능

### 1. 회원 및 프로필 관리
- 이메일/비밀번호 기반 회원가입
- 휴대폰 본인 인증
- 프로필 정보 (성명, 나이/생년월일, 거주지역, 직업)
- 동의 관리 시스템

### 2. 설문 의뢰 기능
- 설문 생성/수정/삭제
- 엑셀/CSV 템플릿 업로드
- 구글 시트 연동
- 타깃 조건 설정 (나이, 지역, 직업)
- 보상 설정 및 관리

### 3. 설문 참여 기능
- 프로필 기반 맞춤 설문 추천
- 설문 응답 및 완료
- 참여 이력 관리
- 보상 수령

### 4. 매칭 및 보상 관리
- 자동 타깃 매칭
- 조건 충족자 판별
- 연락처 제공 및 엑셀 다운로드
- 보상 지급 관리

## 기술 스택

### Backend
- Node.js
- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- Passport & JWT
- Multer (파일 업로드)

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Axios

## 프로젝트 구조

```
survey-matching-platform/
├── backend/                 # NestJS 백엔드
│   ├── src/
│   │   ├── auth/           # 인증 모듈
│   │   ├── users/          # 회원 관리
│   │   ├── profiles/       # 프로필 관리
│   │   ├── surveys/        # 설문 관리
│   │   ├── targeting/      # 타깃팅 & 매칭
│   │   ├── participation/  # 참여 관리
│   │   ├── rewards/        # 보상 관리
│   │   ├── admin/          # 관리자 기능
│   │   └── common/         # 공통 유틸
│   └── package.json
├── frontend/               # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/           # Next.js App Router
│   │   ├── components/    # React 컴포넌트
│   │   ├── hooks/         # Custom Hooks
│   │   ├── lib/           # 유틸리티
│   │   └── types/         # TypeScript 타입
│   └── package.json
└── README.md
```

## 설치 및 실행

### Backend
```bash
cd backend
npm install
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 환경 변수

### Backend (.env)
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=survey_platform
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=7d
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 데이터베이스 스키마

주요 엔티티:
- **Member**: 회원 정보
- **Profile**: 프로필 정보 (나이, 지역, 직업)
- **Survey**: 설문 기본 정보
- **SurveyQuestionnaire**: 설문지 구조
- **SurveyTargetCondition**: 타깃 조건
- **SurveyReward**: 보상 정보
- **SurveyParticipation**: 참여 이력
- **ContactExport**: 연락처 추출 기록

## 개발 로드맵

- [x] 프로젝트 구조 설계
- [ ] 데이터베이스 스키마 설계
- [ ] 백엔드 API 구현
- [ ] 프론트엔드 UI 구현
- [ ] 타깃팅 및 매칭 로직 구현
- [ ] 보상 및 연락처 관리 기능
- [ ] 관리자 기능
- [ ] 테스트 및 배포

## 라이선스

MIT
