import { useState } from 'react';
import { useZeladoria } from '../app/AppProvider.jsx';
import { decimal, humanizar, numero } from '../domain/format.js';
import Icon from './Icon.jsx';

/**
 * Painel de votação de um chamado: nota de urgência (1 a 5) + relato opcional.
 *
 * Ao confirmar, a ação `registrarVoto` do AppProvider grava em `votosChamado`,
 * soma +1 em `totalVotos` e devolve as métricas recalculadas — o card inteiro
 * (votos, média, score) é atualizado pelo React no mesmo render.
 */
export default function PainelVotacao({ item, jaVotouAqui }) {
  const { registrarVoto, votanteId, dados } = useZeladoria();
  const [nota, setNota] = useState('');
  const [comentario, setComentario] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(null);

  const { chamado } = item;

  /* Chamado resolvido: votação encerrada */
  if (chamado.status === 'Resolvido') {
    return (
      <div className="votacao">
        <div className="mensagem mensagem--sucesso visivel">
          <Icon nome="checkCirculo" />
          <span>Chamado resolvido — a votação está encerrada e o serviço já foi executado pela prefeitura.</span>
        </div>
      </div>
    );
  }

  /* Voto recém-registrado neste card */
  if (sucesso) {
    return (
      <div className="votacao">
        <div className="mensagem mensagem--voto visivel" role="status">
          <Icon nome="check" />
          <span>
            Voto registrado com urgência {sucesso.voto.nivelUrgencia}/5. Score agora em {numero(sucesso.score)} (
            {sucesso.totalVotos} votos).
          </span>
        </div>
      </div>
    );
  }

  /* O CPF da sessão já votou neste chamado (UK_VOTO_UNICO_POR_CIDADAO) */
  if (jaVotouAqui) {
    const votante = dados.cidadaos.find((c) => c.cidadaoId === votanteId);
    const votoAnterior = dados.votosChamado.find(
      (voto) => voto.chamadoId === chamado.chamadoId && voto.cidadaoId === votanteId
    );

    return (
      <div className="votacao">
        <div className="mensagem mensagem--info visivel">
          <Icon nome="info" />
          <span>
            <strong>{votante?.nome ?? 'Este CPF'}</strong> já votou neste chamado com urgência{' '}
            <strong>{votoAnterior?.nivelUrgencia ?? '—'}/5</strong>. Troque a identidade no topo da página para
            votar com outro CPF.
          </span>
        </div>
      </div>
    );
  }

  const confirmar = (evento) => {
    evento.preventDefault();
    const resultado = registrarVoto({
      chamadoId: chamado.chamadoId,
      cidadaoId: votanteId,
      nivelUrgencia: Number(nota),
      comentario,
    });

    if (!resultado.ok) {
      setErro(resultado.mensagem);
      return;
    }

    setErro('');
    setSucesso(resultado);
  };

  return (
    <div className="votacao">
      <form className="form-voto" onSubmit={confirmar} noValidate>
        <span className="votacao__legenda" id={`legenda-${chamado.chamadoId}`}>
          Votar neste chamado
        </span>

        {erro && (
          <div className="mensagem mensagem--erro visivel" role="alert">
            <Icon nome="alerta" />
            <span>{erro}</span>
          </div>
        )}

        <fieldset
          className="urgencia"
          aria-describedby={`legenda-${chamado.chamadoId}`}
        >
          <legend className="sr-only">Nível de urgência de 1 (pouco urgente) a 5 (crítico)</legend>
          {[1, 2, 3, 4, 5].map((valor) => (
            <label className="urgencia__opcao" key={valor}>
              <input
                type="radio"
                name={`urgencia-${chamado.chamadoId}`}
                value={valor}
                checked={Number(nota) === valor}
                onChange={() => setNota(valor)}
                aria-label={`Urgência ${valor} de 5`}
              />
              <span aria-hidden="true">{valor}</span>
            </label>
          ))}
        </fieldset>

        <label className="sr-only" htmlFor={`comentario-${chamado.chamadoId}`}>
          Relato opcional
        </label>
        <textarea
          className="area-texto"
          id={`comentario-${chamado.chamadoId}`}
          name="comentario"
          rows="2"
          maxLength="300"
          placeholder="Relato opcional — ex.: passo aqui às 23h e está tudo escuro"
          value={comentario}
          onChange={(evento) => setComentario(evento.target.value)}
        />

        <div className="votacao__rodape">
          <button className="btn btn--primario" type="submit">
            <Icon nome="check" />
            Confirmar voto de urgência (+1)
          </button>
          <p className="votacao__dica">1 voto por CPF · relato opcional</p>
        </div>
      </form>
    </div>
  );
}
