import { useEffect, useMemo, useState } from 'react';
import { useZeladoria } from '../app/AppProvider.jsx';
import ChamadoCard from '../components/ChamadoCard.jsx';
import FiltrosPainel from '../components/FiltrosPainel.jsx';
import Icon from '../components/Icon.jsx';
import Layout from '../components/Layout.jsx';
import Revelar from '../components/Revelar.jsx';
import { filtrarChamados, obterBairro } from '../domain/zeladoria.js';

const FILTROS_INICIAIS = {
  texto: '',
  regiao: '',
  bairroId: '',
  categoria: '',
  status: '',
  ordenacao: 'score',
};

/** Link direto: chamados.html?protocolo=ZEL-2026-0002 (ou ?busca=...) */
function lerQueryString() {
  if (typeof window === 'undefined') return { texto: '', destaque: '' };
  const parametros = new URLSearchParams(window.location.search);
  const protocolo = parametros.get('protocolo');
  const busca = parametros.get('busca');
  return { texto: protocolo || busca || '', destaque: protocolo ? protocolo.toUpperCase() : '' };
}

/** Tela 2 — Painel comunitário, filtros combinados e votação. */
export default function ChamadosPage() {
  const { dados, votanteId, definirVotante } = useZeladoria();
  const [inicial] = useState(lerQueryString);
  const [filtros, setFiltros] = useState({ ...FILTROS_INICIAIS, texto: inicial.texto });
  const [destaque, setDestaque] = useState(inicial.destaque);
  const chamadoDestaque = dados.chamadosZeladoria.find(
    (chamado) => chamado.protocolo === inicial.destaque
  );
  const [abertoId, setAbertoId] = useState(chamadoDestaque?.chamadoId ?? null);

  const resultados = useMemo(() => filtrarChamados(dados, filtros), [dados, filtros]);
  const total = dados.chamadosZeladoria.length;

  /* A zona filtra o bairro: se o bairro escolhido sair da zona, limpa a seleção */
  useEffect(() => {
    if (!filtros.bairroId || !filtros.regiao) return;
    const bairro = obterBairro(dados, filtros.bairroId);
    if (bairro && bairro.regiao !== filtros.regiao) {
      setFiltros((atual) => ({ ...atual, bairroId: '' }));
    }
  }, [filtros.regiao, filtros.bairroId, dados]);

  /* Rola até o chamado aberto por link direto */
  useEffect(() => {
    if (!destaque) return;
    const alvo = document.querySelector('.chamado--destaque');
    if (alvo) alvo.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [destaque]);

  /* Se o chamado aberto sair do filtro, recolhe a lista */
  useEffect(() => {
    if (!abertoId) return;
    const aindaVisivel = resultados.some((item) => item.chamado.chamadoId === abertoId);
    if (!aindaVisivel) setAbertoId(null);
  }, [resultados, abertoId]);

  const alternarChamado = (chamadoId) => {
    setAbertoId((atual) => (atual === chamadoId ? null : chamadoId));
  };

  const aoMudar = (parcial) => {
    setFiltros((atual) => ({ ...atual, ...parcial }));
    setDestaque('');
  };

  const aoLimpar = () => {
    setFiltros(FILTROS_INICIAIS);
    setDestaque('');
    document.getElementById('busca')?.focus();
  };

  return (
    <Layout>
      <section className="cabecalho-pagina cabecalho-pagina--leve" aria-labelledby="tituloPagina">
        <div className="container">
          <p className="sobretitulo">
            Painel comunitário
          </p>
          <h1 id="tituloPagina">Explorar e votar em chamados</h1>
          <p>
            Combine filtros de zona, bairro, categoria e status, e atribua um nível de urgência de 1 a 5 aos
            problemas que afetam a sua rua. Cada voto recalcula na hora o score de prioridade do chamado.
          </p>
        </div>
      </section>

      <section className="secao" style={{ paddingTop: 0 }} aria-labelledby="tituloFiltros">
        <div className="container">
          <FiltrosPainel
            filtros={filtros}
            aoMudar={aoMudar}
            aoLimpar={aoLimpar}
            encontrados={resultados.length}
            total={total}
            dados={dados}
            votanteId={votanteId}
            aoTrocarVotante={definirVotante}
          />

          <div className="layout-chamados" style={{ marginTop: 26 }}>
            <div>
              <h2 className="sr-only">Chamados encontrados</h2>

              <div className="grade-chamados">
                {resultados.length === 0 ? (
                  <div className="vazio">
                    <Icon nome="busca" />
                    <h3>Nenhum chamado encontrado</h3>
                    <p>
                      Não há chamados com esses filtros. Ajuste os critérios ou limpe a busca para ver todos.
                    </p>
                    <button className="btn btn--primario" type="button" onClick={aoLimpar}>
                      Limpar filtros
                    </button>
                  </div>
                ) : (
                  resultados.map((item, indice) => (
                    <ChamadoCard
                      key={item.chamado.chamadoId}
                      item={item}
                      posicao={indice + 1}
                      aberto={abertoId === item.chamado.chamadoId}
                      aoAlternar={() => alternarChamado(item.chamado.chamadoId)}
                      destaque={destaque === item.chamado.protocolo}
                      atraso={Math.min(indice, 5) * 60}
                    />
                  ))
                )}
              </div>
            </div>

            <aside className="coluna-lateral" aria-label="Como funciona a priorização">
              <Revelar as="details" className="nota-fila">
                <summary className="nota-fila__gatilho">Como a fila é calculada</summary>
                <div className="nota-fila__corpo">
                  <p>
                    O score combina o engajamento da comunidade com a vulnerabilidade do
                    território:
                  </p>
                  <code className="formula">
                    scorePrioridade =
                    <br />
                    (totalVotos × 10)
                    <br />+ (indiceVulnerabilidade × 5)
                  </code>
                  <p>
                    A média de urgência é a média aritmética das notas de 1 a 5 dadas pelos
                    moradores.
                  </p>
                </div>
              </Revelar>

              <Revelar as="section" className="cartao-lateral" atraso={90}>
                <h2>Regras da votação</h2>
                <ol>
                  <li>
                    Escolha um nível de urgência de <strong>1 a 5</strong>.
                  </li>
                  <li>O relato é opcional, com até 300 caracteres.</li>
                  <li>
                    Cada CPF vota <strong>uma vez</strong> por chamado.
                  </li>
                  <li>
                    O voto grava em <code>votosChamado</code>, soma +1 em <code>totalVotos</code> e recalcula o
                    score na mesma hora.
                  </li>
                </ol>
              </Revelar>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
}
