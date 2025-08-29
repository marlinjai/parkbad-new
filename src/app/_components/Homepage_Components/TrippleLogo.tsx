// src/app/_components/Homepage_Components/TrippleLogo.tsx
import Image from "next/image";

export default function TrippleIcon() {
  return (
    <>
      <div className="flex pt-12 sm:pt-24 justify-center relative gap-10 md:gap-28 px-[3vw] sm:px-[30vw]">
        <span className="absolute top-1"></span>
        
        {/* Asset 1 - Complex circular design */}
        <div className="flex justify-center text-center">
          <Image
            src="/Asset 1.svg"
            alt="Parkbad logo design 1"
            width={120}
            height={80}
            className="w-[16vw] sm:w-[10vw] lg:w-[8vw] h-auto"
          />
        </div>

        {/* Asset 2 - Wave design */}
        <div className="flex justify-center text-center">
          <Image
            src="/Asset 2.svg"
            alt="Parkbad logo design 2"
            width={120}
            height={80}
            className="w-[16vw] sm:w-[10vw] lg:w-[8vw] h-auto"
          />
        </div>

        {/* Asset 3 - Circular gear design */}
        <div className="flex justify-center text-center">
          <Image
            src="/Asset 3.svg"
            alt="Parkbad logo design 3"
            width={120}
            height={80}
            className="w-[16vw] sm:w-[10vw] lg:w-[8vw] h-auto"
          />
        </div>
      </div>
    </>
  );
}