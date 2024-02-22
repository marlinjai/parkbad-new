"use client";

import React, { FormEvent, useState } from "react";
import { SubmitButton } from "./SubmitButton";
import { TbCircleChevronsDown } from "react-icons/tb";
import { TbCircleChevronsUp } from "react-icons/tb";

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

export default function RentingForm(myFormProps: FormProps) {
  const [state, setState] = useState<{ message: string | null }>({
    message: null,
  });

  const [rows, setRows] = React.useState(4);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleButtonClick = () => {
    setIsFormVisible(true);
  };

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        // 640px is the default breakpoint for 'sm' in Tailwind CSS
        setRows(2);
      } else {
        setRows(4);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call the function initially to set the correct number of rows

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
        setState(
          myFormProps.mailSendError
            ? { message: myFormProps.mailSendError }
            : { message: "Ihre Anfrage wurde erfolgreich versendet!" }
        );
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
      <div className=" bg-slate-700 bg-opacity-25 backdrop-blur-md rounded-3xl m-pz5 p-8 sm:p-16 top-10 sm:top-20  relative">
        <h2 className=" text-lg text-center my-2 sm:my-4 font-semibold tracking-tight text-brand-colour-light sm:text-4xl">
          {myFormProps.headline ? myFormProps.headline : "Hast du noch Fragen?"}
        </h2>
        {/* <h3 className=" my-2 sm:my-4  text-md sm:text-4sc text-center text-brand-colour-light">
        {myFormProps.subheadline
          ? myFormProps.subheadline
          : "Dann sende uns einfach eine Nachrricht"}
      </h3> */}

        {isFormVisible ? (
          <button
            onClick={() => setIsFormVisible(false)}
            className="sm:hidden block mx-auto scale-125 my-4 text-white"
          >
            <TbCircleChevronsUp size={36}></TbCircleChevronsUp>
          </button>
        ) : (
          <button
            onClick={() => setIsFormVisible(true)}
            className="sm:hidden block mx-auto scale-125 my-4 text-white"
          >
            <TbCircleChevronsDown size={36}></TbCircleChevronsDown>
          </button>
        )}

        {/* Show form if isFormVisible is true or screen is not small */}
        {(isFormVisible || window.innerWidth >= 640) && (
          <form
            id="Kontakt"
            className="mx-auto  mb-2  mt-4 max-w-xl sm:mt-16"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:gap-y-4 sm:grid-cols-2">
              {/* First Name */}
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-sm font-semibold leading-6 text-brand-colour-light"
                >
                  Vorname
                </label>
                <div className=" sm:mt-2.5">
                  <input
                    type="text"
                    name="firstName"
                    id="first-name"
                    autoComplete="given-name"
                    required
                    className="block w-full rounded-md border-0 px-3.5 py-1 sm:py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-border-orange sm:text-sm sm:leading-6"
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
                <div className=" sm:mt-2.5">
                  <input
                    type="text"
                    name="lastName"
                    id="last-name"
                    autoComplete="family-name"
                    required
                    className="block w-full rounded-md border-0 px-3.5 py-1 sm:py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-border-orange sm:text-sm sm:leading-6"
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
                <div className=" sm:mt-2.5">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 px-3.5 py-1 sm:py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-brand-border-orange sm:text-sm sm:leading-6"
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
                <div className=" sm:mt-2.5">
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    autoComplete="tel"
                    required
                    className="block w-full rounded-md border-0 px-3.5 py-1 sm:py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-border-orange sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold leading-6 text-brand-colour-light"
                >
                  Ihre Anfrage
                </label>
                <div className=" sm:mt-2.5">
                  <textarea
                    name="message"
                    id="message"
                    rows={rows}
                    required
                    className="block w-full rounded-md border-0 px-3.5 py-1 sm:py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-border-orange sm:text-sm sm:leading-6"
                    defaultValue={""}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className=" sm:col-span-2">
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
        )}
      </div>
    </>
  );
}
