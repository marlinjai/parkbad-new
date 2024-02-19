"use client";

import React, { useState, FormEvent } from "react";
import { SubmitButton } from "./SubmitButton";

interface KontaktPropsType {
  mailSendSuccess?: string;
  mailSendError?: string;
  heaadline?: string;
  subheadline?: string;
  buttonText?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonHoverColor?: string;
}

export default function Kontakt(kontaktProps: KontaktPropsType) {
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
      setState(
        kontaktProps.mailSendSuccess
          ? { message: kontaktProps.mailSendSuccess }
          : {
              message:
                "Leider kann die Anfrage aufgrund technischer Schwierigkeiten nicht abgesendet werden.",
            }
      );
    }
  };

  return (
    <>
      <div className=" flex justify-center items-center text-brand-colour-light text-xl flex-col gap-4">
        <div className=" h-full mb-pz20 flex justify-center">
          <div className="relative h-full  w-vw90 md:w-vw75 w-vw55::after">
            {/* Your existing layout here */}
            {/* Sub-container for the two big squares and the middle rectangle */}
            <div
              className="
                      relative
                      left-0 
                      right-0
                      top-0
                      h-8 md:h-12 lg:h-16
                      "
            >
              {/* Left Top Square */}
              <div
                className="
            absolute 
            left-0 
            top-0 
            h-8 w-8 border-b-2 
            border-r-2 border-solid border-brand-border-orange 
            bg-brand-accent-2 
            md:h-12 
            md:w-12 
            lg:h-16 
            lg:w-16
            "
              ></div>

              {/* Right Top Square */}
              <div
                className="
            absolute 
            right-0 
            top-0 
            h-8 w-8 border-b-2 
            border-l-2 border-solid border-brand-border-orange 
            bg-brand-accent-2 
            md:h-12 
            md:w-12 
            lg:h-16 
            lg:w-16
            "
              ></div>
              {/* Middle Rectangle between the squares */}
              <div
                className="
            absolute 
            left-8 right-8 top-0 
            h-8 border-t-2 border-solid border-brand-border-orange 
            bg-brand-colour-darker 
            md:left-12 md:right-12 md:h-12 
            lg:left-16 
            lg:right-16 
            lg:h-16
            "
              >
                {/* Smaller Rectangle inside Middle Rectangle */}
                <div
                  className="
              absolute 
              bottom-1 
              left-3 
             right-3 
              top-3 
              border-2 
              border-solid  border-brand-border-orange  bg-brand-accent-2 
              md:left-4  md:right-4  md:top-4 
              lg:left-6 lg:right-6 lg:top-6
              "
                ></div>
              </div>
            </div>

            {/* Sub-container for the smaller squares and the rest */}
            <div
              className="
          relative
          left-0 
          right-0 
          top-0 border-b-2 border-l-2 
          border-r-2 
          border-solid 
          border-brand-border-orange 
          bg-brand-colour-darker 
          pt-10 

          md:py-14 
"
            >
              {/* Smaller square below the left big square */}
              <div
                className="
            absolute 
            left-2 top-2 h-4 
            w-4 border-2 border-solid 
            border-brand-border-orange bg-brand-accent-2 md:left-3 
            md:top-3 md:h-6 md:w-6 
            lg:left-4 
            lg:top-4 
            lg:h-8 lg:w-8"
              ></div>

              {/* Smaller square below the right big square */}
              <div
                className="
            absolute 
            right-2 top-2 h-4 
            w-4 border-2 border-solid 
            border-brand-border-orange bg-brand-accent-2 md:right-3 
            md:top-3 md:h-6 md:w-6 
            lg:right-4 
            lg:top-4 
            lg:h-8 
            lg:w-8"
              ></div>

              <div className="flex justify-center">
                <div className=" z-20 -mt-5 h-full block w-pz80 px-4">
                  <h2 className="text-3xl text-center my-4 font-bold tracking-tight text-brand-colour-light sm:text-4xl">
                    Hast du noch Fragen?
                  </h2>
                  <h3 className=" my-4 text-4sc text-center">
                    Dann sende uns einfach eine Nachrricht
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
                      <p
                        className=" text-brand-accent-1"
                        aria-live="polite"
                        role="status"
                      >
                        {state?.message}
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
