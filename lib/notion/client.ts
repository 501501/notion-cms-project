/**
 * Notion API 클라이언트 싱글톤
 * 서버 사이드에서만 사용 가능 (API 키 보호)
 */
import { Client } from "@notionhq/client";

// 빌드 타임에 환경 변수 검증
if (!process.env.NOTION_API_KEY) {
  // 빌드 환경에서는 경고만 출력 (런타임에서 실제 오류 발생)
  console.warn("경고: NOTION_API_KEY 환경 변수가 설정되지 않았습니다.");
}

// Notion 클라이언트 싱글톤
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// 데이터베이스 ID
export const PORTFOLIO_DATABASE_ID = process.env.NOTION_DATABASE_ID ?? "";
