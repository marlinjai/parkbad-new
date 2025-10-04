import { EventDay } from "./componentTypes";

export type Author = {
  name?: string;
  picture?: any;
};

export type SubBusiness = {
  title: any;
  name: string;
  picture: any;
};

export type PostType = {
  _id: string;
  title: string;
  coverImage?: any;
  detailsImage?: any;
  date: string;
  showUntilDate?: string;
  _updatedAt: string;
  excerpt?: string;
  author?: Author;
  slug: string;
  content?: any;
  hideOverlay?: boolean;
};

export type CustomEvent = {
  _id: string;
  eventTitle: string;
  excerpt?: string;
  eventImage?: any;
  detailsImage?: any;
  eventStart: string;
  eventEnd: string;
  author?: Author;
  slug: string;
  content?: any;
  eventDays?: EventDay[];
  hideOverlay?: boolean;
};

export type Food = {
  _id: string;
  foodTitle?: string;
  regularPrice?: number;
  discount?: number;
  category: string;
  slug?: string;
  seller: SubBusiness;
};

export type Drink = {
  _id: string;
  drinkTitle?: string;
  drinkTitleIntern?: string;
  category: string;
  alcoholic?: boolean;
  size?: number;
  regularPrice?: number;
  discount?: number;
  slug?: string;
  seller: SubBusiness;
};

export type DrinkCategory = {
  _id: string;
  name: string;
  picture?: any;
  drinks: Drink[];
};

export type FoodCategory = {
  _id: string;
  name: string;
  picture?: any;
  foods: Food[];
};

export type GalleryImage = {
  metadata: any;
  url: any;
  _type: "image";
  asset: {
    _ref: string;
    url: string;
    metadata: {
      dimensions: {
        width: number;
        height: number;
      };
      lqip?: string;
      palette?: any;
    };
  };
  crop?: any;
  hotspot?: {
    _type: "sanity.imageHotspot";
    height: number;
    width: number;
    x: number;
    y: number;
  };
  alt: string;
  caption?: string;
  takenAt?: string;
};

export type Gallery = {
  _id: string;
  galleryTitle: string;
  publishedAt?: string;
  slug?: {
    current: string;
  };
  images: GalleryImage[];
};

export type GalleryPageProps = {
  galleryData: Gallery;
};

export type ContactSettings = {
  _id: string;
  isWinterBreak: boolean;
  winterBreakMessage: string;
  normalMessage: string;
  contactPhone: string;
  contactEmail: string;
  lastUpdated: string;
};
