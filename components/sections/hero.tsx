import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Github, ArrowRight } from 'lucide-react'

export interface HeroProps {
  title?: string
  description?: string
  badges?: string[]
  ctaText?: string
  ctaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
}

const defaultBadges = ['Next.js 16', 'TypeScript', 'TailwindCSS v4', 'shadcn/ui']

export function Hero({
  title = '모던 웹 스타터킷',
  description = 'Next.js 16, React 19, TailwindCSS v4 기반의 검증된 스타터 템플릿입니다. 즉시 사용 가능한 컴포넌트와 레이아웃으로 프로젝트를 빠르게 시작하세요.',
  badges = defaultBadges,
  ctaText = '지금 시작',
  ctaHref = '#',
  secondaryCtaText = 'GitHub에서 보기',
  secondaryCtaHref = 'https://github.com',
}: HeroProps) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* 배경 그라디언트 장식 */}
      <div className="absolute inset-0 -z-10 flex">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4">
        {/* 배지 행 */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          {badges.map((badge) => (
            <Badge key={badge} variant="secondary">
              {badge}
            </Badge>
          ))}
        </div>

        {/* 제목 */}
        <h1 className="mb-6 text-center text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        {/* 설명 */}
        <p className="mx-auto mb-8 max-w-2xl text-center text-lg text-muted-foreground sm:text-xl">
          {description}
        </p>

        {/* CTA 버튼 */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild className="gap-2">
            <a href={ctaHref}>
              {ctaText}
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild className="gap-2">
            <a href={secondaryCtaHref} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
              {secondaryCtaText}
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
