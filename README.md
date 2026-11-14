# Zeladoria Ativa — Priorizacao Comunitaria de Problemas Urbanos

> **Global Solution 2026/2 — CitizenTech (FIAP)**
> **Curso:** 2º Ano de Engenharia de Software (`2ESOR`)
> **Eixo Tematico:** Cidades (Mobilidade, Acessibilidade, Seguranca e Zeladoria)
> **ODS da ONU:** ODS 11 (Cidades e Comunidades Sustentaveis) e ODS 9 (Industria, Inovacao e Infraestrutura)
> **Prazo de Entrega:** 19/11/2026, ate 23h55

---

## 1. Sobre o Projeto

Nos bairros perifericos das cidades brasileiras, problemas cotidianos de infraestrutura — como buracos no asfalto, postes de iluminacao queimados em pontos de onibus, bueiros entupidos e descarte irregular de entulho — levam meses sem retorno do poder publico. Quando um cidadao abre uma solicitacao em canais tradicionais (como o 156), o protocolo cai em uma fila sem transparencia: os vizinhos nao sabem que o chamado ja existe e a subprefeitura nao tem um termometro claro de qual ocorrencia afeta mais pessoas naquele momento.

O **Zeladoria Ativa** e uma plataforma CitizenTech onde os proprios cidadaos mapeiam os problemas urbanos do territorio e a comunidade atua como curadora da urgencia:

1. Qualquer cidadao cadastrado pode abrir um **Chamado de Zeladoria** informando o bairro, a categoria (`Iluminacao`, `Asfalto`, `Limpeza`, `Drenagem`), o logradouro, o ponto de referencia e a foto do problema.
2. Outros cidadaos visualizam os chamados abertos e registram seu **Voto no Chamado** (limitado a 1 voto por CPF em cada chamado), atribuindo um **Nivel de Urgencia de 1 a 5** e um relato curto.
3. O sistema calcula automaticamente o **Score de Prioridade** combinando o total de votos comunitarios, a media de urgencia e o indice de vulnerabilidade do bairro, ordenando uma fila publica e transparente para que o **Orgao Responsavel** (subprefeitura ou secretaria) emita e execute a **Ordem de Servico**.

---

## 2. Regras Obrigatorias da Global Solution (Leia Antes de Programar)

1. **Um Unico Dominio nas 3 Partes:**

   As entidades do sistema **precisam ser exatamente as mesmas** no **Banco de Dados (**`.sql`**)**, no **Java POO (Console)** e no **Front-end Web (JavaScript)**. O modelo de dados ja foi fechado e entregue na pasta `banco-de-dados/`. Portanto, o Java e o Front-end devem seguir rigorosamente as **7 entidades e atributos** descritos na Secao 3 deste documento.

2. **Sem Integracao entre as Partes:**

   Java, Banco de Dados e Web sao entregues separados dentro do mesmo repositorio/pacote `.zip`. **Nao e necessario** conectar o front-end ao Java nem conectar o Java ao banco SQL via JDBC.

3. **Tecnologias do Curso (Conteudo ate a Fase 4):**

   Tecnologias fora do conteudo visto no curso (como Spring Boot, Hibernate/JPA, Lombok no Java) nao pontuam.
   - **Banco de Dados:** SQL (Oracle SQL) + Diagrama ER.
   - **Java:** Java POO puro rodando no console (`Scanner`, `ArrayList`, camadas `model`, `service` e `view`).
   - **Web:** HTML5 semantico, CSS3 responsivo, JavaScript / React e Google Fonts (com persistencia em `localStorage`).

---

## 3. Dominio Unificado: As 7 Entidades do Sistema

A modelagem oficial do banco de dados ja esta pronta em `banco-de-dados/Zeladoria Ativa.pdf` e `banco-de-dados/script_zeladoria_ativa.sql`. Abaixo esta a tabela de equivalencia que deve ser seguida no **Java** e no **JavaScript**:

