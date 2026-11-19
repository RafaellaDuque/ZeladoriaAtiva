import { useEffect, useRef, useState } from "react";
import { useZeladoria } from "../app/AppProvider.jsx";
import Icon, { IconeCategoria } from "../components/Icon.jsx";
import Layout from "../components/Layout.jsx";
import {
  formatarData,
  humanizar,
  numero,
  somenteDigitos,
} from "../domain/format.js";
import {
  bairrosPorRegiao,
  calcularScore,
  obterBairro,
} from "../domain/zeladoria.js";
import {
  comprimirImagem,
  lerComoDataUrl,
  validarArquivo,
} from "../utils/imagem.js";
import { mascaraCpf, mascaraTelefone } from "../utils/mascaras.js";

const VALORES_INICIAIS = {
  nome: "",
  cpf: "",
  email: "",
  telefone: "",
  bairroId: "",
  categoria: "",
  logradouro: "",
  numeroEndereco: "",
  pontoReferencia: "",
  titulo: "",
  descricao: "",
  nivelUrgencia: "",
};

const ROTULOS_CAMPO = {
  nome: "nome",
  cpf: "CPF",
  email: "e-mail",
  telefone: "telefone",
  bairroId: "bairro",
  categoria: "categoria",
  logradouro: "logradouro",
  numeroEndereco: "número",
  pontoReferencia: "ponto de referência",
  titulo: "título",
  descricao: "descrição",
  nivelUrgencia: "urgência",
  foto: "foto",
};

/** Valida todos os campos obrigatórios e devolve { campo: mensagem }. */
function validar(valores, foto) {
  const erros = {};
  const nome = valores.nome.trim();

  if (!nome) erros.nome = "Informe seu nome completo.";
  else if (nome.length < 5 || !nome.includes(" "))
    erros.nome = "Digite nome e sobrenome (mínimo 5 caracteres).";

  const cpf = somenteDigitos(valores.cpf);
  if (!cpf) erros.cpf = "Informe o CPF.";
  else if (cpf.length !== 11)
    erros.cpf = "O CPF deve ter 11 dígitos no formato 000.000.000-00.";

  const email = valores.email.trim();
  if (!email)
    erros.email = "Informe o e-mail para receber atualizações do chamado.";
  else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email))
    erros.email = "E-mail inválido — use o formato nome@dominio.com.";

  const telefone = valores.telefone.trim();
  if (telefone && somenteDigitos(telefone).length < 10)
    erros.telefone = "Telefone incompleto — informe DDD + número.";

  if (!valores.bairroId)
    erros.bairroId = "Selecione o bairro onde o problema acontece.";
  if (!valores.categoria)
    erros.categoria = "Selecione a categoria do problema.";

  const logradouro = valores.logradouro.trim();
  if (!logradouro)
    erros.logradouro = "Informe o logradouro (rua, avenida, estrada).";
  else if (logradouro.length < 4)
    erros.logradouro =
      "Logradouro muito curto — informe o nome completo da via.";

  const numero = valores.numeroEndereco.trim();
  if (!numero) erros.numeroEndereco = "Informe o número do imóvel ou S/N.";
  else if (!/^s\/?n$/i.test(numero) && !/\d/.test(numero))
    erros.numeroEndereco = "Use um número ou S/N quando não houver numeração.";

  const referencia = valores.pontoReferencia.trim();
  if (!referencia)
    erros.pontoReferencia =
      "Informe um ponto de referência para a equipe localizar o local.";
  else if (referencia.length < 4)
    erros.pontoReferencia = "Detalhe melhor o ponto de referência.";

  const titulo = valores.titulo.trim();
  if (!titulo) erros.titulo = "Dê um título ao chamado.";
  else if (titulo.length < 10)
    erros.titulo = `O título precisa de pelo menos 10 caracteres (você digitou ${titulo.length}).`;

  const descricao = valores.descricao.trim();
  if (!descricao) erros.descricao = "Descreva o problema.";
  else if (descricao.length < 20)
    erros.descricao = `A descrição precisa de pelo menos 20 caracteres (você digitou ${descricao.length}).`;

  if (!valores.nivelUrgencia)
    erros.nivelUrgencia = "Escolha o nível de urgência inicial, de 1 a 5.";

  if (foto) {
    const erroArquivo = validarArquivo(foto);
    if (erroArquivo) erros.foto = erroArquivo;
  }

  return erros;
}

