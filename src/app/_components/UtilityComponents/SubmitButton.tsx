"use client";

import { useFormStatus } from "react-dom";

interface submitButtonProps {
  buttonText?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonHoverColor?: string;
  buttonHoverTextColor?: string;
}
export function SubmitButton(props: submitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className={`block w-full rounded-md ${
        props.buttonColor
          ? "bg-" + props.buttonColor
          : props.buttonTextColor
          ? "text-" + props.buttonTextColor
          : props.buttonHoverColor
          ? "hover:bg-" + props.buttonHoverColor
          : props.buttonHoverTextColor
          ? "hover:text-" + props.buttonHoverTextColor
          : " "
      } 
         "bg-brand-colour-main"
      } bg-brand-border-orange px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-brand-colour-main focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 `}
    >
      {props.buttonText ? props.buttonText : "absenden"}
    </button>
  );
}
