import Image from "next/image";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container site-footer__inner">
        <div>
          <div className="site-footer__brand"><span className="site-brand__logo"><Image src="/copa-atahualpa.jpg" alt="" width={48} height={48} /></span><strong>COPA ATAHUALPA</strong></div>
          <p>El torneo se vive en cada encuentro.</p>
        </div>
        <nav aria-label="Navegación del pie de página">
          <a href="/">Inicio</a>
          <a href="/standings">Posiciones</a>
          <a href="/matches/today">Partidos de hoy</a>
          <a href="/matches/previous">Resultados</a>
        </nav>
      </div>
      <div className="site-container site-footer__bottom">
        <span>© 2026 Copa Atahualpa</span>
        <span>Desarrollado por AKHSELdev</span>
      </div>
    </footer>
  );
}
