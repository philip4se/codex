# 🎁 상품 교환 API 연동 가이드

## 개요

현재 demo_v4.html은 **프론트엔드 전용 데모**로 localStorage를 사용하여 상품 교환 기능을 시뮬레이션합니다. 실제 서비스로 전환하려면 백엔드 서버와 외부 상품권 API 연동이 필요합니다.

---

## 📋 목차

1. [현재 구조](#현재-구조)
2. [실제 서비스 전환 방법](#실제-서비스-전환-방법)
3. [주요 상품권 API 제공업체](#주요-상품권-api-제공업체)
4. [API 연동 구현 예시](#api-연동-구현-예시)
5. [보안 고려사항](#보안-고려사항)

---

## 현재 구조

### 데모 버전 (v4.0)

```javascript
// 현재: 클라이언트 측에서만 처리
function exchangeProduct(product) {
    // 1. localStorage에서 포인트 차감
    users[userIndex].points = currentUser.points - product.price;
    localStorage.setItem('users', JSON.stringify(users));

    // 2. 교환 내역 저장
    exchanges.push({
        id: Date.now().toString(),
        userId: currentUser.id,
        productId: product.id,
        productName: product.name,
        price: product.price,
        exchangedAt: new Date().toISOString(),
        status: 'completed'
    });
    localStorage.setItem('exchanges', JSON.stringify(exchanges));

    // ❌ 실제 상품권 발급은 없음
}
```

**제한사항:**
- 실제 상품권 발급 불가
- 데이터가 브라우저에만 저장됨
- 보안 취약 (클라이언트에서 쉽게 조작 가능)
- 결제 검증 없음

---

## 실제 서비스 전환 방법

### 1. 백엔드 서버 구축

**필요한 기술 스택:**
- Node.js (Express), Python (Django/Flask), Java (Spring Boot) 등
- 데이터베이스: PostgreSQL, MySQL, MongoDB 등
- 인증: JWT, Session 등

**기본 API 구조:**

```
POST /api/exchange        # 상품 교환 요청
GET  /api/exchange/history # 교환 내역 조회
GET  /api/products         # 상품 목록 조회
POST /api/auth/login       # 로그인
GET  /api/user/points      # 포인트 조회
```

### 2. 프론트엔드 수정

**AS-IS (현재):**
```javascript
function exchangeProduct(product) {
    // localStorage 직접 조작
    localStorage.setItem('exchanges', ...);
}
```

**TO-BE (백엔드 연동 후):**
```javascript
async function exchangeProduct(product) {
    try {
        const response = await fetch('/api/exchange', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({
                productId: product.id,
                points: product.price
            })
        });

        const result = await response.json();

        if (result.success) {
            // 상품권 정보 표시
            alert(`🎉 교환 완료!\n상품권 번호: ${result.voucherCode}\n이메일로 발송되었습니다.`);

            // 포인트 업데이트
            currentUser.points = result.remainingPoints;
            updatePoints();
        } else {
            alert(`❌ 교환 실패: ${result.message}`);
        }
    } catch (error) {
        console.error('교환 오류:', error);
        alert('서버 오류가 발생했습니다.');
    }
}
```

---

## 주요 상품권 API 제공업체

### 1. 🎫 **해피머니 (문화상품권)**

**제공사:** 한국문화진흥㈜
**웹사이트:** https://www.happymoney.co.kr

**주요 서비스:**
- 문화상품권 발행 API
- 잔액 조회
- 사용 내역 조회

**연동 프로세스:**
1. 해피머니 B2B 계약 체결
2. API 키 발급
3. 테스트 환경에서 연동 테스트
4. 운영 환경 전환

**API 예시:**
```javascript
// 문화상품권 발급 요청
POST https://api.happymoney.co.kr/v1/voucher/issue
Headers:
  - Authorization: Bearer YOUR_API_KEY
  - Content-Type: application/json

Body:
{
  "amount": 5000,
  "email": "user@example.com",
  "orderId": "ORD20250101001"
}

Response:
{
  "success": true,
  "voucherCode": "1234-5678-9012-3456",
  "pinNumber": "1234",
  "expiryDate": "2026-12-31"
}
```

---

### 2. ☕ **모바일 상품권 (기프티콘)**

#### A. **기프티쇼**

**제공사:** ㈜기프티쇼
**웹사이트:** https://www.giftishow.com

**주요 브랜드:**
- 스타벅스, 투썸플레이스
- 버거킹, 맥도날드
- GS25, CU, 세븐일레븐

**API 예시:**
```javascript
// 기프티콘 발급
POST https://api.giftishow.com/v1/gifticon/send
Headers:
  - X-API-Key: YOUR_API_KEY
  - Content-Type: application/json

Body:
{
  "goodsCode": "SB_5000",      // 스타벅스 5천원권
  "receiverPhone": "01012345678",
  "receiverEmail": "user@example.com",
  "message": "설문 참여 감사합니다!"
}

Response:
{
  "result": "success",
  "exchangeNo": "EX20250101001",
  "barcode": "1234567890123",
  "expiryDate": "2025-12-31"
}
```

#### B. **기프티콘 (Gifticon by Kakao)**

**제공사:** 카카오
**웹사이트:** https://www.kakaocorp.com/page/service/service/Gifticon

**특징:**
- 카카오톡을 통한 발송
- 높은 사용률

**연동 방법:**
- 카카오 비즈니스 계정 필요
- 카카오톡 채널 개설
- API 계약 체결

---

### 3. 🏪 **편의점 상품권**

#### GS리테일 API

**대상:** GS25, GS THE FRESH
**문의:** https://www.gsretail.com

#### BGF리테일 API

**대상:** CU 편의점
**문의:** https://www.bgfretail.com

---

### 4. 🎮 **게임/앱 스토어**

#### Google Play 기프트 코드

**Google for Work:**
- Google Play 기프트 코드 대량 구매
- 자동 발급 API 제공

#### Apple iTunes 기프트 카드

**Apple Business:**
- 기업용 대량 구매 프로그램
- 자동 배포 시스템

---

## API 연동 구현 예시

### 백엔드 예시 (Node.js + Express)

```javascript
// server.js
const express = require('express');
const axios = require('axios');
const app = express();

// 상품 교환 API
app.post('/api/exchange', async (req, res) => {
    const { userId, productId, points } = req.body;

    try {
        // 1. 사용자 포인트 확인
        const user = await db.users.findById(userId);
        if (user.points < points) {
            return res.json({
                success: false,
                message: '포인트가 부족합니다.'
            });
        }

        // 2. 상품 정보 조회
        const product = await db.products.findById(productId);

        // 3. 외부 API 호출 (기프티쇼 예시)
        const voucherResponse = await axios.post(
            'https://api.giftishow.com/v1/gifticon/send',
            {
                goodsCode: product.externalCode,
                receiverEmail: user.email,
                receiverPhone: user.phone
            },
            {
                headers: {
                    'X-API-Key': process.env.GIFTISHOW_API_KEY
                }
            }
        );

        if (voucherResponse.data.result !== 'success') {
            throw new Error('상품권 발급 실패');
        }

        // 4. 트랜잭션 처리
        await db.transaction(async (trx) => {
            // 포인트 차감
            await trx('users')
                .where({ id: userId })
                .decrement('points', points);

            // 교환 내역 저장
            await trx('exchanges').insert({
                user_id: userId,
                product_id: productId,
                points: points,
                voucher_code: voucherResponse.data.barcode,
                exchange_no: voucherResponse.data.exchangeNo,
                status: 'completed',
                created_at: new Date()
            });
        });

        // 5. 이메일 발송
        await sendEmail({
            to: user.email,
            subject: '상품권 발급 완료',
            html: `
                <h2>상품 교환이 완료되었습니다!</h2>
                <p>상품: ${product.name}</p>
                <p>교환번호: ${voucherResponse.data.exchangeNo}</p>
                <p>바코드: ${voucherResponse.data.barcode}</p>
            `
        });

        // 6. 성공 응답
        res.json({
            success: true,
            voucherCode: voucherResponse.data.barcode,
            exchangeNo: voucherResponse.data.exchangeNo,
            remainingPoints: user.points - points
        });

    } catch (error) {
        console.error('교환 오류:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.'
        });
    }
});

app.listen(3000, () => {
    console.log('서버 시작: http://localhost:3000');
});
```

---

### 프론트엔드 전체 수정 예시

```javascript
// demo_v4.html 수정 버전

// API 기본 URL
const API_BASE_URL = 'https://your-api-server.com/api';

// 인증 토큰 (로그인 시 저장)
let authToken = localStorage.getItem('authToken');

// 상품 교환 함수 (수정 버전)
async function exchangeProduct(product) {
    try {
        const response = await fetch(`${API_BASE_URL}/exchange`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                productId: product.id,
                points: product.price
            })
        });

        if (!response.ok) {
            throw new Error('네트워크 오류');
        }

        const result = await response.json();

        if (result.success) {
            // 포인트 업데이트
            currentUser.points = result.remainingPoints;
            updatePoints();

            // 성공 메시지
            alert(`🎉 교환 완료!\n\n${product.icon} ${product.name}\n\n교환번호: ${result.exchangeNo}\n상품권 코드: ${result.voucherCode}\n\n※ 상품권은 등록하신 이메일로 발송됩니다.\n※ 남은 포인트: ${result.remainingPoints.toLocaleString()} P`);

            // 화면 새로고침
            loadProducts();
            loadExchangeHistory();
        } else {
            alert(`❌ 교환 실패\n\n${result.message}`);
        }

    } catch (error) {
        console.error('교환 오류:', error);
        alert('❌ 서버와 통신 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.');
    }
}

// 교환 내역 조회 (수정 버전)
async function loadExchangeHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/exchange/history`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const result = await response.json();
        const list = document.getElementById('exchangeHistoryList');

        if (result.exchanges.length === 0) {
            list.innerHTML = '<p style="color: #999; margin-top: 15px; text-align: center;">아직 교환 내역이 없습니다.</p>';
            return;
        }

        list.innerHTML = result.exchanges.map(exchange => `
            <div class="exchange-history-item">
                <div class="exchange-date">${new Date(exchange.exchangedAt).toLocaleString('ko-KR')}</div>
                <div class="exchange-product">${exchange.productIcon} ${exchange.productName}</div>
                <div class="exchange-points">-${exchange.price.toLocaleString()} P</div>
                <div style="font-size: 12px; color: #666; margin-top: 5px;">
                    교환번호: ${exchange.exchangeNo}<br>
                    상품권 코드: ${exchange.voucherCode}
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('내역 조회 오류:', error);
    }
}
```

---

## 보안 고려사항

### 1. ❌ 절대 하지 말아야 할 것

```javascript
// ❌ 나쁜 예: API 키를 프론트엔드에 노출
const GIFTISHOW_API_KEY = 'sk_live_1234567890abcdef'; // 절대 금지!

function exchangeProduct() {
    // 클라이언트에서 직접 외부 API 호출 - 보안 취약!
    fetch('https://api.giftishow.com/v1/gifticon/send', {
        headers: {
            'X-API-Key': GIFTISHOW_API_KEY  // ❌ API 키 노출
        }
    });
}
```

**문제점:**
- API 키가 브라우저에 노출됨
- 누구나 개발자 도구로 키를 탈취 가능
- 무단 사용으로 큰 금전적 손실 발생 가능

### 2. ✅ 올바른 방법

**구조:**
```
사용자 브라우저 → 우리 백엔드 서버 → 외부 API
              (인증)           (API 키 사용)
```

**백엔드에서 처리:**
```javascript
// ✅ 좋은 예: 백엔드에서 API 호출
// .env 파일
GIFTISHOW_API_KEY=sk_live_1234567890abcdef

// server.js
const GIFTISHOW_API_KEY = process.env.GIFTISHOW_API_KEY;

app.post('/api/exchange', authenticateUser, async (req, res) => {
    // 1. 사용자 인증 확인
    if (!req.user) {
        return res.status(401).json({ error: '인증 필요' });
    }

    // 2. 포인트 검증 (서버에서)
    const user = await db.users.findById(req.user.id);
    if (user.points < req.body.points) {
        return res.status(400).json({ error: '포인트 부족' });
    }

    // 3. 외부 API 호출 (서버에서)
    const response = await axios.post(
        'https://api.giftishow.com/v1/gifticon/send',
        { ... },
        {
            headers: {
                'X-API-Key': GIFTISHOW_API_KEY  // ✅ 서버에서만 사용
            }
        }
    );

    // 4. 응답 전송
    res.json({ success: true, ... });
});
```

### 3. 추가 보안 조치

**A. Rate Limiting (요청 제한)**
```javascript
const rateLimit = require('express-rate-limit');

const exchangeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15분
    max: 5, // 최대 5회
    message: '너무 많은 교환 요청입니다. 잠시 후 다시 시도하세요.'
});

app.post('/api/exchange', exchangeLimiter, async (req, res) => {
    // ...
});
```

**B. 이중 인증**
```javascript
app.post('/api/exchange', async (req, res) => {
    // SMS/이메일 인증 코드 확인
    const isVerified = await verifyAuthCode(
        req.user.phone,
        req.body.authCode
    );

    if (!isVerified) {
        return res.status(403).json({
            error: '인증 코드가 올바르지 않습니다.'
        });
    }

    // 교환 처리...
});
```

**C. 로깅 및 모니터링**
```javascript
app.post('/api/exchange', async (req, res) => {
    // 모든 교환 시도 로깅
    await db.logs.insert({
        userId: req.user.id,
        action: 'exchange_attempt',
        productId: req.body.productId,
        points: req.body.points,
        ip: req.ip,
        timestamp: new Date()
    });

    // 의심스러운 패턴 감지
    const recentAttempts = await db.logs.countRecent(req.user.id, '5m');
    if (recentAttempts > 10) {
        await alertAdmin('비정상적인 교환 시도 감지', req.user.id);
        return res.status(429).json({ error: '잠시 후 다시 시도하세요.' });
    }

    // 교환 처리...
});
```

---

## 단계별 전환 로드맵

### Phase 1: 백엔드 기본 구조 (2-3주)
- [ ] 데이터베이스 설계
- [ ] 사용자 인증 시스템
- [ ] 기본 API 엔드포인트
- [ ] 프론트엔드 연동

### Phase 2: 상품권 API 테스트 (2-3주)
- [ ] 상품권 제공업체 선정
- [ ] 계약 체결 및 API 키 발급
- [ ] 테스트 환경 연동
- [ ] 오류 처리 및 예외 케이스 테스트

### Phase 3: 결제 시스템 (필요시, 2주)
- [ ] PG사 선정 (토스페이먼츠, 이니시스 등)
- [ ] 결제 모듈 연동
- [ ] 포인트 충전 기능

### Phase 4: 보안 강화 (1-2주)
- [ ] SSL/TLS 인증서 적용
- [ ] Rate Limiting
- [ ] 이중 인증
- [ ] 로깅 시스템

### Phase 5: 운영 및 모니터링 (지속)
- [ ] 서버 모니터링
- [ ] 오류 추적
- [ ] 사용자 피드백 수집
- [ ] 지속적 개선

---

## 비용 예상

### 상품권 API 이용료

| 제공업체 | 초기 비용 | 월 이용료 | 수수료 |
|---------|----------|----------|--------|
| 해피머니 | 약 100만원 | 10-30만원 | 2-5% |
| 기프티쇼 | 약 50만원 | 10-20만원 | 3-7% |
| 개별 브랜드 | 협의 | 협의 | 5-10% |

### 서버 운영 비용

| 항목 | 예상 비용 (월) |
|-----|---------------|
| 클라우드 서버 (AWS, GCP) | 5-20만원 |
| 데이터베이스 | 3-10만원 |
| SSL 인증서 | 무료-5만원 |
| 도메인 | 1-2만원 |
| **합계** | **9-37만원** |

---

## 참고 자료

### 공식 문서
- [해피머니 B2B 서비스](https://www.happymoney.co.kr/business)
- [기프티쇼 API 문서](https://www.giftishow.com/business/api)
- [카카오 비즈니스](https://business.kakao.com)

### 개발 리소스
- [Express.js 공식 문서](https://expressjs.com)
- [Axios HTTP 클라이언트](https://axios-http.com)
- [JWT 인증](https://jwt.io)

### 보안
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js 보안 체크리스트](https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices)

---

## 문의

실제 API 연동이 필요하신 경우:

1. **상품권 제공업체 문의**
   - 각 업체 B2B 담당 부서에 연락
   - API 문서 및 계약 조건 확인

2. **백엔드 개발**
   - Node.js, Python, Java 개발자 필요
   - 예상 개발 기간: 1-2개월

3. **운영 인프라**
   - AWS, GCP, Azure 등 클라우드 서비스
   - DevOps 엔지니어 권장

---

**마지막 업데이트:** 2025-01-09
**버전:** 1.0
**작성자:** Claude (Anthropic)
