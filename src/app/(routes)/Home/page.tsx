'use client';

import { useEffect, useState } from "react";
import NewsCard from "../../../components/NewsCard";
import { articleType } from "@/types/types";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useSearchStore } from "@/store/searchStore";

// --- Helper Components for UI States ---

const LoadingSpinner = () => (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="mt-4 text-xl font-medium text-gray-700">Loading news...</span>
    </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
    <div className="flex flex-col justify-center items-center min-h-screen bg-red-50 p-4">
        <svg className="h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 className="mt-4 text-2xl font-semibold text-red-800">Oops! Something went wrong.</h2>
        <p className="mt-2 text-lg text-gray-700">{message}</p>
    </div>
);

const NoArticlesMessage = () => (
    <div className="flex flex-col justify-center items-center min-h-[50vh] bg-gray-50">
        <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-4 8h4"></path>
        </svg>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">No News Today</h2>
        <p className="mt-2 text-lg text-gray-600">Please check back later for the latest updates.</p>
    </div>
);

// --- Main Component ---
export default function Home() {
    const [articles, setArticles] = useState<articleType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const { searchQuery } = useSearchStore();

    const categories = ["finance", "politics", "business", "tech",
        "world", "sports", "entertainment",
        "science", "health"]
    const SOURCES = [
        { name: "Forbes", url: "https://www.forbes.com", bias: "center" },
        { name: "Bloomberg", url: "https://www.bloomberg.com", bias: "left" },
        { name: "CNBC", url: "https://www.cnbc.com", bias: "left" },
        { name: "Financial Times", url: "https://www.ft.com", bias: "center" },
        { name: "The Economist", url: "https://www.economist.com", bias: "left" },
        { name: "Harvard Business Review", url: "https://hbr.org", bias: "center" },
        { name: "MarketWatch", url: "https://www.marketwatch.com", bias: "center" },
        { name: "Wall Street Journal – Business", url: "https://www.wsj.com", bias: "center" },
        { name: "Business Insider", url: "https://www.businessinsider.com", bias: "center" },
        { name: "Investopedia", url: "https://www.investopedia.com", bias: "center" },
    ];


    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/article/articles/`);
                if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
                const data = await res.json();
                setArticles(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    // Step 1 — Category filter
    let filteredArticles = selectedCategory
        ? articles.filter(a => a.category === selectedCategory)
        : articles;

    // Step 2 — Search filter (case-insensitive)
    if (searchQuery.trim() !== "") {
        filteredArticles = filteredArticles.filter(a =>
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.summary.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    const mostViewed = [...articles]
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);  // top 10 articles of the month

    return (
        <main className="min-h-screen bg-gray-50">

            {/* Main Layout */}
            <div className="max-w-[1400px] mx-auto px-4 py-12 flex gap-8">
                {/* LEFT SIDEBAR */}
                <aside className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-semibold mb-4 text-gray-800">Sources we fetch from</h3>

                    <ul className="space-y-3">
                        {SOURCES.map((s) => (
                            <li key={s.name}>
                                <a
                                    href={s.url}
                                    target="_blank"
                                    className="text-blue-600 hover:underline hover:text-blue-800 transition"
                                >
                                    {s.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </aside>


                {/* CENTER CONTENT */}
                <section className="max-w-[900px] mx-auto w-full">
                    {filteredArticles.length === 0 ? (
                        <NoArticlesMessage />

                        // If category selected OR searchQuery typed → show article grid
                    ) : selectedCategory || searchQuery.trim() !== "" ? (
                        <>
                            <h2 className="text-2xl font-bold mb-6 capitalize">
                                {searchQuery
                                    ? `Search results for "${searchQuery}"`
                                    : `${selectedCategory} News`}
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredArticles.map((a) => (
                                    <NewsCard key={a.article_id} {...a} />
                                ))}
                            </div>
                        </>

                        // Otherwise show homepage
                    ) : (
                        <>
                            {/* TODAY'S NEWS */}
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold mb-4">Today's News</h2>
                                <Carousel opts={{ align: "start" }}>
                                    <CarouselContent>
                                        {articles.slice(0, 6).map((a) => (
                                            <CarouselItem key={a.article_id} className="basis-1/2 lg:basis-1/3">
                                                <div className="p-1">
                                                    <NewsCard {...a} />
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                </Carousel>
                            </div>

                            {/* MOST VIEWED */}
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Most viewed articles of the month</h2>
                                <Carousel opts={{ align: "start" }}>
                                    <CarouselContent>
                                        {mostViewed.map((a) => (
                                            <CarouselItem key={a.article_id} className="basis-1/2 lg:basis-1/3">
                                                <div className="p-1">
                                                    <NewsCard {...a} />
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                </Carousel>
                            </div>
                        </>
                    )}
                </section>

                {/* RIGHT SIDEBAR */}
                <aside className="p-4 w-64 bg-white shadow rounded-xl">
                    <h3 className="font-semibold mb-4">Categories</h3>

                    <ul className="space-y-2">
                        {categories.map((c) => (
                            <li key={c}>
                                <button
                                    onClick={() => setSelectedCategory(c)}
                                    className={`w-full text-left px-3 py-2 rounded-lg 
                                        ${selectedCategory === c ? "bg-blue-200 font-semibold" : "hover:bg-gray-100"}
                                    `}
                                >
                                    {c}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {selectedCategory && (
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="mt-4 text-sm text-blue-600 underline"
                        >
                            Clear Filter
                        </button>
                    )}

                </aside>

            </div>
        </main>
    );
}
