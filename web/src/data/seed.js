/**
 * Dados de demonstração — espelho fiel das 7 tabelas de
 * `banco-de-dados/script_zeladoria_ativa.sql`.
 *
 * | Tabela SQL          | Export JS            |
 * |---------------------|----------------------|
 * | MUNICIPIO           | municipios           |
 * | BAIRRO              | bairros              |
 * | CIDADAO             | cidadaos             |
 * | CHAMADO_ZELADORIA   | chamadosZeladoria    |
 * | VOTO_CHAMADO        | votosChamado         |
 * | ORGAO_RESPONSAVEL   | orgaosResponsaveis   |
 * | ORDEM_SERVICO       | ordensServico        |
 *
 * Os valores de string respeitam exatamente as constraints CHECK do banco:
 *   categoria/especialidade : Iluminacao | Asfalto | Limpeza | Drenagem
 *   status                  : Aberto | Em_Andamento | Resolvido
 *   statusExecucao          : Pendente | Equipe_Em_Campo | Concluida | Cancelada
 *   indiceVulnerabilidade / nivelUrgencia : 1..5
 *
 * Nomes próprios estão sem acento porque são cópia literal do script SQL.
 */

export const municipios = [
  { municipioId: 1, nome: 'Sao Paulo', uf: 'SP', codigoIbge: '3550308' },
];

export const bairros = [
  /* Zona Sul */
  { bairroId: 1, nome: 'Grajau', regiao: 'Zona Sul', populacaoEstimada: 384000, indiceVulnerabilidade: 5, municipioId: 1 },
  { bairroId: 2, nome: 'Capao Redondo', regiao: 'Zona Sul', populacaoEstimada: 275000, indiceVulnerabilidade: 5, municipioId: 1 },
  { bairroId: 3, nome: 'Jardim Angela', regiao: 'Zona Sul', populacaoEstimada: 311000, indiceVulnerabilidade: 5, municipioId: 1 },
  { bairroId: 4, nome: 'Cidade Ademar', regiao: 'Zona Sul', populacaoEstimada: 272000, indiceVulnerabilidade: 4, municipioId: 1 },
  { bairroId: 5, nome: 'Santo Amaro', regiao: 'Zona Sul', populacaoEstimada: 85000, indiceVulnerabilidade: 2, municipioId: 1 },
  { bairroId: 6, nome: 'Vila Mariana', regiao: 'Zona Sul', populacaoEstimada: 135000, indiceVulnerabilidade: 1, municipioId: 1 },
  /* Zona Leste */
  { bairroId: 7, nome: 'Itaquera', regiao: 'Zona Leste', populacaoEstimada: 210000, indiceVulnerabilidade: 4, municipioId: 1 },
  { bairroId: 8, nome: 'Cidade Tiradentes', regiao: 'Zona Leste', populacaoEstimada: 228000, indiceVulnerabilidade: 5, municipioId: 1 },
  { bairroId: 9, nome: 'Sapopemba', regiao: 'Zona Leste', populacaoEstimada: 296000, indiceVulnerabilidade: 4, municipioId: 1 },
  { bairroId: 10, nome: 'Sao Mateus', regiao: 'Zona Leste', populacaoEstimada: 162000, indiceVulnerabilidade: 4, municipioId: 1 },
  { bairroId: 11, nome: 'Guaianases', regiao: 'Zona Leste', populacaoEstimada: 118000, indiceVulnerabilidade: 5, municipioId: 1 },
  { bairroId: 12, nome: 'Mooca', regiao: 'Zona Leste', populacaoEstimada: 81000, indiceVulnerabilidade: 2, municipioId: 1 },
  { bairroId: 13, nome: 'Tatuape', regiao: 'Zona Leste', populacaoEstimada: 98000, indiceVulnerabilidade: 1, municipioId: 1 },
  /* Zona Norte */
  { bairroId: 14, nome: 'Brasilandia', regiao: 'Zona Norte', populacaoEstimada: 265000, indiceVulnerabilidade: 5, municipioId: 1 },
  { bairroId: 15, nome: 'Pirituba', regiao: 'Zona Norte', populacaoEstimada: 175000, indiceVulnerabilidade: 3, municipioId: 1 },
  { bairroId: 16, nome: 'Perus', regiao: 'Zona Norte', populacaoEstimada: 92000, indiceVulnerabilidade: 5, municipioId: 1 },
  { bairroId: 17, nome: 'Jacana', regiao: 'Zona Norte', populacaoEstimada: 96000, indiceVulnerabilidade: 4, municipioId: 1 },
  { bairroId: 18, nome: 'Santana', regiao: 'Zona Norte', populacaoEstimada: 124000, indiceVulnerabilidade: 2, municipioId: 1 },
  /* Zona Oeste */
  { bairroId: 19, nome: 'Butanta', regiao: 'Zona Oeste', populacaoEstimada: 58000, indiceVulnerabilidade: 2, municipioId: 1 },
  { bairroId: 20, nome: 'Rio Pequeno', regiao: 'Zona Oeste', populacaoEstimada: 132000, indiceVulnerabilidade: 4, municipioId: 1 },
  { bairroId: 21, nome: 'Lapa', regiao: 'Zona Oeste', populacaoEstimada: 72000, indiceVulnerabilidade: 2, municipioId: 1 },
  { bairroId: 22, nome: 'Pinheiros', regiao: 'Zona Oeste', populacaoEstimada: 68000, indiceVulnerabilidade: 1, municipioId: 1 },
  /* Centro */
  { bairroId: 23, nome: 'Se', regiao: 'Centro', populacaoEstimada: 28000, indiceVulnerabilidade: 4, municipioId: 1 },
  { bairroId: 24, nome: 'Republica', regiao: 'Centro', populacaoEstimada: 61000, indiceVulnerabilidade: 3, municipioId: 1 },
  { bairroId: 25, nome: 'Bela Vista', regiao: 'Centro', populacaoEstimada: 71000, indiceVulnerabilidade: 2, municipioId: 1 },
];

