// src/types/custom-elements.d.ts
// Custom element type declarations

import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'swiper-container': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        init?: string;
      };
      'swiper-slide': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
      };
    }
  }
}

// This ensures the file is treated as a module
export {};

