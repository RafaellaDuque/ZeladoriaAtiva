package br.com.fiap.zeladoria.model;

public class VotoChamado {

    private int votoId;
    private String dataVoto;
    private int nivelUrgencia;
    private String comentario;
    private ChamadoZeladoria chamado;
    private Cidadao cidadao;

    public VotoChamado(int votoId, String dataVoto, int nivelUrgencia, String comentario, ChamadoZeladoria chamado, Cidadao cidadao) {
        this.votoId = votoId;
        this.dataVoto = dataVoto;
        this.nivelUrgencia = nivelUrgencia;
        this.comentario = comentario;
        this.chamado = chamado;
        this.cidadao = cidadao;
    }

    public int getVotoId() {
        return votoId;
    }

    public void setVotoId(int votoId) {
        this.votoId = votoId;
    }

    public String getDataVoto() {
        return dataVoto;
    }

    public void setDataVoto(String dataVoto) {
        this.dataVoto = dataVoto;
    }

    public int getNivelUrgencia() {
        return nivelUrgencia;
    }

    public void setNivelUrgencia(int nivelUrgencia) {
        this.nivelUrgencia = nivelUrgencia;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public ChamadoZeladoria getChamado() {
        return chamado;
    }

    public void setChamado(ChamadoZeladoria chamado) {
        this.chamado = chamado;
    }

    public Cidadao getCidadao() {
        return cidadao;
    }

    public void setCidadao(Cidadao cidadao) {
        this.cidadao = cidadao;
    }

    @Override
    public String toString() {
        return "VotoChamado{" +
                "votoId=" + votoId +
                ", dataVoto='" + dataVoto + '\'' +
                ", nivelUrgencia=" + nivelUrgencia +
                ", comentario='" + comentario + '\'' +
                ", chamado=" + chamado +
                ", cidadao=" + cidadao +
                '}';
    }
}
