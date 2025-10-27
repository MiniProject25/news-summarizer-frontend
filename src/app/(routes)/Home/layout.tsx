import NavBar from "@/components/navbar"

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-y-3">
            <NavBar />
            {children}
        </div>
    )
}