import React, { useEffect, useState } from "react";
import Datenschutzerklaerung from "../../_customerData/Datenschutzerklaerung";
import Impressum from "../../_customerData/Impressum";
import Hausordnung from "../../_customerData/Hausordnung";
import Button from "../UtilityComponents/Button";
import { gsap } from "gsap";

interface ModalProps {
  id: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ id, onClose }) => {
  // Function to prevent propagation of click events from the modal content
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const modalRef = React.useRef(null);
  const backgroundRef = React.useRef(null);

  useEffect(() => {
    gsap.to(backgroundRef.current, { opacity: 1, duration: 0.3 });
    gsap.fromTo(
      modalRef.current,
      { y: 90, opacity: 0, duration: 1, ease: "power2.out" },
      { y: 0, opacity: 1, duration: 1, ease: "power2.inOut", delay: 0.2 }
    );
  }, []);

  useEffect(() => {
    document.body.classList.add("disable-scrolling");
    document.documentElement.classList.add("disable-scrolling");

    return () => {
      document.body.classList.remove("disable-scrolling");
      document.documentElement.classList.remove("disable-scrolling");
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center opacity-0 `}
      onClick={onClose}
      ref={backgroundRef}
    >
      <div className="fixed inset-0 bg-black opacity-70"></div>
      <div
        className={`absolute hide-scrollbar p-pz5 flex gap-pz5 items-center justify-between flex-col sm:pb-pz5 pb-5 -bottom-1 w-vw90 overflow-y-auto rounded-t-3xl bg-brand-accent-2 shadow-lg md:w-vw60 opacity-0`}
        style={{ maxHeight: "80vh" }} // limit height to 80% of the view height
        onClick={stopPropagation}
        ref={modalRef}
      >
        <div className=" flex justify-center items-center text-brand-colour-light text-xl flex-col px-4 gap-4">
          <div className=" h-full mb-pz5 flex justify-center">
            <div className="relative h-full  w-vw80 md:w-vw75 lg:w-vw55 w-vw55::after">
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
          pt-8 
          pb-8

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
                    <div className="text-brand-colour-light">
                      {id === "modal-2-0" ? (
                        <Impressum></Impressum>
                      ) : id === "modal-2-1" ? (
                        <Datenschutzerklaerung />
                      ) : (
                        <Hausordnung></Hausordnung>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button
          styles="w-pz40 mt-pz5"
          onClick={onClose}
          text="Schließen"
        ></Button>
      </div>
    </div>
  );
};

export default Modal;
