"use client";

import { ChevronDown } from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";

// A collapsible page section. Links to `#<id>` anywhere on the page open it and scroll to it.
export default function Dropdown({
  id,
  number,
  title,
  summary,
  defaultOpen = false,
  children,
}: {
  id: string;
  number: number;
  title: string;
  summary?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const openAndScroll = () => {
      if (!ref.current) return;
      ref.current.open = true;
      requestAnimationFrame(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
      // Arriving from another page, content above may still be settling; correct the position once it has.
      window.setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 700);
    };

    const onHashChange = () => {
      if (window.location.hash === `#${id}`) openAndScroll();
    };
    onHashChange();
    window.addEventListener("hashchange", onHashChange);

    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest?.(`a[href="#${id}"]`);
      if (!link) return;
      event.preventDefault();
      history.replaceState(null, "", `#${id}`);
      openAndScroll();
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [id]);

  return (
    <details
      ref={ref}
      id={id}
      open={defaultOpen}
      className="group scroll-mt-20 overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow open:shadow-[0_12px_40px_rgba(35,45,75,0.08)]"
    >
      <summary className="tap-scale flex min-h-16 cursor-pointer list-none items-center gap-4 px-4 py-4 hover:bg-gray-50 sm:px-6 [&::-webkit-details-marker]:hidden">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white tabular-nums group-open:bg-secondary">
          {number}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xl font-bold tracking-[-0.01em] text-primary sm:text-2xl">{title}</span>
          {summary && <span className="mt-0.5 block truncate text-sm text-gray-500">{summary}</span>}
        </span>
        <ChevronDown size={22} className="shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180 group-open:text-secondary" />
      </summary>
      <div className="border-t border-gray-100 bg-gray-50/60 px-4 py-6 sm:px-6 sm:py-8">{children}</div>
    </details>
  );
}
