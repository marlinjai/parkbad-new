import Link from "next/link";
import { HiOutlineArrowLeft } from "react-icons/hi";

function StudioNavbar(props: any) {
  return (
    <div>
      <div className="bg-neutral-900 p-1.5 flex items-center justify-between">
        <Link href="/" className="text-[#D4D092] flex items-center">
          {/* <Image
            src={brandLogo}
            alt="logo"
            style={{ height: "50px", width: "50px", marginRight: "10px" }}
          /> */}
          <HiOutlineArrowLeft className="h-6 w-6 text-[#D4D092] m-3" />
          Go To Website
        </Link>
      </div>
      <>{props.renderDefault(props)}</>
    </div>
  );
}

export default StudioNavbar;
