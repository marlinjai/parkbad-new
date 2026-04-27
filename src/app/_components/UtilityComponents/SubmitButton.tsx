"use client";

interface submitButtonProps {
  buttonText?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonHoverColor?: string;
  buttonHoverTextColor?: string;
  disabled?: boolean;
}
export function SubmitButton(props: submitButtonProps) {
  const { disabled } = props;

  return (
    <button
      type="submit"
      disabled={disabled}
      aria-disabled={disabled}
      className={`mx-auto w-pz50 rounded-full ${
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
      } bg-brand-border-orange hover:border-brand-border-orange border border-brand-border-orange px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-brand-colour-main focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {disabled ? "Wird gesendet..." : props.buttonText ? props.buttonText : "absenden"}
    </button>
  );
}
