import { useEffect, useRef, useState } from "react";
import { useZeladoria } from "../app/AppProvider.jsx";
import Icon from "./Icon.jsx";
import Marca from "./Marca.jsx";
import { PAGINAS } from "./Header.jsx";

/**
 * Rodapé idêntico nas 3 páginas, incluindo o botão discreto
 * "Restaurar dados de demonstração" (com confirmação inline — sem alert/confirm).
 */
export default function Footer() {
  const { restaurar } = useZeladoria();
  const [confirmando, setConfirmando] = useState(false);
  const [status, setStatus] = useState("");
  const botaoConfirmar = useRef(null);
  const botaoAbrir = useRef(null);

  useEffect(() => {
    if (confirmando) botaoConfirmar.current?.focus();
  }, [confirmando]);

  const confirmarRestauracao = () => {
    restaurar();
    setConfirmando(false);
    setStatus("Dados de demonstração restaurados. Recarregando a página…");
    /* Recarrega para todas as seções refletirem o script SQL original */
    window.setTimeout(() => window.location.reload(), 900);
  };

  return (
    <footer className="rodape">
      <div className="container">
        <div className="rodape__grade">
          <div className="rodape__marca">
            <Marca />
            <p style={{ marginTop: 14 }}>
              Protótipo web da Global Solution 2026/2 (FIAP · 2ESOR).
            </p>
          </div>

          <div>
            <h2>Navegação</h2>
            <ul>
              {PAGINAS.map((pagina) => (
                <li key={pagina.chave}>
                  <a href={pagina.href}>{pagina.rotulo}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2>Dados de demonstração</h2>
            <p style={{ marginBottom: 12 }}>
              Chamados, votos e cidadãos criados neste navegador ficam salvos
              localmente.
            </p>

            <div className="restaurar">
              <button
                className="btn-restaurar"
                type="button"
                ref={botaoAbrir}
                onClick={() => setConfirmando((valor) => !valor)}
              >
                <Icon nome="restaurar" />
                Restaurar dados de demonstração
              </button>

              <div
                className={["confirma-restaurar", confirmando ? "visivel" : ""]
                  .filter(Boolean)
                  .join(" ")}
              >
                <p>
                  Isso apaga chamados e votos criados aqui e volta ao script SQL
                  original. Confirmar?
                </p>
                <button
                  type="button"
                  className="btn-confirmar"
                  ref={botaoConfirmar}
                  onClick={confirmarRestauracao}
                >
                  Restaurar agora
                </button>
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => {
                    setConfirmando(false);
                    botaoAbrir.current?.focus();
                  }}
                >
                  Cancelar
                </button>
              </div>

              <p
                className={["status-restaurado", status ? "visivel" : ""]
                  .filter(Boolean)
                  .join(" ")}
              >
                {status}
              </p>
            </div>
          </div>
        </div>

        <div className="rodape__base">
          <p>
            © {new Date().getFullYear()} Zeladoria Ativa · Global Solution
            2026/2 · FIAP 2ESOR
          </p>
          <p>
            Projeto acadêmico — dados fictícios inspirados em bairros reais de
            São Paulo.
          </p>
        </div>
      </div>
    </footer>
  );
}
