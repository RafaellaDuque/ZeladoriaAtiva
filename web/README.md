# Zeladoria Ativa — Protótipo Web (React + Vite)

Front-end do projeto **Zeladoria Ativa — Priorização Comunitária de Problemas Urbanos**
(Global Solution 2026/2 · FIAP · 2ESOR).

**Stack:** React 19 + Vite 7, HTML5 semântico e o mesmo CSS3 do design system.
Sem biblioteca de UI, sem roteador e sem backend: os dados vivem em 7 arrays de objetos
espelhando as 7 tabelas do Oracle, persistidos no `localStorage`.

---

## Como abrir

| Cenário | Passos |
| :-- | :-- |
| **Duplo clique (sem servidor)** | Abra `dist/index.html`. A build tem JS e CSS **embutidos** no HTML, então funciona em `file://`. |
| **GitHub Pages** | Settings → Pages → branch `main`, pasta **`/web/dist`**. `base: './'` mantém os caminhos relativos. |
| **Desenvolvimento (HMR)** | `npm install` → `npm run dev` → `http://localhost:5173` |
| **Preview da build** | `npm run build` → `npm run preview` → `http://localhost:4173` |

### Por que existe um `dist/` versionado

Um build Vite padrão gera `<script type="module" src="./assets/index-abc.js">`. Em `file://`
o Chrome bloqueia o carregamento desse módulo externo (origem `null`), e a página abriria em
branco. Por isso o build roda um passo extra (`scripts/html-embutido.mjs`) que **embute o JS e
o CSS dentro de cada HTML**. O resultado são três arquivos autossuficientes (~330 KB cada,
React incluso) que funcionam no disco, em servidor local e no GitHub Pages.

O `scripts/build.mjs` compila **uma página por vez** com `inlineDynamicImports`, senão o
Rollup extrairia o código compartilhado para um chunk separado — de novo um módulo externo.

---

## Estrutura

```text
web/
├── index.html                 # Entrada Vite (body data-pagina="home")
├── chamados.html              # Entrada Vite → ChamadosPage
├── novo-chamado.html          # Entrada Vite → NovoChamadoPage
├── vite.config.js             # base: './' · 3 entradas · plugin de inline
├── package.json
├── scripts/
│   ├── build.mjs              # build página por página (bundle único)
│   └── html-embutido.mjs      # pós-build: JS/CSS dentro do HTML
├── public/assets/img/         # cenas urbanas em SVG (copiadas como estão)
├── src/
│   ├── main.jsx               # escolhe a página por <body data-pagina>
│   ├── app/AppProvider.jsx    # contexto: estado dos 7 arrays + ações + localStorage
│   ├── data/
│   │   ├── seed.js            # os 7 arrays (cópia literal do script SQL)
│   │   ├── mapa-municipio.js  # contorno do município (malha do IBGE) do hero
│   │   └── storage.js         # chaves, leitura, gravação, restauração
│   ├── domain/
│   │   ├── zeladoria.js       # regras de negócio (funções puras)
│   │   └── format.js          # datas, números pt-BR, normalização, classes CSS
│   ├── components/            # Layout, Header, Footer, cards, painel de votação…
│   ├── pages/                 # HomePage, ChamadosPage, NovoChamadoPage
│   ├── styles/estilo.css      # design system completo (tokens → media queries)
│   └── utils/                 # máscaras de CPF/telefone e compressão de imagem
└── dist/                      # build versionada (abre por duplo clique)
```

Sem `react-router`: as 3 telas são HTMLs reais (`index.html`, `chamados.html`,
`novo-chamado.html`), o que preserva URLs limpas na rubrica e dispensa servidor com rewrite.

---

## Domínio unificado: 7 arrays ⇄ 7 tabelas Oracle

| Tabela SQL | Export em `src/data/seed.js` | Registros |
| :-- | :-- | :-- |
| `MUNICIPIO` | `municipios` | 1 |
| `BAIRRO` | `bairros` | 25 (Zona Sul, Leste, Norte, Oeste e Centro) |
| `CIDADAO` | `cidadaos` | 5 |
| `CHAMADO_ZELADORIA` | `chamadosZeladoria` | 5 |
| `VOTO_CHAMADO` | `votosChamado` | 12 |
| `ORGAO_RESPONSAVEL` | `orgaosResponsaveis` | 5 |
| `ORDEM_SERVICO` | `ordensServico` | 2 |

Valores de string idênticos às constraints `CHECK` do banco:

- `categoria` / `especialidade`: `Iluminacao` · `Asfalto` · `Limpeza` · `Drenagem`
- `status`: `Aberto` · `Em_Andamento` · `Resolvido`
- `statusExecucao`: `Pendente` · `Equipe_Em_Campo` · `Concluida` · `Cancelada`
- `indiceVulnerabilidade` e `nivelUrgencia`: inteiros de 1 a 5

