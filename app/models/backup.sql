-- --------------------------------------------------------
-- 호스트:                          aws-1-ap-northeast-2.pooler.supabase.com
-- 서버 버전:                        PostgreSQL 17.4 on aarch64-unknown-linux-gnu, compiled by gcc (GCC) 13.2.0, 64-bit
-- 서버 OS:                        
-- HeidiSQL 버전:                  12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES  */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- 테이블 public.cafes 구조 내보내기
DROP TABLE IF EXISTS "cafes";
CREATE TABLE IF NOT EXISTS "cafes" (
	"id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"name" VARCHAR(64) NOT NULL,
	"description" TEXT NULL DEFAULT NULL,
	"headline" VARCHAR(256) NULL DEFAULT NULL,
	"body" TEXT NULL DEFAULT NULL,
	"logo_url" TEXT NULL DEFAULT NULL,
	"video_url" TEXT NULL DEFAULT NULL,
	"images_urls" UNKNOWN NULL DEFAULT NULL,
	"created_at" TIMESTAMPTZ NULL DEFAULT now(),
	"updated_at" TIMESTAMPTZ NULL DEFAULT now(),
	PRIMARY KEY ("id"),
	UNIQUE ("name")
);

-- 테이블 데이터 public.cafes:1 rows 내보내기
DELETE FROM "cafes";
/*!40000 ALTER TABLE "cafes" DISABLE KEYS */;
INSERT INTO "cafes" ("id", "name", "description", "headline", "body", "logo_url", "video_url", "images_urls", "created_at", "updated_at") VALUES
	('a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0', '카페 가재미 38', '도심 속의 현대적인 커피 공간', '최고급 원두로 내린 스페셜티 커피', '매일 아침 직접 로스팅한 신선한 원두를 사용합니다.', NULL, NULL, NULL, '2025-09-14 12:45:21.924119+00', '2025-09-14 12:45:21.924119+00');
/*!40000 ALTER TABLE "cafes" ENABLE KEYS */;

