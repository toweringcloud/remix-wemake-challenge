-- 이 스크립트는 모든 테이블의 데이터를 삭제하고 새로운 샘플 데이터로 채웁니다.
-- 주의: 이 스크립트를 실행하면 기존 데이터가 모두 사라집니다.

-- 데이터 초기화
TRUNCATE TABLE items RESTART IDENTITY CASCADE;
TRUNCATE TABLE stocks RESTART IDENTITY CASCADE;
TRUNCATE TABLE recipe_ingredients RESTART IDENTITY CASCADE;
TRUNCATE TABLE ingredients RESTART IDENTITY CASCADE;
TRUNCATE TABLE recipes RESTART IDENTITY CASCADE;
TRUNCATE TABLE menus RESTART IDENTITY CASCADE;
TRUNCATE TABLE products RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;
TRUNCATE TABLE cafes RESTART IDENTITY CASCADE;


-- 1. UUID 기반 테이블 데이터 시딩 (Cafe, User)
------------------------------------------------------------------------------------
-- 1. 카페 삽입
INSERT INTO cafes (id, name, description, headline, body) VALUES
  ('1f9a2b3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c', '숲속의 작은 집', '자연 속에서 즐기는 힐링 북카페', '책 한 권의 여유와 향긋한 핸드드립 커피', '통유리 너머로 사계절을 감상할 수 있는 조용한 공간입니다. 직접 만든 디저트와 함께 독서의 즐거움을 느껴보세요.'),
  ('7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d', '오션 브리즈', '해변가에 위치한 빈티지 서프 카페', '파도 소리와 함께 즐기는 시원한 콜드브루', '서핑을 사랑하는 주인장이 운영하는 자유로운 분위기의 카페입니다. 신선한 해산물로 만든 샌드위치가 인기 메뉴입니다.'),
  ('3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b', '미드나잇 로스터리', '저녁에 더 빛나는 심야 로스터리 카페', '밤을 닮은 깊고 진한 다크 로스팅 원두', '늦은 시간까지 커피와 음악, 대화를 즐길 수 있는 아지트 같은 공간입니다. 바리스타의 시그니처 칵테일도 경험해보세요.'),
  ('9c8b7a6d-5f4e-3d2c-1b0a-9f8e7d6c5b4a', '고양이 찻집', '아늑한 다락방 컨셉의 고양이 티룸', '귀여운 고양이들과 함께하는 티타임', '다양한 종류의 홍차와 허브티를 고양이 모양의 찻잔에 담아 드립니다. 수익금의 일부는 유기묘를 위해 사용됩니다.');

-- SA, MA, BA 역할에 맞는 아바타 URL과 함께 사용자 데이터를 다시 삽입합니다.
INSERT INTO users (id, role, auth_code, cafe_id) VALUES
  -- 숲속의 작은 집
  ('1c1c1c1c-1c1c-1c1c-1c1c-1c1c1c1c1c1c', 'SA', 'cafes123', '1f9a2b3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c'),
  ('1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', 'MA', 'cafem123', '1f9a2b3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c'),
  ('1b1b1b1b-1b1b-1b1b-1b1b-1b1b1b1b1b1b', 'BA', 'cafeb123', '1f9a2b3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c'),
  -- 오션 브리즈
  ('2c2c2c2c-2c2c-2c2c-2c2c-2c2c2c2c2c2c', 'SA', 'cafes234', '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d'),
  ('2a2a2a2a-2a2a-2a2a-2a2a-2a2a2a2a2a2a', 'MA', 'cafem234', '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d'),
  ('2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b2b', 'BA', 'cafeb234', '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d'),
  -- 미드나잇 로스터리
  ('3c3c3c3c-3c3c-3c3c-3c3c-3c3c3c3c3c3c', 'SA', 'cafes345', '3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b'),
  ('3a3a3a3a-3a3a-3a3a-3a3a-3a3a3a3a3a3a', 'MA', 'cafem345', '3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b'),
  ('3b3b3b3b-3b3b-3b3b-3b3b-3b3b3b3b3b3b', 'BA', 'cafeb345', '3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b'),
  -- 고양이 찻집
  ('4c4c4c4c-4c4c-4c4c-4c4c-4c4c4c4c4c4c', 'SA', 'cafes456', '9c8b7a6d-5f4e-3d2c-1b0a-9f8e7d6c5b4a'),
  ('4a4a4a4a-4a4a-4a4a-4a4a-4a4a4a4a4a4a', 'MA', 'cafem456', '9c8b7a6d-5f4e-3d2c-1b0a-9f8e7d6c5b4a'),
  ('4b4b4b4b-4b4b-4b4b-4b4b-4b4b4b4b4b4b', 'BA', 'cafeb456', '9c8b7a6d-5f4e-3d2c-1b0a-9f8e7d6c5b4a');


