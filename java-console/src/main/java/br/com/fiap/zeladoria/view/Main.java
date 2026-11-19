package br.com.fiap.zeladoria.view;

import br.com.fiap.zeladoria.enums.Categoria;
import br.com.fiap.zeladoria.enums.Status;
import br.com.fiap.zeladoria.model.*;
import br.com.fiap.zeladoria.service.ZeladoriaService;

import java.util.List;
import java.util.Scanner;

public class Main {

    private static final Scanner scanner = new Scanner(System.in);
    private static final ZeladoriaService service = new ZeladoriaService();

    public static void main(String[] args) {
        int opcao;
        do {
            exibirMenu();
            opcao = lerInt("Escolha uma opcao: ");
            switch (opcao) {
                case 1 -> listarRanking();
                case 2 -> abrirNovoChamado();
                case 3 -> buscarEFiltrar();
                case 4 -> registrarVoto();
                case 5 -> atualizarStatusOuOrdem();
                case 6 -> removerChamado();
                case 7 -> listarCadastros();
                case 0 -> System.out.println("Encerrando o sistema!!");
                default -> System.out.println("Opcao invalida");
            }
        } while (opcao != 0);
    }


    private static void exibirMenu() {
        System.out.println("\n===== ZELADORIA ATIVA =====");
        System.out.println("[1] Ranking de prioridade dos chamados");
        System.out.println("[2] Abrir novo chamado");
        System.out.println("[3] Buscar e filtrar chamados");
        System.out.println("[4] Registrar voto de urgencia");
        System.out.println("[5] Atualizar status / Ordem de servico");
        System.out.println("[6] Remover chamado");
        System.out.println("[7] Listar bairros, cidadaos, orgaos e ordens");
        System.out.println("[0] Sair");
    }


    private static void listarRanking() {
        System.out.println("\n--- Ranking de Prioridade ---");
        List<ChamadoZeladoria> ranking = service.listarChamadosPorRanking();
        int posicao = 1;
        for (ChamadoZeladoria c : ranking) {
            double media = service.calcularMediaUrgencia(c.getChamadoId());
            System.out.printf("%d. [%s] %s | %s | Votos: %d | Media urgencia: %.2f | Status: %s%n",
                    posicao++, c.getProtocolo(), c.getTitulo(), c.getBairro().getNome(),
                    c.getTotalVotos(), media, c.getStatus());
        }
    }


    private static void abrirNovoChamado() {
        System.out.println("\n--- Abrir Novo Chamado ---");
        try {
            listarCidadaosResumo();
            int cidadaoId = lerInt("ID do cidadao autor: ");

            listarBairrosResumo();
            int bairroId = lerInt("ID do bairro: ");

            String titulo = lerTextoObrigatorio("Titulo: ");
            String descricao = lerTextoObrigatorio("Descricao: ");
            Categoria categoria = escolherCategoria();
            String logradouro = lerTextoObrigatorio("Logradouro: ");
            String numero = lerTextoObrigatorio("Numero (ou S/N): ");
            String referencia = lerTexto("Ponto de referencia: ");
            String urlFoto = lerTexto("URL da foto: ");

            ChamadoZeladoria novo = service.abrirChamado(titulo, descricao, categoria,
                    logradouro, numero, referencia, urlFoto, cidadaoId, bairroId);

            System.out.println("Chamado aberto com sucesso! Protocolo: " + novo.getProtocolo());
        } catch (IllegalArgumentException e) {
            System.out.println("Erro: " + e.getMessage());
        }
    }


    private static void buscarEFiltrar() {
        System.out.println("\n--- Buscar e Filtrar ---");
        System.out.println("[1] Por protocolo");
        System.out.println("[2] Por ID");
        System.out.println("[3] Por bairro");
        System.out.println("[4] Por categoria");
        System.out.println("[5] Por status");
        int tipo = lerInt("Escolha: ");

        switch (tipo) {
            case 1 -> {
                String protocolo = lerTextoObrigatorio("Protocolo (ex: ZEL-2026-0001): ");
                ChamadoZeladoria c = service.buscarChamadoPorProtocolo(protocolo);
                if (c == null) {
                    System.out.println("Chamado nao encontrado.");
                } else {
                    imprimirChamadoDetalhado(c);
                }
            }
            case 2 -> {
                int id = lerInt("ID do chamado: ");
                ChamadoZeladoria c = service.buscarChamadoPorId(id);
                if (c == null) {
                    System.out.println("Chamado nao encontrado.");
                } else {
                    imprimirChamadoDetalhado(c);
                }
            }
            case 3 -> {
                String bairro = lerTextoObrigatorio("Nome do bairro: ");
                imprimirListaChamados(service.filtrarChamadosPorBairro(bairro));
            }
            case 4 -> {
                Categoria categoria = escolherCategoria();
                imprimirListaChamados(service.filtrarChamadosPorCategoria(categoria));
            }
            case 5 -> {
                Status status = escolherStatus();
                imprimirListaChamados(service.filtrarChamadosPorStatus(status));
            }
            default -> System.out.println("Opcao invalida.");
        }
    }


