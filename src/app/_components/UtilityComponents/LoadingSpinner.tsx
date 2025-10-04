"use client";
import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import animationData from "../../../../public/pb_animate.json"; // Adjust the import path according to your file structure

export default function Loading() {
  const container = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && container.current) {
      lottie.loadAnimation({
        container: container.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: animationData,
      });

      // Clean-up function
      return () => {
        lottie.destroy();
      };
    }
  }, []);

  return (
    <div className=" flex justify-center items-center  w-screen h-screen overflow-hidden bg-slate-950">
      <div
        className=" -ml-3 md:scale-125"
        ref={container}
        style={{ width: 400, height: 400 }}
      ></div>
    </div>
  );
}
