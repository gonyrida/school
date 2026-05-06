import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  bg?: "white" | "muted" | "soft";
  id?: string;
};

export function Section({ children, className = "", bg = "white", id }: Props) {
  const bgClass = bg === "muted" ? "bg-surface-muted" : bg === "soft" ? "bg-surface-soft" : "bg-white";
  return (
    <section id={id} className={`${bgClass} py-16 sm:py-24 ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}
