"use client";

import { languages } from "@/lib/languages";
import { SelectLanguage } from "./selectLanguage";
import { useLocale } from "next-intl";

const LanguageContainer = () => {

    const locale = useLocale();

    return (
        <SelectLanguage languages={languages} currentLanguageId={locale}></SelectLanguage>
    );
};

export default LanguageContainer;