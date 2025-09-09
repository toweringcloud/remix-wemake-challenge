-- 이 스크립트는 모든 테이블의 데이터를 삭제하고 새로운 샘플 데이터로 채웁니다.
-- 주의: 이 스크립트를 실행하면 기존 데이터가 모두 사라집니다.

-- 데이터 초기화
TRUNCATE TABLE cafes, users, items, menus, recipes, ingredients, recipe_ingredients RESTART IDENTITY CASCADE;

-- 1. UUID 기반 테이블 데이터 시딩 (Cafe, User)
------------------------------------------------------------------------------------
INSERT INTO cafes (id, name, description, headline, body) VALUES
('a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0', '어반 그라인드', '도심 속의 현대적인 커피 공간', '최고급 원두로 내린 스페셜티 커피', '매일 아침 직접 로스팅한 신선한 원두를 사용합니다.');

-- SA, MA, BA 역할에 맞는 아바타 URL과 함께 사용자 데이터를 다시 삽입합니다.
INSERT INTO users (id, role, mobile, avatar_url, cafe_id) VALUES
-- '어반 그라인드' 카페 사용자 (cafe_id: a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0)
(
  'f3d1dab7-3a98-9ab3-ac10-4a233e7fa6f5', 
  'SA', 
  '010-1111-1111', 
  'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png', -- SA (System Admin) 아바타
  'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'
),
(
  'a4e2ebc8-4b09-0bc4-bd21-5b344f8ab7a6', 
  'MA', 
  '010-2222-2222', 
  'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png', -- MA (Cafe Manager) 아바타
  'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'
),
(
  'b5f3fcd9-5c10-1cd5-ce32-6c455a9bc8b7', 
  'BA', 
  '010-3333-3333', 
  'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png', -- BA (Barista) 아바타
  'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'
);

