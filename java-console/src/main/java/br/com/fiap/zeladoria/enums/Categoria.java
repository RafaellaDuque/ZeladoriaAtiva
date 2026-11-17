package br.com.fiap.zeladoria.enums;

public enum Categoria {
    ILUMINACAO("Iluminacao"),
    ASFALTO("Asfalto"),
    LIMPEZA("Limpeza"),
    DRENAGEM("Drenagem");

    private final String descricao;

    Categoria(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }

    @Override
    public String toString() {
        return descricao;
    }

    public static Categoria fromTexto(String texto) {
        for (Categoria c : values()) {
            if (c.descricao.equalsIgnoreCase(texto)) {
                return c;
            }
        }
        throw new IllegalArgumentException("Categoria invalida: " + texto);
    }
}