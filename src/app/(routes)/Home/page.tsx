'use client';

import { useEffect, useState } from "react";
import NewsCard from "../../../components/NewsCard";
import { articleType } from "@/types/types";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

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

    return (
        <main className="min-h-screen bg-gray-50">

            {/* Main Layout */}
            <div className="max-w-[1400px] mx-auto px-4 py-12 grid grid-cols-[220px_1fr_220px] gap-8">
                {/* LEFT SIDEBAR */}
                <aside className="bg-white border border-gray-300 rounded-xl p-4">
                    <h3 className="font-semibold mb-4">Sources where we fetch from</h3>
                    <ul className="space-y-2 text-gray-600">
                        <li>forbes.com</li>
                        <li>theeconomist.com</li>
                    </ul>
                </aside>

                {/* CENTER CONTENT */}
                <section>
                    {articles.length === 0 ? (
                        <NoArticlesMessage />
                    ) : (
                        <>
                            {/* Today's News */}
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

                            {/* Most Viewed */}
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Most viewed articles of the month</h2>
                                <Carousel opts={{ align: "start" }}>
                                    <CarouselContent>
                                        {articles.slice(6, 12).map((a) => (
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
                <aside className="bg-white border border-gray-300 rounded-xl p-4">
                    <h3 className="font-semibold mb-4">Categories</h3>
                    <ul className="space-y-2 text-gray-600">
                        <li>Politics</li>
                        <li>Entertainment</li>
                        <li>Sports</li>
                    </ul>
                </aside>
            </div>
        </main>
    );
}
