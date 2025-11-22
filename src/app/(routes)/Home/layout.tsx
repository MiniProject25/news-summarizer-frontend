"use client"

import NavBar from "@/components/navbar"
import { useSearchStore } from "@/store/searchStore";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    const { searchQuery, setSearchQuery } = useSearchStore();
    return (
        <div className="flex flex-col gap-y-3">
            <NavBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            {children}
        </div>
    )
}