import Link from "next/link";
import { HiOutlineArrowLeft } from "react-icons/hi";

//Add global color theme

function StudioNavbar(props: any) {
  return (
    <div>
      <div className="bg-neutral-900 p-1.5 flex items-center justify-between">
        <Link href="/" className="text-[#D4D092] flex items-center">
          <HiOutlineArrowLeft className="h-6 w-6 text-[#D4D092] m-3" />
          Go To Website
        </Link>
      </div>
      <>{props.renderDefault(props)}</>
    </div>
  );
}

export default StudioNavbar;
