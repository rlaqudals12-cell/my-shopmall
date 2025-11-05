/**
 * TODO 문서 내용
 * Vercel 배포 환경에서 파일 읽기 문제를 해결하기 위해 코드에 직접 포함
 * 
 * 실제 TODO.md 파일은 docs/TODO.md에 있으며, 이 파일은 그 내용을 복사한 것입니다.
 */

export const todoContent = `# 쇼핑몰 MVP 개발 TODO

## Phase 1: 기본 인프라 (1주)

- [ ] Next.js 프로젝트 셋업
  - [x] Next.js 프로젝트 초기화 (완료)
  - [x] Clerk 연동 설정 (완료)
  - [x] Supabase 프로젝트 생성 (완료)
  - [ ] 환경 변수 설정 확인
    - [ ] \`.env.local\` 파일 생성 (\`.env.example\` 참고하여 생성 필요)
    - [ ] Clerk 키 설정 확인
    - [ ] Supabase 키 설정 확인
    - [ ] Toss Payments 키 설정 (Phase 4 준비)

- [x] Supabase 데이터베이스 스키마 (완료)
  - [x] 상품 테이블 생성 (완료)
  - [x] 장바구니 테이블 생성 (완료)
  - [x] 주문 테이블 생성 (완료)
  - [x] 주문 상세 테이블 생성 (완료)
  - [x] 샘플 데이터 삽입 (완료 - 20개 상품)

- [x] 기본 레이아웃 및 라우팅 (완료)
  - [x] \`app/layout.tsx\` 수정 (쇼핑몰 레이아웃) - 완료
  - [x] \`components/Navbar.tsx\` 수정 (쇼핑몰 네비게이션) - 완료
    - [x] 로고 영역
    - [x] 카테고리 메뉴
    - [x] 장바구니 아이콘 (클릭 시 장바구니 페이지 이동)
    - [x] 사용자 프로필/로그인 버튼
  - [x] Footer 컴포넌트 생성 (\`components/Footer.tsx\`) - 완료
  - [ ] 기본 페이지 구조 설정

- [x] 타입 정의 (완료)
  - [x] \`types/product.ts\` - 상품 타입 정의
  - [x] \`types/cart.ts\` - 장바구니 타입 정의
  - [x] \`types/order.ts\` - 주문 타입 정의

- [x] 공통 컴포넌트 (완료)
  - [x] \`components/ui/card.tsx\` (shadcn 추가)
  - [x] \`components/ui/badge.tsx\` (shadcn 추가)
  - [x] \`components/ui/select.tsx\` (shadcn 추가)
  - [x] \`components/ui/separator.tsx\` (shadcn 추가)
  - [x] \`components/ui/skeleton.tsx\` (shadcn 추가)

---

## Phase 2: 상품 기능 (1주)

- [x] 홈페이지 (완료)
  - [x] \`app/page.tsx\` 수정 - 완료
    - [x] 히어로 섹션
      - [x] 메인 배너/이미지
      - [x] 환영 메시지 또는 프로모션 문구
      - [x] CTA 버튼 (상품 보기 등)
    - [x] 상품 목록 섹션
      - [x] 최신 상품 그리드 표시 (8-12개)
      - [x] 상품 카드 컴포넌트 재사용
      - [x] "더보기" 버튼으로 상품 목록 페이지 이동
      - [x] 로딩 상태 처리
    - [x] 카테고리 섹션
      - [x] 주요 카테고리 아이콘/이미지 표시
      - [x] 카테고리별 클릭 시 필터된 상품 목록으로 이동
      - [ ] 카테고리별 대표 상품 미리보기 (선택)
    - [x] 인기 상품 섹션
      - [x] 인기 상품 그리드 표시 (4-8개)
      - [x] 판매량 또는 조회수 기준 정렬 (현재는 최신순으로 대체)
      - [x] "인기" 배지 표시
      - [x] 상품 카드 컴포넌트 재사용

- [x] 상품 목록 페이지 (완료)
  - [x] \`app/products/page.tsx\` 생성 - 완료
    - [x] 상품 카드 그리드 레이아웃
    - [ ] 무한 스크롤 또는 페이지네이션 (구현 준비됨, 필요시 추가)
    - [x] 로딩 상태 처리
  - [x] \`components/product-card.tsx\` 생성 - 완료
    - [x] 상품 이미지
    - [x] 상품명, 가격
    - [x] 장바구니 추가 버튼 (UI 완료, Phase 3에서 기능 구현)
    - [x] 클릭 시 상세 페이지 이동

- [x] 카테고리 필터링 (완료)
  - [x] \`app/products/page.tsx\`에 필터 기능 추가 - 완료
    - [x] 카테고리별 필터 (전체, electronics, clothing, books, food, sports, beauty, home)
    - [x] 정렬 기능 (가격순, 최신순)
  - [x] URL 쿼리 파라미터로 필터 상태 관리
  - [x] \`components/products-filter.tsx\` 생성 - 완료

- [x] 상품 상세 페이지 (완료)
  - [x] \`app/products/[id]/page.tsx\` 생성 - 완료
    - [x] 상품 이미지 갤러리
    - [x] 상품 정보 (이름, 설명, 가격, 재고)
    - [x] 수량 선택
    - [x] 장바구니 추가 버튼 (UI 완료, Phase 3에서 기능 구현)
    - [x] 바로 구매 버튼 (UI 완료, Phase 3에서 기능 구현)
  - [x] \`components/product-detail.tsx\` 생성 - 완료 (재사용 가능한 컴포넌트)
  - [x] \`components/product-image-gallery.tsx\` 생성 - 완료

- [ ] 어드민 상품 등록 (Supabase 직접)
  - [ ] Supabase 대시보드에서 직접 상품 등록
  - [ ] 상품 데이터 구조 확인 (이름, 설명, 가격, 카테고리, 재고 등)
  - [ ] 이미지 업로드는 Supabase Storage 사용 (나중에)

**참고**: 
- 타입 정의는 Phase 1에서 완료됨 (\`types/product.ts\`, \`types/cart.ts\`, \`types/order.ts\` 존재)
- Server Actions 구현 완료: \`actions/products.ts\`에 \`getProducts()\`, \`getProductById()\`, \`getProductsByCategory()\`, \`getLatestProducts()\`, \`getPopularProducts()\` 함수 생성
- 상품 이미지 처리: 이미지가 없을 경우 placeholder 이미지 표시, Next.js Image 컴포넌트 사용 완료
- \`next.config.ts\`에 placeholder 이미지 도메인 추가 완료

---

## Phase 3: 장바구니 & 주문 (1주)

- [ ] 장바구니 기능
  - [ ] \`app/cart/page.tsx\` 생성
    - [ ] 장바구니 아이템 목록
    - [ ] 수량 변경
    - [ ] 아이템 삭제
    - [ ] 총 금액 계산
    - [ ] 주문하기 버튼
    - [ ] 빈 장바구니 상태 처리 ("장바구니가 비어있습니다" 메시지, "상품 둘러보기" 버튼)
    - [ ] 로그인하지 않은 경우 안내 메시지
  - [ ] \`components/cart-item.tsx\` 생성
    - [ ] 상품 이미지 (클릭 시 상세 페이지 이동)
    - [ ] 상품명, 가격 (단가)
    - [ ] 수량 변경 (증가/감소 버튼, 직접 입력)
    - [ ] 소계 (단가 × 수량)
    - [ ] 삭제 버튼
    - [ ] 재고 상태 표시 (재고 부족 경고)
    - [ ] 카테고리 정보 (선택)
  - [ ] \`components/cart-summary.tsx\` 생성
    - [ ] 총 상품 개수
    - [ ] 총 금액 계산 (모든 상품의 단가 × 수량 합계)
    - [ ] 배송비 안내 (선택, 나중에)
    - [ ] 주문하기 버튼
    - [ ] 장바구니 비우기 버튼 (선택)

- [ ] Server Actions (장바구니)
  - [ ] \`actions/cart.ts\` 생성
    - [ ] \`getCartItems(clerkId)\` - 장바구니 조회 (상품 정보 포함)
    - [ ] \`addToCart(clerkId, productId, quantity)\` - 장바구니 추가
      - [ ] 이미 존재하는 상품이면 수량 증가 (UNIQUE 제약 활용)
      - [ ] 재고 확인 로직 포함
    - [ ] \`updateCartItem(cartItemId, quantity)\` - 수량 변경
      - [ ] 재고량 초과 방지
    - [ ] \`removeCartItem(cartItemId)\` - 아이템 삭제
    - [ ] \`clearCart(clerkId)\` - 장바구니 비우기
    - [ ] \`getCartItemCount(clerkId)\` - 장바구니 아이템 총 개수 (Navbar용)

- [ ] 장바구니 담기 Dialog
  - [ ] \`components/add-to-cart-dialog.tsx\` 생성
    - [ ] 장바구니 담기 성공 시 표시
    - [ ] "장바구니로 이동" 버튼
    - [ ] "계속 쇼핑하기" 버튼
    - [ ] 담긴 상품 정보 미리보기 (선택)

- [ ] 상품 상세 페이지 장바구니 기능 연동
  - [ ] \`components/product-detail.tsx\` 수정
    - [ ] \`handleAddToCart()\` 함수 구현
    - [ ] Server Action 호출
    - [ ] 성공 시 Dialog 표시
    - [ ] 에러 처리 (재고 부족, 로그인 필요 등)

- [ ] 상품 카드 장바구니 기능 연동
  - [ ] \`components/product-card.tsx\` 수정
    - [ ] 장바구니 추가 버튼 클릭 시 기능 구현
    - [ ] 기본 수량 1개로 추가
    - [ ] 성공 시 Toast 또는 Dialog (선택)

- [ ] Navbar 장바구니 UI 개선
  - [ ] \`components/Navbar.tsx\` 수정
    - [ ] 장바구니 아이콘을 왼쪽으로 이동 (로고와 카테고리 메뉴 사이)
    - [ ] 장바구니 아이템 개수 배지 표시
    - [ ] 클릭 시 \`/cart\` 이동
    - [ ] 로그인하지 않은 경우 숨김 처리

- [ ] 장바구니 상태 관리
  - [ ] \`hooks/use-cart.ts\` 생성 (선택사항: 클라이언트 상태 관리)
    - [ ] 장바구니 아이템 개수 실시간 업데이트
    - [ ] Optimistic UI 업데이트

- [ ] 주문 프로세스
  - [ ] \`app/checkout/page.tsx\` 생성
    - [ ] 주문 상품 확인
    - [ ] 배송지 입력 폼
    - [ ] 주문 요약
    - [ ] 결제하기 버튼
  - [ ] \`components/checkout-form.tsx\` 생성
  - [ ] \`components/order-summary.tsx\` 생성

- [ ] Server Actions (주문)
  - [ ] \`actions/orders.ts\` 생성
    - [ ] \`createOrder(clerkId, items, shippingAddress)\` - 주문 생성
    - [ ] \`getOrders(clerkId)\` - 주문 목록 조회
    - [ ] \`getOrderById(orderId)\` - 주문 상세 조회
    - [ ] \`updateOrderStatus(orderId, status)\` - 주문 상태 업데이트

- [ ] 폼 유효성 검사
  - [ ] \`lib/validations/order.ts\` 생성 (Zod 스키마)
  - [ ] react-hook-form 사용

---

## Phase 4: 결제 통합 (1주) - Toss Payments v1

- [ ] Toss Payments 설정 (테스트 환경)
  - [ ] 환경 변수 설정
    - [ ] \`NEXT_PUBLIC_TOSS_CLIENT_KEY\` 설정 (테스트용 클라이언트 키)
    - [ ] \`TOSS_SECRET_KEY\` 설정 (테스트용 시크릿 키, 서버 전용)
    - [ ] \`MOCK_PAYMENT\` 환경 변수 설정 (API 키 미발급 시 모의 결제 모드)
  - [ ] Toss Payments SDK 설치 및 설정
    - [ ] \`@tosspayments/payment-sdk\` 또는 결제 위젯 스크립트 로드
    - [ ] v1 기준으로 구현

- [ ] 결제 페이지 구현 (\`app/checkout/page.tsx\`)
  - [ ] 주문 상품 확인
    - [ ] 장바구니에서 전달받은 상품 목록 표시
    - [ ] 각 상품의 이미지, 이름, 가격, 수량 표시
    - [ ] 총 금액 계산 (상품 금액 합계)
  - [ ] 배송지 입력 폼
    - [ ] 수령인 이름 (필수)
    - [ ] 연락처 (필수, 전화번호 형식)
    - [ ] 배송 주소 (우편번호, 기본 주소, 상세 주소)
    - [ ] 주문 메모 (선택)
  - [ ] 주문 요약
    - [ ] 총 상품 금액
    - [ ] 배송비 (선택사항, 나중에)
    - [ ] 총 결제 금액
  - [ ] 결제하기 버튼
    - [ ] 클릭 시 Toss Payments 결제창 열기
    - [ ] 폼 유효성 검사 후 결제 프로세스 시작

- [ ] 결제 UI 컴포넌트
  - [ ] \`components/payment-widget.tsx\` 생성
    - [ ] Toss Payments v1 결제 위젯 로드
    - [ ] 결제 요청 생성 (\`paymentKey\`, \`orderId\`, \`amount\`, \`orderName\` 등)
    - [ ] 결제 성공/실패 콜백 처리
    - [ ] 테스트 카드 정보 안내 (필요시)
  - [ ] \`components/checkout-form.tsx\` 생성
    - [ ] 배송지 입력 폼 (react-hook-form + Zod)
    - [ ] 폼 유효성 검사
  - [ ] \`components/order-summary.tsx\` 생성
    - [ ] 주문 요약 (총 금액, 상품 목록)

- [ ] Server Actions (결제 및 주문)
  - [ ] \`actions/payments.ts\` 생성
    - [ ] \`createPaymentRequest(orderId, amount, orderName, customerName, successUrl, failUrl)\`
      - [ ] Toss Payments 결제 요청 생성
      - [ ] 테스트 환경에서는 모의 데이터 사용 가능
    - [ ] \`confirmPayment(paymentKey, orderId, amount)\`
      - [ ] 결제 승인 처리
      - [ ] 테스트 환경에서는 승인 로직 시뮬레이션
    - [ ] 모의 결제 모드 지원 (API 키 미발급 상황 대응)
      - [ ] \`MOCK_PAYMENT=true\`일 때 실제 API 호출 스킵
      - [ ] 테스트용 "결제 승인" 버튼으로 결제 성공 플로우 테스트
  - [ ] \`actions/orders.ts\` 생성/수정
    - [ ] \`createOrder(clerkId, items, shippingAddress, orderNote)\`
      - [ ] 주문 생성 (status = 'pending')
      - [ ] orders 테이블에 주문 저장
      - [ ] order_items 테이블에 주문 상품 저장
    - [ ] \`confirmOrder(orderId, paymentKey)\`
      - [ ] 결제 승인 후 호출
      - [ ] orders.status = 'confirmed'로 업데이트
      - [ ] 장바구니 비우기 (clearCart 호출)
    - [ ] \`getOrderById(orderId, clerkId)\` - 주문 상세 조회 (마이페이지용)
    - [ ] \`getOrders(clerkId)\` - 주문 목록 조회

- [ ] 결제 성공/실패 페이지
  - [ ] \`app/payment/success/page.tsx\` 생성
    - [ ] 결제 성공 메시지
    - [ ] 주문 번호 표시
    - [ ] 주문 상세 보기 링크
    - [ ] 홈으로 이동 버튼
  - [x] \`app/payment/fail/page.tsx\` 생성
    - [ ] 결제 실패 메시지
    - [ ] 실패 사유 표시
    - [ ] 다시 시도 버튼 (장바구니로 이동)
    - [ ] 홈으로 이동 버튼

- [ ] 폼 유효성 검사
  - [ ] \`lib/validations/checkout.ts\` 생성 (Zod 스키마)
    - [ ] 수령인 이름 (필수, 최소 2자)
    - [ ] 연락처 (필수, 전화번호 형식)
    - [ ] 배송 주소 (필수)
    - [ ] 주문 메모 (선택, 최대 500자)
    - [ ] react-hook-form과 연동

- [ ] 에러 처리 및 로딩 상태
  - [ ] 결제 실패 시 사용자 친화적 에러 메시지
  - [ ] 네트워크 에러 처리
  - [ ] 재고 부족 시 주문 생성 방지
  - [ ] 중복 주문 방지
  - [ ] 로딩 상태 표시 (결제 요청 중)

- [ ] 결제 플로우 검증
  - [ ] 장바구니 → "결제하기" → 결제창 열기
  - [ ] 결제창에서 테스트 카드 입력 → 승인
  - [ ] 성공 시 DB에 주문 저장, 장바구니 비우기, orders.status = 'confirmed'
  - [ ] 실패 시 안내만 제공

**참고**: 
- Toss Payments v1 사용 (v2는 사업자 등록 필요)
- 테스트 결제까지만 구현 (DB 스키마 변경 없음)
- 결제 완료 시 orders.status = 'confirmed'만 업데이트
- API 키 미발급 상황을 고려하여 모의 결제 모드 구현

---

## Phase 5: 마이페이지 (0.5주)

- [ ] 마이페이지 레이아웃
  - [ ] \`app/my/page.tsx\` 생성
    - [ ] 프로필 정보 섹션
      - [ ] 사용자 이름 (Clerk에서 가져오기)
      - [ ] 이메일 주소
      - [ ] 회원가입일 (선택)
      - [ ] 프로필 이미지 (Clerk UserButton 사용 가능)
    - [ ] 주문 통계 섹션 (선택사항)
      - [ ] 총 주문 건수
      - [ ] 진행 중인 주문 수
      - [ ] 완료된 주문 수
      - [ ] 총 구매 금액 (선택)
    - [ ] 빠른 링크
      - [ ] 주문 내역 보기 → \`/my/orders\`
      - [ ] 장바구니 → \`/cart\`
      - [ ] 홈으로 → \`/\`

- [ ] 주문 내역 조회
  - [ ] \`app/my/orders/page.tsx\` 생성
    - [ ] 주문 목록 표시
    - [ ] 주문 상태 표시
    - [ ] 주문일, 총 금액 표시
    - [ ] 주문 상세 보기 링크
    - [ ] 로딩 상태 처리 (Suspense + Skeleton)
    - [ ] 빈 주문 내역 상태 처리
    - [ ] 정렬 옵션 (선택사항: 최신순, 오래된순, 금액순)
  - [ ] \`components/order-list.tsx\` 생성
    - [ ] 주문 카드 그리드 또는 리스트 레이아웃
    - [ ] 주문 번호 (또는 주문 ID 일부)
    - [ ] 주문일 (YYYY-MM-DD 형식)
    - [ ] 주문 상태 배지
    - [ ] 총 금액
    - [ ] 주문 상품 개수 또는 대표 상품명
    - [ ] 주문 상세 보기 버튼
  - [ ] \`components/order-status-badge.tsx\` 생성
    - [ ] 상태별 색상 구분:
      - [ ] \`pending\`: 노란색 (대기)
      - [ ] \`confirmed\`: 파란색 (확인됨)
      - [ ] \`shipped\`: 보라색 (배송 중)
      - [ ] \`delivered\`: 초록색 (배송 완료)
      - [ ] \`cancelled\`: 회색 (취소됨)

- [ ] 주문 상세 보기
  - [ ] \`app/my/orders/[id]/page.tsx\` 생성
    - [ ] 주문 정보 섹션
      - [ ] 주문 번호 (전체 ID 또는 일부)
      - [ ] 주문일시
      - [ ] 주문 상태 배지
      - [ ] 총 결제 금액
    - [ ] 주문 상품 목록
      - [ ] 각 상품의 이미지 (product_id로 조회 또는 placeholder)
      - [ ] 상품명
      - [ ] 수량
      - [ ] 단가
      - [ ] 소계 (단가 × 수량)
      - [ ] 상품 클릭 시 상세 페이지 이동 (선택)
    - [ ] 배송지 정보
      - [ ] 수령인 이름
      - [ ] 연락처
      - [ ] 우편번호
      - [ ] 기본 주소
      - [ ] 상세 주소 (있는 경우)
    - [ ] 결제 정보
      - [ ] 결제 금액
      - [ ] 결제 수단 (선택, 나중에)
      - [ ] 결제 일시 (주문 생성 일시)
    - [ ] 주문 메모
      - [ ] 주문 메모가 있는 경우에만 표시
    - [ ] 주문 취소 버튼
      - [ ] \`status\`가 \`'pending'\`인 경우만 표시
      - [ ] 확인 Dialog 후 취소 처리
      - [ ] 취소 성공 시 주문 상태를 \`'cancelled'\`로 업데이트
    - [ ] 액션 버튼
      - [ ] 주문 내역으로 돌아가기
      - [ ] 홈으로 이동

- [ ] Server Actions (마이페이지)
  - [ ] \`actions/orders.ts\`에 추가
    - [ ] \`cancelOrder(orderId)\` - 주문 취소
      - [ ] 주문 소유권 확인 (clerk_id 체크)
      - [ ] 주문 상태 확인 (\`pending\` 또는 \`confirmed\`만 취소 가능)
      - [ ] 주문 상태를 \`'cancelled'\`로 업데이트
      - [ ] 에러 처리 (이미 취소됨, 배송 중 등 취소 불가 상태)

- [ ] 주문 취소 Dialog 컴포넌트
  - [ ] \`components/cancel-order-dialog.tsx\` 생성
    - [ ] 주문 취소 확인 Dialog
    - [ ] 취소 사유 입력 (선택)
    - [ ] 취소 버튼 클릭 시 Server Action 호출
    - [ ] 성공/실패 처리

- [ ] Clerk 사용자 정보 조회
  - [ ] Server Component에서 Clerk 사용자 정보 조회
    - [ ] \`clerkClient()\` 사용하여 사용자 정보 가져오기
    - [ ] 이름, 이메일, 프로필 이미지 등

**참고**: 
- 주문 상품 이미지는 \`order_items.product_id\`로 \`products\` 테이블에서 조회 가능
- 주문 시점의 가격과 상품명은 \`order_items\` 테이블에 저장되어 있음
- 주문 취소는 \`pending\` 또는 \`confirmed\` 상태에서만 가능
- 이미 \`actions/orders.ts\`에 \`getOrders()\`, \`getOrderById()\` 함수가 구현되어 있음

---

## Phase 6: 테스트 & 배포 (0.5주)

- [ ] 기능 테스트
  - [ ] 전체 사용자 플로우 테스트
    - [ ] 회원가입/로그인
    - [ ] 상품 조회 및 필터링
    - [ ] 장바구니 추가/수정/삭제
    - [ ] 주문 생성
    - [ ] 결제 프로세스
    - [ ] 주문 내역 조회
  - [ ] 에러 케이스 테스트
    - [ ] 재고 부족 시 처리
    - [ ] 결제 실패 시 처리
    - [ ] 네트워크 에러 처리

- [ ] UI/UX 개선
  - [ ] 로딩 상태 개선
  - [ ] 에러 메시지 개선
  - [ ] 반응형 디자인 검토
  - [ ] 접근성 검토

- [ ] 성능 최적화
  - [ ] 이미지 최적화 확인
  - [ ] 데이터베이스 쿼리 최적화
  - [ ] 캐싱 전략 적용 (필요시)

- [ ] 버그 수정
  - [ ] 발견된 버그 목록 작성
  - [ ] 우선순위별 버그 수정

- [ ] 배포 준비
  - [ ] 환경 변수 설정 (프로덕션)
  - [ ] Vercel 프로젝트 생성
  - [ ] Vercel 배포 설정
  - [ ] 도메인 연결 (선택)
  - [ ] Supabase 프로덕션 환경 확인

- [ ] 배포 후 검증
  - [ ] 프로덕션 환경에서 전체 플로우 테스트
  - [ ] 결제 테스트 (테스트 모드)
  - [ ] 모니터링 설정 (선택)

---

## 추가 개선사항 (MVP 이후)

- [ ] 검색 기능
- [ ] 상품 리뷰
- [ ] 찜하기 기능
- [ ] 쿠폰/할인 기능
- [ ] 관리자 페이지
- [ ] 이메일 알림
- [ ] 배송 추적
`;

