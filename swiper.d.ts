declare namespace JSX {
  interface IntrinsicElements {
    "swiper-slide": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;
    // add 'swiper-container' if it's not already declared
    "swiper-container": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & { init: string },
      HTMLElement
    >;
  }
}
