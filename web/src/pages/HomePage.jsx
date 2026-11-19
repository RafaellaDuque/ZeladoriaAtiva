import { useLayoutEffect, useMemo, useRef } from "react";
import { useZeladoria } from "../app/AppProvider.jsx";
import Icon from "../components/Icon.jsx";
import KpiCard from "../components/KpiCard.jsx";
import Layout from "../components/Layout.jsx";
import MapaVotos from "../components/MapaVotos.jsx";
import OrdemServicoCard from "../components/OrdemServicoCard.jsx";
import Revelar from "../components/Revelar.jsx";
import { decimal, humanizar, numero, plural } from "../domain/format.js";
import {
  calcularIndicadores,
  listarTopPrioridade,
  obterBairro,
  obterChamado,
  obterOrgao,
} from "../domain/zeladoria.js";

/** Tela 1 — Home e transparência pública. */
export default function HomePage() {
  const { dados } = useZeladoria();

  const indicadores = useMemo(() => calcularIndicadores(dados), [dados]);
  const top3 = useMemo(() => listarTopPrioridade(dados, 3), [dados]);
  /* Referência da barra do painel ao vivo (a fila já vem ordenada desc.) */
  const maiorScore = useMemo(
    () => Math.max(...top3.map((item) => item.score), 1),
    [top3],
  );

  const ordens = useMemo(
    () =>
      [...dados.ordensServico]
        .sort((a, b) => (a.dataEmissao < b.dataEmissao ? 1 : -1))
        .map((ordem) => {
          const chamado = obterChamado(dados, ordem.chamadoId);
          return {
            ordem,
            chamado,
            bairro: chamado ? obterBairro(dados, chamado.bairroId) : null,
            orgao: obterOrgao(dados, ordem.orgaoId),
          };
        }),
    [dados],
  );

  const filaRef = useRef(null);
  useTrilhoFila(filaRef);

  const cards = [
    {
      valor: indicadores.totalChamados,
      rotulo: "Chamados registrados",
    },
    {
      valor: indicadores.totalVotos,
      rotulo: "Votos comunitários auditados",
    },
    {
      valor: indicadores.chamadosAltaVulnerabilidade,
      rotulo: "Chamados em bairros de alta vulnerabilidade",
    },
    {
      valor: indicadores.ordensEmitidas,
      rotulo: "Ordens de serviço emitidas",
    },
  ];

  return (
    <Layout>
      {/* ================================ HERO ================================ */}
      <section className="hero" aria-labelledby="tituloHero">
        <div className="container hero__inner">
          <div className="hero__conteudo">
            <h1 id="tituloHero">
              Priorização comunitária dos <em>problemas urbanos</em> de São
              Paulo
            </h1>

            <p className="hero__texto">
              Abra um chamado de Zeladoria. A população vota. A fila pública
              vira ordem de serviço para a Prefeitura.
            </p>

            <div className="hero__acoes">
              <a className="btn btn--primario" href="chamados.html">
                <Icon nome="mapa" />
                Explorar e votar
              </a>
              <a className="btn btn--claro" href="novo-chamado.html">
                <Icon nome="mais" />
                Abrir novo chamado
              </a>
            </div>
          </div>

          <MapaVotos />
        </div>
      </section>

      {/* ========================= ZELADORIA URBANA ========================= */}
      <section className="explica" aria-labelledby="tituloExplica">
        <div className="container">
          <Revelar className="explica__topo">
            <p className="sobretitulo">Entenda o termo</p>
            <h2 id="tituloExplica">Afinal, o que é zeladoria urbana?</h2>
            <p className="explica__lead">
              É o conjunto serviçõs de manutenção dos espaços públicos de uma
              cidade para garantir o bom funcionamento da infraestrutura, a
              segurança e a qualidade de vida da população.
            </p>
          </Revelar>

          <Revelar className="explica__texto" atraso={140}>
            <p>
              <strong>De quem é a responsabilidade?</strong> Do poder público
              municipal, geralmente gerida pelas prefeituras por meio de
              secretarias de obras, serviços urbanos ou subprefeituras.
              <br />A população também desempenha um papel importante ao
              solicitar reparos pelos canais de atendimento das prefeituras ou
              pela Zeladoria Ativa para uma melhor transparência.
            </p>
          </Revelar>
        </div>
      </section>

      {/* ============================ INDICADORES ============================ */}
      <section className="secao" aria-labelledby="tituloIndicadores">
        <div className="container">
          <Revelar className="secao__topo">
            <div>
              <p className="sobretitulo">Nosso objetivo</p>
              <h2 id="tituloIndicadores">
                Pedido mais simples, prioridade mais clara
              </h2>
              <p>
                Nosso projeto existe para que a zeladoria da cidade seja
                decidida por quem vive nela. O objetivo é facilitar as
                solicitações de reparo e ajudar a subprefeitura a ver onde a
                população precisa de mais suporte.
              </p>
            </div>
          </Revelar>

          <div className="grade-kpi">
            {cards.map((card, indice) => (
              <KpiCard key={card.rotulo} {...card} atraso={indice * 70} />
            ))}
          </div>
        </div>
      </section>

      {/* ======================== FILA DE PRIORIDADE ========================
          O trilho é mais alto que a tela. O palco gruda (snap) e, enquanto o
          scroll continua dentro dele, entra o texto e depois o painel. */}
      <section className="fila-cena" ref={filaRef} aria-labelledby="tituloFila">
        <div className="fila-cena__palco secao--tom">
          <div className="container secao-fila">
            <div className="secao__topo fila-revela fila-revela--texto">
              <div className="secao-fila__texto">
                <p className="sobretitulo">Transparência na fila</p>
                <h2 id="tituloFila">Fila de prioridade atual</h2>
                <p>
                  A fila é a ordem de atendimento dos problemas que a cidade
                  ainda não resolveu. O 1º lugar é o chamado que, neste momento,
                  junta mais apoio da comunidade com um bairro mais vulnerável.
                </p>
                <p>
                  Cada cidadão vota uma vez, com uma nota de urgência de 1 a 5.
                  O score soma:{" "}
                  <strong>
                    (votos × 10) + (vulnerabilidade do bairro × 5)
                  </strong>
                  . A urgência que aparece no painel é a média dessas notas.
                </p>
              </div>
            </div>

            <aside
              className="painel-vivo fila-revela fila-revela--painel"
              aria-labelledby="tituloPainelVivo"
            >
              <div className="painel-vivo__topo">
                <h2 id="tituloPainelVivo">Fila de prioridade</h2>
                <span className="pulso">ao vivo</span>
              </div>

              {top3.length === 0 ? (
                <p className="painel-vivo__vazio">
                  Nenhum chamado pendente. Abra um novo se identificar um
                  problema na sua rua.
                </p>
              ) : (
                <ol className="fila-mini">
                  {top3.map((item, indice) => {
                    /* barra proporcional ao maior score da fila: 55 e 45 se distinguem de relance */
                    const largura = Math.max(
                      8,
                      Math.round((item.score / maiorScore) * 100),
                    );

                    return (
                      <li
                        key={item.chamado.chamadoId}
                        className={`fila-mini__item${indice === 0 ? " fila-mini__item--lider" : ""}`}
                      >
                        <span className="fila-mini__pos" aria-hidden="true">
                          {indice + 1}
                        </span>

                        <span className="fila-mini__info">
                          <span className="fila-mini__titulo">
                            {item.chamado.titulo}
                          </span>
                          <span className="fila-mini__meta">
                            {item.bairro?.nome ?? "—"} ·{" "}
                            {humanizar(item.chamado.categoria)} ·{" "}
                            <span className="fila-mini__urgencia">
                              urgência {decimal(item.media)}
                            </span>
                          </span>
                          <span className="fila-mini__barra" aria-hidden="true">
                            <span style={{ width: `${largura}%` }} />
                          </span>
                        </span>

                        <span className="fila-mini__score">
                          {numero(item.score)}
                          <small>
                            {plural(item.chamado.totalVotos, "voto", "votos")}
                          </small>
                        </span>
                      </li>
                    );
                  })}
                </ol>
              )}
            </aside>
          </div>

          <p className="fila-cena__dica" aria-hidden="true">
            Continue rolando
          </p>
        </div>

        <div className="fila-cena__passo" aria-hidden="true" />
        <div className="fila-cena__passo" aria-hidden="true" />
      </section>

      {/* ======================= ORDENS DE SERVIÇO ======================= */}
      <section className="secao" aria-labelledby="tituloOrdens">
        <div className="container">
          <Revelar className="resposta">
            <div className="resposta__texto">
              <p className="sobretitulo">Resposta da prefeitura</p>
              <h2 id="tituloOrdens">Resolvendo um chamado</h2>
              <p>
                Quando a subprefeitura assume um chamado, a ordem de serviço
                mostra quem fez o trabalho e em quanto tempo o problema foi
                resolvido. Possibilitando uma auditoria facilitada e
                transparente, tanto para a população quanto para o próprio poder
                público.
              </p>
            </div>
          </Revelar>

          <div className="dossies">
            {ordens.length === 0 ? (
              <div className="vazio">
                <Icon nome="os" />
                <h3>Nenhuma ordem de serviço emitida</h3>
                <p>
                  As subprefeituras ainda não responderam aos chamados da fila.
                </p>
              </div>
            ) : (
              ordens.map((registro, indice) => (
                <OrdemServicoCard
                  key={registro.ordem.ordemId}
                  {...registro}
                  atraso={indice * 120}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* ========================== IMPACTO E ODS ========================== */}
      <section className="secao secao--escura" aria-labelledby="tituloOds">
        <div className="container">
          <Revelar className="secao__topo">
            <div>
              <p className="sobretitulo">Agenda 2030 da ONU</p>
              <h2 id="tituloOds">Impacto social e ODS</h2>
              <p>
                Luz na rua, calçada livre e bueiro funcionando não são luxo: são
                acesso à cidade. É por aí que o projeto se conecta à Agenda
                2030.
              </p>
            </div>
          </Revelar>

          <div className="ods-grade">
            <Revelar as="article" className="ods-card ods-card--11">
              <p className="ods-card__numero">
                ODS <b>11</b> · Cidades e Comunidades Sustentáveis
              </p>
              <h3>Zeladoria como política de acesso à cidade</h3>
              <p>
                Calçada livre, iluminação pública funcionando e drenagem que não
                alaga são a base do direito à cidade. Ao dar voz a quem vive o
                território, a plataforma ataca desigualdades dentro do mesmo
                município.
              </p>
              <ul>
                <li>
                  <Icon nome="check" />
                  <span>
                    <b>Meta 11.1</b> Garantir acesso a moradia e serviços
                    básicos adequados — inclusive infraestrutura urbana segura.
                  </span>
                </li>
                <li>
                  <Icon nome="check" />
                  <span>
                    <b>Meta 11.3</b> Gestão participativa e integrada do
                    planejamento urbano, com a comunidade como curadora das
                    prioridades.
                  </span>
                </li>
              </ul>
            </Revelar>

            <Revelar as="article" className="ods-card ods-card--9" atraso={90}>
              <p className="ods-card__numero">
                ODS <b>9</b> · Indústria, Inovação e Infraestrutura
              </p>
              <h3>Tecnologia cívica sobre dados abertos</h3>
              <p>
                O mesmo domínio de dados usado no banco Oracle, no console Java
                e na web permite medir a qualidade da infraestrutura urbana
                bairro a bairro e priorizar o investimento público com
                evidência, não com palpite.
              </p>
              <ul>
                <li>
                  <Icon nome="check" />
                  <span>
                    <b>Meta 9.1</b> Infraestrutura confiável, sustentável e
                    resiliente, com acesso equitativo para todos.
                  </span>
                </li>
                <li>
                  <Icon nome="check" />
                  <span>
                    <b>Meta 9.5</b> Fortalecimento da capacidade tecnológica e
                    inovação em serviços públicos locais.
                  </span>
                </li>
              </ul>
            </Revelar>
          </div>
        </div>
      </section>
    </Layout>
  );
}

/** 0–1 acompanhando o scroll: devagar no começo e no fim, contínuo no meio. */
function faixa(progresso, inicio, fim) {
  if (fim <= inicio) return progresso >= fim ? 1 : 0;
  const t = Math.min(1, Math.max(0, (progresso - inicio) / (fim - inicio)));
  return t * t * (3 - 2 * t);
}

/**
 * Amarra o scroll do trilho às variáveis CSS da cena.
 * Desliga sozinho no celular (a fila empilha) e quando a pessoa pediu menos movimento.
 */
function useTrilhoFila(ref) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)");
    const estreito = window.matchMedia("(max-width: 1080px)");
    let frame = 0;

    const aplicar = () => {
      frame = 0;

      if (reduzir.matches || estreito.matches) {
        el.classList.remove("fila-cena--ativa");
        return;
      }

      const distancia = el.offsetHeight - window.innerHeight;
      const percorrido = Math.min(
        Math.max(-el.getBoundingClientRect().top, 0),
        Math.max(distancia, 1),
      );
      const progresso = distancia > 0 ? percorrido / distancia : 1;
      const passos = el.querySelectorAll(".fila-cena__passo");
      const marcoTexto = passos[0]
        ? passos[0].offsetTop / Math.max(distancia, 1)
        : 0.5;
      const marcoPainel = passos[1]
        ? passos[1].offsetTop / Math.max(distancia, 1)
        : 1;

      const fim = Math.min(marcoPainel, 0.98);
      const inicioPainel = Math.min(marcoTexto + 0.04, fim - 0.2);

      el.classList.add("fila-cena--ativa");
      el.style.setProperty(
        "--texto",
        faixa(progresso, 0.04, marcoTexto).toFixed(3),
      );
      el.style.setProperty(
        "--painel",
        faixa(
          progresso,
          inicioPainel,
          inicioPainel + (fim - inicioPainel) * 0.42,
        ).toFixed(3),
      );
      el.style.setProperty(
        "--item-1",
        faixa(
          progresso,
          inicioPainel + 0.02,
          inicioPainel + (fim - inicioPainel) * 0.58,
        ).toFixed(3),
      );
      el.style.setProperty(
        "--item-2",
        faixa(
          progresso,
          inicioPainel + 0.07,
          inicioPainel + (fim - inicioPainel) * 0.76,
        ).toFixed(3),
      );
      el.style.setProperty(
        "--item-3",
        faixa(progresso, inicioPainel + 0.12, fim).toFixed(3),
      );
    };

    const agendar = () => {
      if (frame) return;
      frame = requestAnimationFrame(aplicar);
    };

    aplicar();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    reduzir.addEventListener("change", agendar);
    estreito.addEventListener("change", agendar);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
      reduzir.removeEventListener("change", agendar);
      estreito.removeEventListener("change", agendar);
    };
  }, [ref]);
}
