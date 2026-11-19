/**
 * Vite — build multi-página.
 *
 * base: './'  -> todos os caminhos saem relativos, o que faz o dist funcionar
 *                tanto no GitHub Pages (subpasta /web/dist) quanto aberto direto
 *                do disco (file://).
 *
 * O plugin `htmlEmbutido` (scripts/html-embutido.mjs) roda depois do build e
 * embute o JS e o CSS dentro de cada HTML — sem arquivos externos, nenhum
 * `<script type="module" src>` para o navegador buscar.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { htmlEmbutido } from './scripts/html-embutido.mjs';

export default defineConfig({
  base: './',
  plugins: [react(), htmlEmbutido()],
  server: {
    port: 5173,
    open: '/index.html',
  },
  build: {
    outDir: 'dist',
    target: 'es2020',
    cssCodeSplit: false,   // um único CSS por página
    modulePreload: false,  // sem <link rel="modulepreload">
    assetsInlineLimit: 0,
    reportCompressedSize: false,
    sourcemap: false,
  },
});
