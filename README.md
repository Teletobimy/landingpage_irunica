# 🚀 IRUNICA 맞춤형 랜딩 페이지 (Model: Nano Banana)

**Hyper-Personalized B2B Private Labeling Experience**

이 구조는 텍스트는 **최신 Gemini 3 Flash**가 담당하고, 이미지는 **Nano Banana (Gemini 2.5 Flash Image)**가 담당하는 초고속 아키텍처입니다.

1.  **초고속 추론**: Gemini 3 Flash로 즉각적인 카피라이팅.
2.  **일관된 브랜드화**: Nano Banana 모델을 활용해 IRUNICA의 고유 용기 형태를 유지하면서 고객사의 로고만 자연스럽게 합성.

## 🎯 핵심 목표
*   **실시간 초개인화**: 로딩 바가 차오르는 5~10초 동안 제안서와 제품 이미지를 동시 생성.
*   **Nano Banana 활용**: "가짜 같은 이미지"가 아니라, 실제 판매 중인 용기에 로고만 합성하여 B2B 신뢰도 상승.
*   **비즈니스 임팩트**: "이미 우리 제품이 준비되어 있다"는 강력한 시각적 메시지 전달.

## 🛠 Tech Stack (Updated)
*   **Frontend**: Next.js 14 (App Router), Framer Motion
*   **Backend**: Google Cloud Run (Full SSR & API)
*   **Database/Cache**: Firestore (Result Caching), Google Sheets (Whitelist)
*   **AI Orchestration (Vertex AI)**:
    *   **Text**: `gemini-3-flash-preview` (전략적 제안서 작성)
    *   **Image**: `gemini-2.5-flash-image` (Nano Banana Model - 로고/컬러 합성 특화)
*   **Notification**: Firebase Cloud Functions + Nodemailer

## 🌊 AI 기반 사용자 흐름 (Workflow)
1.  **Identity Check**: `?vip=COMPANY` 접속 → 구글 시트 검증.
2.  **Parallel Generation (5~10초의 예술)**:
    *   **Gemini 3 Flash**: "왜 [COMPANY]가 이루니카를 선택해야 하는가?" 텍스트 생성 (1~2초).
    *   **Nano Banana**: [COMPANY]의 로고가 박힌 이루니카 용기 렌더링 5종 (병렬 처리).
3.  **Data Fusion**: 생성된 모든 자산을 Firestore에 캐싱.
4.  **Interactive Delivery**: 로딩 바 완료와 동시에 맞춤형 페이지 공개.

## 💻 Tech Implementation Highlights

### 1. AI 오케스트레이션 (`lib/ai-service.ts`)
텍스트는 창작하고, 이미지는 '합성'에 집중하여 속도와 퀄리티를 동시에 잡습니다.

```typescript
// Nano Banana: 일관성 있는 합성 로직
const [textResult, ...imageResults] = await Promise.all([
    textModel.generateContent(`Proposal for ${companyName}...`),
    nanoBananaModel.generateContent({ 
        contents: [{ role: 'user', parts: [{ 
            text: `Synthesize '${companyName}' logo on standard cosmetic bottle. Maintain studio lighting.` 
        }] }] 
    })
]);
```

### 2. 페이지 로딩 및 트리거 (`app/[vip]/page.tsx`)
*   **캐시 우선 전략**: 방문 기록이 있으면 즉시 로딩 (0.5초).
*   **신규 방문**: 시네마틱 로딩을 보여주며 백그라운드에서 AI 생성 시작.

### 3. 방문객 알림 시스템 (`functions/index.js`)
잠재 고객이 일정 수(예: 10명) 모이면 관리자에게 리포트 발송.

```javascript
// Firestore Trigger
exports.sendVipReport = functions.firestore.document('visitor_logs/{id}')
    .onCreate(async (snap) => {
        // 10명 도달 시 이메일 발송 로직
});
```

## � 폴더 구조
```
├── app/
│   ├── [vip]/
│   │   ├── page.tsx       (메인 로직: 캐시 확인 -> AI 호출)
│   │   ├── loading.tsx    (시네마틱 로딩 화면)
│   │   └── not-found.tsx  (등록되지 않은 VIP용 기본 페이지)
├── lib/
│   ├── ai-service.ts      (Gemini 3 & Nano Banana 호출)
│   ├── google-sheets.ts   (VIP 리스트 검증)
│   └── firebase.ts        (Firestore & Auth)
├── functions/
│   └── index.js           (이메일 알림 트리거)
└── public/
    └── assets/            (기본 IRUNICA 용기 소스 등)
```

## 📈 Roadmap
- [x] 아키텍처 설계 및 기술 스택 확정 (Nano Banana 도입)
- [ ] **Step 1**: Next.js + Cloud Run 환경 구축 및 배포
- [ ] **Step 2**: Gemini 3 Flash 텍스트 프롬프트 튜닝
- [ ] **Step 3**: Nano Banana 이미지 합성 파이프라인 구축 (일관성 테스트)
- [ ] **Step 4**: 알림 시스템 및 통합 테스트

## 🚨 CRITICAL CONFIGURATION RULES (DO NOT CHANGE)

### 1. Image Generation Model
*   **Model Name**: `gemini-2.5-flash-image` (Fixed)
*   **Method**: REST API only
*   **Payload**: MUST include `responseModalities: ["IMAGE"]`
*   **Reference Code**:
    ```typescript
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            responseModalities: ["IMAGE"],
            candidateCount: 1
        }
    };
    ```
*   **Forbidden**: Do NOT use Unsplash fallback. Do NOT switch to `imagen-3.0`.

### 2. API Configuration
*   **Auth**: Use `GOOGLE_GEMINI_API_KEY` (AI Studio Key).
*   **EndpointBase**: `https://generativelanguage.googleapis.com/v1beta/models/`
# Deployment trigger - Sat Feb  7 17:27:04 KST 2026