-- 2. BIGINT 기반 테이블 데이터 시딩 (Product, Menu, Recipe, Ingredient, Item 등)
-- CTE와 RETURNING 구문을 사용하여 자동 생성된 ID를 참조합니다.
------------------------------------------------------------------------------------
-- 상품(Products) 삽입 후 ID와 이름 반환
INSERT INTO products (name, description, cafe_id)
SELECT 
  v.name AS name,
  v.description AS description,
  '1f9a2b3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c' AS cafe_id
FROM (
  VALUES
  ('커피', '에스프레소 기반의 다양한 커피 음료'),
  ('라떼', '에스프레소와 우유, 또는 다양한 베이스가 조화로운 부드러운 음료')
) AS v(name, description);

-- 메뉴(Menus) 삽입 후 ID, 이름, is_hot 여부 반환
INSERT INTO menus (name, is_hot, product_id, cafe_id)
SELECT
  v.name,
  v.is_hot,
  p.id AS product_id,
  p.cafe_id AS cafe_id
FROM (
  VALUES
    -- 커피
    ('아메리카노', true, '커피'),
    ('아메리카노', false, '커피'),
    ('카라멜 마끼아또', true, '커피'),
    ('카라멜 마끼아또', false, '커피'),
    ('카페 라떼', true, '커피'),
    ('카페 라떼', false, '커피'),
    ('바닐라 라떼', true, '커피'),
    ('바닐라 라떼', false, '커피'),
    -- 라떼
    ('초코 라떼', true, '라떼'),
    ('초코 라떼', false, '라떼'),
    ('그린티 라떼', true, '라떼'),
    ('그린티 라떼', false, '라떼'),
    ('고구마 라떼', true, '라떼'),
    ('생강 라떼', true, '라떼'),
    ('미숫가루 라떼', false, '라떼')
) AS v(name, is_hot, product_name)
JOIN products p ON v.product_name = p.name
WHERE p.cafe_id = '1f9a2b3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c';


-- 레시피(Recipes) 삽입 후 ID와 이름 반환
INSERT INTO recipes (name, description, steps, menu_id, cafe_id)
SELECT
  CASE 
    -- 카테고리별 이름 규칙
    WHEN p.name IN('티', '허브티', '스무디', '에이드', '주스', '디저트') THEN m.name
    -- 기본 핫/아이스 규칙
    WHEN m.is_hot THEN '핫 ' || m.name
    ELSE '아이스 ' || m.name
  END AS name,
  v.description AS description,
  '{}'::text[] AS steps, -- ✅ steps 필드를 빈 배열로 설정
  m.id AS menu_id,
  m.cafe_id AS cafe_id
