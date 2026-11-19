package br.com.fiap.zeladoria.model;

import br.com.fiap.zeladoria.enums.StatusExecucao;

public class OrdemServico {

    private int ordemId;
    private String numeros;
    private StatusExecucao statusExecucao;
    private String dataEmissao;
    private String dataConclusao;
    private String parecerTecnico;
    private String urlFotoSolucao;
    private ChamadoZeladoria chamado;
    private OrgaoResponsavel orgao;

    public OrdemServico(int ordemId, String numeroOs, StatusExecucao statusExecucao, String dataEmissao, String dataConclusao, String parecerTecnico, String urlFotoSolucao, ChamadoZeladoria chamado, OrgaoResponsavel orgao) {
        this.ordemId = ordemId;
        this.numeros = numeroOs;
        this.statusExecucao = statusExecucao;
        this.dataEmissao = dataEmissao;
        this.dataConclusao = dataConclusao;
        this.parecerTecnico = parecerTecnico;
        this.urlFotoSolucao = urlFotoSolucao;
        this.chamado = chamado;
        this.orgao = orgao;
    }

    public int getOrdemId() {
        return ordemId;
    }

    public void setOrdemId(int ordemId) {
        this.ordemId = ordemId;
    }

    public String getNumeros() {
        return numeros;
    }

    public void setNumeros(String numeros) {
        this.numeros = numeros;
    }

    public StatusExecucao getStatusExecucao() {
        return statusExecucao;
    }

    public void setStatusExecucao(StatusExecucao statusExecucao) {
        this.statusExecucao = statusExecucao;
    }

    public String getDataEmissao() {
        return dataEmissao;
    }

    public void setDataEmissao(String dataEmissao) {
        this.dataEmissao = dataEmissao;
    }

    public String getDataConclusao() {
        return dataConclusao;
    }

    public void setDataConclusao(String dataConclusao) {
        this.dataConclusao = dataConclusao;
    }

    public String getParecerTecnico() {
        return parecerTecnico;
    }

    public void setParecerTecnico(String parecerTecnico) {
        this.parecerTecnico = parecerTecnico;
    }

    public String getUrlFotoSolucao() {
        return urlFotoSolucao;
    }

    public void setUrlFotoSolucao(String urlFotoSolucao) {
        this.urlFotoSolucao = urlFotoSolucao;
    }

    public ChamadoZeladoria getChamado() {
        return chamado;
    }

    public void setChamado(ChamadoZeladoria chamado) {
        this.chamado = chamado;
    }

    public OrgaoResponsavel getOrgao() {
        return orgao;
    }

    public void setOrgao(OrgaoResponsavel orgao) {
        this.orgao = orgao;
    }

    @Override
    public String toString() {
        return "OrdemServico{" +
                "ordemId=" + ordemId +
                ", numeros='" + numeros + '\'' +
                ", statusExecucao=" + statusExecucao +
                ", dataEmissao='" + dataEmissao + '\'' +
                ", dataConclusao='" + dataConclusao + '\'' +
                ", parecerTecnico='" + parecerTecnico + '\'' +
                ", urlFotoSolucao='" + urlFotoSolucao + '\'' +
                ", chamado=" + chamado +
                ", orgao=" + orgao +
                '}';
    }
}
