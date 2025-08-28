// src/app/globals.d.ts
// Force global type declarations to load in all environments

import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'swiper-container': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          init?: boolean;
          className?: string;
          ref?: React.RefObject<HTMLElement>;
        },
        HTMLElement
      >;
      'swiper-slide': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          className?: string;
        },
        HTMLElement
      >;
    }
  }
}

export {};
