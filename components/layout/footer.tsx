import { Separator } from '@/components/ui/separator'
import { Github } from 'lucide-react'

export interface FooterLinkGroup {
  title: string
  links: { label: string; href: string }[]
}

interface FooterProps {
  linkGroups?: FooterLinkGroup[]
  copyright?: string
}

const defaultLinkGroups: FooterLinkGroup[] = [
  {
    title: '제품',
    links: [
      { label: '기능', href: '#features' },
      { label: '가격', href: '#pricing' },
      { label: '보안', href: '#' },
    ],
  },
  {
    title: '회사',
    links: [
      { label: '소개', href: '#' },
      { label: '블로그', href: '#' },
      { label: '채용', href: '#' },
    ],
  },
  {
    title: '리소스',
    links: [
      { label: '문서', href: '#' },
      { label: 'API', href: '#' },
      { label: '상태', href: '#' },
    ],
  },
  {
    title: '법률',
    links: [
      { label: '개인정보처리방침', href: '#' },
      { label: '이용약관', href: '#' },
    ],
  },
]

export function Footer({
  linkGroups = defaultLinkGroups,
  copyright = `© ${new Date().getFullYear()} Starter Kit. 모든 권리 보유.`,
}: FooterProps) {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {/* 링크 그룹 */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-4">
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-4 font-semibold">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* 저작권 및 소셜 */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            {copyright}
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
