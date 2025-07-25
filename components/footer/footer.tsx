"use client";
import React from "react";
import LaunchIcon from "@mui/icons-material/Launch";
import { useTranslations } from "next-intl";

function Footer() {
  const t = useTranslations("TermsOfService");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    const confirmed = window.confirm("Are you sure you want to leave this page?");
    if (confirmed) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="flex flex-wrap justify-start items-start gap-5">
      <a
        href="https://www.digitraffic.fi/kayttoehdot/"
        onClick={(e) => {
          handleClick(e, "https://www.digitraffic.fi/kayttoehdot/");
        }}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600"
      >
        <div className="flex flex-row items-center gap-1 text-sm hover:underline">
          <LaunchIcon fontSize="small"></LaunchIcon>
          <span>{t("title")}</span>
        </div>
      </a>
      <div className="text-blue-600">
        <div className="flex flex-row items-center gap-1 text-sm">
          <LaunchIcon fontSize="small"></LaunchIcon>
          <a
            onClick={(e) => {
              handleClick(e, "https://icons8.com/icon/5kH52lu7CJVj/map");
            }}
            target="_blank"
            className="hover:underline"
            rel="noopener noreferrer"
            href="https://icons8.com/icon/5kH52lu7CJVj/map"
          >
            Map
          </a>{" "}
          icon by{" "}
          <a
            onClick={(e) => {
              handleClick(e, "https://icons8.com");
            }}
            target="_blank"
            className="hover:underline"
            rel="noopener noreferrer"
            href="https://icons8.com"
          >
            Icons8
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
