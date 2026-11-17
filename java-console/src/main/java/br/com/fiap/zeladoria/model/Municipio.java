package br.com.fiap.zeladoria.model;

public class Municipio {

    private int municipioId;
    private String nome;
    private String uf;
    private String codigoIbge;

    public Municipio(int municioId, String nome, String uf, String codigoIbge) {
        this.municipioId = municioId;
        this.nome = nome;
        this.uf = uf;
        this.codigoIbge = codigoIbge;
    }

    public int getMunicipioId() {
        return municipioId;
    }

    public void setMunicipioId(int municioId) {
        this.municipioId = municioId;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getUf() {
        return uf;
    }

    public void setUf(String uf) {
        this.uf = uf;
    }

    public String getCodigoIbge() {
        return codigoIbge;
    }

    public void setCodigoIbge(String codigoIbge) {
        this.codigoIbge = codigoIbge;
    }

    @Override
    public String toString() {
        return "Municipio{" +
                "municioId=" + municipioId +
                ", nome='" + nome + '\'' +
                ", uf='" + uf + '\'' +
                ", codigoIbge='" + codigoIbge + '\'' +
                '}';
    }
}
