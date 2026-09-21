export interface EventLink {
  label: string;
  url: string;
  emphasis?: "primary" | "subtle";
}

export interface WebsiteEvent {
  id: string;
  source: "airtable" | "website";
  title: string;
  slug: string;
  description: string;
  location: string;
  start: string;
  end: string;
  dateLabel?: string;
  imageSrc?: string;
  photos?: Array<string | { src: string; alt: string }>;
  links?: EventLink[];
  visible: boolean;
}
