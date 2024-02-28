import React, { FormEvent, useState } from "react";
import { SubmitButton } from "./SubmitButton";

interface FormProps {
  mailSendSuccess?: string;
  mailSendError?: string;
  headline?: string;
  subheadline?: string;
  buttonText?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonHoverColor?: string;
}

export default function Form(myFormProps: FormProps) {
  const [state, setState] = useState<{ message: string | null }>({
    message: null,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
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
        setState(
          myFormProps.mailSendError
            ? { message: myFormProps.mailSendError }
            : { message: "Ihre Anfrage wurde erfolgreich versendet!" }
        );
        form.reset(); // Reset the form fields
      } else {
        throw new Error("Response not OK");
      }
    } catch (error) {
      setState(
        myFormProps.mailSendSuccess
          ? { message: myFormProps.mailSendSuccess }
          : {
              message:
                "Leider kann die Anfrage aufgrund technischer Schwierigkeiten nicht abgesendet werden.",
            }
      );
    }
  };

  return (
    <>
      <h2 className="text-3xl text-center my-4 font-bold tracking-tight text-brand-colour-light sm:text-4xl">
        {myFormProps.headline ? myFormProps.headline : "Hast du noch Fragen?"}
      </h2>
      <h3 className=" my-4 text-4sc text-center">
        {myFormProps.subheadline
          ? myFormProps.subheadline
          : "Dann sende uns einfach eine Nachrricht"}
      </h3>

      <form
        id="Kontakt"
        className="mx-auto mb-16  mt-8 max-w-xl sm:mt-16"
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
                required
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
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-border-orange sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Other Fields as needed... */}

          {/* Email */}
          <div className="">
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
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-brand-border-orange sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Phone number */}

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold leading-6 text-brand-colour-light"
            >
              Telefon
            </label>
            <div className="mt-2.5">
              <input
                type="tel"
                name="phone"
                id="phone"
                autoComplete="tel"
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-border-orange sm:text-sm sm:leading-6"
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
                required
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
