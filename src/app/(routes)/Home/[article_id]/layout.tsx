export default function ArticleLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-y-3">
            {children}
        </div>
    )
}