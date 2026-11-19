import Icon from './Icon.jsx';

const ZONAS = ['Zona Sul', 'Zona Leste', 'Zona Norte', 'Zona Oeste', 'Centro'];

const CATEGORIAS = [
  { valor: 'Iluminacao', rotulo: 'Iluminação' },
  { valor: 'Asfalto', rotulo: 'Asfalto' },
  { valor: 'Limpeza', rotulo: 'Limpeza' },
  { valor: 'Drenagem', rotulo: 'Drenagem' },
];

const STATUS = [
  { valor: 'Aberto', rotulo: 'Aberto' },
  { valor: 'Em_Andamento', rotulo: 'Em andamento' },
  { valor: 'Resolvido', rotulo: 'Resolvido' },
];

const ORDENACOES = [
  { valor: 'score', rotulo: 'Score' },
  { valor: 'votos', rotulo: 'Votos' },
  { valor: 'urgencia', rotulo: 'Urgência' },
  { valor: 'recentes', rotulo: 'Recentes' },
];

const ROTULO_ORDEM = { score: 'maior score', votos: 'mais votados', urgencia: 'maior urgência média', recentes: 'mais recentes' };

/**
 * Barra de filtros combinados (texto, zona, bairro, categoria, status, ordenação)
 * + identidade de quem está votando.
 *
 * Os filtros são controlados pelo estado da página, então cada tecla digitada
 * refiltra a lista imediatamente — sem botão "aplicar".
 */
export default function FiltrosPainel({
  filtros,
  aoMudar,
  aoLimpar,
  encontrados,
  total,
  dados,
  votanteId,
  aoTrocarVotante,
}) {
  /* O select de bairros respeita a zona escolhida (filtros combinados) */
  const bairrosDisponiveis = filtros.regiao
    ? dados.bairros.filter((bairro) => bairro.regiao === filtros.regiao)
    : dados.bairros;

  const grupos = ZONAS.map((zona) => ({
    zona,
    bairros: bairrosDisponiveis.filter((bairro) => bairro.regiao === zona),
  })).filter((grupo) => grupo.bairros.length > 0);

  return (
    <form
      className="painel-filtros"
      role="search"
      aria-labelledby="tituloFiltros"
      onSubmit={(evento) => evento.preventDefault()}
    >
      <h2 id="tituloFiltros" className="sr-only">
        Filtros do painel de chamados
      </h2>

      <div className="filtros-barra">
        <div className="campo-filtro filtros-busca">
          <label className="sr-only" htmlFor="busca">
            Buscar por texto
          </label>
          <input
            className="entrada entrada--busca"
            type="search"
            id="busca"
            name="busca"
            placeholder="Protocolo ou endereço"
            autoComplete="off"
            value={filtros.texto}
            onChange={(evento) => aoMudar({ texto: evento.target.value })}
          />
        </div>

        <div className="campo-filtro">
          <label className="sr-only" htmlFor="filtroZona">
            Zona / região
          </label>
          <select
            className="selecao"
            id="filtroZona"
            name="zona"
            value={filtros.regiao}
            onChange={(evento) => aoMudar({ regiao: evento.target.value })}
          >
            <option value="">Zona</option>
            {ZONAS.map((zona) => (
              <option key={zona} value={zona}>
                {zona}
              </option>
            ))}
          </select>
        </div>

        <div className="campo-filtro">
          <label className="sr-only" htmlFor="filtroBairro">
            Bairro
          </label>
          <select
            className="selecao"
            id="filtroBairro"
            name="bairro"
            value={filtros.bairroId}
            onChange={(evento) => aoMudar({ bairroId: evento.target.value })}
          >
            <option value="">Bairro</option>
            {grupos.map((grupo) => (
              <optgroup key={grupo.zona} label={grupo.zona}>
                {grupo.bairros.map((bairro) => (
                  <option key={bairro.bairroId} value={bairro.bairroId}>
                    {bairro.nome}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="campo-filtro">
          <label className="sr-only" htmlFor="filtroCategoria">
            Categoria
          </label>
          <select
            className="selecao"
            id="filtroCategoria"
            name="categoria"
            value={filtros.categoria}
            onChange={(evento) => aoMudar({ categoria: evento.target.value })}
          >
            <option value="">Categoria</option>
            {CATEGORIAS.map((categoria) => (
              <option key={categoria.valor} value={categoria.valor}>
                {categoria.rotulo}
              </option>
            ))}
          </select>
        </div>

        <div className="campo-filtro">
          <label className="sr-only" htmlFor="filtroStatus">
            Status
          </label>
          <select
            className="selecao"
            id="filtroStatus"
            name="status"
            value={filtros.status}
            onChange={(evento) => aoMudar({ status: evento.target.value })}
          >
            <option value="">Status</option>
            {STATUS.map((status) => (
              <option key={status.valor} value={status.valor}>
                {status.rotulo}
              </option>
            ))}
          </select>
        </div>

        <div className="campo-filtro">
          <label className="sr-only" htmlFor="filtroOrdem">
            Ordenar por
          </label>
          <select
            className="selecao"
            id="filtroOrdem"
            name="ordem"
            value={filtros.ordenacao}
            onChange={(evento) => aoMudar({ ordenacao: evento.target.value })}
          >
            {ORDENACOES.map((ordem) => (
              <option key={ordem.valor} value={ordem.valor}>
                {ordem.rotulo}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn--limpo filtros-limpar" type="button" onClick={aoLimpar}>
          <Icon nome="restaurar" />
          Limpar
        </button>
      </div>

      <div className="filtros-meta">
        <p className="resultado-contagem" role="status" aria-live="polite">
          <b>{encontrados}</b> {encontrados === 1 ? 'chamado encontrado' : 'chamados encontrados'}{' '}
          <span className="texto-miudo">
            de {total} · ordenado por {ROTULO_ORDEM[filtros.ordenacao]}
          </span>
        </p>

        <div className="identidade">
          <Icon nome="usuario" />
          <label className="rotulo" htmlFor="votante">
            Votando como
          </label>
          <select
            className="selecao"
            id="votante"
            value={votanteId ?? ''}
            onChange={(evento) => aoTrocarVotante(evento.target.value)}
            aria-describedby="dicaVoto"
          >
            {dados.cidadaos.map((cidadao) => (
              <option key={cidadao.cidadaoId} value={cidadao.cidadaoId}>
                {cidadao.nome} · {cidadao.cpf}
              </option>
            ))}
          </select>
          <span className="identidade__dica">1 voto por CPF</span>
          <span className="sr-only" id="dicaVoto">
            Cada CPF pode votar uma única vez por chamado (constraint UK_VOTO_UNICO_POR_CIDADAO).
          </span>
        </div>
      </div>
    </form>
  );
}
