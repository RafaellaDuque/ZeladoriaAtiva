package br.com.fiap.zeladoria.model;

import br.com.fiap.zeladoria.enums.Categoria;
import br.com.fiap.zeladoria.enums.Status;

public class ChamadoZeladoria {

    private int chamadoId;
    private String protocolo;
    private String titulo;
    private String descricao;
    private Categoria categoria;
    private String logradouro;
    private String numeroEndereco;
    private String pontoReferencia;
    private String urlFoto;
    private Status status;
    private String dataAbertura;
    private int totalVotos;
    private Cidadao cidadaoAutor;
    private Bairro bairro;


    public int calcularScorePrioridade() {
        return (this.totalVotos * 10) + (this.bairro.getIndiceVulnerabilidade() * 5);
    }


    public ChamadoZeladoria(int chamadoId, String protocolo, String titulo, String descricao, Categoria categoria,
                            String logradouro, String numeroEndereco, String pontoReferencia, String urlFoto,
                            Status status, String dataAbertura, Cidadao cidadaoAutor, int totalVotos, Bairro bairro) {
        this.chamadoId = chamadoId;
        this.protocolo = protocolo;
        this.titulo = titulo;
        this.descricao = descricao;
        this.categoria = categoria;
        this.logradouro = logradouro;
        this.numeroEndereco = numeroEndereco;
        this.pontoReferencia = pontoReferencia;
        this.urlFoto = urlFoto;
        this.status = status;
        this.dataAbertura = dataAbertura;
        this.cidadaoAutor = cidadaoAutor;
        this.totalVotos = totalVotos;
        this.bairro = bairro;
    }

    public int getChamadoId() {
        return chamadoId;
    }

    public void setChamadoId(int chamadoId) {
        this.chamadoId = chamadoId;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getProtocolo() {
        return protocolo;
    }

    public void setProtocolo(String protocolo) {
        this.protocolo = protocolo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public String getLogradouro() {
        return logradouro;
    }

    public void setLogradouro(String logradouro) {
        this.logradouro = logradouro;
    }

    public String getNumeroEndereco() {
        return numeroEndereco;
    }

    public void setNumeroEndereco(String numeroEndereco) {
        this.numeroEndereco = numeroEndereco;
    }

    public String getPontoReferencia() {
        return pontoReferencia;
    }

    public void setPontoReferencia(String pontoReferencia) {
        this.pontoReferencia = pontoReferencia;
    }

    public String getUrlFoto() {
        return urlFoto;
    }

    public void setUrlFoto(String urlFoto) {
        this.urlFoto = urlFoto;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getDataAbertura() {
        return dataAbertura;
    }

    public void setDataAbertura(String dataAbertura) {
        this.dataAbertura = dataAbertura;
    }

    public int getTotalVotos() {
        return totalVotos;
    }

    public void setTotalVotos(int totalVotos) {
        this.totalVotos = totalVotos;
    }

    public Cidadao getCidadaoAutor() {
        return cidadaoAutor;
    }

    public void setCidadaoAutor(Cidadao cidadaoAutor) {
        this.cidadaoAutor = cidadaoAutor;
    }

    public Bairro getBairro() {
        return bairro;
    }

    public void setBairro(Bairro bairro) {
        this.bairro = bairro;
    }

    @Override
    public String toString() {
        return "[" + protocolo + "] " + titulo
                + " | " + categoria
                + " | " + status
                + " | Bairro: " + bairro.getNome()
                + " | Votos: " + totalVotos
                + " | Score: " + calcularScorePrioridade();
    }

}
