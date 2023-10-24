export interface Author {
  name?: string;
  picture?: any;
}

export interface subBusiness {
  title: any;
  name?: string;
  pictur?: any;
}

export interface PostType {
  _id: string;
  title?: string;
  coverImage?: any;
  date?: string;
  showUntilDate?: string;
  _updatedAt?: string;
  excerpt?: string;
  author?: Author;
  slug?: string;
  content?: any;
}

export interface CustomEvent {
  _id: string;
  eventTitle?: string;
  excerpt?: string;
  eventImage?: any;
  eventStart?: string;
  eventEnd?: string;
  author?: Author;
  slug?: string;
  eventContent?: any;
}

export interface food {
  _id: string;
  foodTitle?: string;
  regularPrice?: number;
  discount?: number;
  category?: string;
  slug?: string;
  seller?: subBusiness;
}

export interface drink {
  _id: string;
  drinkTitle?: string;
  drinkTitleIntern?: string;
  category?: string;
  alcoholic?: boolean;
  size?: number;
  regularPrice?: number;
  discount?: number;
  slug?: string;
  seller?: subBusiness;
}

export interface GalleryImage {
  url: any;
  _type: "image";
  asset: {
    _ref: string;
    url: string;
  };
  hotspot?: any;
}

export interface Gallery {
  _id: string;
  imageTitle: string;
  slug?: {
    current: string;
  };
  images: GalleryImage[];
}

export interface GalleryPageProps {
  galleryData: Gallery;
}