> Nomes próprios (bairros, títulos) estão **sem acento** porque são cópia literal do script
> SQL — a sincronização com o banco é item avaliado. Já os textos de interface (rótulos,
> títulos de seção) estão acentuados normalmente.

---

## Regras de negócio (`src/domain/zeladoria.js`)

```js
scorePrioridade = (chamado.totalVotos * 10) + (bairro.indiceVulnerabilidade * 5)
mediaUrgencia   = média aritmética dos nivelUrgencia daquele chamado (1 a 5)
```

Todas as funções são **puras**: recebem o estado (`dados`) e devolvem `{ ok, dados, ... }`.
O `AppProvider` troca o estado e um `useEffect` espelha no `localStorage` — é isso que faz o
React recalcular as métricas do card no mesmo render em que o voto entra.

- **1 voto por CPF em cada chamado** (constraint `UK_VOTO_UNICO_POR_CIDADAO`): o card mostra
  quem já votou e troca o formulário por um aviso, sem depender só do back-end.
- **Protocolo automático** `ZEL-2026-XXXX` a partir do maior existente.
- **Voto inicial na abertura**: o chamado nasce com `totalVotos = 1` e um registro em
  `votosChamado`.
- **Score, média e contadores** nunca são gravados "à mão": são derivados a cada render.

---

## O que cada tela faz

