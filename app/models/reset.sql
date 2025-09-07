-- 이 스크립트는 모든 테이블 스키마를 삭제합니다. (db:migrate 명령어를 실행하기 전에 사용)
-- 주의: 이 스크립트를 실행하면 기존 데이터가 모두 사라집니다.

-- 타입 스키마 초기화
DROP TYPE IF EXISTS public.user_role;

-- 테이블 스키마 초기화
DROP TABLE IF EXISTS recipe_ingredients CASCADE;
DROP TABLE IF EXISTS ingredients CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS menus CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS cafes CASCADE;
