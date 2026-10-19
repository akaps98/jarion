import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    // React 개발 서버 포트
    port: 5173,
    // 위의 포트만 사용하게끔 - 만약 다른 프로세스가 5173 포트 점유시 오류 표시
    strictPort: true,

    proxy: {
      '/api': {
        // Spring Boot 서버 주소 (backend)
        target: 'http://localhost:4231',
        // CORS 방지 (react - spring 포트 다름)
        changeOrigin: true
      }
    }
  }
})
