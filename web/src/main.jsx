/**
 * Ponto de entrada único das 3 páginas.
 *
 * O Vite injeta este arquivo em index.html, chamados.html e novo-chamado.html;
 * a página renderizada é escolhida por `<body data-pagina="...">`, o que evita
 * um roteador e mantém URLs reais (funciona em GitHub Pages e em file://).
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/estilo.css';
import AppProvider from './app/AppProvider.jsx';
import ChamadosPage from './pages/ChamadosPage.jsx';
import HomePage from './pages/HomePage.jsx';
import NovoChamadoPage from './pages/NovoChamadoPage.jsx';

const PAGINAS = {
  home: HomePage,
  chamados: ChamadosPage,
  novo: NovoChamadoPage,
};

const chave = document.body.dataset.pagina ?? 'home';
const Pagina = PAGINAS[chave] ?? HomePage;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <Pagina />
    </AppProvider>
  </StrictMode>
);
