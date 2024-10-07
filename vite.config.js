import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteStaticCopy({
    targets: [
      {src: "src/assets/marker-icon-2x.png", dest: "./assets"}
    ]
  })],
})
