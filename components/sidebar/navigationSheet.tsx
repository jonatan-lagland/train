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
import { TableRows } from "@mui/icons-material"
import { SelectLanguage } from "../nav/selectLanguage"
import { languages } from "@/lib/languages"
import { useLocale } from 'next-intl';

export function NavigationSheet() {

    const locale = useLocale();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className=" p-0" variant="ghost">
                    <TableRows></TableRows>
                </Button>
            </SheetTrigger>
            <SheetContent side={"bottom"}>
                <SheetHeader>
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>
                        Make changes to your profile here. Click save when you're done.
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <SelectLanguage languages={languages} currentLanguageId={locale}></SelectLanguage>
                    <SelectLanguage languages={languages} currentLanguageId={locale}></SelectLanguage>
                    <SelectLanguage languages={languages} currentLanguageId={locale}></SelectLanguage>
                    <SelectLanguage languages={languages} currentLanguageId={locale}></SelectLanguage>

                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="submit">Save changes</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}