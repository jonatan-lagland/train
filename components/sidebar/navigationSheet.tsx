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
import NavigationSheetContent from "./navigationSheetContent"

export function NavigationSheet() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className=" p-0" variant="ghost">
                    <TableRows></TableRows>
                </Button>
            </SheetTrigger>
            <SheetContent side={"left"}>
                <SheetHeader>
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>
                        Make changes to your profile here. Click save when you're done.
                    </SheetDescription>
                </SheetHeader>
                <NavigationSheetContent></NavigationSheetContent>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="submit">Save changes</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}