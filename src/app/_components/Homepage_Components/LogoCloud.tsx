import Image from "next/image";
import React from "react";

import StadtGT from "../../../assets/LogoCloud/stadtGt.svg";
import Joliente from "../../../assets/LogoCloud/joliente_logo_mobile-dark.svg";
import FFGT from "../../../assets/LogoCloud/ffgt.svg";
import StadtwerkeGT from "../../../assets/LogoCloud/logostadtwerke.svg";

const LogoCloud = () => {
  return (
    <>
      {/* Logo cloud */}
      <section id="Partner">
        <div className="relative isolate mt-pz25">
          <div className="absolute inset-x-0 top-1/4 -z-10 mt-pz15 flex -translate-y-1/2 scale-75 justify-center overflow-hidden [mask-image:radial-gradient(50%_45%_at_50%_55%,white,transparent)] sm:mt-pz10 md:scale-100 ">
            <svg
              className="h-[40rem] w-[80rem] flex-none stroke-brand-accent-4"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="e9033f3e-f665-41a6-84ef-756f6778e6fe"
                  width={200}
                  height={200}
                  x="50%"
                  y="50%"
                  patternUnits="userSpaceOnUse"
                  patternTransform="translate(-100 0)"
                >
                  <path d="M.5 200V.5H200" fill="none" />
                </pattern>
              </defs>
              <svg
                x="50%"
                y="50%"
                className="overflow-visible fill-brand-accent-4/50"
              >
                <path
                  d="M-300 0h201v201h-201Z M300 200h201v201h-201Z"
                  strokeWidth={0}
                />
              </svg>
              <rect
                width="100%"
                height="100%"
                strokeWidth={0}
                fill="url(#e9033f3e-f665-41a6-84ef-756f6778e6fe)"
              />
            </svg>
          </div>
        </div>
        <div className="z-10 mx-auto mb-pz20 max-w-7xl px-6 lg:px-8">
          <h2 className="z-20 mb-pz10 text-center text-2sc font-semibold leading-8 text-brand-colour-light">
            Unsere Partner
          </h2>
          <div className=" mx-auto mt-10 grid max-w-lg  grid-cols-4 items-center justify-items-center gap-x-8 gap-y-20 sm:max-w-xl sm:gap-x-28 lg:mx-0 lg:max-w-none">
            {/* Wrap each Image with an <a> tag */}
            <a
              href="https://www.guetersloh.de/de/"
              className=" z-10 col-span-2  lg:col-span-1"
            >
              <Image
                className="max-h-12 w-auto object-contain"
                src={StadtGT}
                alt="StadtGütersloh"
                width={158}
                height={158}
                style={{
                  maxWidth: "100%",
                }}
              />
            </a>
            <a
              href="https://freifunk-kreisgt.de/"
              className=" z-10 col-span-2  lg:col-span-1"
            >
              <Image
                className="max-w-48 max-h-16 object-contain sm:max-h-24"
                src={FFGT}
                alt="FreifunkGütersloh"
                width={158}
                height={158}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            </a>
            <a
              href="https://www.stadtwerke-gt.de/privatkunden/index.php"
              className=" z-10 col-span-2 max-h-12 w-full object-contain  lg:col-span-1"
            >
              <Image
                className="max-h-12 w-auto object-contain"
                src={StadtwerkeGT}
                alt="Stadtwerke Gütersloh"
                width={158}
                height={158}
              />
            </a>
            <a
              href="https://joliente.com/"
              className=" z-10 col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            >
              <Image
                className="max-h-12 w-auto object-contain"
                src={Joliente}
                alt="Statamic"
                width={158}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default LogoCloud;
