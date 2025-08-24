import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    // reactRouter() 플러그인이 routes.ts 파일이 없으면
    // 자동으로 app/routes 폴더를 스캔하여 파일 기반 라우팅을 활성화합니다.
    reactRouter(),
    tailwindcss(),
    tsconfigPaths(),
  ],
});