export const cidadaos = [
  { cidadaoId: 1, nome: 'Helena Souza', cpf: '123.456.789-01', email: 'helena.souza@email.com', telefone: '(11) 98888-1111', dataCadastro: '2026-10-01' },
  { cidadaoId: 2, nome: 'Lucas Oliveira', cpf: '234.567.890-12', email: 'lucas.oliveira@email.com', telefone: '(11) 97777-2222', dataCadastro: '2026-10-05' },
  { cidadaoId: 3, nome: 'Marcos Santos', cpf: '345.678.901-23', email: 'marcos.santos@email.com', telefone: '(11) 96666-3333', dataCadastro: '2026-10-12' },
  { cidadaoId: 4, nome: 'Beatriz Lima', cpf: '456.789.012-34', email: 'beatriz.lima@email.com', telefone: '(11) 95555-4444', dataCadastro: '2026-10-18' },
  { cidadaoId: 5, nome: 'Carlos Ferreira', cpf: '567.890.123-45', email: 'carlos.ferreira@email.com', telefone: '(11) 94444-5555', dataCadastro: '2026-10-20' },
];

/* urlFoto: fotos reais em public/assets/img — funcionam offline (file://) */
export const chamadosZeladoria = [
  {
    chamadoId: 1,
    protocolo: 'ZEL-2026-0001',
    titulo: 'Tres postes queimados em frente ao ponto de onibus',
    descricao: 'Trecho totalmente no escuro ha 45 dias, colocando estudantes noturnos e trabalhadores em risco.',
    categoria: 'Iluminacao',
    logradouro: 'Av. Dona Belmira Marin',
    numeroEndereco: '1450',
    pontoReferencia: 'Em frente a Escola Estadual e ponto da linha 6003',
    urlFoto: 'assets/img/zel-2026-0001.jpg',
    status: 'Aberto',
    dataAbertura: '2026-11-01',
    totalVotos: 3,
    cidadaoAutorId: 2,
    bairroId: 1,
  },
  {
    chamadoId: 2,
    protocolo: 'ZEL-2026-0002',
    titulo: 'Cratera aberta na faixa de onibus causando acidentes',
    descricao: 'Asfalto cedeu apos chuva forte. Motociclistas e onibus precisam invadir a contramao.',
    categoria: 'Asfalto',
    logradouro: 'Estrada de Itapecerica',
    numeroEndereco: '3200',
    pontoReferencia: 'Proximo ao Terminal Capelinha',
    urlFoto: 'assets/img/zel-2026-0002.jpg',
    status: 'Em_Andamento',
    dataAbertura: '2026-11-03',
    totalVotos: 3,
    cidadaoAutorId: 1,
    bairroId: 2,
  },
  {
    chamadoId: 3,
    protocolo: 'ZEL-2026-0003',
    titulo: 'Bueiro entupido provocando alagamento na calcada',
    descricao: 'Boca de lobo bloqueada por lixo e terra; qualquer chuva inunda a entrada das casas.',
    categoria: 'Drenagem',
    logradouro: 'Rua Parapua',
    numeroEndereco: '890',
    pontoReferencia: 'Ao lado da UBS Brasilandia',
    urlFoto: 'assets/img/zel-2026-0003.jpg',
    status: 'Aberto',
    dataAbertura: '2026-11-05',
    totalVotos: 2,
    cidadaoAutorId: 4,
    bairroId: 14,
  },
  {
    chamadoId: 4,
    protocolo: 'ZEL-2026-0004',
    titulo: 'Descarte irregular de entulho bloqueando passagem de cadeirantes',
    descricao: 'Calcada inteira tomada por restos de obra e lixo domestico ha mais de duas semanas.',
    categoria: 'Limpeza',
    logradouro: 'Av. Jacu-Pessego',
    numeroEndereco: 'S/N',
    pontoReferencia: 'Esquina com a Rua Flores do Piaui',
    urlFoto: 'assets/img/zel-2026-0004.jpg',
    status: 'Resolvido',
    dataAbertura: '2026-10-25',
    totalVotos: 2,
    cidadaoAutorId: 3,
    bairroId: 7,
  },
  {
    chamadoId: 5,
    protocolo: 'ZEL-2026-0005',
    titulo: 'Escadaria comunitaria sem iluminacao e com drenagem quebrada',
    descricao: 'Moradores idosos descem no escuro e com degraus escorregadios por vazamento de agua pluvial.',
    categoria: 'Iluminacao',
    logradouro: 'Av. dos Metalurgicos',
    numeroEndereco: '1120',
    pontoReferencia: 'Acesso principal ao terminal de Cidade Tiradentes',
    urlFoto: 'assets/img/zel-2026-0005.jpg',
    status: 'Aberto',
    dataAbertura: '2026-11-08',
    totalVotos: 2,
    cidadaoAutorId: 5,
    bairroId: 8,
  },
];

