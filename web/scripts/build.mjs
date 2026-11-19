/**
 * Build multi-página, uma entrada por vez.
 *
 * Por que não `vite build` direto: com 3 entradas o Rollup extrai o código
 * compartilhado (React, componentes) para um chunk separado, que cada HTML
 * importaria como módulo externo — justamente o que quebra em file://.
 * Construindo uma página por vez com `inlineDynamicImports` cada HTML recebe
 * um bundle único e autossuficiente.
 */
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const paginas = ['index.html', 'chamados.html', 'novo-chamado.html'];

console.log('Zeladoria Ativa — build do protótipo web\n');

for (const [indice, pagina] of paginas.entries()) {
  const inicio = Date.now();
  await build({
    root: raiz,
    configFile: resolve(raiz, 'vite.config.js'),
    logLevel: 'warn',
    build: {
      emptyOutDir: indice === 0,
      rollupOptions: {
        input: resolve(raiz, pagina),
        output: { inlineDynamicImports: true },
      },
    },
  });
  console.log(`  ok  ${pagina.padEnd(18)} ${Date.now() - inicio} ms`);
}

console.log('\nPronto: dist/index.html · dist/chamados.html · dist/novo-chamado.html');
