package br.com.fiap.zeladoria.service;

import br.com.fiap.zeladoria.enums.Categoria;
import br.com.fiap.zeladoria.enums.Status;
import br.com.fiap.zeladoria.enums.StatusExecucao;
import br.com.fiap.zeladoria.model.*;

import java.util.ArrayList;
import java.util.List;

public class ZeladoriaService {

    private List<Municipio> municipios = new ArrayList<>();
    private List<Bairro> bairros = new ArrayList<>();
    private List<Cidadao> cidadaos = new ArrayList<>();
    private List<ChamadoZeladoria> chamados = new ArrayList<>();
    private List<VotoChamado> votos = new ArrayList<>();
    private List<OrgaoResponsavel> orgaos = new ArrayList<>();
    private List<OrdemServico> ordens = new ArrayList<>();

    public List<Cidadao> getCidadaos() {
        return cidadaos;
    }

    public List<OrgaoResponsavel> getOrgaos() {
        return orgaos;
    }

    public List<OrdemServico> getOrdens() {
        return ordens;
    }

    public List<VotoChamado> getVotos() {
        return votos;
    }

    public List<ChamadoZeladoria> getChamados() {
        return chamados;
    }

    public List<Bairro> getBairros() {
        return bairros;
    }

    public List<Municipio> getMunicipios() {
        return municipios;
    }

    public ZeladoriaService(){
        popularDadosInicias();
    }

    private void addBairro(int id, String nome, String regiao, int pop, int vuln, int municipioId) {
        Municipio m = buscarMunicipioPorId(municipioId);
        bairros.add(new Bairro(id, nome, regiao, pop, vuln, m));
    }

    public Municipio buscarMunicipioPorId(int id) {
        for (Municipio m : municipios) {
            if (m.getMunicipioId() == id) {
                return m;
            }
        }
        return null;
    }

    public Cidadao buscarCidadaoPorId(int id) {
        for (Cidadao c : cidadaos) {
            if (c.getCidadaoId() == id) {
                return c;
            }
        }
        return null;
    }

    public Bairro buscarBairroPorId(int id) {
        for (Bairro b : bairros) {
            if (b.getBairroId() == id) {
                return b;
            }
        }
        return null;
    }

    public ChamadoZeladoria buscarChamadoPorId(int id) {
        for (ChamadoZeladoria c : chamados) {
            if (c.getChamadoId() == id) {
                return c;
            }
        }
        return null;
    }

    public OrgaoResponsavel buscarOrgaoPorId(int id) {
        for (OrgaoResponsavel r : orgaos) {
            if (r.getOrgaoId() == id){
                return r;
            }
        }
        return null;
    }

    private void addChamado(int id, String protocolo, String titulo, String descricao,
                            Categoria categoria, String logradouro, String numero,
                            String pontoReferencia, String urlFoto, Status status,
                            String dataAbertura, int totalVotos,
                            int cidadaoAutorId, int bairroId) {
        Cidadao autor = buscarCidadaoPorId(cidadaoAutorId);
        Bairro bairro = buscarBairroPorId(bairroId);
        chamados.add(new ChamadoZeladoria(id, protocolo, titulo, descricao, categoria,
                logradouro, numero, pontoReferencia, urlFoto, status,
                dataAbertura, autor, totalVotos, bairro));
    }

    private void addOrgao(int id, String nome, Categoria especialidade, String telefone,
                          String email, int municipioId) {
        Municipio m = buscarMunicipioPorId(municipioId);
        orgaos.add(new OrgaoResponsavel(id, nome, especialidade, telefone, email, m));
    }

    private void addVoto(int id, String data, int nivelUrgencia, String comentario,
                         int chamadoId, int cidadaoId) {
        ChamadoZeladoria chamado = buscarChamadoPorId(chamadoId);
        Cidadao cidadao = buscarCidadaoPorId(cidadaoId);
        votos.add(new VotoChamado(id, data, nivelUrgencia, comentario, chamado, cidadao));
    }

    private void addOrdem(int id, String numeroOs, StatusExecucao status, String dataEmissao,
                          String dataConclusao, String parecer, String urlFotoSolucao,
                          int chamadoId, int orgaoId) {
        ChamadoZeladoria chamado = buscarChamadoPorId(chamadoId);
        OrgaoResponsavel orgao = buscarOrgaoPorId(orgaoId);
        ordens.add(new OrdemServico(id, numeroOs, status, dataEmissao, dataConclusao,
                parecer, urlFotoSolucao, chamado, orgao));
    }


