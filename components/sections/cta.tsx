import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export interface CtaProps {
  title?: string
  description?: string
  ctaText?: string
  ctaHref?: string
}

export function Cta({
  title = '지금 시작하세요',
  description = '모던한 웹 애플리케이션 개발을 위한 모든 것이 준비되어 있습니다.',
  ctaText = '프로젝트 시작하기',
  ctaHref = '#',
}: CtaProps) {
  return (
    <section className="py-20 sm:py-32">
      {/* 배경 그라디언트 장식 */}
      <div className="relative">
        <div className="absolute inset-0 -z-10 flex">
          <div className="absolute inset-0 bg-primary/5 blur-3xl" />
          <div className="absolute right-0 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-white/5 blur-2xl" />
        </div>

        <div className="container mx-auto max-w-4xl px-4">
          <div className="rounded-lg border border-primary/10 bg-gradient-to-br from-primary/5 via-primary/5 to-primary/10 px-6 py-12 text-center sm:px-12 sm:py-16">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/80">
              {description}
            </p>
            <Button size="lg" asChild className="gap-2" variant="default">
              <a href={ctaHref}>
                {ctaText}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
