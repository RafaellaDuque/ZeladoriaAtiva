package br.com.fiap.zeladoria.enums;

public enum StatusExecucao {
    PENDENTE("Pendente"),
    EQUIPE_EM_CAMPO("Equipe_Em_Campo"),
    CONCLUIDA("Concluida"),
    CANCELADA("Cancelada");

    private final String descricao;

    StatusExecucao(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }

    @Override
    public String toString() {
        return descricao;
    }

    public static StatusExecucao fromTexto(String texto) {
        for (StatusExecucao s : values()) {
            if (s.descricao.equalsIgnoreCase(texto)) {
                return s;
            }
        }
        throw new IllegalArgumentException("Status de execucao invalido: " + texto);
    }
}