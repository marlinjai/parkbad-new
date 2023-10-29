import brandLogo from "../../media/Logo_redo_origclolours.png";
import Image from "next/image";

const logoSize = 250;

export function Logo() {
  return (
    <Image
      priority={true}
      src={brandLogo}
      width={logoSize}
      height={logoSize}
      alt={"Logo"}
      className=" -m-pz10 p-pz15"
    ></Image>
  );
}
