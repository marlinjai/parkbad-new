import React from "react";

interface ButtonProps {
  href: string;
  text: string;
  styles: string;
}

export default function Button({ href, text, styles }: ButtonProps) {
  return (
    <div className={styles}>
      <a href={href}>
        <div className=" bg-primary-buton-color hover:bg-primary-buton-color-hover hover:text-brand-text-button-hover text-brand-text-button text-center p-4 rounded-full">
          {text}
        </div>
      </a>
    </div>
  );
}