    private static void registrarVoto() {
        System.out.println("\n--- Registrar Voto de Urgencia ---");
        try {
            imprimirListaChamados(service.getChamados());
            int chamadoId = lerInt("ID do chamado: ");

            listarCidadaosResumo();
            int cidadaoId = lerInt("ID do cidadao que esta votando: ");

            int nivel = lerInt("Nivel de urgencia (1 a 5): ");
            String comentario = lerTexto("Comentario: ");

            service.registrarVoto(chamadoId, cidadaoId, nivel, comentario);
            System.out.println("Voto registrado com sucesso!");
            System.out.printf("Media de urgencia atual do chamado: %.2f%n",
                    service.calcularMediaUrgencia(chamadoId));
        } catch (IllegalArgumentException e) {
            System.out.println("Erro: " + e.getMessage());
        }
    }


    private static void atualizarStatusOuOrdem() {
        System.out.println("\n--- Atualizar Status / Ordem de Servico ---");
        System.out.println("[1] Atualizar status de um chamado");
        System.out.println("[2] Emitir ordem de servico");
        System.out.println("[3] Concluir ordem de servico");
        int tipo = lerInt("Escolha: ");

        try {
            switch (tipo) {
                case 1 -> {
                    imprimirListaChamados(service.getChamados());
                    int id = lerInt("ID do chamado: ");
                    Status novo = escolherStatus();
                    service.atualizarStatusChamado(id, novo);
                    System.out.println("Status atualizado!");
                }
                case 2 -> {
                    imprimirListaChamados(service.getChamados());
                    int chamadoId = lerInt("ID do chamado: ");
                    listarOrgaosResumo();
                    int orgaoId = lerInt("ID do orgao responsavel: ");
                    String parecer = lerTextoObrigatorio("Parecer tecnico inicial: ");
                    OrdemServico ordemServico = service.emitirOrdemServico(chamadoId, orgaoId, parecer);
                    System.out.println("Ordem emitida: " + ordemServico.getNumeros()
                            + " (chamado passou para EM_ANDAMENTO)");
                }
                case 3 -> {
                    listarOrdensResumo();
                    int ordemId = lerInt("ID da ordem de servico: ");
                    String parecer = lerTextoObrigatorio("Parecer tecnico final: ");
                    String urlFoto = lerTexto("URL da foto da solucao: ");
                    service.concluirOrdemServico(ordemId, parecer, urlFoto);
                    System.out.println("Ordem concluida e chamado marcado como RESOLVIDO!");
                }
                default -> System.out.println("Opcao invalida.");
            }
        } catch (IllegalArgumentException e) {
            System.out.println("Erro: " + e.getMessage());
        }
    }


    private static void removerChamado() {
        System.out.println("\n--- Remover Chamado ---");
        imprimirListaChamados(service.getChamados());
        int id = lerInt("ID do chamado a remover: ");
        String confirma = lerTexto("Confirma a remocao (votos e ordens ligados tambem serao apagados)? (s/n): ");
        if (!confirma.equalsIgnoreCase("s")) {
            System.out.println("Remocao cancelada.");
            return;
        }
        if (service.removerChamado(id)) {
            System.out.println("Chamado removido.");
        } else {
            System.out.println("Chamado nao encontrado.");
        }
    }

    private static void listarCadastros() {
        System.out.println("\n--- Listar ---");
        System.out.println("[1] Bairros");
        System.out.println("[2] Cidadaos");
        System.out.println("[3] Orgaos responsaveis");
        System.out.println("[4] Ordens de servico");
        int tipo = lerInt("Escolha: ");

        switch (tipo) {
            case 1 -> listarBairrosResumo();
            case 2 -> listarCidadaosResumo();
            case 3 -> listarOrgaosResumo();
            case 4 -> listarOrdensResumo();
            default -> System.out.println("Opcao invalida.");
        }
    }


