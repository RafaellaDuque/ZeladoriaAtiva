import { useEffect, useMemo, useRef, useState } from 'react';
import { useZeladoria } from '../app/AppProvider.jsx';
import { obterBairro, obterChamado } from '../domain/zeladoria.js';
import { humanizar } from '../domain/format.js';
import { ALTURA, CONTORNO, LARGURA, PONTOS_POR_ZONA } from '../data/mapa-municipio.js';

/** Largura do card — usada no cálculo da linha (mantida igual à do CSS). */
const LARGURA_CARD = 178;
/** Quanto tempo cada chamado fica em cena (casa com a duração do CSS). */
const CICLO = 7200;

/**
 * Mapa do município de São Paulo no hero.
 *
 * Cada pontinho é **um voto** de `votosChamado` e surge como um alerta: entra
 * com escala a partir de zero e solta uma onda que se expande e apaga. Nada é
 * contado à mão — votar num chamado acende mais um ponto na hora.
 *
 * A vaga de cada ponto vem de `PONTOS_POR_ZONA` (gerado no script da malha a
 * partir do polígono do IBGE, com folga mínima até a divisa), então nenhum ponto
 * cai fora do contorno. O banco não guarda lat/long de bairro: a posição é
 * ilustrativa dentro da zona, a contagem é real.
 *
 * O card de atividade fica na coluna livre à esquerda do contorno (nunca em cima
 * do mapa) e é ligado ao ponto por uma linha. Título, autor, bairro, categoria e
 * protocolo saem dos arrays; só o "agora" do selo é ilustrativo.
 */
