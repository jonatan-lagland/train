"use client";

import { Button } from "@/components/ui/button"
import { Settings } from '@mui/icons-material';
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { languages } from "@/lib/languages";
import { SelectLanguage } from "./selectLanguage";
import { useLocale, useTranslations } from "next-intl";

const SettingsDialog = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const locale = useLocale();
    const t = useTranslations('Navigation');

    return (
        <Dialog onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className='justify-start p-0 text-base' variant={'ghost'} aria-label="Settings">
                    <div
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className="button-hover-animation sidebar-item flex flex-grow flex-row items-center cursor-pointer gap-3">
                        <Settings className={`rotate-icon ${isHovered ? 'rotated' : ''} rounded-full px-0 ${isDialogOpen ? 'rotated' : ''}`} />
                        <label className="hover:cursor-pointer">{t(`settingsTitle`)}</label>
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent className="rounded-md">
                <DialogHeader>
                    <DialogTitle>{t(`settingsTitle`)}</DialogTitle>
                    <DialogDescription>
                        {t(`settingsDescription`)}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 items-center p-2">
                        <span>{t(`language`)}</span>
                        <div className="flex flex-row justify-center">
                            <SelectLanguage languages={languages} currentLanguageId={locale}></SelectLanguage>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

    );
};

export default SettingsDialog;