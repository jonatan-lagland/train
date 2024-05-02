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
import NavigationSheetContent from "./navigationSheetContent"
import SettingsDialog from "../nav/settingsDialog"
import { useTranslations } from 'next-intl';
import { CityComboBoxForm } from './cityComboBox';
import { HomeSharp } from '@mui/icons-material';
import Link from 'next/link';

export function NavigationSheet() {

    const t = useTranslations('Navigation');

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className=" p-0" variant="ghost">
                    <ManageSearch sx={{ fontSize: 28 }}></ManageSearch>
                </Button>
            </SheetTrigger>
            <SheetContent className="w-min" side={"left"}>
                <div className="flex flex-col gap-12 py-8">
                    <div className="flex flex-row items-center justify-around">
                        <Link href="/">
                            <div className='sidebar-item'>
                                <HomeSharp></HomeSharp>
                                <span>{t('home')}</span>
                            </div>
                        </Link>
                        <SettingsDialog></SettingsDialog>
                    </div>
                    <div className="flex items-center">
                        <CityComboBoxForm></CityComboBoxForm>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}