|  #  | Tabela no SQL       | Classe no Java (`model`) | Array no JS (`web`)  | Papel no Sistema                                                                              |
| :-: | :------------------ | :----------------------- | :------------------- | :-------------------------------------------------------------------------------------------- |
|  1  | `MUNICIPIO`         | `Municipio`              | `municipios`         | Cidade atendida (ex.: Sao Paulo - SP).                                                        |
|  2  | `BAIRRO`            | `Bairro`                 | `bairros`            | Bairro/distrito com regiao, populacao e indice de vulnerabilidade (1 a 5).                    |
|  3  | `CIDADAO`           | `Cidadao`                | `cidadaos`           | Pessoa fisica (CPF unico) que abre chamados ou vota em qualquer bairro.                       |
|  4  | `CHAMADO_ZELADORIA` | `ChamadoZeladoria`       | `chamadosZeladoria`  | Ocorrencia reportada na rua com protocolo, categoria, status e contador `totalVotos`.         |
|  5  | `VOTO_CHAMADO`      | `VotoChamado`            | `votosChamado`       | Voto individual de um cidadao em um chamado com `nivelUrgencia` (nota de 1 a 5).              |
|  6  | `ORGAO_RESPONSAVEL` | `OrgaoResponsavel`       | `orgaosResponsaveis` | Subprefeitura ou secretaria municipal que atende determinada especialidade.                   |
|  7  | `ORDEM_SERVICO`     | `OrdemServico`           | `ordensServico`      | Execucao do reparo pelo poder publico ligada ao chamado (1:1), com parecer e foto da solucao. |

### Valores Pre-Aceitos (Padronizacao de Strings / Enums)

Para manter consistencia total com as constraints `CHECK` do Banco de Dados, utilize exatamente estas strings no Java e no JS:

- `categoria` **(em** `ChamadoZeladoria`**) e** `especialidade` **(em** `OrgaoResponsavel`**):**
  - `"Iluminacao"`, `"Asfalto"`, `"Limpeza"`, `"Drenagem"`
- `status` **(em** `ChamadoZeladoria`**):**
  - `"Aberto"`, `"Em_Andamento"`, `"Resolvido"`
- `statusExecucao` **(em** `OrdemServico`**):**
  - `"Pendente"`, `"Equipe_Em_Campo"`, `"Concluida"`, `"Cancelada"`
- `indiceVulnerabilidade` **(em** `Bairro`**) e** `nivelUrgencia` **(em** `VotoChamado`**):**
  - Numeros inteiros estritamente entre `1` e `5`.

---

## 4. Guia para Desenvolver a Parte de Java POO (6 Pontos)

O sistema Java deve ser criado na pasta `java-console/` e rodar inteiramente no terminal (console).

### 4.1. Criterios de Avaliacao do Java (Rubrica FIAP)

- **Diagrama de Classes UML (1 pt):** Deve conter todas as classes (`model`, `service`, `view`), atributos, metodos e associacoes, batendo 100% com o codigo escrito. Exportar em PDF ou PNG.
- **Entidades Bem Modeladas (1 pt):** As 7 classes de dominio com todos os atributos `private`, construtores, `getters/setters`, `toString()` e associacoes entre objetos.
- **CRUD pelo Menu no Console (2 pts):** Cadastro, listagem, busca/filtro e atualizacao armazenando os dados em listas (`List` / `ArrayList`). A remocao (Delete) e o desafio extra e deve ser implementada.
- **Camadas Separadas (1 pt):** Separacao clara em pacotes `model` (entidades), `service` (regras de negocio, listas e validacoes) e `view` (`Main` com menu interativo e `Scanner`).
- **Validacoes (1 pt):** Tratamento de entradas invalidas no console (ex.: `try/catch (NumberFormatException)` ao ler numeros no `Scanner`, bloqueio de strings vazias e validacao de notas entre 1 e 5) com mensagens claras, sem o programa quebrar.

### 4.2. Estrutura de Pacotes Recomendada

```text
java-console/
└── src/
    └── br/com/fiap/zeladoria/
        ├── model/
        │   ├── Municipio.java
        │   ├── Bairro.java
        │   ├── Cidadao.java
        │   ├── ChamadoZeladoria.java
        │   ├── VotoChamado.java
        │   ├── OrgaoResponsavel.java
        │   └── OrdemServico.java
        ├── service/
        │   └── ZeladoriaService.java
        └── view/
            └── Main.java
```

### 4.3. Especificacao Exata dos Atributos das 7 Classes (`model`)

1. `Municipio.java`
   - `private int municipioId;`
   - `private String nome;`
   - `private String uf;`
   - `private String codigoIbge;`
2. `Bairro.java`
   - `private int bairroId;`
   - `private String nome;`
   - `private String regiao;`
   - `private int populacaoEstimada;`
   - `private int indiceVulnerabilidade;` _(1 a 5)_
   - `private Municipio municipio;` _(Associacao com Municipio)_
3. `Cidadao.java`
   - `private int cidadaoId;`
   - `private String nome;`
   - `private String cpf;`
   - `private String email;`
   - `private String telefone;`
   - `private String dataCadastro;`
