"use client";
import React from "react";
import Lottie from "react-lottie";
import animationData from "../../../../public/pb_animate.json"; // Adjust the import path according to your file structure

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function Loading() {
  return (
    <div className=" flex justify-center items-center  w-screen h-screen overflow-hidden bg-slate-950">
      <Lottie options={defaultOptions} width={500} height={500} />
    </div>
  );
}
