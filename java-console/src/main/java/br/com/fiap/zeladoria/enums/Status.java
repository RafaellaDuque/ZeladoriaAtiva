package br.com.fiap.zeladoria.enums;

public enum Status {
    ABERTO("Aberto"),
    EM_ANDAMENTO("Em_Andamento"),
    RESOLVIDO("Resolvido");

    private final String descricao;

    Status(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }

    @Override
    public String toString() {
        return descricao;
    }

    public static Status fromTexto(String texto) {
        for (Status s : values()) {
            if (s.descricao.equalsIgnoreCase(texto)) {
                return s;
            }
        }
        throw new IllegalArgumentException("Status invalido: " + texto);
    }
}