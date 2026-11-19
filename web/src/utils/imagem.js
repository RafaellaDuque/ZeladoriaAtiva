/**
 * Tratamento da foto enviada no formulário.
 *
 * O preview usa FileReader (instantâneo, sem enviar nada para servidor).
 * Antes de gravar no localStorage a imagem é reduzida num <canvas> — uma foto
 * de 2 MB viraria ~2,7 MB em base64 e estouraria a cota de ~5 MB do navegador.
 */

export const LIMITE_FOTO = 2 * 1024 * 1024; // 2 MB
export const TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp'];

/** Valida o arquivo; devolve uma mensagem de erro ou null. */
export function validarArquivo(arquivo) {
  if (!arquivo) return null;
  if (!TIPOS_ACEITOS.includes(arquivo.type)) {
    return 'Formato inválido — envie uma imagem JPG, PNG ou WEBP.';
  }
  if (arquivo.size > LIMITE_FOTO) {
    const megabytes = (arquivo.size / 1048576).toFixed(1);
    return `A imagem tem ${megabytes} MB — o limite é 2 MB.`;
  }
  return null;
}

/** Lê o arquivo como data URL (preview imediato com FileReader). */
export function lerComoDataUrl(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = (evento) => resolve(evento.target.result);
    leitor.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
    leitor.readAsDataURL(arquivo);
  });
}

/** Reduz para no máximo 900 px de largura e recomprime em JPEG 72%. */
export function comprimirImagem(dataUrl) {
  return new Promise((resolve) => {
    const imagem = new Image();
    imagem.onload = () => {
      try {
        const larguraMaxima = 900;
        const escala = Math.min(1, larguraMaxima / imagem.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(imagem.width * escala);
        canvas.height = Math.round(imagem.height * escala);
        canvas.getContext('2d').drawImage(imagem, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      } catch {
        resolve(dataUrl);
      }
    };
    imagem.onerror = () => resolve(dataUrl);
    imagem.src = dataUrl;
  });
}
