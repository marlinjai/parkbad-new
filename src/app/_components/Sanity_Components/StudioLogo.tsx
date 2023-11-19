import React from "react";
import Image from "next/image";
import brandLogo from "../../../assets/logo temporary.png";

function StudioLogo(props: any) {
  const { renderDefault, title } = props;

  return (
    <div className="flex items-center space-x-2">
      <Image
        className="rounden-full object-cover"
        height={100}
        width={100}
        src={brandLogo}
        alt="logo"
        style={{
          maxWidth: "100%",
          height: "auto"
        }} />
      <>{renderDefault(props)}</>
    </div>
  );
}

export default StudioLogo;
