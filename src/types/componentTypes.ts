import type { SanityDocument } from "@sanity/client";
import { CustomEvent, PostType } from "@/types/sanityTypes";

export type HomePageProps = {
  posts: SanityDocument[];
  customevents: CustomEvent[];
  preview: boolean;
};

export type PostPageProps = {
  post?: PostType;
  customevent?: CustomEvent;
  preview: boolean;
};

// Define a type alias for AccordionProps
export type AccordionProps = {
  data: { title: string; links: { name: string; href: string }[] }[];
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
