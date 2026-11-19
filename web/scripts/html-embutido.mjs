/**
 * Plugin de pós-build: embute JS e CSS dentro de cada HTML.
 *
 * Por que isso existe: o protótipo precisa ser avaliado de duas formas —
 * (1) publicado no GitHub Pages e (2) com duplo clique no index.html.
 * Num build padrão o HTML referencia arquivos .js/.css externos, e o Chrome
 * bloqueia o carregamento de módulos a partir de `file://` (origem `null`).
 * Com tudo embutido, o HTML vira um arquivo autossuficiente.
 */
export function htmlEmbutido() {
  return {
    name: 'zeladoria:html-embutido',
    apply: 'build',
    enforce: 'post',
    generateBundle(_opcoes, bundle) {
      const scripts = new Map();
      const estilos = new Map();

      for (const [nome, item] of Object.entries(bundle)) {
        if (item.type === 'chunk' && nome.endsWith('.js')) {
          scripts.set(nome, item.code);
          scripts.set(`./${nome}`, item.code);
        }
        if (item.type === 'asset' && nome.endsWith('.css')) {
          estilos.set(nome, String(item.source));
          estilos.set(`./${nome}`, String(item.source));
        }
      }

      for (const item of Object.values(bundle)) {
        if (item.type !== 'asset' || !item.fileName.endsWith('.html')) continue;
        let html = String(item.source);

        html = html.replace(/<link rel="modulepreload"[^>]*>/g, '');

        html = html.replace(
          /<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g,
          (original, href) => {
            const css = estilos.get(href);
            return css ? `<style>${css}</style>` : original;
          }
        );

        html = html.replace(
          /<script[^>]*type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g,
          (original, src) => {
            const js = scripts.get(src);
            return js ? `<script type="module">${js}</script>` : original;
          }
        );

        item.source = html;
      }

      /* Os arquivos já embutidos saem do bundle (imagens de public/ ficam) */
      for (const nome of Object.keys(bundle)) {
        if (nome.endsWith('.js') || nome.endsWith('.css')) delete bundle[nome];
      }
    },
  };
}
