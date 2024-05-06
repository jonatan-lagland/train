import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ManageSearch } from "@mui/icons-material"
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