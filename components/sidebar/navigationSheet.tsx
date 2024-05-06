import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ManageSearch } from "@mui/icons-material"
import SettingsDialog from "./settingsDialog"
import { useTranslations } from 'next-intl';
import { CityComboBoxForm } from './cityComboBox';
import { HomeSharp } from '@mui/icons-material';
import Link from 'next/link';
import { useState } from "react";
import HomeIcon from "./homeIcon";
import NavigationSheetContent from "./navigationSheetContent";

export function NavigationSheet() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className=" p-0" variant="ghost">
                    <ManageSearch sx={{ fontSize: 28 }}></ManageSearch>
                </Button>
            </SheetTrigger>
            <SheetContent className="w-min" side={"left"}>
                <NavigationSheetContent></NavigationSheetContent>
            </SheetContent>
        </Sheet>
    )
}