import React from "react";
import Image from "next/image";
import brandLogo from "../../../assets/logo temporary.png";

function StudioIcon() {
  return (
    <div className="flex items-center space-x-2">
      <Image
        className="rounden-full object-cover"
        height={300}
        width={300}
        src={brandLogo}
        alt="logo"
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />
    </div>
  );
}

export default StudioIcon;