export const votosChamado = [
  { votoId: 1, dataVoto: '2026-11-01', nivelUrgencia: 5, comentario: 'Volto da faculdade as 23h e esse ponto esta totalmente no escuro.', chamadoId: 1, cidadaoId: 2 },
  { votoId: 2, dataVoto: '2026-11-02', nivelUrgencia: 5, comentario: 'Ja ocorreram assaltos nessa parada por falta de luz nos postes.', chamadoId: 1, cidadaoId: 1 },
  { votoId: 3, dataVoto: '2026-11-02', nivelUrgencia: 5, comentario: 'Idosos e alunos da escola noturna nao enxergam a calcada.', chamadoId: 1, cidadaoId: 4 },
  { votoId: 4, dataVoto: '2026-11-03', nivelUrgencia: 5, comentario: 'Cratera funda bem na curva do corredor de onibus.', chamadoId: 2, cidadaoId: 1 },
  { votoId: 5, dataVoto: '2026-11-04', nivelUrgencia: 5, comentario: 'Quase cai de moto ontem a noite ao desviar desse buraco.', chamadoId: 2, cidadaoId: 3 },
  { votoId: 6, dataVoto: '2026-11-04', nivelUrgencia: 4, comentario: 'Transito travado todos os dias no horario de pico.', chamadoId: 2, cidadaoId: 2 },
  { votoId: 7, dataVoto: '2026-11-05', nivelUrgencia: 5, comentario: 'Se chover forte hoje, a agua invade o posto de saude.', chamadoId: 3, cidadaoId: 4 },
  { votoId: 8, dataVoto: '2026-11-06', nivelUrgencia: 4, comentario: 'Mau cheiro e agua parada acumulando mosquitos.', chamadoId: 3, cidadaoId: 1 },
  { votoId: 9, dataVoto: '2026-10-26', nivelUrgencia: 4, comentario: 'Cadeirantes precisam andar no meio dos carros para passar.', chamadoId: 4, cidadaoId: 3 },
  { votoId: 10, dataVoto: '2026-10-27', nivelUrgencia: 3, comentario: 'Entulho espalhado na esquina inteira.', chamadoId: 4, cidadaoId: 2 },
  { votoId: 11, dataVoto: '2026-11-08', nivelUrgencia: 5, comentario: 'Escadaria perigosa para quem sai cedo para trabalhar.', chamadoId: 5, cidadaoId: 5 },
  { votoId: 12, dataVoto: '2026-11-09', nivelUrgencia: 5, comentario: 'Urgente antes do periodo de chuvas fortes.', chamadoId: 5, cidadaoId: 1 },
];

