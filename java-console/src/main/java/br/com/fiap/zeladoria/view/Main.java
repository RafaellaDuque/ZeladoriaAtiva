package br.com.fiap.zeladoria.view;

import br.com.fiap.zeladoria.service.ZeladoriaService;

public class Main {
    public static void main(String[] args) {
        ZeladoriaService service = new ZeladoriaService();

        System.out.println("Chamados: " + service.getChamados().size());
        System.out.println("Votos: " + service.getVotos().size());
        System.out.println("Ordens: " + service.getOrdens().size());
    }
}