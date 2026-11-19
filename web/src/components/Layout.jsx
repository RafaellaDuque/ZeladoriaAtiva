import { useZeladoria } from '../app/AppProvider.jsx';
import Footer from './Footer.jsx';
import Header from './Header.jsx';
import Icon from './Icon.jsx';

/**
 * Estrutura semântica comum às 3 telas: link de salto, <header> com <nav>,
 * <main> como conteúdo principal e <footer> com a restauração dos dados.
 */
export default function Layout({ children }) {
  const { avisoArmazenamento } = useZeladoria();

  return (
    <>
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>

      <Header />

      <main id="conteudo">{children}</main>

      <Footer />

      <div
        id="avisoArmazenamento"
        className={['mensagem', 'mensagem--erro', avisoArmazenamento ? 'visivel' : ''].filter(Boolean).join(' ')}
        role="status"
      >
        {avisoArmazenamento && (
          <>
            <Icon nome="alerta" />
            <span>{avisoArmazenamento}</span>
          </>
        )}
      </div>
    </>
  );
}