**`index.html`** — hero com o **mapa do município de São Paulo**: um pontinho por voto
registrado em `votosChamado`, numa vaga da zona do bairro votado (Norte, Sul, Leste, Oeste ou
Centro). Cada ponto surge como alerta — entra do zero e solta uma onda recortada pelo contorno
do município. Ao lado do mapa, na coluna livre, um card mostra **um chamado recente** ligado ao
ponto por uma linha (título, autor, bairro, categoria e protocolo vêm dos arrays; o "novo
chamado" do selo é encenação de atividade). 4 indicadores calculados; Top 3
(`Aberto`/`Em_Andamento`) com protocolo, bairro, zona, vulnerabilidade, votos, média e score;
acompanhamento de ordens de serviço (OS + órgão + chamado + dias até a resolução); bloco dos
ODS 11 (11.1 e 11.3) e 9 (9.1 e 9.5).

Duas seções usam fundo escuro (`.secao--tom` na fila, `.secao--escura` no ODS), com a mesma
malha e o mesmo degradê do hero — os cards da fila viram vidro e os selos ganham versões
saturadas, em vez dos tons pastéis. Os indicadores ficam claros, numa faixa editorial: quatro
colunas separadas por filetes finos, com o número grande à frente e nenhuma caixa em volta.
O restante da página e o painel de chamados continuam claros.

**`chamados.html`** — filtros combinados em tempo real (texto, zona, bairro, categoria,
status) + ordenação, contador de resultados e "limpar filtros"; cards com foto, badges,
endereço, vulnerabilidade, métricas, OS vinculada, últimos relatos e votação de urgência
1–5 com relato opcional. O select "Votando como" aplica a regra de 1 voto por CPF.
Link direto: `chamados.html?protocolo=ZEL-2026-0002` filtra e destaca o card.

**`novo-chamado.html`** — três blocos (cidadão, localização/classificação, detalhes/evidência),
máscaras de CPF e telefone, contador de caracteres, upload com validação de tipo/tamanho
(máx. 2 MB) e preview via `FileReader`. Validação **sem `alert()`**: cada erro aparece em
`<small class="erro-campo">` abaixo do campo, com `aria-invalid`. Sucesso → card de confirmação
com protocolo, resumo (bairro, categoria, urgência, data, score) e botão para o painel.

Rodapé das 3 telas: **Restaurar dados de demonstração** (confirmação inline, reseta o
`localStorage` para o script SQL original).

---

## Verificação realizada

- Console limpo (0 erros / 0 avisos) nas 3 telas buildadas.
- Hero: o mapa é derivado de `votosChamado` (12 pontos no seed) e todo ponto cai **dentro** do
  contorno do município (conferido com `isPointInFill` do próprio SVG). Registrando um voto,
  sobe para 13 pontos, o novo ponto entra com a animação de alerta e o KPI "Votos comunitários"
  acompanha; o `aria-label` do mapa anuncia a mesma contagem.
- Mapa alinhado à coluna de conteúdo: a borda direita do mapa coincide com a borda direita do
  container (1.160 px) em 1.280, 1.440 e 1.920 px de largura. O card de atividade fica na coluna
  livre à esquerda do contorno, com folga de 15 px até o mapa nas três larguras medidas.
- Abaixo de 1.080 px o hero vira uma coluna só e **o mapa sai de cena** (`display: none`), junto
  com o card e a linha — em 390, 768 e 1.024 px sobrou só o texto, sem rolagem horizontal.
- Build conferida por `file://` com captura de erro no topo do HTML: 0 exceções, 12 pontos,
  54 animações rodando.
- **Abre por duplo clique**: `dist/index.html`, `dist/chamados.html` e
  `dist/novo-chamado.html` renderizam em `file://` (testado com Chrome headless); imagens
  relativas em `assets/img/` carregam com HTTP 200 no servidor.
- Sem rolagem horizontal em **360, 390, 768 e 1024 px** (probe medindo
  `scrollWidth` × `innerWidth` com iframe de largura fixa).
- Votação: `totalVotos` 3 → 4, média 5,0 → 4,8, score 55 → 65, `localStorage` atualizado;
  voto duplicado e nota fora de 1–5 bloqueados com mensagem.
- Filtros: "zona leste" → 2; Zona Norte → 1 (e o select de bairro cai para 5 opções);
  limpar → 5.
- Formulário vazio → 11 mensagens inline, nenhum `alert`, nenhum reload; envio válido com
  foto → protocolo `ZEL-2026-0006`, foto comprimida no canvas para ~3 KB, cidadão criado.
- `npm run dev` serve as 3 páginas (HTTP 200) e renderiza os 5 cards / 4 indicadores.

---

## Escala da interface

Todo o dimensionamento fica em **dois tokens** no `:root` de `src/styles/estilo.css`, com um
degrau extra no desktop:

```css
/* base (mobile e tablet) */
--escala: 0.875;         /* tipografia de destaque: h1-h3, KPIs, score do ranking */
--escala-espaco: 0.85;   /* respiros: padding das seções/cards, gaps e margens */

/* @media (min-width: 1024px) — mais denso no desktop */
--escala: 0.8;
--escala-espaco: 0.74;
```

`1` é a escala original. Um fator menor compacta o site inteiro sem tocar em cores, hover
ou ícones. O container é `max-width: 1160px` e o cabeçalho tem 64px de altura.

Valores medidos em 1280 / 1512 / 1920px (iguais a partir de 1280, como esperado num layout
com largura máxima):

| Medida | Original | Antes | Agora |
| :-- | --: | --: | --: |
| H1 do hero | 48 px | 42 px | **38,4 px** |
| H2 das seções | 34 px | 29,4 px | **26,9 px** |
| Parágrafo | 17 px | 16 px | **16 px** |
| Valor dos KPIs | 38 px | 33,6 px | **30,7 px** |
| Padding das seções | 72 px | 61 px | **53 px** |
| Padding do hero | 76 px | 65 px | **88–128 px** (clamp por altura da janela) |
| Container | 1.200 px | 1.200 px | **1.160 px** |
| Altura da home | 4.149 px | 3.825 px | **3.726 px** (−10%) |

O botão tem `min-height: max(44px, …)` para a área de toque nunca ficar abaixo do mínimo de
acessibilidade, mesmo com a escala reduzida.

---

## Animações de scroll

Revelação discreta: o bloco sobe 14px e aparece em 0,55s (`src/utils/revelar.js`).

- **Um único** `IntersectionObserver` compartilhado por todos os elementos (não um por card).
- Os cards entram em cascata de 60–80ms; cada seção revela o título primeiro.
- Aplicado a: cabeçalhos de seção, cards de indicadores, Top 3, ordens de serviço, cards de
  chamado e cartões laterais do painel. **O hero e a página de abertura de chamado não entram
  nessa revelação** — são telas de leitura e de foco, onde ela atrapalha. O hero tem uma
  animação própria, de alerta: cada ponto do mapa entra com escala a partir de zero
  (`mapa-surge`) e solta uma onda recortada pelo contorno do município (`mapa-onda`), com
  atrasos distintos para não piscarem em sincronia. O card de atividade tem ciclo de 7,2 s
  (`alerta-card` / `alerta-linha`), igual ao relógio que troca o chamado em cena no
  componente — se mudar um, mude o outro.
- **Nada fica invisível sem JS**: o CSS só esconde quando `<html class="js">` existe (a
  classe é adicionada por um script no `<head>`). Sem `IntersectionObserver` no navegador,
  o elemento é exibido na hora.
- `prefers-reduced-motion: reduce` desliga a animação por completo.

---

## Onde editar

| O quê | Onde |
| :-- | :-- |
| Cores, tipografia, espaçamentos | `src/styles/estilo.css`, bloco `:root` |
| **Escala geral do site** | `src/styles/estilo.css`, tokens `--escala` e `--escala-espaco` |
| Dados de demonstração | `src/data/seed.js` |
| Regras de cálculo | `src/domain/zeladoria.js` |
| Ícones SVG | `src/components/Icon.jsx` |
| Contorno do mapa do hero | `src/data/mapa-municipio.js` (gerado da malha do IBGE) |
| Textos e estrutura de cada tela | `src/pages/*.jsx` |

Depois de qualquer alteração no código-fonte, rode `npm run build` para regerar `dist/`.
