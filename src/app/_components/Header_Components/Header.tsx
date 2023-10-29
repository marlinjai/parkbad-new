"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { NavLink } from "./NavLink";
import { ParkbadBuilding } from "./ParkbadBuilding";

interface OverlayNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OverlayNavigation({ isOpen, onClose }: OverlayNavigationProps) {
  // Handle clicks inside the overlay to toggle the menu
  const handleOverlayClick = () => {
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-neutral-950/90 p-4 text-center text-3sc tracking-tight text-neutral-100 ${
        isOpen ? "" : "hidden"
      }`}
      // Handle clicks inside the overlay
      onClick={handleOverlayClick}
    >
      <div className="flex flex-col justify-center gap-8 ">
        <Link className="hover:text-brand-accent-2" href="/">
          Home
        </Link>
        <Link className="hover:text-brand-accent-2" href="/#News">
          Neuigkeiten
        </Link>
        <Link className="hover:text-brand-accent-2" href="/Essen&Trinken">
          Essen & Trinken
        </Link>
        <Link className="hover:text-brand-accent-2" href="/Bildgalerie">
          Bildgalerie
        </Link>
        <Link className="hover:text-brand-accent-2" href="/Historie&Kontakt">
          Historie & Kontakt
        </Link>
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen(!open);
    if (!open) {
      // When opening the overlay, add a class to disable scrolling
      document.body.classList.add("disable-scrolling");
      document.documentElement.classList.add("disable-scrolling");
    } else {
      // When closing the overlay, remove the class to enable scrolling
      document.body.classList.remove("disable-scrolling");
      document.documentElement.classList.remove("disable-scrolling");
    }
  };

  return (
    <header className="relative z-50 flex w-vw100 justify-center bg-brand-accent-4">
      <div className="flex w-vw25 items-center md:w-vw10">
        <Link href="/" aria-label="Home" className="">
          <Logo />
        </Link>
        <div className="hidden text-4xl">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/#News">Neuigkeiten</NavLink>
          <NavLink href="/Essen&Trinken">Essen & Trinken</NavLink>
          <NavLink href="/Bildgalerie">Bildgalerie</NavLink>
          <NavLink href="/Historie&Kontakt">Historie & Kontakt</NavLink>
        </div>
      </div>
      <ParkbadBuilding></ParkbadBuilding>
      <div className="flex w-vw25 items-center justify-center gap-x-5 md:w-vw10 md:gap-x-8">
        <button
          className="z-10 flex h-full w-full items-center justify-center outline-0"
          onClick={toggleMenu}
          aria-label="Toggle Navigation"
        >
          {open ? (
            <svg
              aria-hidden="true"
              className="z-20 h-3.5 w-3.5 rounded-none stroke-neutral-900 lg:h-6 lg:w-6 xl:h-8 xl:w-8 2xl:h-10 2xl:w-10"
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
              viewBox="0 0 14 14"
            >
              <path
                d="M2 2L12 12M12 2L2 12"
                className="origin-center stroke-white opacity-100 hover:stroke-brand-accent-2"
              />
            </svg>
          ) : (
            <svg
              id="Layer_1"
              version="1.1"
              viewBox="0 0 32 32"
              className="z-20 h-5 w-5 rounded-none stroke-neutral-900 lg:h-8 lg:w-8 xl:h-12 xl:w-12 2xl:h-10 2xl:w-10"
              strokeWidth={0.05}
            >
              <path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2 s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2 S29.104,22,28,22z" />
            </svg>
            // <svg
            //   aria-hidden="true"
            //   className="z-20 h-3.5 w-3.5 rounded-none stroke-neutral-900 lg:h-6 lg:w-6 xl:h-8 xl:w-8 2xl:h-10 2xl:w-10"
            //   fill="none"
            //   strokeWidth={2}
            //   strokeLinecap="round"
            //   viewBox="0 0 14 14"
            // >
            //   <path
            //     d="M0 1H14M0 7H14M0 13H14"
            //     className="origin-center stroke-neutral-900 opacity-100"
            //   />

            // </svg>
          )}
        </button>
        <nav>
          <OverlayNavigation isOpen={open} onClose={toggleMenu} />
        </nav>
      </div>
    </header>
  );
}