4. `ChamadoZeladoria.java`
   - `private int chamadoId;`
   - `private String protocolo;` _(Gerado automaticamente pelo sistema no formato_ `ZEL-2026-0001`_)_
   - `private String titulo;`
   - `private String descricao;`
   - `private String categoria;` _(_`Iluminacao`_,_ `Asfalto`_,_ `Limpeza`_,_ `Drenagem`_)_
   - `private String logradouro;`
   - `private String numeroEndereco;`
   - `private String pontoReferencia;`
   - `private String urlFoto;` _(No console, armazena o nome/link da foto ou_ `"Sem foto"`_)_
   - `private String status;` _(_`Aberto`_,_ `Em_Andamento`_,_ `Resolvido`_)_
   - `private String dataAbertura;`
   - `private int totalVotos;` _(Inicia em 1 ao abrir o chamado e soma +1 a cada novo voto)_
   - `private Cidadao cidadaoAutor;` _(Associacao com Cidadao)_
   - `private Bairro bairro;` _(Associacao com Bairro)_
   - **Metodo de regra de negocio sugerido na classe:**
     ```java
     public int calcularScorePrioridade() {
         return (this.totalVotos * 10) + (this.bairro.getIndiceVulnerabilidade() * 5);
     }
     ```
5. `VotoChamado.java`
   - `private int votoId;`
   - `private String dataVoto;`
   - `private int nivelUrgencia;` _(Nota de 1 a 5)_
   - `private String comentario;`
   - `private ChamadoZeladoria chamado;` _(Associacao com ChamadoZeladoria)_
   - `private Cidadao cidadao;` _(Associacao com Cidadao)_
6. `OrgaoResponsavel.java`
   - `private int orgaoId;`
   - `private String nomeOrgao;`
   - `private String especialidade;` _(_`Iluminacao`_,_ `Asfalto`_,_ `Limpeza`_,_ `Drenagem`_)_
   - `private String telefoneContato;`
   - `private String emailOuvidoria;`
   - `private Municipio municipio;` _(Associacao com Municipio)_
7. `OrdemServico.java`
   - `private int ordemId;`
   - `private String numeroOs;` _(Gerado no formato_ `OS-2026-0001`_)_
   - `private String statusExecucao;` _(_`Pendente`_,_ `Equipe_Em_Campo`_,_ `Concluida`_,_ `Cancelada`_)_
   - `private String dataEmissao;`
   - `private String dataConclusao;`
   - `private String parecerTecnico;`
   - `private String urlFotoSolucao;`
   - `private ChamadoZeladoria chamado;` _(Associacao 1:1 com ChamadoZeladoria)_
   - `private OrgaoResponsavel orgao;` _(Associacao com OrgaoResponsavel)_

### 4.4. Regras de Negocio e Menu no `ZeladoriaService` e `Main`

- **Dados Iniciais Pre-Populados:** No construtor do `ZeladoriaService`, popule as listas `ArrayList` com os mesmos dados base do script SQL (Municipio de Sao Paulo, principais bairros, cidadaos, chamados, votos, orgaos e ordens de servico). Isso e essencial para demonstrar o sistema funcionando rapidamente no Video Pitch.
- **Geracao Automatica de Protocolo:** O usuario nao digita o protocolo; o sistema gera com `String.format("ZEL-2026-%04d", novoId)`.
- **Logica de Votacao (**`VotoChamado` **+** `totalVotos`**):**
  1. Ao registrar um voto em um chamado, verificar na lista `votos` se aquele `cidadaoId` ja votou naquele `chamadoId` (impedir voto duplicado da mesma pessoa no mesmo chamado).
  2. Validar se `nivelUrgencia` esta entre `1` e `5`.
  3. Adicionar o novo objeto `VotoChamado` na lista `votos` e incrementar `chamado.setTotalVotos(chamado.getTotalVotos() + 1)`.
  4. Criar metodo `calcularMediaUrgencia(int chamadoId)` que percorre os votos daquele chamado e retorna a media das notas de `1 a 5`.
- **Opcoes recomendadas para o Menu no Console (**`Main.java`**):**
  - `[1]` Listar Chamados por Ranking de Prioridade (ordenados por Score / Total de Votos e Media de Urgencia)
  - `[2]` Abrir Novo Chamado de Zeladoria (Create)
  - `[3]` Buscar e Filtrar Chamados (por Protocolo/ID, Bairro, Categoria ou Status) (Read)
  - `[4]` Registrar Voto de Urgencia em um Chamado (Create/Update)
  - `[5]` Atualizar Status de um Chamado / Emitir ou Concluir Ordem de Servico (Update)
  - `[6]` Remover Chamado Indevido ou Duplicado (Delete - Desafio Extra)
  - `[7]` Listar Bairros, Cidadaos, Orgaos Responsaveis e Ordens de Servico
  - `[0]` Sair