FROM (
  VALUES
    ('아메리카노', true, '깊고 진한 에스프레소에 뜨거운 물을 더한 클래식 커피', '커피'),
    ('아메리카노', false, '시원한 물과 얼음 위에 에스프레소를 부어 깔끔하게 즐기는 커피', '커피'),
    ('카페 라떼', true, '에스프레소에 부드러운 스팀 밀크를 듬뿍 더해 고소하고 담백하게 즐기는 커피', '커피'),
    ('카페 라떼', false, '신선한 우유와 얼음, 에스프레소 샷이 어우러져 더욱 고소하고 시원한 커피', '커피'),
    ('카라멜 마끼아또', true, '달콤한 바닐라 향의 스팀 밀크에 에스프레소 샷과 카라멜 소스를 얹은 부드러운 커피', '커피'),
    ('카라멜 마끼아또', false, '바닐라 시럽과 우유, 얼음 위에 에스프레소 샷과 카라멜 소스를 더한 시원하고 달콤한 커피', '커피'),
    ('바닐라 라떼', true, '달콤한 바닐라 시럽과 에스프레소, 부드러운 스팀 밀크가 조화로운 인기 라떼', '커피'),
    ('바닐라 라떼', false, '바닐라 시럽의 달콤함과 에스프레소의 깊은 풍미를 시원하게 즐기는 라떼', '커피'),
    ('초코 라떼', true, '진한 초콜릿과 부드러운 스팀 밀크가 만나 달콤하고 따뜻하게 몸을 녹여주는 음료', '라떼'),
    ('초코 라떼', false, '진하고 달콤한 초콜릿을 신선한 우유와 얼음으로 시원하게 즐기는 음료', '라떼'),
    ('그린티 라떼', true, '쌉쌀한 국내산 녹차와 부드러운 우유가 만나 건강하고 든든한 논커피 라떼', '라떼'),
    ('그린티 라떼', false, '진한 녹차의 풍미를 신선한 우유와 얼음으로 더욱 시원하고 깔끔하게 즐기는 라떼', '라떼'),
    ('고구마 라떼', true, '달콤하고 구수한 국내산 고구마와 따뜻한 우유가 만나 든든한 한 끼 식사 대용 음료', '라떼'),
    ('생강 라떼', true, '알싸한 생강과 부드러운 우유가 만나 몸을 따뜻하게 데워주는 건강 라떼', '라떼'),
    ('미숫가루 라떼', false, '18가지 곡물로 만들어 고소하고 든든하며 시원하게 즐기는 한국식 건강 음료', '라떼')
) AS v(name, is_hot, description, product_name)
JOIN menus m ON v.name = m.name AND v.is_hot = m.is_hot
JOIN products p ON v.product_name = p.name
WHERE m.cafe_id = '1f9a2b3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c';

-- 레시피(Recipes) 조리 단계 업데이트
-- 커피
UPDATE recipes SET steps = ARRAY['뜨거운 잔을 준비합니다.', '에스프레소 2샷(30ml)을 추출합니다.', '추출된 샷에 뜨거운 물(200ml)을 붓습니다.'] WHERE name = '핫 아메리카노';
UPDATE recipes SET steps = ARRAY['얼음을 가득 채운 아이스 잔을 준비합니다.', '차가운 물(180ml)을 붓습니다.', '에스프레소 2샷(30ml)을 추출하여 물 위에 붓습니다.'] WHERE name = '아이스 아메리카노';
UPDATE recipes SET steps = ARRAY['뜨거운 잔에 바닐라 시럽(2펌프)을 넣습니다.', '우유(220ml)를 곱게 스티밍하여 잔에 붓습니다.', '에스프레소 2샷(30ml)을 추출하여 우유 거품 위에 점을 찍듯이 붓습니다.', '카라멜 소스를 격자 모양으로 드리즐합니다.'] WHERE name = '핫 카라멜 마끼아또';
UPDATE recipes SET steps = ARRAY['아이스 잔에 바닐라 시럽(2펌프)을 넣습니다.', '우유(200ml)를 붓고 얼음을 가득 채웁니다.', '에스프레소 2샷(30ml)을 추출하여 얼음 위에 부드럽게 붓습니다.', '카라멜 소스를 격자 모양으로 드리즐합니다.'] WHERE name = '아이스 카라멜 마끼아또';
UPDATE recipes SET steps = ARRAY['뜨거운 잔을 준비합니다.', '잔에 에스프레소 2샷(30ml)을 추출합니다.', '우유(250ml)를 스팀 피처에 담아 벨벳 질감으로 스티밍합니다.', '샷 위에 스팀 우유를 부드럽게 부어 하트 모양을 만듭니다.'] WHERE name = '핫 카페 라떼';
UPDATE recipes SET steps = ARRAY['얼음을 가득 채운 아이스 잔을 준비합니다.', '잔에 우유(200ml)를 먼저 붓습니다.', '에스프레소 2샷(30ml)을 추출하여 우유 위에 부드럽게 붓습니다.'] WHERE name = '아이스 카페 라떼';
UPDATE recipes SET steps = ARRAY['뜨거운 잔에 바닐라 시럽(2펌프)을 넣습니다.', '에스프레소 2샷(30ml)을 추출하여 시럽과 잘 섞어줍니다.', '우유(220ml)를 곱게 스티밍하여 잔에 붓습니다.'] WHERE name = '핫 바닐라 라떼';
UPDATE recipes SET steps = ARRAY['아이스 잔에 바닐라 시럽(2펌프)과 에스프레소 2샷(30ml)을 넣고 섞어줍니다.', '우유(200ml)를 붓고 얼음을 가득 채웁니다.'] WHERE name = '아이스 바닐라 라떼';

