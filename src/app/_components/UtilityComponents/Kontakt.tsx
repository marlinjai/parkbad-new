"use client";

import React, { useState, FormEvent } from "react";
import { SubmitButton } from "./SubmitButton";

export default function Kontakt() {
  const [state, setState] = useState<{ message: string | null }>({
    message: null,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget); // Use currentTarget instead of target
    const formProps = Object.fromEntries(formData);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formProps),
      });

      if (response.ok) {
        setState({ message: "Ihre Anfrage wurde erfolgreich versendet!" });
      } else {
        throw new Error("Response not OK");
      }
    } catch (error) {
      setState({
        message:
          "Leider kann die Anfrage aufgrund technischer Schwierigkeiten nicht abgesendet werden.",
      });
    }
  };

  return (
    <>
      <form
        className="mx-auto mb-16  mt-16 max-w-xl sm:mt-20"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          {/* First Name */}
          <div>
            <label
              htmlFor="first-name"
              className="block text-sm font-semibold leading-6 text-brand-colour-light"
            >
              Vorname
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="firstName"
                id="first-name"
                autoComplete="given-name"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-border-orange sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="last-name"
              className="block text-sm font-semibold leading-6 text-brand-colour-light"
            >
              Nachname
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="lastName"
                id="last-name"
                autoComplete="family-name"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-border-orange sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Other Fields as needed... */}

          {/* Email */}
          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold leading-6 text-brand-colour-light"
            >
              E-Mail
            </label>
            <div className="mt-2.5">
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-brand-border-orange sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Message */}
          <div className="sm:col-span-2">
            <label
              htmlFor="message"
              className="block text-sm font-semibold leading-6 text-brand-colour-light"
            >
              Ihre Nachrricht
            </label>
            <div className="mt-2.5">
              <textarea
                name="message"
                id="message"
                rows={4}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-border-orange sm:text-sm sm:leading-6"
                defaultValue={""}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-10 sm:col-span-2">
            <SubmitButton></SubmitButton>
          </div>
          <p className=" text-brand-accent-1" aria-live="polite" role="status">
            {state?.message}
          </p>
        </div>
      </form>
    </>
  );
}