    private static void listarBairrosResumo() {
        System.out.println("Bairros:");
        for (Bairro b : service.getBairros()) {
            System.out.println("  " + b.getBairroId() + " - " + b.getNome());
        }
    }

    private static void listarCidadaosResumo() {
        System.out.println("Cidadaos:");
        for (Cidadao c : service.getCidadaos()) {
            System.out.println("  " + c.getCidadaoId() + " - " + c.getNome());
        }
    }

    private static void listarOrgaosResumo() {
        System.out.println("Orgaos responsaveis:");
        for (OrgaoResponsavel o : service.getOrgaos()) {
            System.out.println("  " + o.getOrgaoId() + " - " + o.getNomeOrgao()
                    + " (" + o.getEspecialidade() + ")");
        }
    }

    private static void listarOrdensResumo() {
        System.out.println("Ordens de servico:");
        for (OrdemServico o : service.getOrdens()) {
            System.out.println("  " + o.getOrdemId() + " - " + o.getNumeros()
                    + " | Chamado: " + o.getChamado().getProtocolo()
                    + " | Orgao: " + o.getOrgao().getNomeOrgao()
                    + " | Status: " + o.getStatusExecucao());
        }
    }

    private static void imprimirListaChamados(List<ChamadoZeladoria> lista) {
        if (lista.isEmpty()) {
            System.out.println("Nenhum chamado encontrado.");
            return;
        }
        for (ChamadoZeladoria c : lista) {
            System.out.printf("  %d - [%s] %s | %s | %s | Votos: %d%n",
                    c.getChamadoId(), c.getProtocolo(), c.getTitulo(),
                    c.getBairro().getNome(), c.getStatus(), c.getTotalVotos());
        }
    }

    private static void imprimirChamadoDetalhado(ChamadoZeladoria c) {
        System.out.println("Protocolo: " + c.getProtocolo());
        System.out.println("Titulo: " + c.getTitulo());
        System.out.println("Categoria: " + c.getCategoria());
        System.out.println("Bairro: " + c.getBairro().getNome());
        System.out.println("Status: " + c.getStatus());
        System.out.println("Total de votos: " + c.getTotalVotos());
        System.out.printf("Media de urgencia: %.2f%n", service.calcularMediaUrgencia(c.getChamadoId()));
    }


    private static Categoria escolherCategoria() {
        Categoria[] valores = Categoria.values();
        System.out.println("Categorias:");
        for (int i = 0; i < valores.length; i++) {
            System.out.println("  " + (i + 1) + " - " + valores[i]);
        }
        int escolha;

        do {
            escolha = lerInt("Escolha a categoria: ");
            if (escolha < 1 || escolha > valores.length) {
                System.out.println("Opcao invalida. Escolha entre 1 e " + valores.length + ".");
            }
        } while (escolha < 1 || escolha > valores.length);

        return valores[escolha - 1];
    }

    private static Status escolherStatus() {
        Status[] valores = Status.values();
        System.out.println("Status:");
        for (int i = 0; i < valores.length; i++) {
            System.out.println("  " + (i + 1) + " - " + valores[i]);
        }
        int escolha;
        do {
            escolha = lerInt("Escolha a categoria: ");
            if (escolha < 1 || escolha > valores.length) {
                System.out.println("Opcao invalida. Escolha entre 1 e " + valores.length + ".");
            }
        } while (escolha < 1 || escolha > valores.length);

        return valores[escolha - 1];
    }


    private static int lerInt(String mensagem) {
        while (true) {
            System.out.print(mensagem);
            try {
                return Integer.parseInt(scanner.nextLine().trim());
            } catch (NumberFormatException e) {
                System.out.println("Digite um numero valido.");
            }
        }
    }

    private static String lerTexto(String mensagem) {
        System.out.print(mensagem);
        return scanner.nextLine().trim();
    }

    private static String lerTextoObrigatorio(String mensagem) {
        while (true) {
            System.out.print(mensagem);
            String texto = scanner.nextLine().trim();
            if (!texto.isEmpty()) {
                return texto;
            }
            System.out.println("Este campo nao pode ficar vazio");
        }
    }

}