-- 라떼
UPDATE recipes SET steps = ARRAY['뜨거운 잔에 초코 파우더(30g)를 넣습니다.', '뜨거운 물 또는 우유(30ml)를 약간 부어 잘 녹여 페이스트로 만듭니다.', '우유(220ml)를 부드럽게 스티밍합니다.', '초코 페이스트에 스팀 우유를 부으면서 잘 저어줍니다.'] WHERE name = '핫 초코 라떼';
UPDATE recipes SET steps = ARRAY['잔에 초코 파우더(30g)와 우유(220ml)를 넣고 잘 저어줍니다.', '얼음을 가득 채웁니다.', '기호에 따라 휘핑 크림을 올립니다.'] WHERE name = '아이스 초코 라떼';
UPDATE recipes SET steps = ARRAY['뜨거운 잔에 녹차 파우더(20g)와 설탕(10g)을 넣습니다.', '뜨거운 물(30ml)을 부어 파우더가 뭉치지 않게 잘 풀어줍니다.', '우유(220ml)를 곱게 스티밍합니다.', '녹차 베이스에 스팀 우유를 부으면서 잘 저어줍니다.'] WHERE name = '핫 그린티 라떼';
UPDATE recipes SET steps = ARRAY['잔에 녹차 파우더(20g)와 설탕(10g), 우유(220ml)를 넣고 잘 저어줍니다.', '얼음을 가득 채웁니다.'] WHERE name = '아이스 그린티 라떼';
UPDATE recipes SET steps = ARRAY['뜨거운 잔에 고구마 페이스트(40g)를 넣습니다.', '우유(250ml)를 스티밍합니다.', '고구마 페이스트에 스팀 우유를 부으면서 덩어리가 없도록 잘 저어줍니다.', '기호에 따라 견과류 토핑을 올립니다.'] WHERE name = '핫 고구마 라떼';
UPDATE recipes SET steps = ARRAY['뜨거운 잔에 생강청(30g)을 넣습니다.', '우유(250ml)를 스티밍합니다.', '생강청에 스팀 우유를 부으면서 잘 저어줍니다.', '시나몬 파우더를 살짝 뿌려 제공합니다.'] WHERE name = '핫 생강 라떼';
UPDATE recipes SET steps = ARRAY['블렌더에 미숫가루(40g), 우유(250ml), 꿀(15ml), 얼음(8개)을 넣습니다.', '내용물이 부드러워질 때까지 약 30초간 블렌딩합니다.', '잔에 옮겨 담아 제공합니다.'] WHERE name = '아이스 미숫가루 라떼';


