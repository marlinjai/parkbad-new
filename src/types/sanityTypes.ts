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
  date?: string;
  showUntilDate?: string;
  _updatedAt: string;
  excerpt?: string;
  author?: Author;
  slug: string;
  content?: any;
};

export type CustomEvent = {
  _id: string;
  eventTitle: string;
  excerpt?: string;
  eventImage?: any;
  eventStart: string;
  eventEnd: string;
  author?: Author;
  slug: string;
  content?: any;
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

export type GalleryImage = {
  url: any;
  _type: "image";
  asset: {
    _ref: string;
    url: string;
  };
  hotspot?: any;
  alt: string;
};

export type Gallery = {
  _id: string;
  imageTitle: string;
  slug?: {
    current: string;
  };
  images: GalleryImage[];
};

export type GalleryPageProps = {
  galleryData: Gallery;
};
