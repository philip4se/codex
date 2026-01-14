# 설문 매칭 플랫폼 설치 가이드

## 시스템 요구사항

- Node.js 18+
- PostgreSQL 12+
- npm 또는 yarn

## 1. 데이터베이스 설정

### PostgreSQL 설치 및 데이터베이스 생성

```bash
# PostgreSQL 설치 (Ubuntu/Debian)
sudo apt-get install postgresql postgresql-contrib

# PostgreSQL 설치 (macOS with Homebrew)
brew install postgresql

# PostgreSQL 서비스 시작
sudo service postgresql start  # Ubuntu/Debian
brew services start postgresql # macOS

# 데이터베이스 생성
sudo -u postgres psql
CREATE DATABASE survey_platform;
CREATE USER survey_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE survey_platform TO survey_user;
\q
```

## 2. 백엔드 설정

```bash
# 백엔드 디렉토리로 이동
cd backend

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 편집하여 데이터베이스 정보 입력

# 데이터베이스 초기화 (자동으로 테이블 생성)
# synchronize: true로 설정되어 있어 첫 실행 시 자동으로 테이블 생성됨

# 개발 서버 실행
npm run start:dev
```

### 백엔드 환경 변수 (.env)

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=survey_user
DATABASE_PASSWORD=your_password
DATABASE_NAME=survey_platform

# JWT
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRATION=7d

# Server
PORT=3001
NODE_ENV=development

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

## 3. 프론트엔드 설정

```bash
# 프론트엔드 디렉토리로 이동
cd frontend

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.local.example .env.local
# 필요시 API URL 수정

# 개발 서버 실행
npm run dev
```

### 프론트엔드 환경 변수 (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 4. 초기 데이터 생성

백엔드 서버가 실행 중일 때, 다음 API를 호출하여 초기 지역 및 직업 데이터를 생성할 수 있습니다:

```bash
# 서버가 실행 중일 때
# RegionsService와 OccupationsService의 seed() 메서드가 자동으로 호출됩니다.
```

또는 직접 코드에서 호출:

```typescript
// backend/src/main.ts에 추가
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 초기 데이터 생성
  const regionsService = app.get(RegionsService);
  await regionsService.seed();

  const occupationsService = app.get(OccupationsService);
  await occupationsService.seed();

  // ... 나머지 코드
}
```

## 5. 접속 정보

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:3001
- **API 문서 (Swagger)**: http://localhost:3001/api

## 6. 테스트 사용자 생성

웹 브라우저에서 http://localhost:3000 으로 접속하여:

1. "회원가입" 클릭
2. 필수 정보 입력:
   - 이메일
   - 비밀번호 (8자 이상)
   - 이름
   - 전화번호
   - 생년월일
3. 회원가입 완료 후 로그인

## 7. 주요 기능 사용 방법

### 7.1 설문 의뢰자

1. **로그인** → 대시보드
2. **"새 설문 만들기"** 클릭
3. 설문 정보 입력:
   - 제목, 설명, 기간
   - 타깃 조건 (나이, 지역, 직업, 성별)
   - 보상 정보
4. 설문 생성 후 상태 변경 (recruiting으로)
5. 참여자 관리 및 연락처 다운로드

### 7.2 설문 참여자

1. **로그인** → 대시보드
2. **프로필 설정** (지역, 직업 등)
3. **"참여 가능한 설문"** 확인
4. 설문 참여 및 응답 제출
5. 보상 수령

## 8. 문제 해결

### 데이터베이스 연결 오류

```bash
# PostgreSQL 서비스 확인
sudo service postgresql status

# .env 파일의 데이터베이스 정보 확인
cat backend/.env
```

### 포트 충돌

```bash
# 3000, 3001 포트 사용 중인 프로세스 확인
lsof -i :3000
lsof -i :3001

# 프로세스 종료
kill -9 <PID>
```

### 의존성 설치 오류

```bash
# 캐시 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

## 9. 프로덕션 배포

### 백엔드

```bash
cd backend
npm run build
npm run start:prod
```

### 프론트엔드

```bash
cd frontend
npm run build
npm run start
```

## 10. API 엔드포인트

### 인증
- `POST /auth/login` - 로그인
- `POST /users/register` - 회원가입
- `GET /users/me` - 내 정보 조회

### 프로필
- `GET /profiles/me` - 내 프로필 조회
- `POST /profiles` - 프로필 생성
- `PUT /profiles/me` - 프로필 수정

### 설문
- `GET /surveys` - 설문 목록
- `POST /surveys` - 설문 생성
- `GET /surveys/:id` - 설문 상세
- `PUT /surveys/:id` - 설문 수정
- `DELETE /surveys/:id` - 설문 삭제

### 참여
- `GET /participation/matched-surveys` - 나에게 맞는 설문
- `POST /participation/start` - 설문 참여 시작
- `POST /participation/:surveyId/submit` - 응답 제출
- `GET /participation/my-participations` - 내 참여 이력

### 보상
- `GET /rewards/survey/:surveyId/eligible` - 보상 대상자 목록
- `GET /rewards/survey/:surveyId/export` - 연락처 엑셀 다운로드
- `GET /rewards/survey/:surveyId/statistics` - 보상 통계

## 라이선스

MIT
