import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Shield, Gauge, Palette, Smartphone, Code2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface Feature {
  title: string
  description: string
  icon: LucideIcon
}

export interface FeaturesProps {
  title?: string
  description?: string
  features?: Feature[]
}

const defaultFeatures: Feature[] = [
  {
    title: '빠른 성능',
    description: 'Next.js App Router와 서버 컴포넌트로 최적화된 성능',
    icon: Zap,
  },
  {
    title: '타입 안전성',
    description: 'TypeScript로 안전하고 신뢰성 있는 코드',
    icon: Shield,
  },
  {
    title: '반응형 디자인',
    description: 'TailwindCSS v4로 구현한 모든 기기 지원',
    icon: Smartphone,
  },
  {
    title: '개발 경험',
    description: '포괄적인 shadcn/ui 컴포넌트 라이브러리',
    icon: Palette,
  },
  {
    title: '확장성',
    description: 'Zustand, React Query로 상태 관리 준비 완료',
    icon: Code2,
  },
  {
    title: '다크모드',
    description: 'next-themes로 구현한 완벽한 다크모드 지원',
    icon: Gauge,
  },
]

export function Features({
  title = '주요 기능',
  description = '스타터킷에 포함된 모든 기능들을 확인하세요',
  features = defaultFeatures,
}: FeaturesProps) {
  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="container mx-auto max-w-7xl px-4">
        {/* 섹션 헤더 */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>

        {/* 기능 카드 그리드 */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const IconComponent = feature.icon
            return (
              <Card
                key={feature.title}
                className="transition-all hover:shadow-lg hover:shadow-primary/10"
              >
                <CardHeader>
                  <div className="mb-2 inline-flex rounded-lg bg-primary/10 p-2">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
