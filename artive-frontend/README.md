This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

UI 연동 순서 제안
회원 프로필 보기/수정 화면

썸네일 이미지 업로드/프리뷰

닉네임, 이름, 자기소개(bio), 이메일 등 정보 표시/수정

저장 시 PATCH 요청

Artwork 등록 화면

제목, 설명 입력

썸네일 업로드 → 업로드 후 URL 반환 → 등록 시 포함

저장 시 POST 요청 (/api/artworks)

Artwork 히스토리 등록 화면

이미지 여러 장 업로드 → 업로드 후 URL 배열 생성

히스토리 텍스트, 날짜 입력

저장 시 POST 요청 (/api/artworks/history)

Artwork 목록 & 상세보기 페이지

썸네일 리스트 출력

클릭 시 상세 페이지 (히스토리 리스트 포함)

삭제 기능 연동

Artwork 삭제 시 → 이미지 S3에서 삭제 + DB 삭제

히스토리도 동일 로직 적용

추가 UX 요소

로딩 인디케이터

토스트 메시지 (성공/실패)

폼 유효성 검사