    private void popularDadosInicias(){

        municipios.add(new Municipio(1, "Sao Paulo", "SP", "3550308"));

        addBairro(1, "Grajau", "Zona Sul", 384000, 5, 1);
        addBairro(2, "Capao Redondo", "Zona Sul", 275000, 5, 1);
        addBairro(3, "Jardim Angela", "Zona Sul", 311000, 5, 1);
        addBairro(4, "Cidade Ademar", "Zona Sul", 272000, 4, 1);
        addBairro(5, "Santo Amaro", "Zona Sul", 85000, 2, 1);
        addBairro(6, "Vila Mariana", "Zona Sul", 135000, 1, 1);

        addBairro(7, "Itaquera", "Zona Leste", 210000, 4, 1);
        addBairro(8, "Cidade Tiradentes", "Zona Leste", 228000, 5, 1);
        addBairro(9, "Sapopemba", "Zona Leste", 296000, 4, 1);
        addBairro(10, "Sao Mateus", "Zona Leste", 162000, 4, 1);
        addBairro(11, "Guaianases", "Zona Leste", 118000, 5, 1);
        addBairro(12, "Mooca", "Zona Leste", 81000, 2, 1);
        addBairro(13, "Tatuape", "Zona Leste", 98000, 1, 1);


        addBairro(14, "Brasilandia", "Zona Norte", 265000, 5, 1);
        addBairro(15, "Pirituba", "Zona Norte", 175000, 3, 1);
        addBairro(16, "Perus", "Zona Norte", 92000, 5, 1);
        addBairro(17, "Jacana", "Zona Norte", 96000, 4, 1);
        addBairro(18, "Santana", "Zona Norte", 124000, 2, 1);


        addBairro(19, "Butanta", "Zona Oeste", 58000, 2, 1);
        addBairro(20, "Rio Pequeno", "Zona Oeste", 132000, 4, 1);
        addBairro(21, "Lapa", "Zona Oeste", 72000, 2, 1);
        addBairro(22, "Pinheiros", "Zona Oeste", 68000, 1, 1);


        addBairro(23, "Se", "Centro", 28000, 4, 1);
        addBairro(24, "Republica", "Centro", 61000, 3, 1);
        addBairro(25, "Bela Vista", "Centro", 71000, 2, 1);

        cidadaos.add(new Cidadao(1, "Helena Souza", "123.456.789-01", "helena.souza@email.com", "(11) 98888-1111", "2026-10-01"));
        cidadaos.add(new Cidadao(2, "Lucas Oliveira", "234.567.890-12", "lucas.oliveira@email.com", "(11) 97777-2222", "2026-10-05"));
        cidadaos.add(new Cidadao(3, "Marcos Santos", "345.678.901-23", "marcos.santos@email.com", "(11) 96666-3333", "2026-10-12"));
        cidadaos.add(new Cidadao(4, "Beatriz Lima", "456.789.012-34", "beatriz.lima@email.com", "(11) 95555-4444", "2026-10-18"));
        cidadaos.add(new Cidadao(5, "Carlos Ferreira", "567.890.123-45", "carlos.ferreira@email.com", "(11) 94444-5555", "2026-10-20"));

        addChamado(1, "ZEL-2026-0001",
                "Tres postes queimados em frente ao ponto de onibus",
                "Trecho totalmente no escuro ha 45 dias, colocando estudantes noturnos e trabalhadores em risco.",
                Categoria.ILUMINACAO, "Av. Dona Belmira Marin", "1450",
                "Em frente a Escola Estadual e ponto da linha 6003",
                "https://storage.zeladoria.gov.br/evidencias/zel-2026-0001.jpg",
                Status.ABERTO, "2026-11-01", 3, 2, 1);

        addChamado(2, "ZEL-2026-0002",
                "Cratera aberta na faixa de onibus causando acidentes",
                "Asfalto cedeu apos chuva forte. Motociclistas e onibus precisam invadir a contramao.",
                Categoria.ASFALTO, "Estrada de Itapecerica", "3200",
                "Proximo ao Terminal Capelinha",
                "https://storage.zeladoria.gov.br/evidencias/zel-2026-0002.jpg",
                Status.EM_ANDAMENTO, "2026-11-03", 3, 1, 2);

        addChamado(3, "ZEL-2026-0003",
                "Bueiro entupido provocando alagamento na calcada",
                "Boca de lobo bloqueada por lixo e terra; qualquer chuva inunda a entrada das casas.",
                Categoria.DRENAGEM, "Rua Parapua", "890",
                "Ao lado da UBS Brasilandia",
                "https://storage.zeladoria.gov.br/evidencias/zel-2026-0003.jpg",
                Status.ABERTO, "2026-11-05", 2, 4, 14);

        addChamado(4, "ZEL-2026-0004",
                "Descarte irregular de entulho bloqueando passagem de cadeirantes",
                "Calcada inteira tomada por restos de obra e lixo domestico ha mais de duas semanas.",
                Categoria.LIMPEZA, "Av. Jacu-Pessego", "S/N",
                "Esquina com a Rua Flores do Piaui",
                "https://storage.zeladoria.gov.br/evidencias/zel-2026-0004.jpg",
                Status.RESOLVIDO, "2026-10-25", 2, 3, 7);

        addChamado(5, "ZEL-2026-0005",
                "Escadaria comunitaria sem iluminacao e com drenagem quebrada",
                "Moradores idosos descem no escuro e com degraus escorregadios por vazamento de agua pluvial.",
                Categoria.ILUMINACAO, "Av. dos Metalurgicos", "1120",
                "Acesso principal ao terminal de Cidade Tiradentes",
                "https://storage.zeladoria.gov.br/evidencias/zel-2026-0005.jpg",
                Status.ABERTO, "2026-11-08", 2, 5, 8);

        addOrgao(1, "SP Regula / Ilumina SP - Iluminacao Publica", Categoria.ILUMINACAO,
                "156", "iluminacao@prefeitura.sp.gov.br", 1);
        addOrgao(2, "Subprefeitura Campo Limpo - Manutencao Viaria", Categoria.ASFALTO,
                "(11) 3397-0500", "campolimpo@prefeitura.sp.gov.br", 1);
        addOrgao(3, "Subprefeitura Itaquera - Limpeza Urbana", Categoria.LIMPEZA,
                "(11) 2070-1600", "itaquera@prefeitura.sp.gov.br", 1);
        addOrgao(4, "Subprefeitura Freguesia / Brasilandia - Drenagem", Categoria.DRENAGEM,
                "(11) 3981-5000", "brasilandia@prefeitura.sp.gov.br", 1);
        addOrgao(5, "Subprefeitura Capela do Socorro - Obras e Servicos", Categoria.ILUMINACAO,
                "(11) 3397-2700", "capeladosocorro@prefeitura.sp.gov.br", 1);

        addVoto(1, "2026-11-01", 5, "Volto da faculdade as 23h e esse ponto esta totalmente no escuro.", 1, 2);
        addVoto(2, "2026-11-02", 5, "Ja ocorreram assaltos nessa parada por falta de luz nos postes.", 1, 1);
        addVoto(3, "2026-11-02", 5, "Idosos e alunos da escola noturna nao enxergam a calcada.", 1, 4);
        addVoto(4, "2026-11-03", 5, "Cratera funda bem na curva do corredor de onibus.", 2, 1);
        addVoto(5, "2026-11-04", 5, "Quase cai de moto ontem a noite ao desviar desse buraco.", 2, 3);
        addVoto(6, "2026-11-04", 4, "Transito travado todos os dias no horario de pico.", 2, 2);
        addVoto(7, "2026-11-05", 5, "Se chover forte hoje, a agua invade o posto de saude.", 3, 4);
        addVoto(8, "2026-11-06", 4, "Mau cheiro e agua parada acumulando mosquitos.", 3, 1);
        addVoto(9, "2026-10-26", 4, "Cadeirantes precisam andar no meio dos carros para passar.", 4, 3);
        addVoto(10, "2026-10-27", 3, "Entulho espalhado na esquina inteira.", 4, 2);
        addVoto(11, "2026-11-08", 5, "Escadaria perigosa para quem sai cedo para trabalhar.", 5, 5);
        addVoto(12, "2026-11-09", 5, "Urgente antes do periodo de chuvas fortes.", 5, 1);

        addOrdem(1, "OS-2026-0001", StatusExecucao.EQUIPE_EM_CAMPO, "2026-11-05", null,
                "Area isolada com cavaletes; caminhao de massa asfaltica em deslocamento para recapeamento.",
                null, 2, 2);
        addOrdem(2, "OS-2026-0002", StatusExecucao.CONCLUIDA, "2026-10-28", "2026-10-30",
                "Retiradas 4 toneladas de entulho e realizada lavagem e desobstrucao da calcada.",
                "https://storage.zeladoria.gov.br/solucoes/os-2026-0002-depois.jpg", 4, 3);

    }
}