-- 레시피 재료(Ingredients) 삽입 후 ID와 이름 반환
INSERT INTO ingredients (name, cafe_id) 
SELECT 
  v.name AS name,
  '1f9a2b3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c' AS cafe_id
FROM (
  VALUES
    -- 커피 & 공통 재료
    ('에스프레소'),
    ('우유'),
    ('얼음'),
    ('뜨거운 물'),
    ('차가운 물'),
    ('휘핑 크림'),
    ('꿀'),
    ('설탕'),
    ('연유'),
    
    -- 시럽 & 소스 & 파우더
    ('바닐라 시럽'),
    ('카라멜 소스'),
    ('초코 파우더'),
    ('녹차 파우더'),
    ('시나몬 파우더'),
    ('고구마 페이스트'),
    ('미숫가루'),
    ('콩가루')
  ) AS v(name);


-- 레시피-재료 관계(Recipe-Ingredients) 테이블 최종 삽입
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity)
SELECT
  r.menu_id AS recipe_id,
  i.id AS ingredient_id,
  v.quantity AS quantity
FROM (
  VALUES
    -- 커피
    ('핫 아메리카노', '에스프레소', '2샷(30ml)'),
    ('핫 아메리카노', '뜨거운 물', '200ml'),
    ('아이스 아메리카노', '얼음', '가득'),
    ('아이스 아메리카노', '차가운 물', '180ml'),
    ('아이스 아메리카노', '에스프레소', '2샷(30ml)'),
    ('핫 카라멜 마끼아또', '바닐라 시럽', '2펌프'),
    ('핫 카라멜 마끼아otto', '우유', '220ml'),
    ('핫 카라멜 마끼아또', '에스프레소', '2샷(30ml)'),
    ('핫 카라멜 마끼아또', '카라멜 소스', '드리즐'),
    ('아이스 카라멜 마끼아또', '바닐라 시럽', '2펌프'),
    ('아이스 카라멜 마끼아또', '우유', '200ml'),
    ('아이스 카라멜 마끼아또', '얼음', '가득'),
    ('아이스 카라멜 마끼아또', '에스프레소', '2샷(30ml)'),
    ('아이스 카라멜 마끼아또', '카라멜 소스', '드리즐'),
    ('핫 카페 라떼', '에스프레소', '2샷(30ml)'),
    ('핫 카페 라떼', '우유', '250ml'),
    ('아이스 카페 라떼', '얼음', '가득'),
    ('아이스 카페 라떼', '우유', '200ml'),
    ('아이스 카페 라떼', '에스프레소', '2샷(30ml)'),
    ('핫 바닐라 라떼', '바닐라 시럽', '2펌프'),
    ('핫 바닐라 라떼', '에스프레소', '2샷(30ml)'),
    ('핫 바닐라 라떼', '우유', '220ml'),
    ('아이스 바닐라 라떼', '바닐라 시럽', '2펌프'),
    ('아이스 바닐라 라떼', '에스프레소', '2샷(30ml)'),
    ('아이스 바닐라 라떼', '우유', '200ml'),
    ('아이스 바닐라 라떼', '얼음', '가득'),

    -- 라떼
    ('핫 초코 라떼', '초코 파우더', '30g'),
    ('핫 초코 라떼', '우유', '250ml'),
    ('아이스 초코 라떼', '초코 파우더', '30g'),
    ('아이스 초코 라떼', '우유', '220ml'),
    ('아이스 초코 라떼', '얼음', '가득'),
    ('핫 그린티 라떼', '녹차 파우더', '20g'),
    ('핫 그린티 라떼', '설탕', '10g'),
    ('핫 그린티 라떼', '우유', '250ml'),
    ('아이스 그린티 라떼', '녹차 파우더', '20g'),
    ('아이스 그린티 라떼', '설탕', '10g'),
    ('아이스 그린티 라떼', '우유', '220ml'),
    ('아이스 그린티 라떼', '얼음', '가득'),
    ('핫 고구마 라떼', '고구마 페이스트', '40g'),
    ('핫 고구마 라떼', '우유', '250ml'),
    ('핫 생강 라떼', '생강청', '30g'),
    ('핫 생강 라떼', '우유', '250ml'),
    ('아이스 미숫가루 라떼', '미숫가루', '40g'),
    ('아이스 미숫가루 라떼', '우유', '250ml'),
    ('아이스 미숫가루 라떼', '꿀', '15ml'),
    ('아이스 미숫가루 라떼', '얼음', '8개')
) AS v(recipe_name, ingredient_name, quantity)
JOIN recipes r ON v.recipe_name = r.name
JOIN ingredients i ON v.ingredient_name = i.name
WHERE r.cafe_id = '1f9a2b3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c'
  AND i.cafe_id = '1f9a2b3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c';