-- 테이블 public.ingredients 구조 내보내기
DROP TABLE IF EXISTS "ingredients";
CREATE TABLE IF NOT EXISTS "ingredients" (
	"id" BIGINT NOT NULL,
	"name" VARCHAR(64) NOT NULL,
	"image_url" TEXT NULL DEFAULT NULL,
	"cafe_id" UUID NOT NULL,
	PRIMARY KEY ("id"),
	CONSTRAINT "ingredients_cafe_id_cafes_id_fk" FOREIGN KEY ("cafe_id") REFERENCES "cafes" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- 테이블 데이터 public.ingredients:54 rows 내보내기
DELETE FROM "ingredients";
/*!40000 ALTER TABLE "ingredients" DISABLE KEYS */;
INSERT INTO "ingredients" ("id", "name", "image_url", "cafe_id") VALUES
	(1, '에스프레소', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(2, '우유', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(3, '얼음', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(4, '뜨거운 물', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(5, '차가운 물', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(6, '휘핑 크림', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(7, '꿀', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(8, '설탕', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(9, '연유', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(10, '바닐라 시럽', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(11, '카라멜 소스', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(12, '초코 파우더', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(13, '녹차 파우더', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(14, '시나몬 파우더', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(15, '고구마 페이스트', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(16, '미숫가루', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(17, '콩가루', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(18, '생강청', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(19, '유자청', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(20, '자몽청', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(21, '레몬청', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(22, '청포도청', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(23, '복숭아청', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(24, '자두청', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(25, '냉동 딸기', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(26, '냉동 블루베리', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(27, '냉동 망고', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(28, '수박', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(29, '토마토', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(30, '수제꽃차 티백', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(31, '히비스커스 티백', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(32, '캐모마일 티백', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(33, '페퍼민트 티백', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(34, '얼그레이 티백', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(35, '대추 슬라이스', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(36, '말린 대추 슬라이스', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(37, '레몬 슬라이스', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(38, '자몽 슬라이스', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(39, '복숭아 슬라이스', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(40, '로즈마리', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(41, '애플민트', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(42, '허브', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(43, '잣', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(44, '견과류 토핑', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(45, '플레인 요거트', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(46, '탄산수', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(47, '식혜', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(48, '코코넛 젤리', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(49, '알로에', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(50, '크로플', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(51, '바닐라 아이스크림', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(52, '초코 시럽', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(53, '인절미 떡', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(54, '커피콩빵 반죽', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0');
/*!40000 ALTER TABLE "ingredients" ENABLE KEYS */;

-- 테이블 public.items 구조 내보내기
DROP TABLE IF EXISTS "items";
CREATE TABLE IF NOT EXISTS "items" (
	"id" BIGINT NOT NULL,
	"name" VARCHAR(64) NOT NULL,
	"count" INTEGER NOT NULL DEFAULT 0,
	"unit" VARCHAR(16) NULL DEFAULT NULL,
	"image_url" TEXT NULL DEFAULT NULL,
	"created_at" TIMESTAMPTZ NULL DEFAULT now(),
	"updated_at" TIMESTAMPTZ NULL DEFAULT now(),
	"stock_id" BIGINT NOT NULL,
	"cafe_id" UUID NOT NULL,
	PRIMARY KEY ("id"),
	CONSTRAINT "items_cafe_id_cafes_id_fk" FOREIGN KEY ("cafe_id") REFERENCES "cafes" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT "items_stock_id_stocks_id_fk" FOREIGN KEY ("stock_id") REFERENCES "stocks" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- 테이블 데이터 public.items:57 rows 내보내기
DELETE FROM "items";
/*!40000 ALTER TABLE "items" DISABLE KEYS */;
INSERT INTO "items" ("id", "name", "count", "unit", "image_url", "created_at", "updated_at", "stock_id", "cafe_id") VALUES
	(1, '에스프레소 원두', 20, 'kg', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 1, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(2, '플레인 요거트', 15, '통', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 2, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(3, '휘핑 크림', 10, '캔', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 2, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(4, '우유 1L', 24, '팩', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 2, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(5, '연유', 5, '캔', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 3, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(6, '백설탕', 10, 'kg', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 3, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(7, '꿀', 8, '병', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 3, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(8, '초코 시럽', 4, '병', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 3, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(9, '카라멜 소스', 4, '병', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 3, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(10, '바닐라 시럽', 5, '병', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 3, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(11, '콩가루', 3, '봉지', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 4, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(12, '시나몬 파우더', 3, '통', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 4, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(13, '미숫가루', 5, '봉지', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 4, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(14, '고구마 페이스트', 5, 'kg', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 4, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(15, '녹차 파우더', 7, '봉지', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 4, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(16, '초코 파우더', 10, '봉지', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 4, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(17, '자두청', 4, '병', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 5, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(18, '복숭아청', 4, '병', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 5, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(19, '청포도청', 4, '병', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 5, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(20, '생강청', 4, '병', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 5, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(21, '유자청', 6, '병', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 5, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(22, '자몽청', 6, '병', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 5, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(23, '레몬청', 6, '병', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 5, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(24, '토마토', 5, 'kg', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 5, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(25, '수박', 3, '통', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 5, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(26, '냉동 망고', 12, 'kg', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 5, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(27, '냉동 블루베리', 12, 'kg', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 5, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(28, '냉동 딸기', 15, 'kg', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 5, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(29, '얼그레이 티백', 3, '박스', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 6, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(30, '페퍼민트 티백', 3, '박스', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 6, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(31, '캐모마일 티백', 3, '박스', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 6, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(32, '히비스커스 티백', 3, '박스', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 6, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(33, '수제꽃차 티백', 3, '박스', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 6, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(34, '견과류 토핑', 2, '통', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 7, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(35, '잣', 1, '봉지', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 7, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(36, '허브', 1, '팩', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 7, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(37, '애플민트', 1, '팩', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 7, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(38, '로즈마리', 1, '팩', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 7, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(39, '복숭아', 10, '개', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 7, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(40, '자몽', 10, '개', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 7, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(41, '레몬', 10, '개', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 7, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(42, '말린 대추 슬라이스', 2, '팩', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 7, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(43, '대추 슬라이스', 2, '팩', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 7, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(44, '커피콩빵 믹스', 5, '봉지', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 8, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(45, '인절미 떡', 2, 'kg', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 8, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(46, '바닐라 아이스크림', 5, '통', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 8, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(47, '냉동 크로플 생지', 50, '개', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 8, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(48, '얼음', 100, 'kg', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 9, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(49, '알로에', 5, '통', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 9, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(50, '코코넛 젤리', 5, '통', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 9, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(51, '식혜 1.5L', 10, '병', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 9, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(52, '탄산수 355ml', 48, '캔', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 9, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(53, '냅킨', 15, '팩', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 10, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(54, '빨대', 20, '박스', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 10, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(55, '컵 홀더', 10, '박스', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 10, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(56, '16oz 아이스컵', 8, '줄', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 10, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(57, '12oz 종이컵', 5, '줄', NULL, '2025-09-14 15:04:27.729505+00', '2025-09-14 15:04:27.729505+00', 10, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0');
/*!40000 ALTER TABLE "items" ENABLE KEYS */;

-- 테이블 public.menus 구조 내보내기
DROP TABLE IF EXISTS "menus";
CREATE TABLE IF NOT EXISTS "menus" (
	"id" BIGINT NOT NULL,
	"name" VARCHAR(64) NOT NULL,
	"is_hot" BOOLEAN NOT NULL DEFAULT true,
	"price" INTEGER NOT NULL DEFAULT 0,
	"stock" INTEGER NOT NULL DEFAULT 0,
	"is_active" BOOLEAN NULL DEFAULT true,
	"image_url" TEXT NULL DEFAULT NULL,
	"created_at" TIMESTAMPTZ NULL DEFAULT now(),
	"updated_at" TIMESTAMPTZ NULL DEFAULT now(),
	"product_id" BIGINT NOT NULL,
	"cafe_id" UUID NOT NULL,
	PRIMARY KEY ("id"),
	CONSTRAINT "menus_cafe_id_cafes_id_fk" FOREIGN KEY ("cafe_id") REFERENCES "cafes" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT "menus_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- 테이블 데이터 public.menus:40 rows 내보내기
DELETE FROM "menus";
/*!40000 ALTER TABLE "menus" DISABLE KEYS */;
INSERT INTO "menus" ("id", "name", "is_hot", "price", "stock", "is_active", "image_url", "created_at", "updated_at", "product_id", "cafe_id") VALUES
	(1, '아메리카노', 'true', 0, 0, 'true', NULL, '2025-09-14 13:42:08.824369+00', '2025-09-14 13:42:08.824369+00', 1, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(2, '아메리카노', 'false', 0, 0, 'true', NULL, '2025-09-14 13:42:08.824369+00', '2025-09-14 13:42:08.824369+00', 1, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(3, '카라멜 마끼아또', 'true', 0, 0, 'true', NULL, '2025-09-14 13:42:08.824369+00', '2025-09-14 13:42:08.824369+00', 1, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(4, '카라멜 마끼아또', 'false', 0, 0, 'true', NULL, '2025-09-14 13:42:08.824369+00', '2025-09-14 13:42:08.824369+00', 1, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(5, '카페 라떼', 'true', 0, 0, 'true', NULL, '2025-09-14 13:42:08.824369+00', '2025-09-14 13:42:08.824369+00', 1, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(6, '카페 라떼', 'false', 0, 0, 'true', NULL, '2025-09-14 13:42:08.824369+00', '2025-09-14 13:42:08.824369+00', 1, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(7, '바닐라 라떼', 'true', 0, 0, 'true', NULL, '2025-09-14 13:42:08.824369+00', '2025-09-14 13:42:08.824369+00', 1, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(8, '바닐라 라떼', 'false', 0, 0, 'true', NULL, '2025-09-14 13:42:08.824369+00', '2025-09-14 13:42:08.824369+00', 1, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(9, '초코 라떼', 'true', 0, 0, 'true', NULL, '2025-09-14 13:42:08.824369+00', '2025-09-14 13:42:08.824369+00', 2, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(10, '초코 라떼', 'false', 0, 0, 'true', NULL, '2025-09-14 13:42:08.824369+00', '2025-09-14 13:42:08.824369+00', 2, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(11, '그린티 라떼', 'true', 0, 0, 'true', NULL, '2025-09-14 13:42:08.824369+00', '2025-09-14 13:42:08.824369+00', 2, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(12, '그린티 라떼', 'false', 0, 0, 'true', NULL, '2025-09-14 13:42:08.824369+00', '2025-09-14 13:42:08.824369+00', 2, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(13, '고구마 라떼', 'true', 0, 0, 'true', NULL, '2025-09-14 13:42:08.824369+00', '2025-09-14 13:42:08.824369+00', 2, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(14, '생강 라떼', 'true', 0, 0, 'true', NULL, '2025-09-14 13:42:08.824369+00', '2025-09-14 13:42:08.824369+00', 2, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(15, '미숫가루 라떼', 'false', 0, 0, 'true', NULL, '2025-09-14 13:42:08.824369+00', '2025-09-14 13:42:08.824369+00', 2, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0')
/*!40000 ALTER TABLE "menus" ENABLE KEYS */;

-- 테이블 public.products 구조 내보내기
DROP TABLE IF EXISTS "products";
CREATE TABLE IF NOT EXISTS "products" (
	"id" BIGINT NOT NULL,
	"name" VARCHAR(64) NOT NULL,
	"description" TEXT NULL DEFAULT NULL,
	"image_url" TEXT NULL DEFAULT NULL,
	"cafe_id" UUID NOT NULL,
	PRIMARY KEY ("id"),
	CONSTRAINT "products_cafe_id_cafes_id_fk" FOREIGN KEY ("cafe_id") REFERENCES "cafes" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- 테이블 데이터 public.products:8 rows 내보내기
DELETE FROM "products";
/*!40000 ALTER TABLE "products" DISABLE KEYS */;
INSERT INTO "products" ("id", "name", "description", "image_url", "cafe_id") VALUES
	(1, '커피', '에스프레소 기반의 다양한 커피 음료', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(2, '라떼', '에스프레소와 우유, 또는 다양한 베이스가 조화로운 부드러운 음료', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0')
/*!40000 ALTER TABLE "products" ENABLE KEYS */;

-- 테이블 public.recipes 구조 내보내기
DROP TABLE IF EXISTS "recipes";
CREATE TABLE IF NOT EXISTS "recipes" (
	"name" VARCHAR(64) NOT NULL,
	"description" TEXT NULL DEFAULT NULL,
	"steps" UNKNOWN NOT NULL,
	"video_url" TEXT NULL DEFAULT NULL,
	"created_at" TIMESTAMPTZ NULL DEFAULT now(),
	"updated_at" TIMESTAMPTZ NULL DEFAULT now(),
	"menu_id" BIGINT NOT NULL,
	"cafe_id" UUID NOT NULL,
	PRIMARY KEY ("menu_id"),
	CONSTRAINT "recipes_cafe_id_cafes_id_fk" FOREIGN KEY ("cafe_id") REFERENCES "cafes" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT "recipes_menu_id_menus_id_fk" FOREIGN KEY ("menu_id") REFERENCES "menus" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);

-- 테이블 데이터 public.recipes:40 rows 내보내기
DELETE FROM "recipes";
/*!40000 ALTER TABLE "recipes" DISABLE KEYS */;
INSERT INTO "recipes" ("name", "description", "steps", "video_url", "created_at", "updated_at", "menu_id", "cafe_id") VALUES
	('핫 아메리카노', '깊고 진한 에스프레소에 뜨거운 물을 더한 클래식 커피', '{"뜨거운 잔을 준비합니다.","에스프레소 2샷(30ml)을 추출합니다.","추출된 샷에 뜨거운 물(200ml)을 붓습니다."}', NULL, '2025-09-14 13:49:02.762496+00', '2025-09-14 13:49:02.762496+00', 1, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	('아이스 아메리카노', '시원한 물과 얼음 위에 에스프레소를 부어 깔끔하게 즐기는 커피', '{"얼음을 가득 채운 아이스 잔을 준비합니다.","차가운 물(180ml)을 붓습니다.","에스프레소 2샷(30ml)을 추출하여 물 위에 붓습니다."}', NULL, '2025-09-14 13:49:02.762496+00', '2025-09-14 13:49:02.762496+00', 2, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	('핫 카라멜 마끼아또', '달콤한 바닐라 향의 스팀 밀크에 에스프레소 샷과 카라멜 소스를 얹은 부드러운 커피', '{"뜨거운 잔에 바닐라 시럽(2펌프)을 넣습니다.","우유(220ml)를 곱게 스티밍하여 잔에 붓습니다.","에스프레소 2샷(30ml)을 추출하여 우유 거품 위에 점을 찍듯이 붓습니다.","카라멜 소스를 격자 모양으로 드리즐합니다."}', NULL, '2025-09-14 13:49:02.762496+00', '2025-09-14 13:49:02.762496+00', 3, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	('아이스 카라멜 마끼아또', '바닐라 시럽과 우유, 얼음 위에 에스프레소 샷과 카라멜 소스를 더한 시원하고 달콤한 커피', '{"아이스 잔에 바닐라 시럽(2펌프)을 넣습니다.","우유(200ml)를 붓고 얼음을 가득 채웁니다.","에스프레소 2샷(30ml)을 추출하여 얼음 위에 부드럽게 붓습니다.","카라멜 소스를 격자 모양으로 드리즐합니다."}', NULL, '2025-09-14 13:49:02.762496+00', '2025-09-14 13:49:02.762496+00', 4, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	('핫 카페 라떼', '에스프레소에 부드러운 스팀 밀크를 듬뿍 더해 고소하고 담백하게 즐기는 커피', '{"뜨거운 잔을 준비합니다.","잔에 에스프레소 2샷(30ml)을 추출합니다.","우유(250ml)를 스팀 피처에 담아 벨벳 질감으로 스티밍합니다.","샷 위에 스팀 우유를 부드럽게 부어 하트 모양을 만듭니다."}', NULL, '2025-09-14 13:49:02.762496+00', '2025-09-14 13:49:02.762496+00', 5, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	('아이스 카페 라떼', '신선한 우유와 얼음, 에스프레소 샷이 어우러져 더욱 고소하고 시원한 커피', '{"얼음을 가득 채운 아이스 잔을 준비합니다.","잔에 우유(200ml)를 먼저 붓습니다.","에스프레소 2샷(30ml)을 추출하여 우유 위에 부드럽게 붓습니다."}', NULL, '2025-09-14 13:49:02.762496+00', '2025-09-14 13:49:02.762496+00', 6, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	('핫 바닐라 라떼', '달콤한 바닐라 시럽과 에스프레소, 부드러운 스팀 밀크가 조화로운 인기 라떼', '{"뜨거운 잔에 바닐라 시럽(2펌프)을 넣습니다.","에스프레소 2샷(30ml)을 추출하여 시럽과 잘 섞어줍니다.","우유(220ml)를 곱게 스티밍하여 잔에 붓습니다."}', NULL, '2025-09-14 13:49:02.762496+00', '2025-09-14 13:49:02.762496+00', 7, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	('아이스 바닐라 라떼', '바닐라 시럽의 달콤함과 에스프레소의 깊은 풍미를 시원하게 즐기는 라떼', '{"아이스 잔에 바닐라 시럽(2펌프)과 에스프레소 2샷(30ml)을 넣고 섞어줍니다.","우유(200ml)를 붓고 얼음을 가득 채웁니다."}', NULL, '2025-09-14 13:49:02.762496+00', '2025-09-14 13:49:02.762496+00', 8, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	('핫 초코 라떼', '진한 초콜릿과 부드러운 스팀 밀크가 만나 달콤하고 따뜻하게 몸을 녹여주는 음료', '{"뜨거운 잔에 초코 파우더(30g)를 넣습니다.","뜨거운 물 또는 우유(30ml)를 약간 부어 잘 녹여 페이스트로 만듭니다.","우유(220ml)를 부드럽게 스티밍합니다.","초코 페이스트에 스팀 우유를 부으면서 잘 저어줍니다."}', NULL, '2025-09-14 13:49:02.762496+00', '2025-09-14 13:49:02.762496+00', 9, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	('아이스 초코 라떼', '진하고 달콤한 초콜릿을 신선한 우유와 얼음으로 시원하게 즐기는 음료', '{"잔에 초코 파우더(30g)와 우유(220ml)를 넣고 잘 저어줍니다.","얼음을 가득 채웁니다.","기호에 따라 휘핑 크림을 올립니다."}', NULL, '2025-09-14 13:49:02.762496+00', '2025-09-14 13:49:02.762496+00', 10, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	('핫 그린티 라떼', '쌉쌀한 국내산 녹차와 부드러운 우유가 만나 건강하고 든든한 논커피 라떼', '{"뜨거운 잔에 녹차 파우더(20g)와 설탕(10g)을 넣습니다.","뜨거운 물(30ml)을 부어 파우더가 뭉치지 않게 잘 풀어줍니다.","우유(220ml)를 곱게 스티밍합니다.","녹차 베이스에 스팀 우유를 부으면서 잘 저어줍니다."}', NULL, '2025-09-14 13:49:02.762496+00', '2025-09-14 13:49:02.762496+00', 11, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	('아이스 그린티 라떼', '진한 녹차의 풍미를 신선한 우유와 얼음으로 더욱 시원하고 깔끔하게 즐기는 라떼', '{"잔에 녹차 파우더(20g)와 설탕(10g), 우유(220ml)를 넣고 잘 저어줍니다.","얼음을 가득 채웁니다."}', NULL, '2025-09-14 13:49:02.762496+00', '2025-09-14 13:49:02.762496+00', 12, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	('핫 고구마 라떼', '달콤하고 구수한 국내산 고구마와 따뜻한 우유가 만나 든든한 한 끼 식사 대용 음료', '{"뜨거운 잔에 고구마 페이스트(40g)를 넣습니다.","우유(250ml)를 스티밍합니다.","고구마 페이스트에 스팀 우유를 부으면서 덩어리가 없도록 잘 저어줍니다.","기호에 따라 견과류 토핑을 올립니다."}', NULL, '2025-09-14 13:49:02.762496+00', '2025-09-14 13:49:02.762496+00', 13, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	('핫 생강 라떼', '알싸한 생강과 부드러운 우유가 만나 몸을 따뜻하게 데워주는 건강 라떼', '{"뜨거운 잔에 생강청(30g)을 넣습니다.","우유(250ml)를 스티밍합니다.","생강청에 스팀 우유를 부으면서 잘 저어줍니다.","시나몬 파우더를 살짝 뿌려 제공합니다."}', NULL, '2025-09-14 13:49:02.762496+00', '2025-09-14 13:49:02.762496+00', 14, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	('아이스 미숫가루 라떼', '18가지 곡물로 만들어 고소하고 든든하며 시원하게 즐기는 한국식 건강 음료', '{"블렌더에 미숫가루(40g), 우유(250ml), 꿀(15ml), 얼음(8개)을 넣습니다.","내용물이 부드러워질 때까지 약 30초간 블렌딩합니다.","잔에 옮겨 담아 제공합니다."}', NULL, '2025-09-14 13:49:02.762496+00', '2025-09-14 13:49:02.762496+00', 15, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0')
/*!40000 ALTER TABLE "recipes" ENABLE KEYS */;

-- 테이블 public.recipe_ingredients 구조 내보내기
DROP TABLE IF EXISTS "recipe_ingredients";
CREATE TABLE IF NOT EXISTS "recipe_ingredients" (
	"recipe_id" BIGINT NOT NULL,
	"ingredient_id" BIGINT NOT NULL,
	"quantity" VARCHAR(16) NOT NULL,
	CONSTRAINT "recipe_ingredients_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
	CONSTRAINT "recipe_ingredients_recipe_id_recipes_menu_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("menu_id") ON UPDATE NO ACTION ON DELETE CASCADE
);

-- 테이블 데이터 public.recipe_ingredients:103 rows 내보내기
DELETE FROM "recipe_ingredients";
/*!40000 ALTER TABLE "recipe_ingredients" DISABLE KEYS */;
INSERT INTO "recipe_ingredients" ("recipe_id", "ingredient_id", "quantity") VALUES
	(4, 11, '드리즐'),
	(4, 1, '2샷(30ml)'),
	(4, 3, '가득'),
	(4, 2, '200ml'),
	(4, 10, '2펌프'),
	(5, 2, '250ml'),
	(5, 1, '2샷(30ml)'),
	(8, 3, '가득'),
	(8, 2, '200ml'),
	(8, 1, '2샷(30ml)'),
	(8, 10, '2펌프'),
	(7, 2, '220ml'),
	(7, 1, '2샷(30ml)'),
	(7, 10, '2펌프'),
	(10, 3, '가득'),
	(10, 2, '220ml'),
	(10, 12, '30g'),
	(12, 3, '가득'),
	(12, 2, '220ml'),
	(12, 8, '10g'),
	(12, 13, '20g'),
	(14, 2, '250ml'),
	(14, 18, '30g'),
	(1, 4, '200ml'),
	(1, 1, '2샷(30ml)'),
	(2, 1, '2샷(30ml)'),
	(2, 5, '180ml'),
	(2, 3, '가득'),
	(3, 11, '드리즐'),
	(3, 1, '2샷(30ml)'),
	(3, 10, '2펌프'),
	(6, 1, '2샷(30ml)'),
	(6, 2, '200ml'),
	(6, 3, '가득'),
	(9, 2, '250ml'),
	(9, 12, '30g'),
	(11, 2, '250ml'),
	(11, 8, '10g'),
	(11, 13, '20g'),
	(13, 2, '250ml'),
	(13, 15, '40g'),
	(15, 3, '8개'),
	(15, 7, '15ml'),
	(15, 2, '250ml'),
	(15, 16, '40g');
/*!40000 ALTER TABLE "recipe_ingredients" ENABLE KEYS */;

-- 테이블 public.stocks 구조 내보내기
DROP TABLE IF EXISTS "stocks";
CREATE TABLE IF NOT EXISTS "stocks" (
	"id" BIGINT NOT NULL,
	"name" VARCHAR(64) NOT NULL,
	"description" TEXT NULL DEFAULT NULL,
	"image_url" TEXT NULL DEFAULT NULL,
	"cafe_id" UUID NOT NULL,
	PRIMARY KEY ("id"),
	CONSTRAINT "stocks_cafe_id_cafes_id_fk" FOREIGN KEY ("cafe_id") REFERENCES "cafes" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- 테이블 데이터 public.stocks:10 rows 내보내기
DELETE FROM "stocks";
/*!40000 ALTER TABLE "stocks" DISABLE KEYS */;
INSERT INTO "stocks" ("id", "name", "description", "image_url", "cafe_id") VALUES
	(1, '원두', '커피 추출에 사용되는 원두', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(2, '유제품', '우유, 크림, 요거트 등 유제품류', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(3, '시럽/소스/감미료', '음료에 사용되는 시럽, 소스, 감미료', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(4, '파우더/베이스', '라떼, 음료 베이스가 되는 파우더 및 페이스트', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(5, '과일/청', '냉동 과일, 수제청, 신선 과일 등', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(6, '티백', '차(Tea) 종류', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(7, '가니쉬/토핑', '음료 및 디저트 장식용 재료', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(8, '베이커리/디저트', '크로플, 아이스크림 등 디저트 재료', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(9, '음료/기타', '탄산수, 식혜 등 완제품 음료 및 기타 재료', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	(10, '일회용품', '컵, 빨대, 냅킨 등 매장 소모품', NULL, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0');
/*!40000 ALTER TABLE "stocks" ENABLE KEYS */;

-- 테이블 public.users 구조 내보내기
DROP TABLE IF EXISTS "users";
CREATE TABLE IF NOT EXISTS "users" (
	"id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"role" UNKNOWN NOT NULL,
	"auth_code" VARCHAR(512) NULL DEFAULT NULL,
	"mobile" VARCHAR(16) NULL DEFAULT NULL,
	"avatar_url" TEXT NULL DEFAULT NULL,
	"created_at" TIMESTAMPTZ NULL DEFAULT now(),
	"updated_at" TIMESTAMPTZ NULL DEFAULT now(),
	"cafe_id" UUID NOT NULL,
	PRIMARY KEY ("id"),
	CONSTRAINT "users_cafe_id_cafes_id_fk" FOREIGN KEY ("cafe_id") REFERENCES "cafes" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- 테이블 데이터 public.users:3 rows 내보내기
DELETE FROM "users";
/*!40000 ALTER TABLE "users" DISABLE KEYS */;
INSERT INTO "users" ("id", "role", "auth_code", "mobile", "avatar_url", "created_at", "updated_at", "cafe_id") VALUES
	('a4e2ebc8-4b09-0bc4-bd21-5b344f8ab7a6', 'MA', 'cafem001', '010-2222-2222', 'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png', '2025-09-14 12:45:21.954345+00', '2025-09-14 12:45:21.954345+00', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	('b5f3fcd9-5c10-1cd5-ce32-6c455a9bc8b7', 'BA', 'cafeb001', '010-3333-3333', 'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png', '2025-09-14 12:45:21.954345+00', '2025-09-14 12:45:21.954345+00', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
	('f3d1dab7-3a98-9ab3-ac10-4a233e7fa6f5', 'SA', 'cafes001', '010-1111-1111', 'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png', '2025-09-14 12:45:21.954345+00', '2025-09-14 12:45:21.954345+00', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0');
/*!40000 ALTER TABLE "users" ENABLE KEYS */;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
