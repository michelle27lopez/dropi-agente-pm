"use client";

import { useEffect, useState } from "react";

type Item = { id: string; label: string };

export default function SectionNav({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items]);

  return (
    <nav className="section-nav" aria-label="Secciones de logística">
      {items.map((it) => (
        <a key={it.id} href={`#${it.id}`} className={active === it.id ? "active" : ""}>
          {it.label}
        </a>
      ))}
    </nav>
  );
}
