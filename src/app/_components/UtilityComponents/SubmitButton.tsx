"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="block w-full rounded-md bg-brand-border-orange px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-brand-colour-main focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
    >
      absenden
    </button>
  );
}
