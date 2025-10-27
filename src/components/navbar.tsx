import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Input } from "./ui/input";
import Link from "next/link";

export default function NavBar() {
    return (
        <nav className="flex border-b sticky top-0 z-50 bg-white shadow-sm px-8 py-3 items-center justify-between text-center">
            <h1 className="text-xl font-semibold">News-Aggreg</h1>

            <NavigationMenu className="">
                <NavigationMenuList className="flex gap-6">
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link href="/Home">Home</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link href="/aboutus">About Us</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link href="/contact">Contact Us</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <div>
                <Input placeholder="Search for an article"></Input>
            </div>
        </nav>
    )
}