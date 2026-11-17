package br.com.fiap.zeladoria.model;

public class Bairro {

    private int bairroId;
    private String nome;
    private String regiao;
    private int populacaoEstimada;
    private int indiceVulnerabilidade;
    private Municipio municipio;

    public Bairro(int bairroId, String nome, String regiao, int populacaoEstimada, int indiceVulnerabilidade, Municipio municipio) {
        this.bairroId = bairroId;
        this.nome = nome;
        this.regiao = regiao;
        this.populacaoEstimada = populacaoEstimada;
        this.indiceVulnerabilidade = indiceVulnerabilidade;
        this.municipio = municipio;
    }

    public int getBairroId() {
        return bairroId;
    }

    public void setBairroId(int bairroId) {
        this.bairroId = bairroId;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getRegiao() {
        return regiao;
    }

    public void setRegiao(String regiao) {
        this.regiao = regiao;
    }

    public int getPopulacaoEstimada() {
        return populacaoEstimada;
    }

    public void setPopulacaoEstimada(int populacaoEstimada) {
        this.populacaoEstimada = populacaoEstimada;
    }

    public int getIndiceVulnerabilidade() {
        return indiceVulnerabilidade;
    }

    public void setIndiceVulnerabilidade(int indiceVulnerabilidade) {
        this.indiceVulnerabilidade = indiceVulnerabilidade;
    }

    public Municipio getMunicipio() {
        return municipio;
    }

    public void setMunicipio(Municipio municipio) {
        this.municipio = municipio;
    }

    @Override
    public String toString() {
        return "Bairro{" +
                "bairroId=" + bairroId +
                ", nome='" + nome + '\'' +
                ", regiao='" + regiao + '\'' +
                ", populacaoEstimada=" + populacaoEstimada +
                ", indiceVulnerabilidade=" + indiceVulnerabilidade +
                ", municipio=" + municipio +
                '}';
    }
}
