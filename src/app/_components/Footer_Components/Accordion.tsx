import { AccordionProps } from "@/types/componentTypes";
import React, { useState } from "react";

const Accordion: React.FC<AccordionProps> = ({
  data,
  openModal,
  requiresModal,
}) => {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const handleClick = (index: number) => {
    setOpenIndices((prevOpenIndices) =>
      prevOpenIndices.includes(index)
        ? prevOpenIndices.filter((ind) => ind !== index)
        : [...prevOpenIndices, index]
    );
  };

  return data.map((item, index) => (
    <div
      className={`flex flex-col sm:w-full md:w-1/3 lg:w-1/4 ${
        openIndices.includes(index) ? "open" : ""
      }`}
      key={index}
    >
      <p className="accordion-header">
        <button
          className="accordion-button text-uppercase flex w-full justify-between bg-transparent p-4 text-xl"
          onClick={() => handleClick(index)}
        >
          <span className="hover:text-brand-accent-4 text-brand-colour-light">
            {item.title}
          </span>
          {openIndices.includes(index) ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m6-6H6"
              />
            </svg>
          )}
        </button>
      </p>
      <div
        className=" text-brand-colour-light accordion-body overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: openIndices.includes(index) ? "1000px" : "0" }}
      >
        <ul className="px-2">
          {item.links.map((link, linkIndex) => (
            <li className="footer-link pb-4 pl-2 pr-2" key={linkIndex}>
              {requiresModal(item.title) ? (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    openModal(`modal-${index}-${linkIndex}`); // use index from data.map here
                  }}
                  className="text-md hover:text-brand-colour-dark"
                >
                  {link.name}
                </a>
              ) : (
                <a
                  href={link.href}
                  className="text-md hover:text-brand-colour-dark"
                >
                  {link.name}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
      <hr />
    </div>
  ));
};

export default Accordion;