-- 재고 그룹(stocks)을 먼저 삽입하고, 생성된 id와 name을 반환합니다.
INSERT INTO stocks (name, description, cafe_id) VALUES
SELECT 
  v.name AS name,
  v.description AS description, 
  '1f9a2b3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c' AS cafe_id,
FROM (
  VALUES
    ('원두', '커피 추출에 사용되는 원두'),
    ('유제품', '우유, 크림, 요거트 등 유제품류'),
    ('시럽/소스/감미료', '음료에 사용되는 시럽, 소스, 감미료'),
    ('파우더/베이스', '라떼, 음료 베이스가 되는 파우더 및 페이스트'),
    ('음료/기타', '탄산수, 식혜 등 완제품 음료 및 기타 재료'),
    ('일회용품', '컵, 빨대, 냅킨 등 매장 소모품')
  ) AS v(name, description);


-- 위에서 생성된 stock id를 참조하여 전체 개별 재고(items)를 삽입합니다.
INSERT INTO items (name, count, unit, stock_id, cafe_id)
SELECT
  v.name AS name, 
  v.count AS count, 
  v.unit AS unit,
  s.id AS stock_id, 
  s.cafe_id AS cafe_id
FROM (
  VALUES
    -- 재고 그룹명, 품목명, 수량, 단위
    ('원두', '에스프레소 원두', 20, 'kg'),
    ('유제품', '우유 1L', 24, '팩'),
    ('유제품', '휘핑 크림', 10, '캔'),
    ('유제품', '플레인 요거트', 15, '통'),
    ('시럽/소스/감미료', '바닐라 시럽', 5, '병'),
    ('시럽/소스/감미료', '카라멜 소스', 4, '병'),
    ('시럽/소스/감미료', '초코 시럽', 4, '병'),
    ('시럽/소스/감미료', '꿀', 8, '병'),
    ('시럽/소스/감미료', '백설탕', 10, 'kg'),
    ('시럽/소스/감미료', '연유', 5, '캔'),
    ('파우더/베이스', '초코 파우더', 10, '봉지'),
    ('파우더/베이스', '녹차 파우더', 7, '봉지'),
    ('파우더/베이스', '고구마 페이스트', 5, 'kg'),
    ('파우더/베이스', '미숫가루', 5, '봉지'),
    ('파우더/베이스', '시나몬 파우더', 3, '통'),
    ('파우더/베이스', '콩가루', 3, '봉지'),
    ('음료/기타', '탄산수 355ml', 48, '캔'),
    ('음료/기타', '식혜 1.5L', 10, '병'),
    ('음료/기타', '코코넛 젤리', 5, '통'),
    ('음료/기타', '알로에', 5, '통'),
    ('음료/기타', '얼음', 100, 'kg'),
    ('일회용품', '12oz 종이컵', 5, '줄'),
    ('일회용품', '16oz 아이스컵', 8, '줄'),
    ('일회용품', '컵 홀더', 10, '박스'),
    ('일회용품', '빨대', 20, '박스'),
    ('일회용품', '냅킨', 15, '팩')
) AS v(stock_name, name, count, unit)
JOIN stocks s ON v.stock_name = s.name
WHERE s.cafe_id = '1f9a2b3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c';
