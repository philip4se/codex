# 데이터베이스 스키마 설계

## ERD 개요

### 주요 엔티티

1. **Member** - 회원
2. **Profile** - 프로필 (나이, 지역, 직업)
3. **Survey** - 설문
4. **SurveyQuestionnaire** - 설문지 구조
5. **SurveyTargetCondition** - 타깃 조건
6. **SurveyReward** - 보상 정보
7. **SurveyParticipation** - 참여 이력
8. **ContactExport** - 연락처 추출 기록
9. **Region** - 지역 정보 (국가, 광역, 시군구, 읍면동)
10. **Occupation** - 직업 분류
11. **Consent** - 동의 관리

---

## 상세 스키마

### 1. Member (회원)
```sql
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    phone_verified BOOLEAN DEFAULT FALSE,
    birth_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, suspended, deleted
    role VARCHAR(20) DEFAULT 'user', -- user, admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_phone ON members(phone);
CREATE INDEX idx_members_status ON members(status);
```

### 2. Profile (프로필)
```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID UNIQUE NOT NULL REFERENCES members(id) ON DELETE CASCADE,

    -- 지역 정보
    country_id UUID REFERENCES regions(id),
    province_id UUID REFERENCES regions(id), -- 광역
    city_id UUID REFERENCES regions(id), -- 시군구
    district_id UUID REFERENCES regions(id), -- 읍면동

    -- 직업 정보
    occupation_id UUID REFERENCES occupations(id),
    occupation_detail VARCHAR(255), -- 기타 직업 상세

    -- 추가 정보
    gender VARCHAR(10), -- male, female, other, prefer_not_to_say

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_profiles_member ON profiles(member_id);
CREATE INDEX idx_profiles_region ON profiles(country_id, province_id, city_id, district_id);
CREATE INDEX idx_profiles_occupation ON profiles(occupation_id);
```

### 3. Region (지역)
```sql
CREATE TABLE regions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    level INTEGER NOT NULL, -- 1: 국가, 2: 광역, 3: 시군구, 4: 읍면동
    parent_id UUID REFERENCES regions(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_regions_code ON regions(code);
CREATE INDEX idx_regions_parent ON regions(parent_id);
CREATE INDEX idx_regions_level ON regions(level);
```

### 4. Occupation (직업)
```sql
CREATE TABLE occupations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100), -- 대분류
    parent_id UUID REFERENCES occupations(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_occupations_code ON occupations(code);
CREATE INDEX idx_occupations_category ON occupations(category);
```

### 5. Survey (설문)
```sql
CREATE TABLE surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES members(id),

    title VARCHAR(255) NOT NULL,
    description TEXT,
    purpose TEXT,

    status VARCHAR(20) DEFAULT 'draft', -- draft, pending_approval, recruiting, closed, cancelled

    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,

    target_response_count INTEGER DEFAULT 0,
    current_response_count INTEGER DEFAULT 0,

    estimated_duration INTEGER, -- 예상 소요 시간 (분)

    google_sheet_url VARCHAR(500),
    google_form_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_surveys_creator ON surveys(creator_id);
CREATE INDEX idx_surveys_status ON surveys(status);
CREATE INDEX idx_surveys_dates ON surveys(start_date, end_date);
```

### 6. SurveyQuestionnaire (설문지)
```sql
CREATE TABLE survey_questionnaires (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID UNIQUE NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,

    questions_structure JSONB NOT NULL, -- 문항 구조 JSON

    -- 예시 구조:
    -- [
    --   {
    --     "number": 1,
    --     "type": "single_choice",
    --     "question": "귀하의 성별은?",
    --     "required": true,
    --     "options": ["남성", "여성", "기타"]
    --   },
    --   ...
    -- ]

    total_questions INTEGER,

    file_path VARCHAR(500), -- 업로드된 엑셀/CSV 파일 경로
    file_name VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_questionnaires_survey ON survey_questionnaires(survey_id);
```

### 7. SurveyTargetCondition (타깃 조건)
```sql
CREATE TABLE survey_target_conditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID UNIQUE NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,

    -- 나이 조건
    min_age INTEGER,
    max_age INTEGER,

    -- 지역 조건 (배열로 저장)
    target_countries UUID[], -- 국가 ID 배열
    target_provinces UUID[], -- 광역 ID 배열
    target_cities UUID[], -- 시군구 ID 배열
    target_districts UUID[], -- 읍면동 ID 배열

    -- 직업 조건
    target_occupations UUID[], -- 직업 ID 배열

    -- 성별 조건
    target_genders VARCHAR(50)[], -- 성별 배열

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_target_conditions_survey ON survey_target_conditions(survey_id);
```

### 8. SurveyReward (보상)
```sql
CREATE TABLE survey_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID UNIQUE NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,

    reward_type VARCHAR(50), -- gifticon, mobile_voucher, point, none
    reward_name VARCHAR(255),
    reward_amount DECIMAL(10, 2),

    total_recipients INTEGER DEFAULT 0, -- 지급 인원
    distributed_count INTEGER DEFAULT 0, -- 실제 지급된 수

    distribution_condition VARCHAR(50), -- all_questions, specific_question
    condition_details JSONB, -- 조건 상세

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rewards_survey ON survey_rewards(survey_id);
```