export default function MapaVotos() {
  const { dados } = useZeladoria();
  const figuraRef = useRef(null);
  const svgRef = useRef(null);
  const [indiceAlerta, setIndiceAlerta] = useState(0);
  const [ancora, setAncora] = useState(null);

  const pontos = useMemo(() => {
    const usadas = new Map();

    return dados.votosChamado.map((voto, indice) => {
      const chamado = obterChamado(dados, voto.chamadoId);
      const bairro = chamado ? obterBairro(dados, chamado.bairroId) : null;
      const zona = bairro?.regiao ?? 'Centro';

      const posicao = usadas.get(zona) ?? 0;
      usadas.set(zona, posicao + 1);

      const vagas = PONTOS_POR_ZONA[zona] ?? PONTOS_POR_ZONA.Centro;
      const [vagaX, vagaY] = vagas[posicao % vagas.length];
      /* ao passar do número de vagas, o ponto volta para o miolo com um desvio */
      const volta = Math.floor(posicao / vagas.length);
      const desvio = volta * 7;

      return {
        votoId: voto.votoId,
        x: vagaX + desvio,
        y: vagaY + desvio,
        /* entrada em cascata + pulso fora de fase */
        entrada: Number((indice * 0.26).toFixed(2)),
        pulso: Number(((indice * 0.61) % 4.6).toFixed(2)),
      };
    });
  }, [dados]);

  /* Os chamados mais recentes viram os cards do mapa */
  const alertas = useMemo(
    () =>
      [...dados.chamadosZeladoria]
        .sort((a, b) => (a.dataAbertura < b.dataAbertura ? 1 : -1))
        .slice(0, 3)
        .map((chamado) => {
          const bairro = obterBairro(dados, chamado.bairroId);
          const autor = dados.cidadaos.find((c) => c.cidadaoId === chamado.cidadaoAutorId);
          const [x, y] = (PONTOS_POR_ZONA[bairro?.regiao] ?? PONTOS_POR_ZONA.Centro)[0];

          return { chamado, bairro, autor, x, y };
        }),
    [dados]
  );

  const alerta = alertas[indiceAlerta % Math.max(alertas.length, 1)];

  /* Troca o chamado em cena de tempos em tempos (respeitando reduced motion) */
  useEffect(() => {
    if (alertas.length < 2) return undefined;
    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (semMovimento) return undefined;

    const relogio = setInterval(
      () => setIndiceAlerta((atual) => (atual + 1) % alertas.length),
      CICLO
    );
    return () => clearInterval(relogio);
  }, [alertas.length]);

  /* Posição do ponto na tela: card e linha vivem em pixels, dentro da figura */
  useEffect(() => {
    const medir = () => {
      const svg = svgRef.current;
      const figura = figuraRef.current;
      if (!svg || !figura || !alerta) return;

      const matriz = svg.getScreenCTM();
      if (!matriz) return;

      const ponto = svg.createSVGPoint();
      ponto.x = alerta.x;
      ponto.y = alerta.y;
      const tela = ponto.matrixTransform(matriz);
      const caixa = figura.getBoundingClientRect();

      setAncora({
        x: tela.x - caixa.left,
        y: tela.y - caixa.top,
        largura: caixa.width,
        altura: caixa.height,
      });
    };

    medir();
    const observador =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(medir) : null;
    if (observador && figuraRef.current) observador.observe(figuraRef.current);
    window.addEventListener('resize', medir);

    return () => {
      if (observador) observador.disconnect();
      window.removeEventListener('resize', medir);
    };
  }, [alerta]);

  const total = pontos.length;

  /* Card na coluna livre, à esquerda do contorno, centrado na altura do ponto */
  const card = ancora
    ? {
        esquerda: 0,
        centro: Math.min(Math.max(ancora.y, 86), Math.max(ancora.altura - 86, 86)),
      }
    : null;

  const saida = card ? { x: card.esquerda + LARGURA_CARD, y: card.centro } : null;
  const comprimento =
    ancora && saida ? Math.round(Math.hypot(ancora.x - saida.x, ancora.y - saida.y)) : 0;

  return (
    <figure className="hero__mapa" ref={figuraRef}>
      <div className="hero__mapa-conteudo">
        <svg
          className="mapa-sp"
          ref={svgRef}
          viewBox={`-22 -22 ${LARGURA + 44} ${ALTURA + 44}`}
          role="img"
          aria-label={`Mapa do município de São Paulo com ${total} ${
            total === 1 ? 'voto registrado' : 'votos registrados'
          }, posicionados pela zona do bairro que votou`}
        >
          {/* Contorno impresso fora de registro, como numa gravura de duas cores */}
          <path
            className="mapa-sp__fantasma"
            d={CONTORNO}
            transform="translate(10 10)"
            aria-hidden="true"
          />
          <path className="mapa-sp__estado" d={CONTORNO} />

          {/* As ondas são recortadas pelo contorno: o alerta acontece dentro da cidade */}
          <defs>
            <clipPath id="mapa-sp-recorte">
              <path d={CONTORNO} />
            </clipPath>
          </defs>

          <g clipPath="url(#mapa-sp-recorte)" aria-hidden="true">
            {pontos.map((ponto) => (
              <g
                key={ponto.votoId}
                className="mapa-sp__alerta"
                style={{ '--entrada': `${ponto.entrada}s`, '--pulso': `${ponto.pulso}s` }}
                transform={`translate(${ponto.x} ${ponto.y})`}
              >
                <circle className="mapa-sp__onda" r="15" />
                <circle className="mapa-sp__onda mapa-sp__onda--tarde" r="15" />
                <circle className="mapa-sp__voto" r="15" />
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* Linha do ponto até o card (pixels da figura, não do viewBox) */}
      {ancora && saida && alerta && (
        <svg className="mapa-alerta__linha" aria-hidden="true">
          {/* A linha começa no ponto e cresce até o card */}
          <line
            key={`linha-${alerta.chamado.chamadoId}`}
            x1={ancora.x}
            y1={ancora.y}
            x2={saida.x}
            y2={saida.y}
            style={{ '--comp': comprimento }}
          />
          <circle
            key={`ponta-${alerta.chamado.chamadoId}`}
            className="mapa-alerta__ponta"
            cx={ancora.x}
            cy={ancora.y}
            r="2.5"
          />
        </svg>
      )}

      {card && alerta && (
        <div
          className="mapa-alerta-caixa"
          style={{ left: card.esquerda, top: card.centro }}
          aria-hidden="true"
        >
          <div key={alerta.chamado.chamadoId} className="mapa-alerta">
            <p className="mapa-alerta__selo">
              <span className="mapa-alerta__farol" />
              novo chamado
            </p>
            <p className="mapa-alerta__titulo">{alerta.chamado.titulo}</p>
            <p className="mapa-alerta__meta">
              {alerta.autor?.nome ?? 'Cidadão'} · {alerta.bairro?.nome ?? '—'}
            </p>
            <p className="mapa-alerta__protocolo">{alerta.chamado.protocolo}</p>
          </div>
        </div>
      )}
    </figure>
  );
}