---

## 5. Guia para Desenvolver o Prototipo Web (5 Pontos)

O prototipo web deve ser criado na pasta `web/` utilizando **HTML5 semantico, CSS3 responsivo e JavaScript / React** (com Google Fonts).

### 5.1. Criterios de Avaliacao da Web (Rubrica FIAP)

- **Navegacao e HTML Semantico (1 pt):** Pelo menos **3 paginas HTML** ligadas por um menu identico em todas, utilizando tags semanticas (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- **Interatividade com Dados no DOM (2 pts):** Dados do dominio armazenados em arrays de objetos no JavaScript (`municipios`, `bairros`, `cidadaos`, `chamadosZeladoria`, `votosChamado`, `orgaosResponsaveis`, `ordensServico`), exibidos e filtrados dinamicamente na pagina via manipulacao do DOM.
- **Formulario com Validacao em JS (1 pt):** Campos obrigatorios validados via JavaScript na abertura de chamado, exibindo mensagens de erro ou confirmacao **na propria pagina (no DOM)**, sem depender apenas de `alert()`.
- **Responsivo e Bem Desenhado (1 pt):** Layout adaptavel para celular e desktop (Flexbox/Grid e `@media` queries), com bom contraste e legibilidade.

### 5.2. As 3 Paginas Oigatorias

1. `index.html` **(Home e Visao Geral):**
   - Apresentacao da proposta do Zeladoria Ativa, contadores gerais de impacto (chamados abertos, votos registrados, ordens de servico concluidas), destaque dos chamados mais urgentes e explicacao dos ODS 9 e 11.
2. `chamados.html` **(Painel de Chamados, Filtros e Votacao no DOM):**
   - Filtros funcionando em tempo real no DOM: busca por texto/protocolo, filtro por Bairro, por Categoria (`Iluminacao`, `Asfalto`, `Limpeza`, `Drenagem`), por Status (`Aberto`, `Em_Andamento`, `Resolvido`) e ordenacao por Score/Votos.
   - Botao em cada card permitindo votar no chamado informando a nota de urgencia (`1 a 5`) e atualizando o contador `totalVotos` e a media de urgencia na tela imediatamente (salvando no `localStorage`).
3. `novo-chamado.html` **(Formulario de Abertura de Chamado com Validacao JS):**
   - Formulario com validacao de todos os campos obrigatorios (dados do cidadao, selecao de bairro e categoria, titulo, logradouro, numero, ponto de referencia, descricao, nivel de urgencia inicial de 1 a 5 e anexo opcional de foto via `FileReader`).
   - Ao validar com sucesso, gera o protocolo automatico (`ZEL-2026-XXXX`), salva no `localStorage` e exibe a confirmacao na propria pagina.

---

## 6. Estrutura Final do Repositorio e Entrega (`.zip`)

```text
ZeladoriaAtiva/
├── banco-de-dados/
│   ├── script_zeladoria_ativa.sql   # Script Oracle SQL (DDL + DML + SELECTs com JOIN) [PRONTO]
│   ├── Zeladoria Ativa.pdf          # Diagrama Entidade-Relacionamento em PDF [PRONTO]
│   └── Zeladoria Ativa.png          # Diagrama Entidade-Relacionamento em PNG [PRONTO]
├── java-console/                    # Projeto Java POO no console + Diagrama UML [A FAZER]
├── web/                             # Prototipo HTML5 + CSS3 + JS puro [A FAZER]
├── integrantes_e_pitch.txt          # Nome do grupo, Nome + RM dos integrantes e Link do Pitch [A FAZER]
└── README.md                        # Documentacao unificada do projeto
```

---

## 7. Declaracao de Uso de IA Generativa

Em conformidade com as diretrizes da Global Solution 2026/2 da FIAP, declaramos que ferramentas de Inteligencia Artificial Generativa foram utilizadas exclusivamente como apoio para pesquisa de contexto urbano, revisao textual da documentacao, padronizacao de dados de exemplo (bairros de Sao Paulo) e explicacao de conceitos. Todo o modelo de dominio, regras de negocio e codigos foram revisados, validados e compreendidos integralmente pelos integrantes do grupo.
