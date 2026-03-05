# add-component

Next.js 페이지를 생성합니다.

## 사용법

```
/add-component <page-name>
```

## 예시

```
/add-component about
/add-component products
/add-component dashboard
```

## 생성 파일

- `app/<page-name>/page.tsx` - React 함수형 컴포넌트
  - TypeScript 사용
  - Tailwind CSS 기본 레이아웃
  - default export

## 프로세스

1. $1 파라미터로 페이지 이름 받기
2. `app/$1/` 디렉토리 생성
3. `page.tsx` 파일 생성 (React 함수형 컴포넌트)
4. Tailwind CSS 기본 레이아웃 추가

## 생성되는 컴포넌트 구조

```typescript
export default function PageName() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold">Page Title</h1>
        {/* 페이지 내용 */}
      </div>
    </main>
  );
}
```
