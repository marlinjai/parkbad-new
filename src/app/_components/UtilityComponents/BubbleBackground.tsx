"use client";

import React, { useEffect, useState } from "react";

// If you want to explicitly define the props (including children)
interface BubbleBackgroundProps {
  children?: React.ReactNode;
}

const BubbleBackground: React.FC<BubbleBackgroundProps> = ({ children }) => {
  const [curX, setCurX] = useState<number>(0);
  const [curY, setCurY] = useState<number>(0);
  const [tgX, setTgX] = useState<number>(0);
  const [tgY, setTgY] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const move = () => {
      setCurX((curX) => curX + (tgX - curX) / 20);
      setCurY((curY) => curY + (tgY - curY) / 20);
      if (typeof window !== "undefined") {
        requestAnimationFrame(move);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      setTgX(event.clientX);
      setTgY(event.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    move();

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [tgX, tgY]);
  return (
    <div className="w-full h-full overflow-hidden">
      {children}
      <div className="gradients-container h-full w-full z-20 filter blur-2xl">
        {/* Your gradient divs go here, styled with Tailwind */}
        <div className="g1"></div>
        <div className="g2"></div>
        <div className="g3"></div>
        <div className="g4"></div>
        <div className="g5"></div>

        {/* Add other gradients similarly */}
        <div
          className="interactive"
          style={{
            transform: `translate(${Math.round(curX)}px, ${Math.round(
              curY
            )}px)`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default BubbleBackground;
