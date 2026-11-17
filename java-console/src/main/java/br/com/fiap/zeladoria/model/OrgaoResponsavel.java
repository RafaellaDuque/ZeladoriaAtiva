package br.com.fiap.zeladoria.model;

import br.com.fiap.zeladoria.enums.Categoria;

public class OrgaoResponsavel {

    private int orgaoId;
    private String nomeOrgao;
    private Categoria especialidade;
    private String telefoneContato;
    private String emailOuvidoria;
    private Municipio municipio;

    public OrgaoResponsavel(int orgaoId, String nomeOrgao, Categoria especialidade, String telefoneContato, String emailOuvidoria, Municipio municipio) {
        this.orgaoId = orgaoId;
        this.nomeOrgao = nomeOrgao;
        this.especialidade = especialidade;
        this.telefoneContato = telefoneContato;
        this.emailOuvidoria = emailOuvidoria;
        this.municipio = municipio;
    }

    public int getOrgaoId() {
        return orgaoId;
    }

    public void setOrgaoId(int orgaoId) {
        this.orgaoId = orgaoId;
    }

    public String getNomeOrgao() {
        return nomeOrgao;
    }

    public void setNomeOrgao(String nomeOrgao) {
        this.nomeOrgao = nomeOrgao;
    }

    public Categoria getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(Categoria especialidade) {
        this.especialidade = especialidade;
    }

    public String getTelefoneContato() {
        return telefoneContato;
    }

    public void setTelefoneContato(String telefoneContato) {
        this.telefoneContato = telefoneContato;
    }

    public String getEmailOuvidoria() {
        return emailOuvidoria;
    }

    public void setEmailOuvidoria(String emailOuvidoria) {
        this.emailOuvidoria = emailOuvidoria;
    }

    public Municipio getMunicipio() {
        return municipio;
    }

    public void setMunicipio(Municipio municipio) {
        this.municipio = municipio;
    }

    @Override
    public String toString() {
        return "OrgaoResponsavel{" +
                "orgaoId=" + orgaoId +
                ", nomeOrgao='" + nomeOrgao + '\'' +
                ", especialidade=" + especialidade +
                ", telefoneContato='" + telefoneContato + '\'' +
                ", emailOuvidoria='" + emailOuvidoria + '\'' +
                ", municipio=" + municipio +
                '}';
    }
}
