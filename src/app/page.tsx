"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useProjectTransition } from "./project-transition";

const projects = [
  { name: "FORMA", category: "Айдентика", color: "#d8cec0" },
  { name: "NORD", category: "Объекты", color: "#455747" },
  { name: "PULSE", category: "Цифровые проекты", color: "#bcc8ee" },
  { name: "TYPE / 01", category: "Айдентика", color: "#e59872" },
  { name: "ORBIT", category: "Цифровые проекты", color: "#292d48" },
  { name: "МТС УЖЕ 5G", category: "ИИ-ролики", color: "#e32636" },
  { name: "MONO", category: "Айдентика", color: "#d5d5ce" },
  { name: "COAST", category: "Моушн-дизайн", color: "#8ea9b1" },
  { name: "AMBER", category: "3D-графика", color: "#a85f34" },
  { name: "ARCHIVE", category: "Моушн-дизайн", color: "#3d394c" },
  { name: "VERT", category: "Цифровые проекты", color: "#a4b69b" },
  { name: "SILOS", category: "Айдентика", color: "#c2bcba" },
];

const categories = [
  "Все",
  "ИИ-ролики",
  "3D-графика",
  "Айдентика",
  "Цифровые проекты",
  "Моушн-дизайн",
  "Объекты",
];

export default function Home() {
  const { navigateWithTransition } = useProjectTransition();
  const [category, setCategory] = useState("Все");
  const [selected, setSelected] = useState(5);
  const [isShowreelVisible, setIsShowreelVisible] = useState(true);

  const sceneRef = useRef<HTMLDivElement>(null);
  const projectTabsRef = useRef<HTMLElement>(null);
  const activeProjectTabRef = useRef<HTMLButtonElement>(null);
  const showreelRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLButtonElement[]>([]);
  const wheelTime = useRef(0);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startIndex: number;
    stepX: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const layoutReady = useRef(false);

  const visibleProjects = projects.filter(
    (project) => category === "Все" || project.category === category
  );

  const activeIndex = Math.min(selected, visibleProjects.length - 1);
  const previousActiveIndex = useRef(activeIndex);

  useEffect(() => {
    const tabs = projectTabsRef.current;
    const activeTab = activeProjectTabRef.current;

    if (
      !tabs ||
      !activeTab ||
      !window.matchMedia("(max-width: 760px)").matches
    ) {
      return;
    }

    const tabsBounds = tabs.getBoundingClientRect();
    const activeTabBounds = activeTab.getBoundingClientRect();

    tabs.scrollTo({
      left:
        tabs.scrollLeft +
        activeTabBounds.left -
        tabsBounds.left -
        (tabs.clientWidth - activeTab.clientWidth) / 2,
      behavior: "smooth",
    });
  }, [activeIndex, category]);

  useEffect(() => {
    const showreel = showreelRef.current;
    if (!showreel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsShowreelVisible(entry.intersectionRatio > 0.05);
      },
      { threshold: [0, 0.05] }
    );

    observer.observe(showreel);
    return () => observer.disconnect();
  }, []);

  function changeProject(direction: number) {
    setSelected((current) =>
      Math.max(0, Math.min(visibleProjects.length - 1, current + direction))
    );
  }

  // Плавное перемещение и раскрытие карточек.
  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const cardElements = Array.from(
      scene.querySelectorAll<HTMLButtonElement>(".project-card")
    );

    const faceElements = cardElements
      .map((card) => card.querySelector(".card-face"))
      .filter((face): face is Element => face !== null);

    const arrange = (instant = false) => {
      const mobile = window.innerWidth <= 760;
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const cardWidth = cardElements[0]?.offsetWidth ?? 480;
      const stepX = mobile ? cardWidth * 0.92 : cardWidth * 0.15;
      const stepY = mobile ? 0 : cardWidth * -0.065;
      const activeGap = mobile ? 0 : cardWidth * 1.1;

      const duration =
        instant || reducedMotion || !layoutReady.current ? 0 : 0.95;
      const movingBackward = activeIndex < previousActiveIndex.current;

      cardElements.forEach((card, index) => {
        const distance = index - activeIndex;
        const isActive = distance === 0;
        const side = Math.sign(distance);

        const x = distance * stepX + side * activeGap;
        const y = distance * stepY - side * activeGap * 0.25;
        const z = -Math.abs(distance) * (mobile ? 0 : 18);

        const zIndex = isActive
          ? movingBackward && duration > 0
            ? 50
            : 100
          : 50 - distance;
        card.style.zIndex = String(zIndex);

        gsap.to(card, {
          x,
          y,
          z,
          rotationX: mobile ? 0 : isActive ? 0 : 3,
          rotationY: mobile ? 0 : isActive ? -3 : -7,
          rotationZ: 0,
          scale: mobile
            ? 1
            : isActive
              ? 1.5
              : Math.max(0.65, 1 - Math.abs(distance) * 0.055),
          duration,
          ease: "power3.inOut",
          overwrite: "auto",
          onComplete:
            index === cardElements.length - 1
              ? () => {
                  cardElements.forEach((element, cardIndex) => {
                    const cardDistance = cardIndex - activeIndex;
                    element.style.zIndex = String(
                      cardDistance === 0
                        ? 100
                        : 50 - cardDistance
                    );
                  });
                }
              : undefined,
        });

        const face = card.querySelector(".card-face");

        if (face) {
          const blur = Math.min(2, Math.abs(distance) * 0.45);

          gsap.to(face, {
            filter: `blur(${blur}px)`,
            duration,
            ease: "power2.inOut",
            overwrite: "auto",
          });
        }
      });

      layoutReady.current = true;
      previousActiveIndex.current = activeIndex;
    };

    arrange();
    const onResize = () => arrange(true);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);

      // Останавливаем анимации, но сохраняем текущие позиции.
      // Следующее движение начнётся отсюда, без сброса.
      gsap.killTweensOf(cardElements);
      gsap.killTweensOf(faceElements);
    };
  }, [activeIndex, category]);

  // Переключаем карточки только горизонтальным жестом тачпада над карточкой.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const onWheel = (event: WheelEvent) => {
      if (
        event.ctrlKey ||
        Math.abs(event.deltaX) <= Math.abs(event.deltaY) ||
        Math.abs(event.deltaX) < 8 ||
        !(event.target instanceof Element) ||
        !event.target.closest(".project-card")
      ) {
        return;
      }

      const direction = Math.sign(event.deltaX);
      const atEdge =
        (direction < 0 && activeIndex === 0) ||
        (direction > 0 && activeIndex === visibleProjects.length - 1);

      if (atEdge) return;

      event.preventDefault();

      const now = Date.now();

      // Одна серия событий от жеста тачпада переключает только одну карточку.
      if (now - wheelTime.current < 500) return;

      wheelTime.current = now;
      setSelected((current) =>
        Math.max(
          0,
          Math.min(visibleProjects.length - 1, current + direction)
        )
      );
    };

    scene.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      scene.removeEventListener("wheel", onWheel);
    };
  }, [activeIndex, visibleProjects.length]);

  function startCardDrag(
    event: ReactPointerEvent<HTMLButtonElement>
  ) {
    if (!event.isPrimary || event.button !== 0) return;

    const mobile = window.innerWidth <= 760;
    const cardWidth = event.currentTarget.offsetWidth;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startIndex: activeIndex,
      stepX: cardWidth * (mobile ? 0.92 : 1.25),
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveCardDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    if (Math.abs(deltaX) < 8) return;

    drag.moved = true;
    const offset = Math.round(-deltaX / drag.stepX);
    setSelected(
      Math.max(0, Math.min(visibleProjects.length - 1, drag.startIndex + offset))
    );
  }

  function endCardDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    dragRef.current = null;
    if (drag.moved) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  }

  return (
    <main className="home-page">
      <header
        className={`site-header${isShowreelVisible ? " showreel-visible" : ""}`}
      >
        <Link
          className="studio-logo"
          href="/#showreel"
          aria-label="Вернуться к шоурилу"
          onClick={(event) => {
            if (window.location.pathname === "/") {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <Image
            src="/logo.png"
            alt="2И3Д"
            fill
            sizes="70px"
            preload
            className="studio-logo-image"
          />
        </Link>

        <nav className="main-navigation" aria-label="Основная навигация">
          <a href="#showreel">Шоурил</a>
          <a href="#work">Работы</a>
          <Link href="/contacts">Контакты</Link>
        </nav>
      </header>

      <section
        ref={showreelRef}
        className="showreel-section"
        id="showreel"
        aria-labelledby="showreel-title"
      >
        <div className="showreel-frame">
          <video
            className="showreel-video"
            src="/showreel.mp4"
            poster="/showreel-poster.svg"
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
            aria-label="Шоурил студии 2И3Д"
          />
          <h1 id="showreel-title" className="showreel-title">
            ШОУРИЛ <span>2026</span>
          </h1>
        </div>

        <a className="showreel-scroll" href="#work">
          ПРОКРУТИТЕ ВНИЗ <span aria-hidden="true">↓</span>
        </a>
      </section>

      <section className="portfolio" id="work" aria-label="Избранные работы">
        <div className="mobile-portfolio-heading">
          <span>ПОРТФОЛИО / 2026</span>
          <h2>Избранные работы</h2>
        </div>

        <nav className="filters" aria-label="Фильтр работ по категории">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              className={category === item ? "filter active" : "filter"}
              onClick={() => {
                setCategory(item);
                setSelected(item === "Все" ? 5 : 0);
              }}
            >
              {item}
            </button>
          ))}
        </nav>

        <nav
          ref={projectTabsRef}
          className="project-tabs"
          aria-label="Выбор проекта"
        >
          {visibleProjects.map((project, index) => (
            <button
              key={project.name}
              ref={index === activeIndex ? activeProjectTabRef : null}
              type="button"
              aria-pressed={index === activeIndex}
              className={index === activeIndex ? "project-tab active" : "project-tab"}
              onClick={() => setSelected(index)}
            >
              {project.name === "МТС УЖЕ 5G" ? "МТС" : project.name}
            </button>
          ))}
        </nav>

        <div
          ref={sceneRef}
          className="gallery"
          role="region"
          aria-label="Галерея работ. Используйте стрелки для переключения."
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              changeProject(event.key === "ArrowRight" ? 1 : -1);
            }
          }}
        >
          <div className="cards-origin">
            {visibleProjects.map((project, index) => (
              <button
                key={project.name}
                ref={(element) => {
                  if (element) cardsRef.current[index] = element;
                }}
                type="button"
                className={`project-card ${
                  index === activeIndex ? "is-active" : ""
                }`}
                aria-label={
                  project.name === "МТС УЖЕ 5G"
                    ? "Открыть проект МТС"
                    : `Выбрать работу ${project.name}`
                }
                aria-pressed={index === activeIndex}
                onPointerDown={startCardDrag}
                onPointerMove={moveCardDrag}
                onPointerUp={endCardDrag}
                onPointerCancel={() => {
                  dragRef.current = null;
                }}
                onClick={() => {
                  if (suppressClickRef.current) return;

                  if (project.name === "МТС УЖЕ 5G") {
                    navigateWithTransition("/projects/mts");
                    return;
                  }

                  setSelected(index);
                }}
              >
                <div
                  className="card-face"
                  style={{ backgroundColor: project.color }}
                >
                  <span className="cover-category">{project.category}</span>
                  <span className="cover-title">
                    {project.name === "МТС УЖЕ 5G" ? "МТС" : project.name}
                  </span>

                  {project.name === "МТС УЖЕ 5G" && (
                    <span className="cover-subtitle">УЖЕ 5G</span>
                  )}

                  <span className="cover-bottom">
                    <span>2И3Д / ИЗБРАННЫЕ РАБОТЫ</span>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </span>

                  <span className="cover-circle" aria-hidden="true" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <footer className="site-footer">
          <span className="project-counter">
            {String(activeIndex + 1).padStart(2, "0")}
            <span> / {String(visibleProjects.length).padStart(2, "0")}</span>
          </span>

          <span className="browse-hint">
            Зажмите и потяните · Горизонтальный скролл тачпада
          </span>

          <div className="gallery-controls">
            <button
              type="button"
              onClick={() => changeProject(-1)}
              disabled={activeIndex === 0}
              aria-label="Предыдущий проект"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => changeProject(1)}
              disabled={activeIndex === visibleProjects.length - 1}
              aria-label="Следующий проект"
            >
              →
            </button>
          </div>
        </footer>
      </section>

      <footer className="contact-footer" aria-label="Контакты студии">
        <a className="contact-footer-email" href="mailto:hello@studio-23d.com">
          hello@studio-23d.com
        </a>
        <div className="contact-footer-details">
          <div>
            <span className="contact-footer-label">КОНТАКТ</span>
            <span>Sergey Pleshkov</span>
          </div>
          <div>
            <span className="contact-footer-label">АДРЕС</span>
            <span>Дербеневская наб., 7, стр. 13</span>
          </div>
        </div>
        <div className="contact-footer-bottom">
          <span>2И3Д</span>
          <Link href="/contacts">Контакты ↗</Link>
        </div>
      </footer>
    </main>
  );
}