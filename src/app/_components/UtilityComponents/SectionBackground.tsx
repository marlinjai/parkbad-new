"use client";

import React from "react";

interface SectionBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionBackground({ children, className = "" }: SectionBackgroundProps) {
  return (
    <section className={`relative w-full bg-gradient-to-br from-gray-800 via-brand-accent-2 via-brand-accent-2/90 to-gray-900 ${className}`}>
      {children}
    </section>
  );
} 