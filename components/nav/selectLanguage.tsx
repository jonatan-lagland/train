"use client";
import * as React from "react";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { useRouter, usePathname } from "@/navigation";
import { useTranslations } from "next-intl";

export type Languages = {
  id: string;
  src: string;
  alt: string;
  name: string;
  label: string;
};

export type LanguagesProps = {
  languages: Languages[];
  currentLanguageId: string;
  size?: number;
};

type SelectItemLanguageProps = {
  lang: Languages;
  size: number;
  children: React.ReactNode;
};

type Locale = "en" | "fi" | "se" | undefined;

const SelectItemLanguage = ({ lang, size, children }: SelectItemLanguageProps) => {
  return (
    <div className="flex flex-row items-center gap-3">
      <Image src={lang.src} width={size} height={size} alt={lang.alt} />
      {children}
    </div>
  );
};

/* 
    NOTE: usePathname and useRouter use the next-intl wrapper
    * languages:                An array of all available languages
    * currentLanguageId:        Id of the default or currently selected language
    * size                      Size of the country flag image
*/

export function SelectLanguage({ languages, currentLanguageId, size = 24 }: LanguagesProps) {
  const currentLanguage = languages.find((lang) => lang.id === currentLanguageId);
  const label = currentLanguage?.label || "Select a language";
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Navigation");

  const handleLocaleChange = (selectedLanguage: string) => {
    router.replace(pathname, {
      locale: (selectedLanguage as Locale) ?? undefined, // Ensure 'undefined' is not coerced into a string
    });
    router.refresh();
  };

  return (
    <Select onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-max h-max" aria-label={t("selectLanguage")}>
        <SelectValue
          placeholder={
            currentLanguage ? (
              <SelectItemLanguage lang={currentLanguage} size={size}>
                {currentLanguage.name}
              </SelectItemLanguage>
            ) : (
              t("selectLanguage")
            ) // Fallback placeholder text
          }
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel className=" text-gray-700">{label}</SelectLabel>
          {languages.map((lang) => (
            <SelectItem className="text-gray-600" key={lang.id} value={lang.id}>
              <SelectItemLanguage lang={lang} size={size}>
                {lang.name}
              </SelectItemLanguage>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
