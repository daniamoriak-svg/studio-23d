import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./contacts.module.css";

const contactEmail = "hello@studio-23d.com";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Свяжитесь со студией 2И3Д, чтобы обсудить новый проект или сотрудничество.",
};

export default function ContactsPage() {
  return (
    <main className={styles.page}>
      <section className={styles.panel} aria-labelledby="contacts-title">
        <header className={styles.header}>
          <Link
            className={styles.logo}
            href="/#showreel"
            aria-label="2И3Д — шоурил"
          >
            <Image
              src="/logo.png"
              alt="2И3Д"
              fill
              sizes="42px"
              preload
            />
          </Link>

          <nav className={styles.nav} aria-label="Основная навигация">
            <Link href="/#showreel">Шоурил</Link>
            <Link href="/#work">Работы</Link>
            <span aria-current="page">Контакты</span>
          </nav>
        </header>

        <div className={styles.content}>
          <div className={styles.intro}>
            <p className={styles.eyebrow}>СТУДИЯ 2И3Д · КОНТАКТЫ</p>
            <h1 id="contacts-title">Давайте обсудим<span>.</span></h1>
            <p className={styles.lead}>
              Есть идея или проект? Расскажите, над чем вы работаете, —
              вместе найдём лучшее решение.
            </p>
          </div>

          <a className={styles.emailLink} href={`mailto:${contactEmail}`}>
            <span className={styles.cardLabel}>НОВЫЕ ПРОЕКТЫ И СОТРУДНИЧЕСТВО</span>
            <span className={styles.email}>{contactEmail}</span>
            <span className={styles.arrow} aria-hidden="true">↗</span>
          </a>

          <footer className={styles.footer}>
            <span>2И3Д</span>
            <Link href="/#showreel">К ШОУРИЛУ ↑</Link>
          </footer>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <Image
            src="/contact-halftone.svg"
            alt=""
            fill
            sizes="(max-width: 760px) 100vw, 60vw"
            className={styles.visualImage}
          />
          <p className={styles.visualNote}>ИССЛЕДУЕМ ГРАНИЦЫ ВОЗМОЖНОГО</p>
        </div>
      </section>
    </main>
  );
}
