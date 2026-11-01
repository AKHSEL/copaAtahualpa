import type { ReactNode } from "react";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
};

export function PageIntro({ eyebrow, title, description, aside }: PageIntroProps) {
  return (
    <section className="page-intro">
      <div className="site-container page-intro__inner">
        <div>
          <p className="eyebrow eyebrow--light">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="page-intro__description">{description}</p>
        </div>
        {aside && <div className="page-intro__aside">{aside}</div>}
      </div>
    </section>
  );
}
