"use client";
import React from "react";
import LaunchIcon from "@mui/icons-material/Launch";
import { useTranslations } from "next-intl";

function Footer() {
  const t = useTranslations("TermsOfService");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const confirmed = window.confirm("Are you sure you want to leave this page?");
    if (confirmed) {
      window.open("https://www.digitraffic.fi/kayttoehdot/", "_blank");
    }
  };

  return (
    <div className="flex flex-wrap justify-start items-center">
      <a href="https://www.digitraffic.fi/kayttoehdot/" onClick={handleClick} target="_blank" rel="noopener noreferrer" className="text-blue-600">
        <div className="flex flex-row items-center gap-1 text-sm hover:underline">
          <LaunchIcon fontSize="small"></LaunchIcon>
          <span>{t("title")}</span>
        </div>
      </a>
    </div>
  );
}

export default Footer;
