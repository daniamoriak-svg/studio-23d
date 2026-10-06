import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProjectTransitionLink } from "../../project-transition";
import styles from "./project.module.css";

export const metadata: Metadata = {
  title: "МТС — истории в движении",
  description:
    "Видеопроект 2И3Д для МТС: яркие визуальные истории о технологиях, людях и повседневной жизни.",
};

export default function MtsProjectPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="project-title">
        <video
          className={styles.heroVideo}
          src="/mts-project/mts-generic.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Видеофрагмент проекта МТС"
        />
        <div className={styles.heroShade} aria-hidden="true" />

        <header className={styles.header}>
          <ProjectTransitionLink
            className={styles.logo}
            href="/#showreel"
            ariaLabel="2И3Д — шоурил"
          >
            <Image src="/logo.png" alt="" width={56} height={62} priority />
          </ProjectTransitionLink>
          <nav className={styles.navigation} aria-label="Навигация по сайту">
            <ProjectTransitionLink href="/#work">Работы</ProjectTransitionLink>
            <Link href="/contacts">Контакты</Link>
          </nav>
        </header>

        <div className={styles.heroCopy}>
          <p className={styles.kicker}>2И3Д / ВИДЕОПРОИЗВОДСТВО</p>
          <h1 id="project-title">
            МТС<span>.</span>
            <br />
            Ближе к жизни
          </h1>
          <div className={styles.heroBottom}>
            <span>Серия визуальных историй</span>
            <span>Смотреть проект ↓</span>
          </div>
        </div>
      </section>

      <section className={styles.intro} aria-labelledby="intro-title">
        <div className={styles.introHeading}>
          <p className={styles.eyebrow}>О ПРОЕКТЕ</p>
          <h2 id="intro-title">
            Технологии
            <br />
            начинаются
            <br />
            с человека.
          </h2>
        </div>
        <div className={styles.introText}>
          <p>
            Для МТС мы собрали серию коротких историй о моментах, в которых
            технологии становятся частью жизни. От большого городского ритма до
            важных перемен — каждый эпизод раскрывает свой характер и настроение.
          </p>
          <div className={styles.projectFacts}>
            <div>
              <span>КЛИЕНТ</span>
              <strong>МТС</strong>
            </div>
            <div>
              <span>ФОРМАТ</span>
              <strong>Видеоролики</strong>
            </div>
            <div>
              <span>СТУДИЯ</span>
              <strong>2И3Д</strong>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.feature} aria-labelledby="feature-title">
        <div className={styles.featureHeading}>
          <div>
            <p className={styles.eyebrow}>01 / ВИДЕО</p>
            <h2 id="feature-title">Мир в движении</h2>
          </div>
          <Image
            className={styles.mtsLogo}
            src="/mts-project/mts-logo.png"
            alt="Логотип МТС"
            width={500}
            height={500}
          />
        </div>
        <video
          className={styles.featureVideo}
          src="/mts-project/mts-phone.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Видеофрагмент МТС — тянется к телефону"
        />
        <p className={styles.caption}>
          Короткая история о любопытстве, импульсе и привычке всегда быть на связи.
        </p>
      </section>

      <section className={styles.medicine} aria-labelledby="medicine-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>02 / СЕРИЯ</p>
          <h2 id="medicine-title">Забота — тоже связь.</h2>
          <p>
            Два эпизода из медицинской серии: внимательные детали, выразительный
            свет и истории, в которых важна каждая секунда.
          </p>
        </div>
        <div className={styles.videoGrid}>
          <figure>
            <video
              src="/mts-project/mts-medicine-01.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Первый видеофрагмент медицинской серии МТС"
            />
            <figcaption>Эпизод 01</figcaption>
          </figure>
          <figure>
            <video
              src="/mts-project/mts-medicine-02.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Второй видеофрагмент медицинской серии МТС"
            />
            <figcaption>Эпизод 02</figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.closing} aria-label="Вернуться к работам">
        <p>Продолжаем придумывать истории.</p>
        <ProjectTransitionLink href="/#work">
          Смотреть другие проекты ↗
        </ProjectTransitionLink>
      </section>

      <footer className={styles.footer}>
        <ProjectTransitionLink href="/#showreel">2И3Д</ProjectTransitionLink>
        <span>МТС · Видеопроект</span>
        <Link href="/contacts">Связаться с нами ↗</Link>
      </footer>
    </main>
  );
}
