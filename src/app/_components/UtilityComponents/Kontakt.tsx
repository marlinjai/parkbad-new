"use client";

import React, { useState, FormEvent } from "react";
import { SubmitButton } from "./SubmitButton";
import Form from "./Form";

interface KontaktPropsType {
  bgColour?: string;
}

export default function Kontakt(kontaktProps: KontaktPropsType) {
  return (
    <>
      <div className=" flex justify-center items-center text-brand-colour-light text-xl flex-col gap-4">
        <div className=" h-full mb-pz20 flex justify-center">
          <div className="relative h-full  w-vw90 md:w-vw75 lg:w-vw55 w-vw55::after">
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
                className={`
            absolute 
            left-0 
            top-0 
            h-8 w-8 border-b-2 
            border-r-2 border-solid border-brand-border-orange
            ${
              kontaktProps.bgColour
                ? kontaktProps.bgColour
                : "bg-brand-accent-2"
            } 
            md:h-12 
            md:w-12 
            lg:h-16 
            lg:w-16
            `}
              ></div>

              {/* Right Top Square */}
              <div
                className={`
            absolute 
            right-0 
            top-0 
            h-8 w-8 border-b-2 
            border-l-2 border-solid border-brand-border-orange 
            ${
              kontaktProps.bgColour
                ? kontaktProps.bgColour
                : "bg-brand-accent-2"
            } 
            md:h-12 
            md:w-12 
            lg:h-16 
            lg:w-16
            `}
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
                  className={`
              absolute 
              bottom-1 
              left-3 
             right-3 
              top-3 
              border-2 
              border-solid  border-brand-border-orange  bg-brand-accent-2 
              md:left-4  md:right-4  md:top-4 
              lg:left-6 lg:right-6 lg:top-6 `}
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
                <div className=" z-20 -mt-5 h-full block w-pz80 px-4"></div>
              </div>
              <Form></Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