-- 2. BIGINT 기반 테이블 데이터 시딩 (Item, Ingredient, Menu, Recipe 등)
-- CTE와 RETURNING 구문을 사용하여 자동 생성된 ID를 참조합니다.
------------------------------------------------------------------------------------
WITH
-- 2-1. 재고 아이템(Items) 삽입 후 ID와 이름 반환
inserted_items AS (
  INSERT INTO items (category, name, count, unit, cafe_id) VALUES
    ('식재료', '하우스 블렌드 원두', 5000, 'g', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('식재료', '서울우유', 10, 'L', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('식재료', '바닐라 시럽', 2, 'L', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('식재료', '카라멜 소스', 2, 'kg', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('식재료', '초콜릿 파우더', 3, 'kg', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('식재료', '유기농 녹차 파우더', 1, 'kg', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('식재료', '국내산 고구마 페이스트', 3, 'kg', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('식재료', '생강청', 2, 'kg', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('식재료', '18곡 미숫가루', 2, 'kg', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('식재료', '유자청', 5, 'kg', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('식재료', '자몽청', 5, 'kg', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('식재료', '레몬청', 5, 'kg', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('식재료', '꽃차/허브티 믹스', 500, 'g', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('식재료', '식혜 원액', 10, 'L', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0')
  RETURNING id, name
),

-- 2-2. 레시피 재료(Ingredients) 삽입 후 ID와 이름 반환
inserted_ingredients AS (
  INSERT INTO ingredients (name, cafe_id) VALUES
    ('에스프레소 샷', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'), ('물', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('우유', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'), ('얼음', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('바닐라 시럽', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'), ('카라멜 소스', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('초코 파우더', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'), ('녹차 파우더', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('고구마 페이스트', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'), ('생강청', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('미숫가루', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'), ('수제꽃차 티백', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('생강 슬라이스', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'), ('대추 슬라이스', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('유자청', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'), ('자몽청', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('레몬청', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'), ('히비스커스 티백', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('캐모마일 티백', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'), ('페퍼민트 티백', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('얼그레이 티백', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'), ('식혜', 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0')
  RETURNING id, name
),

-- 2-3. 메뉴(Menus) 삽입 후 ID, 이름, is_hot 여부 반환
inserted_menus AS (
  INSERT INTO menus (category, name, is_hot, cafe_id) VALUES
    ('커피', '아메리카노', true, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'), ('커피', '아메리카노', false, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('커피', '카라멜 마끼아또', true, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'), ('커피', '카라멜 마끼아또', false, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('커피', '카페라떼', true, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'), ('커피', '카페라떼', false, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('커피', '바닐라라떼', true, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'), ('커피', '바닐라라떼', false, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('라떼', '초코라떼', true, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'), ('라떼', '초코라떼', false, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('라떼', '그린티라떼', true, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'), ('라떼', '그린티라떼', false, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('라떼', '고구마라떼', true, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'), ('라떼', '생강라떼', true, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('라떼', '미숫가루라떼', false, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('차', '수제꽃차', true, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'), ('차', '생강차', true, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('차', '대추차', true, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'), ('차', '유자차', true, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('차', '자몽차', true, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'), ('차', '레몬차', true, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('허브티', '히비스커스', true, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'), ('허브티', '캐모마일', true, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('허브티', '페퍼민트', true, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'), ('홍차', '얼그레이', true, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'),
    ('전통음료', '살얼음 동동식혜', false, 'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0')
  RETURNING id, name, is_hot
),

-- 2-4. 레시피(Recipes) 삽입 후 ID와 이름 반환
inserted_recipes AS (
  INSERT INTO recipes (name, menu_id, cafe_id)
  SELECT
    CASE WHEN m.is_hot THEN '핫 ' || m.name ELSE '아이스 ' || m.name END,
    m.id,
    'a8e6e5a2-8b43-4b68-b765-9b788f2ab1a0'
  FROM inserted_menus AS m
  RETURNING id, name
)

-- 2-5. 레시피(Recipes) 상세 설명 및 조리 단계 업데이트
UPDATE recipes SET description = '깊고 진한 에스프레소에 뜨거운 물을 더한 클래식 커피' WHERE name = '핫 아메리카노';
UPDATE recipes SET description = '시원한 물과 얼음 위에 에스프레소를 부어 깔끔하게 즐기는 커피' WHERE name = '아이스 아메리카노';
UPDATE recipes SET description = '달콤한 바닐라 향의 스팀 밀크에 에스프레소 샷과 카라멜 소스를 얹은 부드러운 커피' WHERE name = '핫 카라멜 마끼아또';
UPDATE recipes SET description = '바닐라 시럽과 우유, 얼음 위에 에스프레소 샷과 카라멜 소스를 더한 시원하고 달콤한 커피' WHERE name = '아이스 카라멜 마끼아또';
UPDATE recipes SET description = '에스프레소에 부드러운 스팀 밀크를 듬뿍 더해 고소하고 담백하게 즐기는 커피' WHERE name = '핫 카페라떼';
UPDATE recipes SET description = '신선한 우유와 얼음, 에스프레소 샷이 어우러져 더욱 고소하고 시원한 커피' WHERE name = '아이스 카페라떼';
UPDATE recipes SET description = '달콤한 바닐라 시럽과 에스프레소, 부드러운 스팀 밀크가 조화로운 인기 라떼' WHERE name = '핫 바닐라라떼';
UPDATE recipes SET description = '바닐라 시럽의 달콤함과 에스프레소의 깊은 풍미를 시원하게 즐기는 라떼' WHERE name = '아이스 바닐라라떼';
UPDATE recipes SET description = '진한 초콜릿과 부드러운 스팀 밀크가 만나 달콤하고 따뜻하게 몸을 녹여주는 음료' WHERE name = '핫 초코라떼';
UPDATE recipes SET description = '진하고 달콤한 초콜릿을 신선한 우유와 얼음으로 시원하게 즐기는 음료' WHERE name = '아이스 초코라떼';
UPDATE recipes SET description = '쌉쌀한 국내산 녹차와 부드러운 우유가 만나 건강하고 든든한 논커피 라떼' WHERE name = '핫 그린티라떼';
UPDATE recipes SET description = '진한 녹차의 풍미를 신선한 우유와 얼음으로 더욱 시원하고 깔끔하게 즐기는 라떼' WHERE name = '아이스 그린티라떼';
UPDATE recipes SET description = '달콤하고 구수한 국내산 고구마와 따뜻한 우유가 만나 든든한 한 끼 식사 대용 음료' WHERE name = '핫 고구마라떼';
UPDATE recipes SET description = '알싸한 생강과 부드러운 우유가 만나 몸을 따뜻하게 데워주는 건강 라떼' WHERE name = '핫 생강라떼';
UPDATE recipes SET description = '18가지 곡물로 만들어 고소하고 든든하며 시원하게 즐기는 한국식 건강 음료' WHERE name = '아이스 미숫가루라떼';
UPDATE recipes SET description = '아름다운 꽃잎을 그대로 담아 눈과 입으로 즐기는 향긋한 수제 허브티' WHERE name = '핫 수제꽃차';
UPDATE recipes SET description = '국내산 생강을 정성껏 달여 만들어 목을 편안하게 해주는 건강 전통차' WHERE name = '핫 생강차';
UPDATE recipes SET description = '푹 고아낸 대추의 깊고 진한 단맛으로 몸의 기운을 북돋아 주는 전통차' WHERE name = '핫 대추차';
UPDATE recipes SET description = '향긋한 유자의 상큼함과 달콤함으로 비타민을 보충하는 인기 과일차' WHERE name = '핫 유자차';
UPDATE recipes SET description = '쌉쌀하고 상큼한 자몽 과육이 그대로 담겨 생기 넘치는 하루를 선사하는 과일차' WHERE name = '핫 자몽차';
UPDATE recipes SET description = '상큼한 레몬의 신선함으로 기분까지 상쾌하게 만들어주는 비타민 과일차' WHERE name = '핫 레몬차';
UPDATE recipes SET description = '매혹적인 붉은 수색과 새콤한 맛이 특징인 무카페인 허브티' WHERE name = '핫 히비스커스';
UPDATE recipes SET description = '은은한 사과향과 함께 심신을 안정시켜 편안한 휴식을 선사하는 허브티' WHERE name = '핫 캐모마일';
UPDATE recipes SET description = '입안 가득 퍼지는 상쾌한 민트향으로 기분을 전환시켜주는 허브티' WHERE name = '핫 페퍼민트';
UPDATE recipes SET description = '베르가못 향이 매력적인 클래식 홍차로, 깊고 풍부한 맛을 자랑합니다' WHERE name = '핫 얼그레이';
UPDATE recipes SET description = '엿기름으로 직접 담가 달콤하고 시원하며 밥알이 동동 떠있는 한국 전통 음료' WHERE name = '아이스 살얼음 동동식혜';

-- 핫 아메리카노
UPDATE recipes
SET steps = ARRAY['뜨거운 잔을 준비합니다.', '에스프레소 2샷(30ml)을 추출합니다.', '추출된 샷에 뜨거운 물(200ml)을 붓습니다.']
WHERE name = '핫 아메리카노';

-- 아이스 아메리카노
UPDATE recipes
SET steps = ARRAY['얼음을 가득 채운 아이스 잔을 준비합니다.', '차가운 물(180ml)을 붓습니다.', '에스프레소 2샷(30ml)을 추출하여 물 위에 붓습니다.']
WHERE name = '아이스 아메리카노';

-- 핫 카라멜 마끼아또
UPDATE recipes
SET steps = ARRAY['뜨거운 잔에 바닐라 시럽(2펌프)을 넣습니다.', '우유(220ml)를 곱게 스티밍하여 잔에 붓습니다.', '에스프레소 2샷(30ml)을 추출하여 우유 거품 위에 점을 찍듯이 붓습니다.', '카라멜 소스를 격자 모양으로 드리즐합니다.']
WHERE name = '핫 카라멜 마끼아또';

-- 아이스 카라멜 마끼아또
UPDATE recipes
SET steps = ARRAY['아이스 잔에 바닐라 시럽(2펌프)을 넣습니다.', '우유(200ml)를 붓고 얼음을 가득 채웁니다.', '에스프레소 2샷(30ml)을 추출하여 얼음 위에 부드럽게 붓습니다.', '카라멜 소스를 격자 모양으로 드리즐합니다.']
WHERE name = '아이스 카라멜 마끼아또';

-- 핫 카페라떼
UPDATE recipes
SET steps = ARRAY['뜨거운 잔을 준비합니다.', '잔에 에스프레소 2샷(30ml)을 추출합니다.', '우유(250ml)를 스팀 피처에 담아 벨벳 질감으로 스티밍합니다.', '샷 위에 스팀 우유를 부드럽게 부어 하트 모양을 만듭니다.']
WHERE name = '핫 카페라떼';

-- 아이스 카페라떼
UPDATE recipes
SET steps = ARRAY['얼음을 가득 채운 아이스 잔을 준비합니다.', '잔에 우유(200ml)를 먼저 붓습니다.', '에스프레소 2샷(30ml)을 추출하여 우유 위에 부드럽게 붓습니다.']
WHERE name = '아이스 카페라떼';

-- 핫 바닐라라떼
UPDATE recipes
SET steps = ARRAY['뜨거운 잔에 바닐라 시럽(2펌프)을 넣습니다.', '에스프레소 2샷(30ml)을 추출하여 시럽과 잘 섞어줍니다.', '우유(220ml)를 곱게 스티밍하여 잔에 붓습니다.']
WHERE name = '핫 바닐라라떼';

-- 아이스 바닐라라떼
UPDATE recipes
SET steps = ARRAY['아이스 잔에 바닐라 시럽(2펌프)과 에스프레소 2샷(30ml)을 넣고 섞어줍니다.', '우유(200ml)를 붓고 얼음을 가득 채웁니다.']
WHERE name = '아이스 바닐라라떼';

-- 핫 초코라떼
UPDATE recipes
SET steps = ARRAY['뜨거운 잔에 초코 파우더(30g)를 넣습니다.', '뜨거운 물 또는 우유(30ml)를 약간 부어 잘 녹여 페이스트로 만듭니다.', '우유(220ml)를 부드럽게 스티밍합니다.', '초코 페이스트에 스팀 우유를 부으면서 잘 저어줍니다.']
WHERE name = '핫 초코라떼';

-- 아이스 초코라떼
UPDATE recipes
SET steps = ARRAY['잔에 초코 파우더(30g)와 우유(220ml)를 넣고 잘 저어줍니다.', '얼음을 가득 채웁니다.', '기호에 따라 휘핑 크림을 올립니다.']
WHERE name = '아이스 초코라떼';

-- 핫 그린티라떼
UPDATE recipes
SET steps = ARRAY['뜨거운 잔에 녹차 파우더(20g)와 설탕(10g)을 넣습니다.', '뜨거운 물(30ml)을 부어 파우더가 뭉치지 않게 잘 풀어줍니다.', '우유(220ml)를 곱게 스티밍합니다.', '녹차 베이스에 스팀 우유를 부으면서 잘 저어줍니다.']
WHERE name = '핫 그린티라떼';

-- 아이스 그린티라떼
UPDATE recipes
SET steps = ARRAY['잔에 녹차 파우더(20g)와 설탕(10g), 우유(220ml)를 넣고 잘 저어줍니다.', '얼음을 가득 채웁니다.']
WHERE name = '아이스 그린티라떼';

-- 핫 고구마라떼
UPDATE recipes
SET steps = ARRAY['뜨거운 잔에 고구마 페이스트(40g)를 넣습니다.', '우유(250ml)를 스티밍합니다.', '고구마 페이스트에 스팀 우유를 부으면서 덩어리가 없도록 잘 저어줍니다.', '기호에 따라 견과류 토핑을 올립니다.']
WHERE name = '핫 고구마라떼';

-- 핫 생강라떼
UPDATE recipes
SET steps = ARRAY['뜨거운 잔에 생강청(30g)을 넣습니다.', '우유(250ml)를 스티밍합니다.', '생강청에 스팀 우유를 부으면서 잘 저어줍니다.', '시나몬 파우더를 살짝 뿌려 제공합니다.']
WHERE name = '핫 생강라떼';

-- 아이스 미숫가루라떼
UPDATE recipes
SET steps = ARRAY['블렌더에 미숫가루(40g), 우유(250ml), 꿀(15ml), 얼음(8개)을 넣습니다.', '내용물이 부드러워질 때까지 약 30초간 블렌딩합니다.', '잔에 옮겨 담아 제공합니다.']
WHERE name = '아이스 미숫가루라떼';

-- 수제꽃차 / 생강차 / 대추차 / 유자차 / 자몽차 / 레몬차 (청 기반 차)
UPDATE recipes SET steps = ARRAY['뜨거운 잔에 수제꽃차 티백(1개)을 넣습니다.', '뜨거운 물(300ml)을 붓습니다.', '티백이 충분히 우러나도록 3-4분 정도 기다립니다.'] WHERE name = '핫 수제꽃차';
UPDATE recipes SET steps = ARRAY['뜨거운 잔에 생강청(30g)을 넣습니다.', '뜨거운 물(250ml)을 붓습니다.', '청이 잘 녹도록 저어주고, 대추 슬라이스를 띄웁니다.'] WHERE name = '핫 생강차';
UPDATE recipes SET steps = ARRAY['뜨거운 잔에 말린 대추 슬라이스(10g)를 넣습니다.', '뜨거운 물(300ml)을 붓고 5분 이상 충분히 우려냅니다.', '꿀이나 설탕을 취향에 맞게 추가합니다.'] WHERE name = '핫 대추차';
UPDATE recipes SET steps = ARRAY['뜨거운 잔에 유자청(40g)을 넣습니다.', '뜨거운 물(250ml)을 붓고 청이 잘 녹도록 저어줍니다.'] WHERE name = '핫 유자차';
UPDATE recipes SET steps = ARRAY['뜨거운 잔에 자몽청(40g)을 넣습니다.', '뜨거운 물(250ml)을 붓고 청이 잘 녹도록 저어줍니다.', '로즈마리 잎으로 장식합니다.'] WHERE name = '핫 자몽차';
UPDATE recipes SET steps = ARRAY['뜨거운 잔에 레몬청(40g)을 넣습니다.', '뜨거운 물(250ml)을 붓고 청이 잘 녹도록 저어줍니다.', '레몬 슬라이스를 추가합니다.'] WHERE name = '핫 레몬차';

-- 허브티 & 홍차 (티백 기반)
UPDATE recipes SET steps = ARRAY['뜨거운 잔에 히비스커스 티백(1개)을 넣습니다.', '뜨거운 물(300ml)을 붓습니다.', '티백이 충분히 우러나도록 3-5분 정도 기다립니다.'] WHERE name = '핫 히비스커스';
UPDATE recipes SET steps = ARRAY['뜨거운 잔에 캐모마일 티백(1개)을 넣습니다.', '뜨거운 물(300ml)을 붓습니다.', '티백이 충분히 우러나도록 3-4분 정도 기다립니다.'] WHERE name = '핫 캐모마일';
UPDATE recipes SET steps = ARRAY['뜨거운 잔에 페퍼민트 티백(1개)을 넣습니다.', '뜨거운 물(300ml)을 붓습니다.', '티백이 충분히 우러나도록 3-4분 정도 기다립니다.'] WHERE name = '핫 페퍼민트';
UPDATE recipes SET steps = ARRAY['뜨거운 잔에 얼그레이 티백(1개)을 넣습니다.', '뜨거운 물(300ml)을 붓습니다.', '티백이 충분히 우러나도록 2-3분 정도 기다립니다.'] WHERE name = '핫 얼그레이';

-- 살얼음 동동식혜
UPDATE recipes
SET steps = ARRAY['차가운 유리잔을 준비합니다.', '살얼음이 있는 식혜(300ml)를 밥알과 함께 잔에 붓습니다.', '기호에 따라 잣이나 밥알을 추가로 띄웁니다.']
WHERE name = '아이스 살얼음 동동식혜';

-- 2-6. 레시피-재료 관계(Recipe-Ingredients) 테이블 최종 삽입
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity)
SELECT
  r.id AS recipe_id,
  i.id AS ingredient_id,
  v.quantity
FROM (VALUES
  ('핫 아메리카노', '에스프레소 샷', '2샷'), ('핫 아메리카노', '물', '200ml'),
  ('아이스 아메리카노', '에스프레소 샷', '2샷'), ('아이스 아메리카노', '물', '180ml'), ('아이스 아메리카노', '얼음', '가득'),
  ('핫 카라멜 마끼아또', '에스프레소 샷', '2샷'), ('핫 카라멜 마끼아또', '우유', '200ml'), ('핫 카라멜 마끼아또', '바닐라 시럽', '1펌프'), ('핫 카라멜 마끼아또', '카라멜 소스', '15ml'),
  ('아이스 카라멜 마끼아또', '에스프레소 샷', '2샷'), ('아이스 카라멜 마끼아또', '우유', '180ml'), ('아이스 카라멜 마끼아또', '바닐라 시럽', '1펌프'), ('아이스 카라멜 마끼아또', '카라멜 소스', '15ml'), ('아이스 카라멜 마끼아또', '얼음', '가득'),
  ('핫 카페라떼', '에스프레소 샷', '2샷'), ('핫 카페라떼', '우유', '250ml'),
  ('아이스 카페라떼', '에스프레소 샷', '2샷'), ('아이스 카페라떼', '우유', '200ml'), ('아이스 카페라떼', '얼음', '가득'),
  ('핫 바닐라라떼', '에스프레소 샷', '2샷'), ('핫 바닐라라떼', '우유', '250ml'), ('핫 바닐라라떼', '바닐라 시럽', '2펌프'),
  ('아이스 바닐라라떼', '에스프레소 샷', '2샷'), ('아이스 바닐라라떼', '우유', '200ml'), ('아이스 바닐라라떼', '바닐라 시럽', '2펌프'), ('아이스 바닐라라떼', '얼음', '가득'),
  ('핫 초코라떼', '초코 파우더', '30g'), ('핫 초코라떼', '우유', '250ml'),
  ('아이스 초코라떼', '초코 파우더', '30g'), ('아이스 초코라떼', '우유', '200ml'), ('아이스 초코라떼', '얼음', '가득'),
  ('핫 그린티라떼', '녹차 파우더', '20g'), ('핫 그린티라떼', '우유', '250ml'),
  ('아이스 그린티라떼', '녹차 파우더', '20g'), ('아이스 그린티라떼', '우유', '200ml'), ('아이스 그린티라떼', '얼음', '가득'),
  ('핫 고구마라떼', '고구마 페이스트', '40g'), ('핫 고구마라떼', '우유', '250ml'),
  ('핫 생강라떼', '생강청', '30g'), ('핫 생강라떼', '우유', '250ml'), ('핫 생강라떼', '생강 슬라이스', '1조각'),
  ('아이스 미숫가루라떼', '미숫가루', '40g'), ('아이스 미숫가루라떼', '우유', '250ml'), ('아이스 미숫가루라떼', '얼음', '가득'),
  ('핫 수제꽃차', '수제꽃차 티백', '1개'), ('핫 수제꽃차', '물', '300ml'),
  ('핫 생강차', '생강청', '30g'), ('핫 생강차', '물', '250ml'), ('핫 생강차', '대추 슬라이스', '약간'),
  ('핫 대추차', '대추 슬라이스', '5-6개'), ('핫 대추차', '물', '300ml'),
  ('핫 유자차', '유자청', '40g'), ('핫 유자차', '물', '250ml'),
  ('핫 자몽차', '자몽청', '40g'), ('핫 자몽차', '물', '250ml'),
  ('핫 레몬차', '레몬청', '40g'), ('핫 레몬차', '물', '250ml'),
  ('핫 히비스커스', '히비스커스 티백', '1개'), ('핫 히비스커스', '물', '300ml'),
  ('핫 캐모마일', '캐모마일 티백', '1개'), ('핫 캐모마일', '물', '300ml'),
  ('핫 페퍼민트', '페퍼민트 티백', '1개'), ('핫 페퍼민트', '물', '300ml'),
  ('핫 얼그레이', '얼그레이 티백', '1개'), ('핫 얼그레이', '물', '300ml'),
  ('아이스 살얼음 동동식혜', '식혜', '300ml'), ('아이스 살얼음 동동식혜', '얼음', '약간')
) AS v(recipe_name, ingredient_name, quantity)
JOIN inserted_recipes r ON v.recipe_name = r.name
JOIN inserted_ingredients i ON v.ingredient_name = i.name;
