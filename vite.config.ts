import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/plant/', // GitHub Pages base path (เปลี่ยนตามชื่อ repo ของคุณ)
})
