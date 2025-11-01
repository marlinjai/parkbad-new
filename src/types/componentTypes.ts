import type { SanityDocument } from "@sanity/client";
import { Author, CustomEvent, PostType } from "@/types/sanityTypes";

export type HomePageProps = {
  posts: PostType[];
  customevents: CustomEvent[];
  preview?: boolean;
  historyImages: any;
};

export type FooterProps = {
  openingHours: OpeningHour[];
  // ... other props if any
};

export type PostPageProps = {
  post?: PostType;
  customevent?: CustomEvent;
  preview: boolean;
};

// Define a type alias for AccordionProps
export type AccordionProps = {
  data: {
    title: string;
    links: {
      secondaryHref?: any;
      name: string;
      href: string;
    }[];
  }[];
  openModal: (id: string) => void;
  requiresModal: (title: string) => boolean;
};

export type OverlayNavigationProps = {
  isOpen: boolean;
  onClose: () => void;
};

export type PostImageProps = {
  title: string;
  slug?: string;
  image: any;
  priority?: boolean;
  width?: number;
  height?: number;
  fit?: "contain" | "cover"; // New fit prop to control objectFit value
};

export type SanityImageQueryResult = {
  asset: {
    _ref: string;
    metadata: { dimensions: { width: number; height: number } };
  };
  crop: {
    _type: "sanity.imageCrop";
    bottom: number;
    left: number;
    right: number;
    top: number;
  };
  hotspot: {
    _type: "sanity.imageHotspot";
    height: number;
    width: number;
    x: number;
    y: number;
  };

  alt: string;
};
// Define a type alias for the item
export type EventDay = {
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
};

export type PostorEventItem = {
  _id: string;
  slug?: string;
  title?: string;
  eventTitle?: string;
  coverImage?: SanityImageQueryResult;
  content?: any;
  eventContent?: any;
  eventImage?: SanityImageQueryResult;
  author?: Author;
  date?: string;
  eventStart?: string;
  eventEnd?: string;
  eventDays?: EventDay[];
  hideOverlay?: boolean;
  detailsImage?: SanityImageQueryResult;
  customOverlayText?: string;
  customOverlaySubtext?: string;
};

export type OpeningHour = {
  dayName: string;
  hours: string;
};

export type GroupedOpeningHour = {
  days: string[];
  hours: string;
};