/** Tela 3 — Formulário de abertura com validação na própria página. */
export default function NovoChamadoPage() {
  const { dados, criarChamado } = useZeladoria();

  const [valores, setValores] = useState(VALORES_INICIAIS);
  const [erros, setErros] = useState({});
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [erroFoto, setErroFoto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [avisoGravacao, setAvisoGravacao] = useState("");

  const formulario = useRef(null);
  const confirmacao = useRef(null);
  const inputFoto = useRef(null);

  const grupos = bairrosPorRegiao(dados);

  /* Rola até o card de confirmação quando o chamado é criado */
  useEffect(() => {
    if (!resultado) return;
    confirmacao.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    confirmacao.current?.focus();
  }, [resultado]);

  const alterar = (campo, valor) => {
    setValores((atual) => ({ ...atual, [campo]: valor }));
    if (erros[campo]) setErros((atual) => ({ ...atual, [campo]: undefined }));
  };

  const aoEscolherFoto = async (evento) => {
    const arquivo = evento.target.files?.[0];
    setErroFoto("");

    if (!arquivo) {
      setFoto(null);
      setPreview("");
      return;
    }

    const erroArquivo = validarArquivo(arquivo);
    if (erroArquivo) {
      setErroFoto(erroArquivo);
      setFoto(null);
      setPreview("");
      evento.target.value = "";
      return;
    }

    setFoto(arquivo);
    try {
      setPreview(await lerComoDataUrl(arquivo));
    } catch {
      setErroFoto("Não foi possível ler a imagem. Tente outro arquivo.");
      setFoto(null);
      setPreview("");
    }
  };

  const removerFoto = () => {
    setFoto(null);
    setPreview("");
    setErroFoto("");
    if (inputFoto.current) inputFoto.current.value = "";
  };

  const enviar = async (evento) => {
    evento.preventDefault();

    const errosEncontrados = validar(valores, foto);
    setErros(errosEncontrados);

    const camposInvalidos = Object.keys(errosEncontrados);
    if (camposInvalidos.length) {
      /* Foca o primeiro campo inválido para o usuário corrigir de cima para baixo */
      const primeiro = formulario.current?.querySelector(
        ".campo.invalido input, .campo.invalido select, .campo.invalido textarea",
      );
      primeiro?.focus();
      primeiro?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setEnviando(true);

    /* Converte a foto para dataURL comprimido antes de gravar */
    let urlFoto = null;
    if (foto) {
      const dataUrl = await lerComoDataUrl(foto);
      urlFoto = await comprimirImagem(dataUrl);
    }

    const criado = criarChamado({ ...valores, urlFoto });

    setEnviando(false);
    setResultado(criado.dados ? criado : null);

    if (criado.dados) {
      /* Avisa se o localStorage recusou a gravação (cota cheia / modo privado) */
      window.setTimeout(() => {
        const persistido = window.localStorage.getItem("zeladoria-ativa:bd:v1");
        if (!persistido) {
          setAvisoGravacao(
            "O chamado foi criado nesta sessão, mas o navegador não conseguiu gravar no localStorage.",
          );
        }
      }, 150);
    }
  };

  const campoInvalido = (campo) => (erros[campo] ? "campo invalido" : "campo");
  const erroVisivel = (campo) =>
    ["erro-campo", erros[campo] ? "visivel" : ""].filter(Boolean).join(" ");
  const tamanhoDescricao = valores.descricao.length;

  return (
    <Layout>
      <section
        className="cabecalho-pagina cabecalho-pagina--leve"
        aria-labelledby="tituloPagina"
      >
        <div className="container">
          <p className="sobretitulo">Abertura de chamado</p>
          <h1 id="tituloPagina">Abrir novo chamado de zeladoria</h1>
          <p>
            Descreva o problema com o máximo de precisão: bairro, endereço,
            ponto de referência e, se possível, uma foto.
          </p>
        </div>
      </section>

      <section
        className="secao"
        style={{ paddingTop: 26 }}
        aria-labelledby="tituloFormulario"
      >
        <div className="container">
          {resultado ? (
            /* ----------------------- CARD DE CONFIRMAÇÃO ----------------------- */
            <section
              className="confirmacao visivel"
              ref={confirmacao}
              tabIndex={-1}
              aria-live="polite"
              aria-labelledby="tituloConfirmacao"
            >
              <div className="confirmacao__icone" aria-hidden="true">
                <Icon nome="check" />
              </div>
              <h2 id="tituloConfirmacao">Chamado registrado com sucesso</h2>
              <p>
                Protocolo gerado automaticamente e voto inicial contabilizado.
                Guarde o número abaixo: é por ele que a comunidade e a
                subprefeitura acompanham o atendimento.
              </p>

              <p className="protocolo-destaque">
                <Icon nome="check" />
                <span>{resultado.protocolo}</span>
              </p>

              <ul className="resumo-envio">
                {[
                  ["Protocolo", resultado.chamado.protocolo],
                  [
                    "Bairro",
                    `${obterBairro(resultado.dados, resultado.chamado.bairroId)?.nome ?? "—"} · ${
                      obterBairro(resultado.dados, resultado.chamado.bairroId)
                        ?.regiao ?? "—"
                    }`,
                  ],
                  ["Categoria", humanizar(resultado.chamado.categoria)],
                  ["Urgência inicial", `${resultado.voto.nivelUrgencia}/5`],
                  [
                    "Data de abertura",
                    formatarData(resultado.chamado.dataAbertura),
                  ],
                  [
                    "Score inicial",
                    `${numero(calcularScore(resultado.dados, resultado.chamado))} pontos`,
                  ],
                ].map(([rotulo, valor]) => (
                  <li key={rotulo}>
                    <b>{rotulo}</b>
                    <span>{valor}</span>
                  </li>
                ))}
              </ul>

              {avisoGravacao && (
                <div
                  className="mensagem mensagem--erro visivel"
                  style={{ marginBottom: 16 }}
                >
                  <Icon nome="alerta" />
                  <span>{avisoGravacao}</span>
                </div>
              )}

              <div className="confirmacao__acoes">
                <a
                  className="btn btn--primario"
                  href={`chamados.html?protocolo=${encodeURIComponent(resultado.protocolo)}`}
                >
                  Ver o chamado no painel
                  <Icon nome="seta" />
                </a>
                <button
                  className="btn btn--secundario"
                  type="button"
                  onClick={() => {
                    setResultado(null);
                    setValores(VALORES_INICIAIS);
                    setErros({});
                    removerFoto();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Abrir outro chamado
                </button>
              </div>
            </section>
          ) : (
            /* --------------------------- FORMULÁRIO --------------------------- */
            <div className="layout-form">
              <div>
                <h2 id="tituloFormulario" className="sr-only">
                  Formulário de abertura de chamado
                </h2>

                {Object.keys(erros).length > 0 && (
                  <div
                    className="mensagem mensagem--erro visivel"
                    role="alert"
                    style={{ marginBottom: 16 }}
                  >
                    <Icon nome="alerta" />
                    <span>
                      <strong>Não foi possível enviar.</strong> Revise{" "}
                      {Object.keys(erros).length === 1
                        ? "o campo"
                        : "os campos"}
                      :{" "}
                      {Object.keys(erros)
                        .map((campo) => ROTULOS_CAMPO[campo])
                        .join(", ")}
                      .
                    </span>
                  </div>
                )}

                <form
                  className="form-chamado"
                  ref={formulario}
                  onSubmit={enviar}
                  noValidate
                >
                  {/* ------------------ 1. DADOS DO CIDADÃO ------------------ */}
                  <fieldset className="bloco-form">
                    <legend>
                      <span className="bloco-form__numero" aria-hidden="true">
                        1
                      </span>{" "}
                      Dados do cidadão autor
                    </legend>

                    <div className="grade-form">
                      <div className={campoInvalido("nome")} data-campo="nome">
                        <label htmlFor="nome">
                          Nome completo{" "}
                          <span className="obrig" aria-hidden="true">
                            *
                          </span>
                        </label>
                        <input
                          className="entrada"
                          type="text"
                          id="nome"
                          name="nome"
                          autoComplete="name"
                          placeholder="Como consta no seu documento"
                          value={valores.nome}
                          onChange={(evento) =>
                            alterar("nome", evento.target.value)
                          }
                          aria-invalid={Boolean(erros.nome)}
                        />
                        <small className={erroVisivel("nome")} id="erro-nome">
                          {erros.nome}
                        </small>
                      </div>

                      <div className={campoInvalido("cpf")} data-campo="cpf">
                        <label htmlFor="cpf">
                          CPF{" "}
                          <span className="obrig" aria-hidden="true">
                            *
                          </span>
                        </label>
                        <input
                          className="entrada"
                          type="text"
                          id="cpf"
                          name="cpf"
                          inputMode="numeric"
                          maxLength="14"
                          placeholder="000.000.000-00"
                          autoComplete="off"
                          value={valores.cpf}
                          onChange={(evento) =>
                            alterar("cpf", mascaraCpf(evento.target.value))
                          }
                          aria-invalid={Boolean(erros.cpf)}
                        />
                        <small className={erroVisivel("cpf")} id="erro-cpf">
                          {erros.cpf}
                        </small>
                      </div>

                      <div
                        className={campoInvalido("email")}
                        data-campo="email"
                      >
                        <label htmlFor="email">
                          E-mail{" "}
                          <span className="obrig" aria-hidden="true">
                            *
                          </span>
                        </label>
                        <input
                          className="entrada"
                          type="email"
                          id="email"
                          name="email"
                          autoComplete="email"
                          placeholder="voce@email.com"
                          value={valores.email}
                          onChange={(evento) =>
                            alterar("email", evento.target.value)
                          }
                          aria-invalid={Boolean(erros.email)}
                        />
                        <small className={erroVisivel("email")} id="erro-email">
                          {erros.email}
                        </small>
                      </div>

                      <div
                        className={campoInvalido("telefone")}
                        data-campo="telefone"
                      >
                        <label htmlFor="telefone">
                          Telefone <span className="opcional">(opcional)</span>
                        </label>
                        <input
                          className="entrada"
                          type="tel"
                          id="telefone"
                          name="telefone"
                          autoComplete="tel"
                          placeholder="(11) 90000-0000"
                          maxLength="15"
                          value={valores.telefone}
                          onChange={(evento) =>
                            alterar(
                              "telefone",
                              mascaraTelefone(evento.target.value),
                            )
                          }
                          aria-invalid={Boolean(erros.telefone)}
                        />
                        <small
                          className={erroVisivel("telefone")}
                          id="erro-telefone"
                        >
                          {erros.telefone}
                        </small>
                      </div>
                    </div>
                  </fieldset>

                  {/* -------------- 2. LOCALIZAÇÃO E CLASSIFICAÇÃO -------------- */}
                  <fieldset className="bloco-form">
                    <legend>
                      <span className="bloco-form__numero" aria-hidden="true">
                        2
                      </span>{" "}
                      Localização e classificação
                    </legend>

                    <div className="grade-form">
                      <div
                        className={campoInvalido("bairroId")}
                        data-campo="bairroId"
                      >
                        <label htmlFor="bairroId">
                          Bairro de São Paulo{" "}
                          <span className="obrig" aria-hidden="true">
                            *
                          </span>
                        </label>
                        <select
                          className="selecao"
                          id="bairroId"
                          name="bairroId"
                          value={valores.bairroId}
                          onChange={(evento) =>
                            alterar("bairroId", evento.target.value)
                          }
                          aria-invalid={Boolean(erros.bairroId)}
                        >
                          <option value="">Selecione o bairro</option>
                          {grupos.map((grupo) => (
                            <optgroup key={grupo.regiao} label={grupo.regiao}>
                              {grupo.bairros.map((bairro) => (
                                <option
                                  key={bairro.bairroId}
                                  value={bairro.bairroId}
                                >
                                  {bairro.nome} — vulnerabilidade{" "}
                                  {bairro.indiceVulnerabilidade}/5
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                        <small
                          className={erroVisivel("bairroId")}
                          id="erro-bairroId"
                        >
                          {erros.bairroId}
                        </small>
                      </div>

                      <div
                        className={campoInvalido("categoria")}
                        data-campo="categoria"
                      >
                        <label htmlFor="categoria">
                          Categoria{" "}
                          <span className="obrig" aria-hidden="true">
                            *
                          </span>
                        </label>
                        <select
                          className="selecao"
                          id="categoria"
                          name="categoria"
                          value={valores.categoria}
                          onChange={(evento) =>
                            alterar("categoria", evento.target.value)
                          }
                          aria-invalid={Boolean(erros.categoria)}
                        >
                          <option value="">Selecione a categoria</option>
                          <option value="Iluminacao">Iluminação pública</option>
                          <option value="Asfalto">
                            Asfalto / pavimentação
                          </option>
                          <option value="Limpeza">Limpeza urbana</option>
                          <option value="Drenagem">Drenagem / bueiro</option>
                        </select>
                        <small
                          className={erroVisivel("categoria")}
                          id="erro-categoria"
                        >
                          {erros.categoria}
                        </small>
                      </div>

                      <div
                        className={`${campoInvalido("logradouro")} campo--largo`}
                        data-campo="logradouro"
                      >
                        <label htmlFor="logradouro">
                          Logradouro{" "}
                          <span className="obrig" aria-hidden="true">
                            *
                          </span>
                        </label>
                        <input
                          className="entrada"
                          type="text"
                          id="logradouro"
                          name="logradouro"
                          placeholder="Ex.: Av. Dona Belmira Marin"
                          value={valores.logradouro}
                          onChange={(evento) =>
                            alterar("logradouro", evento.target.value)
                          }
                          aria-invalid={Boolean(erros.logradouro)}
                        />
                        <small
                          className={erroVisivel("logradouro")}
                          id="erro-logradouro"
                        >
                          {erros.logradouro}
                        </small>
                      </div>

                      <div
                        className={campoInvalido("numeroEndereco")}
                        data-campo="numeroEndereco"
                      >
                        <label htmlFor="numeroEndereco">
                          Número <span className="opcional">(ou S/N)</span>{" "}
                          <span className="obrig" aria-hidden="true">
                            *
                          </span>
                        </label>
                        <input
                          className="entrada"
                          type="text"
                          id="numeroEndereco"
                          name="numeroEndereco"
                          placeholder="1450 ou S/N"
                          maxLength="20"
                          value={valores.numeroEndereco}
                          onChange={(evento) =>
                            alterar("numeroEndereco", evento.target.value)
                          }
                          aria-invalid={Boolean(erros.numeroEndereco)}
                        />
                        <small
                          className={erroVisivel("numeroEndereco")}
                          id="erro-numeroEndereco"
                        >
                          {erros.numeroEndereco}
                        </small>
                      </div>

                      <div
                        className={campoInvalido("pontoReferencia")}
                        data-campo="pontoReferencia"
                      >
                        <label htmlFor="pontoReferencia">
                          Ponto de referência{" "}
                          <span className="obrig" aria-hidden="true">
                            *
                          </span>
                        </label>
                        <input
                          className="entrada"
                          type="text"
                          id="pontoReferencia"
                          name="pontoReferencia"
                          placeholder="Ex.: em frente à escola, ao lado da UBS"
                          value={valores.pontoReferencia}
                          onChange={(evento) =>
                            alterar("pontoReferencia", evento.target.value)
                          }
                          aria-invalid={Boolean(erros.pontoReferencia)}
                        />
                        <small
                          className={erroVisivel("pontoReferencia")}
                          id="erro-pontoReferencia"
                        >
                          {erros.pontoReferencia}
                        </small>
                      </div>
                    </div>
                  </fieldset>

                  {/* ---------------- 3. DETALHES E EVIDÊNCIA ---------------- */}
                  <fieldset className="bloco-form">
                    <legend>
                      <span className="bloco-form__numero" aria-hidden="true">
                        3
                      </span>{" "}
                      Detalhes e evidência
                    </legend>

                    <div className="grade-form">
                      <div
                        className={`${campoInvalido("titulo")} campo--largo`}
                        data-campo="titulo"
                      >
                        <label htmlFor="titulo">
                          Título do chamado{" "}
                          <span className="obrig" aria-hidden="true">
                            *
                          </span>
                        </label>
                        <input
                          className="entrada"
                          type="text"
                          id="titulo"
                          name="titulo"
                          maxLength="100"
                          placeholder="Ex.: Três postes apagados em frente ao ponto de ônibus"
                          value={valores.titulo}
                          onChange={(evento) =>
                            alterar("titulo", evento.target.value)
                          }
                          aria-invalid={Boolean(erros.titulo)}
                        />
                        <small
                          className={erroVisivel("titulo")}
                          id="erro-titulo"
                        >
                          {erros.titulo}
                        </small>
                        <p className="campo__dica">
                          Mínimo de 10 caracteres — resuma o problema em uma
                          frase.
                        </p>
                      </div>

                      <div
                        className={`${campoInvalido("descricao")} campo--largo`}
                        data-campo="descricao"
                      >
                        <label htmlFor="descricao">
                          Descrição do problema{" "}
                          <span className="obrig" aria-hidden="true">
                            *
                          </span>
                        </label>
                        <textarea
                          className="area-texto"
                          id="descricao"
                          name="descricao"
                          rows="5"
                          maxLength="500"
                          placeholder="O que está acontecendo, há quanto tempo e quem é afetado?"
                          value={valores.descricao}
                          onChange={(evento) =>
                            alterar("descricao", evento.target.value)
                          }
                          aria-invalid={Boolean(erros.descricao)}
                        />
                        <span
                          className={[
                            "contador",
                            tamanhoDescricao < 20 ? "pouco" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {tamanhoDescricao}/500 · mínimo 20
                        </span>
                        <small
                          className={erroVisivel("descricao")}
                          id="erro-descricao"
                        >
                          {erros.descricao}
                        </small>
                      </div>

                      <div
                        className={`${campoInvalido("nivelUrgencia")} campo--largo`}
                        data-campo="nivelUrgencia"
                      >
                        <label id="rotuloUrgencia">
                          Nível de urgência inicial{" "}
                          <span className="obrig" aria-hidden="true">
                            *
                          </span>
                        </label>
                        <fieldset
                          className="urgencia"
                          aria-describedby="rotuloUrgencia"
                        >
                          <legend className="sr-only">
                            Nível de urgência inicial de 1 (pouco urgente) a 5
                            (crítico)
                          </legend>
                          {[1, 2, 3, 4, 5].map((nota) => (
                            <label className="urgencia__opcao" key={nota}>
                              <input
                                type="radio"
                                name="nivelUrgencia"
                                value={nota}
                                checked={Number(valores.nivelUrgencia) === nota}
                                onChange={() => alterar("nivelUrgencia", nota)}
                                aria-label={`Urgência ${nota} de 5`}
                                aria-invalid={Boolean(erros.nivelUrgencia)}
                              />
                              <span aria-hidden="true">{nota}</span>
                            </label>
                          ))}
                        </fieldset>
                        <div className="urgencia-escala">
                          <span>1 · Pouco urgente</span>
                          <span>3 · Atenção</span>
                          <span>5 · Crítico</span>
                        </div>
                        <small
                          className={erroVisivel("nivelUrgencia")}
                          id="erro-nivelUrgencia"
                        >
                          {erros.nivelUrgencia}
                        </small>
                      </div>

                      <div
                        className={`${campoInvalido("foto")} campo--largo`}
                        data-campo="foto"
                      >
                        <label htmlFor="foto">
                          Foto do problema{" "}
                          <span className="opcional">(opcional)</span>
                        </label>

                        <div className="upload">
                          <div className="upload__area">
                            <Icon nome="camera" />
                            <span className="upload__texto">
                              <strong>Escolher imagem</strong>
                              <br />
                              <small>JPG, PNG ou WEBP · até 2 MB</small>
                            </span>
                            <input
                              ref={inputFoto}
                              type="file"
                              id="foto"
                              name="foto"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={aoEscolherFoto}
                            />
                          </div>

                          <div className="preview">
                            {!preview && (
                              <span className="preview__vazio">
                                Pré-visualização
                                <br />
                                da foto
                              </span>
                            )}
                            {preview && (
                              <img
                                src={preview}
                                alt="Pré-visualização da foto selecionada"
                              />
                            )}
                            <button
                              className={[
                                "preview__remover",
                                preview ? "visivel" : "",
                              ]
                                .filter(Boolean)
                                .join(" ")}
                              type="button"
                              onClick={removerFoto}
                              aria-label="Remover foto selecionada"
                            >
                              ×
                            </button>
                          </div>
                        </div>

                        <small
                          className={["erro-campo", erroFoto ? "visivel" : ""]
                            .filter(Boolean)
                            .join(" ")}
                          id="erro-foto"
                        >
                          {erroFoto}
                        </small>
                      </div>
                    </div>
                  </fieldset>

                  <div className="acoes-form">
                    <p
                      className="texto-miudo"
                      style={{ margin: 0, maxWidth: "46ch" }}
                    >
                      Campos marcados com <span className="obrig">*</span> são
                      obrigatórios.
                    </p>
                    <button
                      className="btn btn--primario"
                      type="submit"
                      disabled={enviando}
                    >
                      <Icon nome="enviar" />
                      {enviando ? "Enviando…" : "Enviar chamado"}
                    </button>
                  </div>
                </form>
              </div>

              {/* ---------------------------- LATERAL ---------------------------- */}
              <aside
                className="coluna-lateral"
                aria-label="Orientações para abrir o chamado"
              >
                <section className="nota-form nota-form--aviso">
                  <h2>Antes de enviar</h2>
                  <ul>
                    <li>
                      Confira se já não existe um chamado parecido na sua rua.
                    </li>
                  </ul>
                </section>

                <section className="nota-form">
                  <h2>O que acontece depois</h2>
                  <ol>
                    <li>
                      O sistema gera o protocolo <strong>ZEL-2026-XXXX</strong>.
                    </li>
                    <li>
                      Seu voto inicial de urgência entra em{" "}
                      <code>votosChamado</code>.
                    </li>
                    <li>Os vizinhos votam e o score sobe.</li>
                    <li>A subprefeitura emite a ordem de serviço.</li>
                  </ol>
                </section>
              </aside>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
