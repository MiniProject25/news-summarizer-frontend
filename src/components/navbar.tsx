"use client"

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Input } from "./ui/input";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast"

const logout = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/logout`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });
        if (response.ok) {
            toast.success("Logged out Successfully");
            window.location.reload();
        } else {
            toast.error("Logout failed. Please try again.");
        }
    } catch (error) {
        console.error(`Failed to logut, ${error}`);
        toast.error("Network error. Could not connect to the server.");
    }
}

interface NavBarProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
}

export default function NavBar({ searchQuery, setSearchQuery }: NavBarProps) {
    return (
        <nav className="flex border-b sticky top-0 z-50 bg-white shadow-sm px-8 py-3 items-center justify-between">
            <Link href="/Home" className="font-bold text-xl hover:text-blue-600">
                News-Aggreg
            </Link>
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
                            <Link href="/contactus">Contact Us</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <div className="flex gap-x-4">
                <input
                    type="text"
                    placeholder="Search articles..."
                    className="px-4 py-2 border rounded-lg w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="cursor-pointer w-full py-1 px-1 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors" onClick={logout}>Logout</button>
            </div>
            <Toaster position="bottom-center" />
        </nav>
    )
}