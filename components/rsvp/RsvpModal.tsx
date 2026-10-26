"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, MapPin, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import RsvpForm from "@/components/rsvp/RsvpForm";
import type { PublicEvent } from "@/lib/rsvp/airtable";

function formatEventTime(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  }).format(startDate);
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  });
  return `${date}, ${time.format(startDate)}–${time.format(endDate)}`;
}

export default function RsvpModal({
  event,
  showTrigger = true,
  closeHref,
}: {
  event: PublicEvent;
  showTrigger?: boolean;
  closeHref?: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const dialogRef = useRef<HTMLDivElement>(null);
  const navigateAfterCloseRef = useRef(false);

  const closeModal = useCallback(() => {
    navigateAfterCloseRef.current = Boolean(closeHref);
    setIsOpen(false);
  }, [closeHref]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const handleKey = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") closeModal();
      if (keyboardEvent.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), input:not([tabindex="-1"]), select, textarea',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (keyboardEvent.shiftKey && document.activeElement === first) {
        keyboardEvent.preventDefault();
        last.focus();
      } else if (!keyboardEvent.shiftKey && document.activeElement === last) {
        keyboardEvent.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [closeModal, isOpen]);

  return (
    <>
  {showTrigger && (
    <button
      type="button"
      onClick={() => setIsOpen(true)}
      className="tap-scale button-raised inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-2.5 font-medium text-white hover:bg-primary/92"
    >
      RSVP
    </button>
  )}

  <AnimatePresence
    initial={false}
    onExitComplete={() => {
      if (navigateAfterCloseRef.current && closeHref) {
        navigateAfterCloseRef.current = false;
        router.replace(closeHref, { scroll: false });
      }
    }}
  >
    {isOpen && (
      <motion.div
        className="fixed inset-0 z-[100] flex items-end justify-center bg-primary/55 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onMouseDown={(mouseEvent) => {
          if (mouseEvent.target === mouseEvent.currentTarget) closeModal();
        }}
      >
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="rsvp-title"
          tabIndex={-1}
          className="relative max-h-[calc(100dvh-1rem)] w-full overflow-y-auto rounded-t-[28px] bg-white px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_24px_80px_rgba(0,0,0,0.28)] sm:max-w-xl sm:rounded-[28px] sm:p-8"
          initial={{ opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.99 }}
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
        >
          <button
            type="button"
            onClick={closeModal}
            className="tap-scale absolute right-3 top-3 flex size-11 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-primary sm:right-5 sm:top-5"
            aria-label="Close RSVP"
          >
            <X size={22} />
          </button>

          <RsvpForm
            event={event}
            header={
              <>
                    <div className="pr-11">
                      <h1 id="rsvp-title" className="text-3xl font-bold tracking-[-0.025em] text-primary sm:text-4xl">
                        {event.name}
                      </h1>
                    </div>
                    <div className="mt-4 space-y-2 text-sm font-medium text-gray-600">
                      <p className="flex items-start gap-2">
                        <CalendarDays className="mt-0.5 size-4 shrink-0 text-secondary" />
                        <span className="tabular-nums">{formatEventTime(event.start, event.end)}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-secondary" />
                        <span>{event.location}</span>
                      </p>
                    </div>
                    <p className="mt-4 text-base leading-relaxed text-gray-600">{event.description}</p>
                  </>
                }
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
