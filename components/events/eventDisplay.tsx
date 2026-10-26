import Image from "next/image";

export function formatDateRange(start: string, end: string, includeTime: boolean) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const date = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York" });
  const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" });
  const sameDay = date.format(startDate) === date.format(endDate);
  if (!includeTime) return sameDay ? date.format(startDate) : `${date.format(startDate)} – ${date.format(endDate)}`;
  if (sameDay) return `${date.format(startDate)} · ${time.format(startDate)}–${time.format(endDate)}`;
  return `${date.format(startDate)}, ${time.format(startDate)} – ${date.format(endDate)}, ${time.format(endDate)}`;
}

export function Flyer({
  src,
  title,
  cover = false,
  sizes = "(min-width: 1024px) 352px, (min-width: 640px) 50vw, 100vw",
}: {
  src?: string;
  title: string;
  cover?: boolean;
  sizes?: string;
}) {
  if (!src) return null;

  return <div className="relative flex items-center justify-center overflow-hidden bg-gray-100" style={{ aspectRatio: "8.5 / 11" }}>
    {src.startsWith("http")
      // Remote flyer hosts vary (Airtable and the configured Supabase project), so this cannot use a fixed Next Image allowlist.
      // eslint-disable-next-line @next/next/no-img-element
      ? <img src={src} alt={`${title} flyer`} className={`image-outline absolute inset-0 size-full ${cover ? "object-cover" : "object-contain"}`} />
      : <Image src={src} alt={`${title} flyer`} fill sizes={sizes} className={`image-outline ${cover ? "object-cover" : "object-contain"}`} />
    }
  </div>;
}
