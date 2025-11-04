# Vercel 배포 가이드

## 📦 배포 전 확인사항

### 1. Git 상태 확인
모든 변경사항이 커밋되고 푸시되었는지 확인:

```bash
git status
git log --oneline -3
```

### 2. 로컬 빌드 테스트
배포 전에 로컬에서 빌드가 성공하는지 확인:

```bash
cd nextjs-supabase-boilerplate-main
pnpm install
pnpm run build
```

빌드가 성공하면 배포 준비가 완료된 것입니다.

---

## 🚀 Vercel 배포 방법

### 방법 1: 자동 배포 (GitHub 연동)

이미 GitHub 저장소가 Vercel에 연결되어 있다면, **Git에 푸시하면 자동으로 배포됩니다**.

1. **변경사항 커밋 및 푸시**
   ```bash
   git add .
   git commit -m "feat: 최신 기능 추가"
   git push origin main
   ```

2. **Vercel 대시보드 확인**
   - Vercel 대시보드 → 프로젝트 → "Deployments" 탭
   - 새 배포가 자동으로 시작됩니다
   - 빌드 완료까지 약 1-2분 소요

### 방법 2: 수동 배포 (Vercel CLI)

Vercel CLI를 사용하여 수동으로 배포:

1. **Vercel CLI 설치**
   ```bash
   npm install -g vercel
   ```

2. **로그인**
   ```bash
   vercel login
   ```

3. **배포**
   ```bash
   cd nextjs-supabase-boilerplate-main
   vercel
   ```
   
   - 첫 배포 시 프로젝트 설정 질문에 답변
   - 프로덕션 배포: `vercel --prod`

### 방법 3: Vercel 대시보드에서 직접 배포

1. Vercel 대시보드 접속
2. 프로젝트 선택
3. "Deployments" 탭 클릭
4. 우측 상단 "..." 메뉴 → "Redeploy"
5. 또는 "Deploy" 버튼 클릭

---

## ⚙️ Vercel 환경 변수 설정

배포 전에 반드시 Vercel 대시보드에서 환경 변수를 설정해야 합니다.

### 설정 방법

1. **Vercel 대시보드** → 프로젝트 선택
2. **Settings** → **Environment Variables** 메뉴
3. 다음 환경 변수들을 추가:

#### Clerk 환경 변수
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

#### Supabase 환경 변수
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_STORAGE_BUCKET=uploads
```

#### Toss Payments 환경 변수 (선택사항)
```
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_... (테스트용)
TOSS_SECRET_KEY=test_sk_... (테스트용)
NEXT_PUBLIC_MOCK_PAYMENT=true (API 키 없이 테스트할 경우)
```

4. **Environment** 선택:
   - Production: 프로덕션 배포용
   - Preview: 프리뷰 배포용
   - Development: 개발 배포용
   
   **모든 환경에 적용하려면** 각각 선택하여 추가하세요.

5. **Save** 클릭

---

## 🔧 Vercel 프로젝트 설정

### Build Settings 확인

Vercel 대시보드 → Settings → General:

- **Framework Preset**: Next.js (자동 감지)
- **Root Directory**: `nextjs-supabase-boilerplate-main` (프로젝트 구조에 따라)
- **Build Command**: `pnpm run build` (또는 `npm run build`)
- **Output Directory**: `.next` (Next.js 기본값)
- **Install Command**: `pnpm install` (또는 `npm install`)

### Node.js 버전 확인

- **Node.js Version**: 18.x 이상 권장

---

## 📝 배포 후 확인사항

### 1. 배포 상태 확인
- Vercel 대시보드에서 배포 상태가 "Ready"인지 확인
- 빌드 로그 확인 (에러가 없는지)

### 2. 사이트 접속 테스트
- 배포된 URL로 접속
- 주요 페이지 테스트:
  - 홈페이지: `/`
  - 상품 목록: `/products`
  - 상품 상세: `/products/[id]`
  - 장바구니: `/cart`
  - 결제: `/checkout`
  - 마이페이지: `/my`
  - 문서: `/docs`

### 3. 환경 변수 확인
- Clerk 로그인 기능 테스트
- Supabase 데이터 조회 테스트
- 에러가 발생하면 환경 변수 설정 확인

---

## 🐛 배포 문제 해결

### 빌드 실패

**원인 1: 환경 변수 누락**
- 해결: Vercel 대시보드에서 모든 환경 변수 설정 확인

**원인 2: 의존성 오류**
- 해결: `package.json`의 의존성 확인
- 로컬에서 `pnpm install` 후 `pnpm run build` 테스트

**원인 3: TypeScript 오류**
- 해결: 로컬에서 `pnpm run build` 실행하여 오류 확인
- 모든 타입 오류 수정 후 다시 배포

### 배포는 되지만 사이트가 작동하지 않음

**원인 1: 환경 변수 누락**
- 해결: Vercel 대시보드에서 환경 변수 확인
- 특히 Clerk, Supabase 키 확인

**원인 2: API 라우트 오류**
- 해결: Vercel 대시보드 → Functions 탭에서 에러 로그 확인

**원인 3: 데이터베이스 연결 오류**
- 해결: Supabase URL 및 키 확인
- Supabase 프로젝트가 활성화되어 있는지 확인

---

## 📌 배포 URL

배포가 완료되면 다음 URL로 접근할 수 있습니다:

- **프로덕션**: `https://my-shopmall.vercel.app`
- **문서 목록**: `https://my-shopmall.vercel.app/docs`
- **PRD 문서**: `https://my-shopmall.vercel.app/docs/prd`
- **TODO 문서**: `https://my-shopmall.vercel.app/docs/todo`

---

## 🔄 자동 배포 설정

GitHub 저장소와 연동되어 있다면, `main` 브랜치에 푸시할 때마다 자동으로 배포됩니다.

**자동 배포 확인:**
- Vercel 대시보드 → Settings → Git
- 연결된 저장소 확인
- 배포 브랜치 확인 (보통 `main`)

---

## 💡 추가 팁

1. **프리뷰 배포**: Pull Request마다 자동으로 프리뷰 배포 생성
2. **도메인 설정**: Settings → Domains에서 커스텀 도메인 추가 가능
3. **환경 변수**: 프로덕션/프리뷰/개발 환경별로 다른 값 설정 가능
4. **빌드 캐시**: Vercel이 자동으로 의존성 캐싱하여 빌드 시간 단축

---

**배포 준비 완료!** 🎉

위의 단계를 따라하시면 Vercel에 성공적으로 배포할 수 있습니다.