### 9. SurveyParticipation (참여 이력)
```sql
CREATE TABLE survey_participations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id),
    participant_id UUID NOT NULL REFERENCES members(id),

    status VARCHAR(20) DEFAULT 'in_progress', -- in_progress, completed, abandoned

    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,

    answers JSONB, -- 응답 데이터

    -- 보상 관련
    is_eligible_for_reward BOOLEAN DEFAULT FALSE,
    reward_distributed BOOLEAN DEFAULT FALSE,
    reward_distributed_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(survey_id, participant_id)
);

CREATE INDEX idx_participations_survey ON survey_participations(survey_id);
CREATE INDEX idx_participations_participant ON survey_participations(participant_id);
CREATE INDEX idx_participations_status ON survey_participations(status);
CREATE INDEX idx_participations_reward ON survey_participations(is_eligible_for_reward, reward_distributed);
```

### 10. ContactExport (연락처 추출 기록)
```sql
CREATE TABLE contact_exports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id),
    exporter_id UUID NOT NULL REFERENCES members(id),

    exported_count INTEGER,
    file_path VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exports_survey ON contact_exports(survey_id);
CREATE INDEX idx_exports_exporter ON contact_exports(exporter_id);
```

### 11. Consent (동의 관리)
```sql
CREATE TABLE consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id),

    consent_type VARCHAR(100) NOT NULL, -- terms_of_service, privacy_policy, contact_sharing, marketing
    consent_version VARCHAR(20),

    agreed BOOLEAN DEFAULT FALSE,
    agreed_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(member_id, consent_type)
);

CREATE INDEX idx_consents_member ON consents(member_id);
CREATE INDEX idx_consents_type ON consents(consent_type);
```

---

## 관계도

```
Member (1) --- (1) Profile
       (1) --- (N) Survey (creator)
       (1) --- (N) SurveyParticipation (participant)
       (1) --- (N) ContactExport (exporter)
       (1) --- (N) Consent

Survey (1) --- (1) SurveyQuestionnaire
       (1) --- (1) SurveyTargetCondition
       (1) --- (1) SurveyReward
       (1) --- (N) SurveyParticipation
       (1) --- (N) ContactExport

Profile (N) --- (1) Region (country)
        (N) --- (1) Region (province)
        (N) --- (1) Region (city)
        (N) --- (1) Region (district)
        (N) --- (1) Occupation

Region (1) --- (N) Region (parent-child)
Occupation (1) --- (N) Occupation (parent-child)
```

---

## 주요 쿼리 패턴

### 1. 사용자에게 맞는 설문 찾기
```sql
SELECT s.*
FROM surveys s
INNER JOIN survey_target_conditions tc ON s.id = tc.survey_id
INNER JOIN profiles p ON p.member_id = :memberId
WHERE s.status = 'recruiting'
  AND s.start_date <= NOW()
  AND s.end_date >= NOW()
  AND (tc.min_age IS NULL OR EXTRACT(YEAR FROM AGE(NOW(), (SELECT birth_date FROM members WHERE id = :memberId))) >= tc.min_age)
  AND (tc.max_age IS NULL OR EXTRACT(YEAR FROM AGE(NOW(), (SELECT birth_date FROM members WHERE id = :memberId))) <= tc.max_age)
  AND (tc.target_countries IS NULL OR p.country_id = ANY(tc.target_countries))
  AND (tc.target_provinces IS NULL OR p.province_id = ANY(tc.target_provinces))
  AND (tc.target_cities IS NULL OR p.city_id = ANY(tc.target_cities))
  AND (tc.target_occupations IS NULL OR p.occupation_id = ANY(tc.target_occupations))
  AND NOT EXISTS (
    SELECT 1 FROM survey_participations sp
    WHERE sp.survey_id = s.id
      AND sp.participant_id = :memberId
      AND sp.status = 'completed'
  );
```

### 2. 보상 조건 충족자 조회
```sql
SELECT m.name, m.phone, sp.completed_at
FROM survey_participations sp
INNER JOIN members m ON sp.participant_id = m.id
WHERE sp.survey_id = :surveyId
  AND sp.status = 'completed'
  AND sp.is_eligible_for_reward = TRUE
  AND sp.reward_distributed = FALSE;
```

---

## 초기 데이터

### 지역 데이터 (샘플)
- 대한민국
  - 서울특별시
    - 강남구
      - 역삼동
      - 삼성동
    - 서초구
  - 경기도
    - 성남시
    - 수원시

### 직업 데이터 (샘플)
- 관리자
- 전문가 및 관련 종사자
  - 과학 전문가 및 관련직
  - 정보통신 전문가 및 기술직
- 사무 종사자
- 서비스 종사자
- 판매 종사자
- 학생
- 무직
