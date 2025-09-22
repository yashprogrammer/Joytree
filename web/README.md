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

## Environment

Set the following environment variables locally and on Vercel:

- `POSTGRES_URL` (or `POSTGRES_PRISMA_URL`/`POSTGRES_URL_NON_POOLING`) from Vercel Postgres
- `NEXT_PUBLIC_API_MOCKING`:
  - `enabled` to turn on client-side MSW mocks
  - `disabled` or unset to use real APIs

### Vercel Postgres setup

1. In Vercel dashboard, add the Postgres integration and link it to this project.
2. Copy the `POSTGRES_URL` env var into Project Settings → Environment Variables.
3. Redeploy. The app lazily creates the `orders` table if it doesn't exist.

### Notes

- In development, you can enable mocks by setting `NEXT_PUBLIC_API_MOCKING=enabled`.
- In production, leave it unset/disabled so requests hit real API routes backed by Postgres.
