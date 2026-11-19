import { classeStatus, diasEntre, formatarData, humanizar, plural } from '../domain/format.js';
import { useRevelar } from '../utils/revelar.js';

/**
 * Ordem de serviço da prefeitura: cruza `ordensServico` + `orgaosResponsaveis` +
 * `chamadosZeladoria` e mostra o caminho do chamado até a execução.
 *
 * Estrutura (casada com o CSS da seção 09): cabeçalho com status e prazo,
 * detalhe do chamado com o parecer técnico, linha do tempo em três passos e,
 * no pé, o órgão responsável com telefone e ouvidoria.
 */
export default function OrdemServicoCard({ ordem, chamado, bairro, orgao, atraso = 0 }) {
  const concluida = ordem.statusExecucao === 'Concluida';
  const ref = useRevelar(atraso);

  const ateEmissao = chamado ? diasEntre(chamado.dataAbertura, ordem.dataEmissao) : null;
  const total = chamado ? diasEntre(chamado.dataAbertura, ordem.dataConclusao || undefined) : null;
  const execucao = ordem.dataConclusao ? diasEntre(ordem.dataEmissao, ordem.dataConclusao) : null;

  return (
    <article className="dossie" ref={ref}>
      <header className="dossie__topo">
        <span className={classeStatus(ordem.statusExecucao)}>
          {humanizar(ordem.statusExecucao)}
        </span>
        <span className="dossie__numero">{ordem.numeroOs}</span>
        <span className="dossie__prazo">
          {concluida
            ? `Resolvido em ${plural(total ?? 0, 'dia', 'dias')}`
            : `Em execução há ${plural(total ?? 0, 'dia', 'dias')}`}
        </span>
      </header>

      <div className="dossie__detalhe">
        <h3 className="dossie__titulo">{chamado ? chamado.titulo : 'Chamado não encontrado'}</h3>
        <p className="dossie__meta">
          {bairro ? `${bairro.nome} · ${bairro.regiao}` : 'Bairro não informado'}
          {chamado ? ` · ${humanizar(chamado.categoria)}` : ''}
        </p>
        <p className="dossie__parecer">
          {ordem.parecerTecnico || 'Parecer técnico ainda não registrado.'}
        </p>
      </div>

      <ol className="dossie__trilha">
        <li data-estado="feito">
          <strong>Chamado aberto</strong>
          <time>{formatarData(chamado?.dataAbertura)}</time>
        </li>
        <li data-estado="feito">
          <strong>OS emitida</strong>
          <time>{formatarData(ordem.dataEmissao)}</time>
          {ateEmissao !== null && <span>+{plural(ateEmissao, 'dia', 'dias')}</span>}
        </li>
        <li data-estado={concluida ? 'feito' : 'andamento'}>
          <strong>{concluida ? 'Concluída' : 'Em execução'}</strong>
          <time>{concluida ? formatarData(ordem.dataConclusao) : 'sem data de conclusão'}</time>
          {execucao !== null && <span>{plural(execucao, 'dia', 'dias')} de obra</span>}
        </li>
      </ol>

      <footer className="dossie__orgao">
        <strong>{orgao ? orgao.nomeOrgao : 'Órgão não informado'}</strong>
        {orgao && (
          <span>
            {orgao.telefoneContato} · {orgao.emailOuvidoria}
          </span>
        )}
      </footer>
    </article>
  );
}
