'use client'

import { Menu } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/providers'

export interface NavItem {
  label: string
  href: string
  description?: string
}

interface NavbarProps {
  brand?: string
  items?: NavItem[]
}

const defaultItems: NavItem[] = [
  { label: '홈', href: '/' },
  { label: '문서', href: '#' },
]

export function Navbar({
  brand = 'Starter',
  items = defaultItems,
}: NavbarProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* 브랜드 */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">{brand}</span>
        </div>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              {items.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    href={item.href}
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* 오른쪽 액션 영역 */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* 모바일 메뉴 토글 */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="메뉴 열기"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>{brand}</SheetTitle>
              </SheetHeader>
              <Separator className="my-4" />
              <nav className="flex flex-col gap-4">
                {items.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <Separator className="my-4" />
              <div className="flex gap-2">
                <Button className="flex-1">로그인</Button>
                <Button variant="outline" className="flex-1">
                  시작하기
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* 데스크탑 로그인 버튼 */}
          <div className="hidden gap-2 md:flex">
            <Button variant="ghost" size="sm">
              로그인
            </Button>
            <Button size="sm">시작하기</Button>
          </div>
        </div>
      </div>
    </header>
  )
}