export const orgaosResponsaveis = [
  { orgaoId: 1, nomeOrgao: 'SP Regula / Ilumina SP - Iluminacao Publica', especialidade: 'Iluminacao', telefoneContato: '156', emailOuvidoria: 'iluminacao@prefeitura.sp.gov.br', municipioId: 1 },
  { orgaoId: 2, nomeOrgao: 'Subprefeitura Campo Limpo - Manutencao Viaria', especialidade: 'Asfalto', telefoneContato: '(11) 3397-0500', emailOuvidoria: 'campolimpo@prefeitura.sp.gov.br', municipioId: 1 },
  { orgaoId: 3, nomeOrgao: 'Subprefeitura Itaquera - Limpeza Urbana', especialidade: 'Limpeza', telefoneContato: '(11) 2070-1600', emailOuvidoria: 'itaquera@prefeitura.sp.gov.br', municipioId: 1 },
  { orgaoId: 4, nomeOrgao: 'Subprefeitura Freguesia / Brasilandia - Drenagem', especialidade: 'Drenagem', telefoneContato: '(11) 3981-5000', emailOuvidoria: 'brasilandia@prefeitura.sp.gov.br', municipioId: 1 },
  { orgaoId: 5, nomeOrgao: 'Subprefeitura Capela do Socorro - Obras e Servicos', especialidade: 'Iluminacao', telefoneContato: '(11) 3397-2700', emailOuvidoria: 'capeladosocorro@prefeitura.sp.gov.br', municipioId: 1 },
];

export const ordensServico = [
  {
    ordemId: 1,
    numeroOs: 'OS-2026-0001',
    statusExecucao: 'Equipe_Em_Campo',
    dataEmissao: '2026-11-05',
    dataConclusao: null,
    parecerTecnico: 'Area isolada com cavaletes; caminhao de massa asfaltica em deslocamento para recapeamento.',
    urlFotoSolucao: null,
    chamadoId: 2,
    orgaoId: 2,
  },
  {
    ordemId: 2,
    numeroOs: 'OS-2026-0002',
    statusExecucao: 'Concluida',
    dataEmissao: '2026-10-28',
    dataConclusao: '2026-10-30',
    parecerTecnico: 'Retiradas 4 toneladas de entulho e realizada lavagem e desobstrucao da calcada.',
    urlFotoSolucao: 'assets/img/os-2026-0002-depois.svg',
    chamadoId: 4,
    orgaoId: 3,
  },
];

/** Estado inicial completo — usado pelo botão "Restaurar dados de demonstração". */
export function dadosOriginais() {
  return structuredClone({
    municipios,
    bairros,
    cidadaos,
    chamadosZeladoria,
    votosChamado,
    orgaosResponsaveis,
    ordensServico,
  });
}
