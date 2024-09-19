import React from "react";
import Link from "next/link";
import Image from "next/image";

function HomeIcon() {
  return (
    <Link href="/">
      <div className="flex flex-row items-center gap-3 px-7 shadow-sm py-1 h-full bg-orange-700 hover:brightness-105 transition-all duration-300 ease-in-out">
        <Image
          alt="logo"
          width={64}
          height={64}
          src={"/icon-suomilinja-white-128x128.png"}
        ></Image>
        <span className="text-white font-bold font-besley hidden md:block">
          Suomilinja
        </span>
      </div>
    </Link>
  );
}

export default HomeIcon;
