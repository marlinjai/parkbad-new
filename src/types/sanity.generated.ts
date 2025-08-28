// src/types/sanity.generated.ts
// Proper Sanity type definitions

export interface SanityImageObject {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  caption?: string;
}

export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

export interface PostType extends SanityDocument {
  _type: 'post';
  title: string;
  coverImage?: SanityImageObject;
  date: string;
  showUntilDate?: string;
  excerpt?: string;
  author?: Author;
  slug: {
    current: string;
    _type: 'slug';
  };
  content?: PortableTextBlock[];
}

export interface CustomEvent extends SanityDocument {
  _type: 'customevent';
  eventTitle: string;
  coverImage?: SanityImageObject;
  eventDate: string;
  eventEndDate?: string;
  slug: {
    current: string;
    _type: 'slug';
  };
  content?: PortableTextBlock[];
}

export interface Author extends SanityDocument {
  _type: 'author';
  name: string;
  picture?: SanityImageObject;
}

// Utility types
export type SanityReference<T = any> = {
  _type: 'reference';
  _ref: string;
  _weak?: boolean;
  _strengthenOnPublish?: {
    type: string;
    weak?: boolean;
    template?: {
      id: string;
      params: Record<string, any>;
    };
  };
} & T;

export type PortableTextBlock = {
  _key: string;
  _type: 'block';
  children: PortableTextSpan[];
  markDefs: PortableTextMarkDefinition[];
  style: string;
};

export type PortableTextSpan = {
  _key: string;
  _type: 'span';
  text: string;
  marks: string[];
};

export type PortableTextMarkDefinition = {
  _key: string;
  _type: string;
  [key: string]: any;
};
