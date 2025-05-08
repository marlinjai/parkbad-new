import React from "react";

interface ButtonProps {
  href?: string;
  text: string;
  styles: string;
  onClick?: () => void; // Define the type for onClick function
}

// Make sure to destructure the onClick prop from the props object
export default function Button({ href, text, styles, onClick }: ButtonProps) {
  // Prevent default action if onClick is provided to avoid navigating away when the button is clicked
  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    if (onClick) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div className={styles}>
      {/* Add the onClick event handler to the <a> tag */}
      <a href={href} onClick={handleClick}>
        <div className="  hover:bg-brand-colour-main hover:text-brand-text-button-hover text-brand-colour-light text-center p-4 rounded-full">
          {text}
        </div>
      </a>
    </div>
  );
}
