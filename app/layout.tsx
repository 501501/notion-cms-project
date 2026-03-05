import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// 사이트 기본 URL (환경 변수 → 기본값 순)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfolio.example.com'
const authorName = process.env.NEXT_PUBLIC_AUTHOR_NAME ?? 'Your Name'

export const metadata: Metadata = {
  title: {
    default: `${authorName} | 포트폴리오`,
    template: `%s | ${authorName}`,
  },
  description:
    'Notion CMS 기반 개인 포트폴리오 사이트. 웹, 모바일, 디자인 프로젝트 소개.',
  keywords: ['포트폴리오', '개발자', '프로젝트', 'Next.js', 'TypeScript', 'React'],
  authors: [{ name: authorName }],
  creator: authorName,
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteUrl,
    siteName: `${authorName} Portfolio`,
  },
  // 검색엔진 크롤링 허용
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <TooltipProvider>
            {children}
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  )
}
