'use client';

import { useEffect, useState } from "react";
import NewsCard from "../../../components/NewsCard";
import { articleType } from "@/types/types";

// --- Helper Components for UI States ---

// You can replace this with a more sophisticated spinner component
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
        <svg className="h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 className="mt-4 text-2xl font-semibold text-red-800">Oops! Something went wrong.</h2>
        <p className="mt-2 text-lg text-gray-700">{message}</p>
    </div>
);

const NoArticlesMessage = () => (
    <div className="flex flex-col justify-center items-center min-h-[50vh] bg-gray-50">
        <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-4 8h4"></path>
        </svg>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">No News Today</h2>
        <p className="mt-2 text-lg text-gray-600">Please check back later for the latest updates.</p>
    </div>
);

// --- Main Component ---

export default function Home({ /*searchQuery*/ }) {
    const [articles, setArticles] = useState<articleType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch articles
    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true); // Set loading true at the start of fetch
            setError(null);
            // if (searchQuery) params.append('search', searchQuery);

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/article/articles/`);

                if (!res.ok) {
                    throw new Error(`HTTP Error! Status: ${res.status}`);
                }
                const data = await res.json();
                setArticles(data);
            } catch (err) {
                console.error('Error fetching articles:', err);
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setLoading(false); // Set loading false after try/catch
            }
        };

        fetchArticles();
    }, []); // Dependency array is empty, runs once on mount

    // --- Conditional Rendering ---

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    // --- Main Content ---

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Show this only if there are no articles *after* loading */}
                {articles.length === 0 ? (
                    <NoArticlesMessage />
                ) : (
                    <>
                        {/* Daily News / Trending Section */}
                        <section aria-labelledby="daily-news-heading">
                            <header className="mb-6">
                                <h2 id="daily-news-heading" className="text-3xl font-bold tracking-tight text-gray-900 flex items-center">
                                    <span className="text-red-500 mr-3">🔥</span> Daily News
                                </h2>
                                <p className="mt-2 text-lg text-gray-600">
                                    Your daily dose of breaking news and top stories.
                                </p>
                            </header>

                            <div className="relative">
                                <div className="flex gap-6 overflow-x-auto hide-scrollbar px-2 py-4">
                                    {articles.map((a) => (
                                        <div key={a.article_id} className="flex-shrink-0 w-80">
                                            <NewsCard {...a} />
                                        </div>
                                    ))}
                                </div>

                                {/* Fade left */}
                                <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-gray-50 to-transparent" />

                                {/* Fade right */}
                                <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-gray-50 to-transparent" />
                            </div>
                        </section>

                        {/* Today's Summary Section */}
                        <section aria-labelledby="summary-heading" className="mt-16">
                            <header className="mb-8">
                                <h2 id="summary-heading" className="text-3xl font-bold tracking-tight text-gray-900">
                                    Today's News Summary
                                </h2>
                                <p className="mt-2 text-lg text-gray-600">
                                    A complete overview of all articles for today.
                                </p>
                            </header>

                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {articles.map((a) => (
                                    <NewsCard key={a.article_id} {...a} />
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </div>
        </main>
    );
}