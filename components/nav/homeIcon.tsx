import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

async function HomeIcon() {
  const t = await getTranslations("Nav");

  return (
    <Link href="/">
      <div className="flex flex-row items-center gap-2 h-full">
        <Image alt="logo" width={64} height={64} src={"/logo.png"}></Image>
        <div className="flex flex-col">
          <span className="text-[#3e4f23] text-xl font-bold font-besley hidden md:block">Suomilinja</span>
          <span className="font-besley">{t("logo")}</span>
        </div>
      </div>
    </Link>
  );
}

export default HomeIcon;
