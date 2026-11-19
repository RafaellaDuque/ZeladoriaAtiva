/**
 * Revelação suave ao entrar na viewport.
 *
 * Um único IntersectionObserver é compartilhado por todos os elementos (em vez
 * de um observer por card). O elemento recebe a classe `revelar` do CSS, que só
 * esconde o conteúdo quando `<html class="js">` está presente — assim, sem JS ou
 * com "reduzir movimento" ativado, nada fica invisível.
 */
import { useEffect, useRef } from 'react';

let observador = null;

const prefereReduzirMovimento = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function obterObservador() {
  if (observador || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return observador;
  }

  observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('revelar--visivel');
        observador.unobserve(entrada.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  );

  return observador;
}

/** Registra um elemento; devolve a função de limpeza. */
export function registrarRevelar(elemento, atraso = 0) {
  if (!elemento) return () => {};

  if (prefereReduzirMovimento() || !('IntersectionObserver' in window)) {
    elemento.classList.add('revelar--visivel');
    return () => {};
  }

  elemento.style.setProperty('--atraso', `${atraso}ms`);
  elemento.classList.add('revelar');

  const obs = obterObservador();
  obs.observe(elemento);

  return () => obs.unobserve(elemento);
}

/** Hook: devolve a ref para colocar no elemento que deve revelar. */
export function useRevelar(atraso = 0) {
  const ref = useRef(null);

  useEffect(() => {
    const limpar = registrarRevelar(ref.current, atraso);
    return () => limpar();
  }, [atraso]);

  return ref;
}
