"use client";

import { useState } from "react";
import Accordion from "./Accordion";
import Modal from "./Modals";
import React from "react";
import { footerNavigationLinks } from "../../_customerData/footerLinksData";
import { socialNavigationLinks } from "../../_customerData/footerLinksData";
import { MdOutlineMail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { FooterProps } from "@/types/componentTypes";

import Newsletter from "./Newsletter";
import BusinessHours from "./BusinessHours";

export default function Footer({ openingHours }: FooterProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  console.log(openingHours);

  const openModal = (id: string) => {
    setActiveModal(id);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // Helper function to check if a section title requires a modal
  const requiresModal = (title: string) => {
    return title === "Rechtliches";
  };

  return (
    <footer
      className=" z-50 bg-brand-accent-3"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto flex flex-col justify-center px-8 pb-8 pt-16 sm:pt-20 md:px-20 lg:px-20">
        <div className="grid-cols-3 gap-12   py-4 md:grid  xl:gap-8">
          {/* Modals */}
          {footerNavigationLinks.map((section, sectionIndex) => (
            <React.Fragment key={section.title}>
              <div
                className={`${
                  sectionIndex === 1
                    ? "justify-self-center"
                    : sectionIndex === 2
                    ? "justify-self-end"
                    : "justify-self-start"
                } hidden md:block`}
              >
                <h3 className="text-2xl font-semibold leading-6 text-white">
                  {section.title}
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <li key={link.name}>
                      {requiresModal(section.title) ? (
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            openModal(`modal-${sectionIndex}-${linkIndex}`);
                          }}
                          className="text-md leading-6 text-gray-300 hover:text-brand-colour-dark"
                        >
                          {link.name}
                        </a>
                      ) : (
                        <>
                          <div className=" text-gray-300">
                            <a
                              href={link.href}
                              className="text-md leading-6 text-gray-300 hover:text-brand-colour-dark"
                            >
                              {link.secondaryHref
                                ? link.name.split(" & ")[0]
                                : link.name}
                            </a>
                            {link.secondaryHref && (
                              <>
                                {" & "}
                                <a
                                  href={link.secondaryHref}
                                  className="text-md leading-6 text-gray-300 hover:text-brand-colour-dark"
                                >
                                  {link.name.split(" & ")[1]}
                                </a>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Render modals for sections that require them */}
              {requiresModal(section.title) &&
                section.links.map((link, linkIndex) => {
                  const modalId = `modal-${sectionIndex}-${linkIndex}`;
                  return (
                    activeModal === modalId && (
                      <Modal key={modalId} id={modalId} onClose={closeModal} />
                    )
                  );
                })}
            </React.Fragment>
          ))}

          <div className="grid grid-cols-1 gap-2 md:hidden">
            <Accordion
              data={footerNavigationLinks}
              openModal={openModal}
              requiresModal={requiresModal}
            />
          </div>
        </div>

        <div className=" mt-pz5 flex flex-col justify-between gap-vw1 p-4 sm:flex-row  md:p-0">
          {/* <Newsletter></Newsletter> */}
          <BusinessHours openingHours={openingHours}></BusinessHours>
          <div className=" text-xl  w-full sm:w-pz65 text-brand-colour-light">
            <a
              href="tel:+49 5241 235858"
              className="text-white flex justify-start sm:justify-end items-center gap-3 my-2"
            >
              <FiPhone className="inline" />
              <span>+49 5241 235858</span>
            </a>
            <a
              href="mailto:verwaltung@parkbad-gt.de"
              className="text-white flex justify-start sm:justify-end items-center gap-3 my-2"
            >
              <MdOutlineMail className="inline" />
              <span>verwaltung@parkbad-gt.de</span>
            </a>
          </div>
        </div>

        <div className="mt-pz5 border-t border-white/10 px-pz7 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            {socialNavigationLinks.social.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-500 hover:text-gray-400"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
          <p className="mt-8 text-xs sm:text-sm leading-5 text-gray-400 md:order-1 md:mt-0">
            &copy; 2023 Parkbad Gütersloh All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
