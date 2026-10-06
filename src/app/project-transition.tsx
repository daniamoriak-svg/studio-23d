"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type TransitionPhase = "idle" | "covering" | "revealing";

type ProjectTransitionContextValue = {
  navigateWithTransition: (href: string) => void;
};

const ProjectTransitionContext =
  createContext<ProjectTransitionContextValue | null>(null);

export function ProjectTransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const phaseRef = useRef<TransitionPhase>("idle");
  const previousPathRef = useRef(pathname);
  const targetPathRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigateWithTransition = useCallback(
    (href: string) => {
      if (phaseRef.current !== "idle") return;

      targetPathRef.current = new URL(href, window.location.href).pathname;
      phaseRef.current = "covering";
      setPhase("covering");
      timerRef.current = setTimeout(() => {
        router.push(href);
      }, 1050);
    },
    [router]
  );

  useEffect(() => {
    const previousPath = previousPathRef.current;
    previousPathRef.current = pathname;

    const reachedTarget =
      phaseRef.current === "covering" && targetPathRef.current === pathname;
    const returnedToHome =
      phaseRef.current === "idle" &&
      previousPath.startsWith("/projects/") &&
      pathname === "/";

    if (!reachedTarget && !returnedToHome) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    targetPathRef.current = null;
    phaseRef.current = "revealing";
    setPhase("revealing");
    timerRef.current = setTimeout(() => {
      phaseRef.current = "idle";
      setPhase("idle");
    }, 1100);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  return (
    <ProjectTransitionContext.Provider value={{ navigateWithTransition }}>
      {children}
      {phase !== "idle" && (
        <div
          className={`project-transition project-transition--${phase}`}
          role="status"
          aria-label="Переход между страницами"
        >
          {Array.from({ length: 5 }, (_, index) => (
            <span
              className="project-transition-panel"
              key={index}
              style={{
                left: `${index * 20}%`,
                animationDelay: `${index * 65}ms`,
              }}
              aria-hidden="true"
            />
          ))}
          <Image
            className="project-transition-logo"
            src="/logo.png"
            alt="2И3Д"
            width={130}
            height={143}
            priority
          />
        </div>
      )}
    </ProjectTransitionContext.Provider>
  );
}

export function useProjectTransition() {
  const context = useContext(ProjectTransitionContext);

  if (!context) {
    throw new Error(
      "useProjectTransition must be used within ProjectTransitionProvider"
    );
  }

  return context;
}

export function ProjectTransitionLink({
  href,
  children,
  className,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const { navigateWithTransition } = useProjectTransition();

  return (
    <Link
      href={href}
      className={className}
      aria-label={ariaLabel}
      onClick={(event) => {
        event.preventDefault();
        navigateWithTransition(href);
      }}
    >
      {children}
    </Link>
  );
}
