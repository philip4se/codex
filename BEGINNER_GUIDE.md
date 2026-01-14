# 🌟 완전 초보자를 위한 설문 매칭 플랫폼 실행 가이드

이 가이드는 프로그래밍 경험이 전혀 없는 분들을 위해 작성되었습니다.
모든 단계를 천천히 따라하시면 됩니다.

---

## 📋 목차
1. [필요한 프로그램 설치](#1-필요한-프로그램-설치)
2. [코드 다운로드](#2-코드-다운로드)
3. [데이터베이스 설정](#3-데이터베이스-설정)
4. [백엔드 실행](#4-백엔드-실행)
5. [프론트엔드 실행](#5-프론트엔드-실행)
6. [웹사이트 테스트](#6-웹사이트-테스트)
7. [문제 해결](#7-문제-해결)

---

## 1. 필요한 프로그램 설치

### 1-1. Node.js 설치 (필수)

**Node.js란?** 자바스크립트를 실행할 수 있게 해주는 프로그램입니다.

#### Windows 사용자:

1. **다운로드**
   - 웹브라우저를 열고 https://nodejs.org 접속
   - 왼쪽의 큰 초록색 버튼 "LTS" 클릭 (예: 20.x.x LTS)
   - 다운로드된 파일 실행 (예: node-v20.x.x-x64.msi)

2. **설치**
   - "Next" 계속 클릭
   - 설치 경로는 기본값 사용
   - "Automatically install the necessary tools" 체크박스 선택
   - "Install" 클릭
   - 설치 완료까지 대기 (2-3분 소요)

3. **설치 확인**
   - Windows 검색에서 "cmd" 입력
   - "명령 프롬프트" 실행
   - 다음 명령어 입력 후 Enter:
     ```
     node --version
     ```
   - 버전이 표시되면 성공 (예: v20.11.0)

#### macOS 사용자:

1. **다운로드 및 설치**
   - 웹브라우저를 열고 https://nodejs.org 접속
   - 왼쪽의 큰 초록색 버튼 "LTS" 클릭
   - 다운로드된 .pkg 파일 실행
   - 설치 과정 진행

2. **설치 확인**
   - "Launchpad" → "Terminal" 실행
   - 다음 명령어 입력:
     ```
     node --version
     ```

### 1-2. PostgreSQL 설치 (필수)

**PostgreSQL이란?** 데이터를 저장하는 데이터베이스 프로그램입니다.

#### Windows 사용자:

1. **다운로드**
   - https://www.postgresql.org/download/windows/ 접속
   - "Download the installer" 클릭
   - Windows x86-64 버전 최신 버전 다운로드 (예: 16.x)

2. **설치**
   - 다운로드된 파일 실행
   - "Next" 클릭
   - 설치 경로는 기본값 사용
   - 모든 구성요소 선택된 상태로 "Next"
   - 데이터 디렉토리 기본값 사용
   - **중요!** 비밀번호 설정 화면에서:
     - 비밀번호 입력: `postgres` (간단하게 설정)
     - 비밀번호 확인: `postgres`
     - **이 비밀번호를 꼭 기억하세요!**
   - 포트 번호: 5432 (기본값)
   - 로케일: 기본값
   - 설치 완료까지 대기

3. **설치 확인**
   - Windows 검색에서 "pgAdmin" 입력
   - pgAdmin 4 실행
   - 마스터 비밀번호 설정 (아무거나 입력해도 됨)
   - 왼쪽에서 "Servers" → "PostgreSQL 16" 클릭
   - 비밀번호 입력: `postgres`
   - 연결되면 성공!

#### macOS 사용자:

1. **Homebrew로 설치 (권장)**
   - Terminal 실행
   - Homebrew가 없다면 먼저 설치:
     ```bash
     /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
     ```
   - PostgreSQL 설치:
     ```bash
     brew install postgresql@16
     brew services start postgresql@16
     ```

2. **또는 PostgreSQL.app 사용**
   - https://postgresapp.com/ 접속
   - "Download" 클릭
   - 다운로드된 앱 실행
   - Applications 폴더로 이동
   - Postgres.app 실행
   - "Initialize" 클릭

### 1-3. Git 설치 (코드 다운로드용)

#### Windows 사용자:

1. https://git-scm.com/download/win 접속
2. 자동으로 다운로드 시작
3. 설치 파일 실행
4. 모든 옵션 기본값으로 "Next" 계속 클릭
5. "Install" 클릭

#### macOS 사용자:

1. Terminal에서 입력:
   ```bash
   git --version
   ```
2. Git이 없으면 자동으로 설치 안내 나타남
3. 또는 Homebrew로 설치:
   ```bash
   brew install git
   ```

### 1-4. 코드 편집기 설치 (선택사항, 하지만 권장)

**추천: Visual Studio Code**

1. https://code.visualstudio.com/ 접속
2. "Download" 클릭
3. 운영체제에 맞는 버전 자동 다운로드
4. 설치 파일 실행
5. 기본 옵션으로 설치

---

## 2. 코드 다운로드

### 2-1. 작업 폴더 만들기

#### Windows:

1. 파일 탐색기 열기
2. C 드라이브 (또는 원하는 위치)로 이동
3. 빈 공간에서 마우스 오른쪽 클릭
4. "새로 만들기" → "폴더"
5. 폴더 이름: `Projects` 입력

#### macOS:

1. Finder 열기
2. 홈 폴더로 이동
3. 원하는 위치에서 마우스 오른쪽 클릭
4. "새 폴더" 선택
5. 폴더 이름: `Projects` 입력

### 2-2. GitHub에서 코드 다운로드

#### 방법 1: Git 사용 (권장)

**Windows:**

1. `Projects` 폴더로 이동
2. 폴더 안에서 마우스 오른쪽 클릭
3. "Git Bash Here" 선택 (또는 주소창에 `cmd` 입력)
4. 다음 명령어 입력:
   ```bash
   git clone https://github.com/philip4se/codex.git
   cd codex
   git checkout claude/survey-matching-platform-011CUwRCgwbb23iLKSxLVruX
   ```

**macOS:**

1. Terminal 실행
2. 다음 명령어 입력:
   ```bash
   cd ~/Projects
   git clone https://github.com/philip4se/codex.git
   cd codex
   git checkout claude/survey-matching-platform-011CUwRCgwbb23iLKSxLVruX
   ```

#### 방법 2: ZIP 파일 다운로드

1. 웹브라우저에서 GitHub 저장소 접속
2. 초록색 "Code" 버튼 클릭
3. "Download ZIP" 클릭
4. 다운로드된 ZIP 파일을 `Projects` 폴더에 압축 해제

### 2-3. 폴더 구조 확인

다운로드 후 폴더 구조:

```
Projects/
└── codex/
    ├── backend/          ← 서버 코드
    ├── frontend/         ← 웹사이트 코드
    ├── README.md
    ├── SETUP_GUIDE.md
    └── BEGINNER_GUIDE.md (이 문서)
```

---

## 3. 데이터베이스 설정

### 3-1. PostgreSQL 실행 확인

#### Windows:

1. Windows 검색에서 "서비스" 입력
2. "서비스" 앱 실행
3. 목록에서 "postgresql-x64-16" 찾기
4. 상태가 "실행 중"인지 확인
5. 아니면 마우스 오른쪽 클릭 → "시작"

#### macOS:

Terminal에서:
```bash
brew services list
```
postgresql이 "started" 상태인지 확인

### 3-2. 데이터베이스 생성

#### Windows:

1. Windows 검색에서 "cmd" 입력
2. 명령 프롬프트 실행
3. 다음 명령어 입력:
   ```
   psql -U postgres
   ```
4. 비밀번호 입력: `postgres` (설치 시 설정한 비밀번호)
5. 성공하면 `postgres=#` 프롬프트 표시

6. 다음 SQL 명령어들을 **하나씩** 입력 (Enter 누르기):
   ```sql
   CREATE DATABASE survey_platform;
   ```
   → `CREATE DATABASE` 메시지 확인

   ```sql
   \c survey_platform
   ```
   → 데이터베이스 연결 확인

   ```sql
   \q
   ```
   → 종료

#### macOS:

Terminal에서:
```bash
psql postgres
```

그 다음 Windows와 동일한 SQL 명령어 실행

---

## 4. 백엔드 실행

### 4-1. 백엔드 폴더로 이동

#### Windows (명령 프롬프트):

```
cd C:\Projects\codex\backend
```

#### macOS (Terminal):

```bash
cd ~/Projects/codex/backend
```

### 4-2. 환경 변수 파일 설정

#### Windows:

1. 파일 탐색기에서 `Projects\codex\backend` 폴더 열기
2. `.env.example` 파일 찾기
3. 마우스 오른쪽 클릭 → "복사"
4. 빈 공간에서 마우스 오른쪽 클릭 → "붙여넣기"
5. 복사된 파일 이름을 `.env`로 변경
6. `.env` 파일을 메모장으로 열기
7. 다음 내용 확인 및 수정:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=survey_platform

# JWT
JWT_SECRET=my_super_secret_key_12345
JWT_EXPIRATION=7d

# Server
PORT=3001
NODE_ENV=development

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

8. 파일 저장 (Ctrl+S)

#### macOS:

Terminal에서:
```bash
cd ~/Projects/codex/backend
cp .env.example .env
nano .env
```

위의 내용으로 수정 후:
- Ctrl+O (저장)
- Enter
- Ctrl+X (종료)

### 4-3. 필요한 패키지 설치

명령 프롬프트 또는 Terminal에서:

```bash
npm install
```

**주의:** 이 과정은 5-10분 정도 걸릴 수 있습니다.
많은 파일이 다운로드됩니다. 기다려주세요!

진행 중 화면 예시:
```
npm WARN deprecated ...
npm WARN ...
added 1234 packages in 3m
```

### 4-4. 백엔드 서버 실행

```bash
npm run start:dev
```

**성공 메시지 예시:**
```
🚀 Application is running on: http://localhost:3001
📚 API Documentation: http://localhost:3001/api
```

**중요!** 이 창은 **절대 닫지 마세요!**
서버가 실행되고 있는 중입니다.

---

## 5. 프론트엔드 실행

### 5-1. 새 터미널 창 열기

**백엔드 창은 그대로 두고**, 새로운 창을 엽니다.

#### Windows:
- Windows 검색 → "cmd" → 새 명령 프롬프트 실행

#### macOS:
- Cmd+N으로 새 Terminal 창 열기

### 5-2. 프론트엔드 폴더로 이동

#### Windows:

```
cd C:\Projects\codex\frontend
```

#### macOS:

```bash
cd ~/Projects/codex/frontend
```

### 5-3. 환경 변수 파일 설정

#### Windows:

1. 파일 탐색기에서 `Projects\codex\frontend` 폴더 열기
2. `.env.local.example` 파일을 `.env.local`로 복사 및 이름 변경
3. `.env.local` 파일을 메모장으로 열기
4. 내용 확인:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

5. 파일 저장

#### macOS:

```bash
cp .env.local.example .env.local
```

### 5-4. 필요한 패키지 설치

```bash
npm install
```

다시 5-10분 정도 소요됩니다.

### 5-5. 프론트엔드 서버 실행

```bash
npm run dev
```

**성공 메시지 예시:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

**중요!** 이 창도 **닫지 마세요!**

---

## 6. 웹사이트 테스트

### 6-1. 웹사이트 접속

1. 웹브라우저 열기 (Chrome, Edge, Safari 등)
2. 주소창에 입력:
   ```
   http://localhost:3000
   ```
3. Enter

### 6-2. 회원가입 테스트

1. "회원가입" 버튼 또는 링크 클릭
2. 정보 입력:
   - **이메일**: test@example.com
   - **비밀번호**: password123
   - **비밀번호 확인**: password123
   - **이름**: 홍길동
   - **전화번호**: 010-1234-5678
   - **생년월일**: 1990-01-01
3. "회원가입" 버튼 클릭
4. 성공 메시지 확인

### 6-3. 로그인 테스트

1. "로그인" 페이지로 이동
2. 정보 입력:
   - **이메일**: test@example.com
   - **비밀번호**: password123
3. "로그인" 버튼 클릭
4. 대시보드 페이지로 이동 확인

### 6-4. 프로필 설정

1. 상단 메뉴에서 "프로필" 클릭
2. 프로필 정보 입력:
   - 지역 선택
   - 직업 선택
   - 성별 선택 (선택사항)
3. 저장

### 6-5. 설문 생성 테스트 (의뢰자 역할)

1. 대시보드에서 "+ 새 설문 만들기" 클릭
2. 설문 정보 입력:
   - **제목**: "온라인 쇼핑 만족도 조사"
   - **설명**: "온라인 쇼핑 경험에 대한 설문조사입니다"
   - **시작일**: 오늘 날짜
   - **종료일**: 한 달 후
   - **목표 응답 수**: 100
3. 타깃 조건 설정 (선택사항)
4. 보상 정보 설정 (선택사항)
5. "설문 생성" 버튼 클릭

### 6-6. 설문 참여 테스트 (참여자 역할)

1. "참여 가능한 설문" 메뉴 클릭
2. 표시된 설문 중 하나 선택
3. 설문 응답 작성
4. "제출" 버튼 클릭

---

## 7. 문제 해결

### 문제 1: "포트가 이미 사용 중입니다" 오류

**증상:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**해결 방법:**

#### Windows:
```
netstat -ano | findstr :3000
taskkill /PID [PID번호] /F
```

#### macOS:
```bash
lsof -ti:3000 | xargs kill -9
```

### 문제 2: PostgreSQL 연결 오류

**증상:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**해결 방법:**
1. PostgreSQL 서비스 실행 확인
2. 비밀번호 확인
3. `.env` 파일의 DATABASE_PASSWORD 확인

### 문제 3: npm install 실패

**증상:**
```
npm ERR! code ENOENT
```

**해결 방법:**
1. 올바른 폴더에 있는지 확인
2. Node.js 재설치
3. 관리자 권한으로 실행

### 문제 4: 화면이 제대로 표시되지 않음

**해결 방법:**
1. 브라우저 캐시 삭제 (Ctrl+Shift+Delete)
2. 브라우저 재시작
3. 다른 브라우저로 시도

### 문제 5: "Cannot find module" 오류

**해결 방법:**
```bash
# backend 또는 frontend 폴더에서
rm -rf node_modules package-lock.json
npm install
```

---

## 8. 서버 종료 방법

### 서버 중지:

#### Windows/macOS 공통:

백엔드 또는 프론트엔드 실행 중인 터미널에서:
- **Ctrl+C** 누르기
- "Terminate batch job? (Y/N)" 나오면 **Y** 입력

### 다시 시작하려면:

1. 백엔드 터미널:
   ```bash
   cd Projects/codex/backend
   npm run start:dev
   ```

2. 프론트엔드 터미널:
   ```bash
   cd Projects/codex/frontend
   npm run dev
   ```

---

## 9. 추가 도움말

### API 문서 확인

브라우저에서:
```
http://localhost:3001/api
```

여기서 모든 API 엔드포인트를 테스트할 수 있습니다.

### 데이터베이스 내용 확인

pgAdmin 4 실행 → Servers → PostgreSQL → Databases → survey_platform

---

## 10. 자주 묻는 질문 (FAQ)

**Q: 컴퓨터를 껐다가 켜면 어떻게 하나요?**

A: PostgreSQL은 자동으로 실행됩니다.
   백엔드와 프론트엔드는 위의 명령어로 다시 실행하면 됩니다.

**Q: 인터넷 연결이 필요한가요?**

A: 처음 설치 시에만 필요합니다.
   이후에는 오프라인에서도 실행 가능합니다.

**Q: 다른 컴퓨터에서도 접속할 수 있나요?**

A: 같은 네트워크 내에서 가능합니다.
   IP 주소를 확인하고 방화벽 설정이 필요합니다.

**Q: 실제 서비스로 배포하려면?**

A: 클라우드 서비스 (AWS, Heroku, Vercel 등)를 이용해야 합니다.
   별도의 배포 가이드가 필요합니다.

---

## 📞 도움이 필요하신가요?

1. 오류 메시지 전체를 복사해서 보관하세요
2. 어느 단계에서 문제가 발생했는지 메모하세요
3. 스크린샷을 찍어두세요

이 정보들이 있으면 문제 해결에 큰 도움이 됩니다!

---

## ✅ 체크리스트

설치 완료 여부를 체크하세요:

- [ ] Node.js 설치 완료
- [ ] PostgreSQL 설치 완료
- [ ] Git 설치 완료
- [ ] 코드 다운로드 완료
- [ ] 데이터베이스 생성 완료
- [ ] 백엔드 .env 파일 설정 완료
- [ ] 백엔드 npm install 완료
- [ ] 백엔드 서버 실행 성공
- [ ] 프론트엔드 .env.local 파일 설정 완료
- [ ] 프론트엔드 npm install 완료
- [ ] 프론트엔드 서버 실행 성공
- [ ] 웹사이트 접속 성공
- [ ] 회원가입 테스트 성공
- [ ] 로그인 테스트 성공

모두 체크되었다면 성공입니다! 🎉

---

**작성일:** 2024
**버전:** 1.0
**난이도:** 초보자용
