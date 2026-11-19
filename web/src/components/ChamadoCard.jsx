import { useZeladoria } from '../app/AppProvider.jsx';
import {
  classeStatus,
  classeVulnerabilidade,
  decimal,
  formatarData,
  humanizar,
  numero,
  plural,
  textoVulnerabilidade,
} from '../domain/format.js';
import { jaVotou } from '../domain/zeladoria.js';
import { useRevelar } from '../utils/revelar.js';
import Icon, { IconeCategoria } from './Icon.jsx';
import PainelVotacao from './PainelVotacao.jsx';

/** Bloco da ordem de serviço vinculada ao chamado (quando a prefeitura já respondeu). */
function BlocoOrdem({ ordem, orgao }) {
  return (
    <div className="bloco-os">
      <div className="bloco-os__topo">
        <span className="bloco-os__numero">{ordem.numeroOs}</span>
        <span className={classeStatus(ordem.statusExecucao)}>{humanizar(ordem.statusExecucao)}</span>
        {ordem.dataConclusao && (
          <span className="bloco-os__data">Concluída em {formatarData(ordem.dataConclusao)}</span>
        )}
      </div>
      <span className="bloco-os__orgao">{orgao ? orgao.nomeOrgao : 'Órgão não informado'}</span>
      <p className="bloco-os__parecer">{ordem.parecerTecnico || 'Sem parecer técnico registrado.'}</p>
    </div>
  );
}

/** Últimos relatos de moradores (os 2 mais recentes). */
function Relatos({ votos, dados }) {
  if (!votos.length) {
    return (
      <div className="relatos">
        <p className="relatos__titulo">Relatos de moradores</p>
        <p className="relatos__vazio">Nenhum relato ainda. Seja o primeiro a votar.</p>
      </div>
    );
  }

  const recentes = votos.slice(0, 2);
  const restantes = votos.length - recentes.length;

  return (
    <div className="relatos">
      <p className="relatos__titulo">
        <span>Relatos de moradores</span>
        <span>{plural(votos.length, 'voto', 'votos')}</span>
      </p>
      <ul className="relatos__lista">
        {recentes.map((voto) => {
          const autor = dados.cidadaos.find((c) => c.cidadaoId === voto.cidadaoId);
          return (
            <li key={voto.votoId}>
              <div className="relatos__autoria">
                <b>{autor?.nome ?? 'Morador'}</b>
                <span>
                  <span className="relatos__nota">{voto.nivelUrgencia}/5</span> · {formatarData(voto.dataVoto)}
                </span>
              </div>
              {voto.comentario ? voto.comentario : <em>Sem relato escrito.</em>}
            </li>
          );
        })}
      </ul>
      {restantes > 0 && (
        <p className="texto-miudo" style={{ margin: '8px 0 0' }}>
          + {plural(restantes, 'relato anterior', 'relatos anteriores')}
        </p>
      )}
    </div>
  );
}

/**
 * Linha compacta do painel. Fechada, mostra só o essencial (título, local,
 * status e prioridade). O clique abre foto, descrição, relatos e votação.
 */
export default function ChamadoCard({ item, posicao, aberto, aoAlternar, destaque, atraso = 0 }) {
  const { dados, votanteId } = useZeladoria();
  const { chamado, bairro, media, score, ordem, orgao, votos } = item;
  const ref = useRevelar(atraso);

  const vulnerabilidade = bairro?.indiceVulnerabilidade ?? 0;
  const endereco = [chamado.logradouro, chamado.numeroEndereco].filter(Boolean).join(', ');
  const local = [endereco, bairro?.nome, bairro?.regiao].filter(Boolean).join(' · ');
  const painelId = `painel-${chamado.chamadoId}`;

  const trocarFoto = (evento) => {
    /* fallback: se a foto não carregar, usa a imagem "sem foto" */
    evento.currentTarget.onerror = null;
    evento.currentTarget.src = 'assets/img/sem-foto.svg';
  };

  return (
    <article
      className={['chamado', aberto ? 'chamado--aberto' : '', destaque ? 'chamado--destaque' : '']
        .filter(Boolean)
        .join(' ')}
      ref={ref}
      id={`chamado-${chamado.chamadoId}`}
      data-chamado={chamado.chamadoId}
    >
      <button
        type="button"
        className="chamado__resumo"
        aria-expanded={aberto}
        aria-controls={painelId}
        onClick={aoAlternar}
      >
        <span className="chamado__pos" aria-hidden="true">
          {posicao}
        </span>

        <span className="chamado__resumo-texto">
          <span className="chamado__resumo-topo">
            <span className={classeStatus(chamado.status)}>{humanizar(chamado.status)}</span>
            <span className="chip chip--categoria">
              <IconeCategoria categoria={chamado.categoria} />
              {humanizar(chamado.categoria)}
            </span>
            <span className="chamado__protocolo">{chamado.protocolo}</span>
          </span>
          <h3 className="chamado__titulo">{chamado.titulo}</h3>
          <span className="chamado__endereco">
            <Icon nome="mapa" />
            <span>
              {local || 'Local não informado'}
              {chamado.pontoReferencia ? ` — ${chamado.pontoReferencia}` : ''}
            </span>
          </span>
        </span>

        <span className="chamado__resumo-numeros">
          <span className="chamado__score">
            {numero(score)}
            <small>score</small>
          </span>
          <span className="chamado__resumo-meta">
            urgência {decimal(media)} · {plural(chamado.totalVotos, 'voto', 'votos')}
          </span>
        </span>

        <Icon nome="seta" className="chamado__seta" />
      </button>

      <div className="chamado__painel" id={painelId} inert={aberto ? undefined : true}>
        <div className="chamado__painel-miolo">
          <div className="chamado__detalhe">
            <div className="chamado__midia">
              <img
                className="chamado__foto"
                src={chamado.urlFoto}
                alt={`Registro fotográfico da ocorrência: ${chamado.titulo}`}
                width="800"
                height="450"
                loading="lazy"
                onError={trocarFoto}
              />
            </div>

            <div className="chamado__corpo">
              <p className="chamado__descricao">{chamado.descricao}</p>

              <div className="chamado__local">
                <span className="chip chip--contorno">{bairro?.nome ?? 'Bairro não informado'}</span>
                <span className="chip chip--contorno">{bairro?.regiao ?? '—'}</span>
                <span className={classeVulnerabilidade(vulnerabilidade)}>
                  Vulnerabilidade {vulnerabilidade}/5 · {textoVulnerabilidade(vulnerabilidade)}
                </span>
              </div>

              <div className="metricas">
                <div className="metrica">
                  <span className="metrica__valor">{numero(chamado.totalVotos)}</span>
                  <span className="metrica__rotulo">Votos</span>
                </div>
                <div className="metrica">
                  <span className="metrica__valor">{decimal(media)}</span>
                  <span className="metrica__rotulo">Urgência média</span>
                </div>
                <div className="metrica">
                  <span className="metrica__valor metrica__valor--score">{numero(score)}</span>
                  <span className="metrica__rotulo">Score</span>
                </div>
              </div>

              {ordem && <BlocoOrdem ordem={ordem} orgao={orgao} />}

              <Relatos votos={votos} dados={dados} />
            </div>
          </div>

          <PainelVotacao item={item} jaVotouAqui={jaVotou(dados, chamado.chamadoId, votanteId)} />
        </div>
      </div>
    </article>
  );
}
