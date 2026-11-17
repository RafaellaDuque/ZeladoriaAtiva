package br.com.fiap.zeladoria.model;

public class Cidadao {
    private int cidadaoId;
    private String nome;
    private String cpf;
    private String email;
    private String telefone;
    private String dataCadastro;

    public Cidadao(int cidadaoId, String cpf, String nome, String email, String telefone, String dataCadastro) {
        this.cidadaoId = cidadaoId;
        this.cpf = cpf;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.dataCadastro = dataCadastro;
    }

    public int getCidadaoId() {
        return cidadaoId;
    }

    public void setCidadaoId(int cidadaoId) {
        this.cidadaoId = cidadaoId;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(String dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    @Override
    public String toString() {
        return "Cidadao{" +
                "cidadaoId=" + cidadaoId +
                ", nome='" + nome + '\'' +
                ", cpf='" + cpf + '\'' +
                ", email='" + email + '\'' +
                ", telefone='" + telefone + '\'' +
                ", dataCadastro='" + dataCadastro + '\'' +
                '}';
    }
}
