# 설문 플랫폼 로컬 실행 가이드

## 📋 사전 준비사항

- Node.js 18 이상
- npm 또는 yarn

## 🚀 설치 및 실행 단계

### 1. 저장소 클론

```bash
git clone <repository-url>
cd codex
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env` 파일이 이미 생성되어 있습니다. 필요시 수정하세요:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="survey-platform-secret-key-2024"
```

### 4. 데이터베이스 초기화

```bash
# Prisma 마이그레이션 실행
npx prisma migrate dev --name init

# 또는 빠른 동기화
npx prisma db push

# Prisma Client 생성
npx prisma generate
```

### 5. 개발 서버 실행

```bash
npm run dev
```

서버가 실행되면 브라우저에서 http://localhost:3000 에 접속하세요!

## 📱 테스트 시나리오

### 1. 회원가입 테스트

1. 메인 페이지에서 "회원가입" 클릭
2. 다음 정보 입력:
   - 이메일: test@example.com
   - 비밀번호: test123
   - 이름: 홍길동
   - 나이: 25
   - 휴대폰: 010-1234-5678
   - 직업: 회사원
   - 지역: 서울특별시 > 강남구
3. 회원가입 완료

### 2. 로그인 테스트

1. 로그인 페이지에서 위 정보로 로그인
2. 메인 페이지로 리다이렉트 확인

### 3. 설문 의뢰자 기능 테스트

1. "설문 의뢰하기" 클릭
2. 새 설문 등록:
   - 제목: 소비자 만족도 조사
   - 설명: 제품 사용 경험 조사
   - 구글 시트 URL: https://docs.google.com/spreadsheets/d/example
   - 타겟 설정:
     * 최소 나이: 20
     * 최대 나이: 40
     * 지역: 서울특별시
     * 직업: 회사원
   - 보상: 기프티콘 - 스타벅스 아메리카노
3. 설문 등록 완료

### 4. 설문 참여자 기능 테스트

1. "설문 참여하기" 클릭
2. 나에게 맞는 설문 목록 확인
3. 설문 카드에서 보상 정보 확인
4. "참여하기" 버튼으로 설문 참여

### 5. 응답자 데이터 다운로드 테스트

1. 설문 의뢰자 페이지에서 "응답보기" 클릭
2. 완료된 응답자 목록 확인
3. "엑셀 다운로드" 버튼 클릭
4. CSV 파일 다운로드 확인

## 🔍 데이터베이스 확인

Prisma Studio를 사용하여 데이터를 시각적으로 확인할 수 있습니다:

```bash
npx prisma studio
```

브라우저에서 http://localhost:5555 에 접속하여 데이터베이스 내용을 확인하세요.

## 🎨 주요 기능

### ✅ 구현 완료
- [x] 회원가입/로그인 (JWT 인증)
- [x] 상세 개인정보 등록 (이름, 나이, 지역, 직업 등)
- [x] 설문 등록 (구글 시트 URL 연동)
- [x] 타겟 응답자 설정 (나이, 지역, 직업)
- [x] 보상 정보 등록
- [x] 맞춤형 설문 추천 (개인정보 기반)
- [x] 설문 참여 상태 관리
- [x] 응답자 데이터 조회
- [x] CSV/엑셀 다운로드

### 🚧 향후 개발 예정
- [ ] 실제 구글 시트 API 연동
- [ ] 엑셀/CSV 파일 업로드 자동 변환
- [ ] 설문 응답 직접 입력 기능
- [ ] 실시간 알림 시스템
- [ ] 통계 대시보드

## ⚙️ 기술 스택

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (개발), PostgreSQL (프로덕션)
- **ORM**: Prisma
- **Authentication**: JWT (jose)
- **Password**: bcryptjs

## 🐛 문제 해결

### 포트 충돌 오류
```bash
# 3000 포트가 이미 사용 중인 경우
npm run dev -- -p 3001
```

### Prisma 오류
```bash
# Prisma Client 재생성
npx prisma generate

# 데이터베이스 리셋
npx prisma migrate reset
```

### 데이터베이스 초기화
```bash
# dev.db 파일 삭제 후 재실행
rm prisma/dev.db
npx prisma migrate dev
```

## 📞 지원

문제가 발생하면 이슈를 등록해주세요!
