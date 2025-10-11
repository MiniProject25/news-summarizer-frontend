'use client';

import { useEffect, useState } from "react";
// import Category from "../../../components/Category";
import NewsCard from "../../../components/NewsCard";
import { articleType } from "@/types/types";

export default function Home({ /*searchQuery*/ }) {
    const [articles, setArticles] = useState<articleType[]>([]);
    // const [activeCategory, setActiveCategory] = useState("All");

    // Fetch today's articles
    useEffect(() => {
        const fetchArticles = async () => {
            const params = new URLSearchParams();
            // if (searchQuery) params.append('search', searchQuery);

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/article/articles/`);

                if (!res.ok) {
                    throw new Error(`HTTP Error! Status: ${res.status}`)
                }
                const data = await res.json();
                setArticles(data);
            } catch (err) {
                console.error('Error fetching articles:', err);
            }
        };

        fetchArticles();
    }, []);

    return (
        <div>
            {/* <Category activeCategory={activeCategory} setActiveCategory={setActiveCategory} /> */}
            {/* Trending Section */}
            <h2 className="text-xl font-bold flex items-center mb-2">
                <span className="text-red-500 mr-2">🔥</span> Daily News
            </h2>

            <div className="relative">
                <div className="flex gap-4 overflow-x-auto hide-scrollbar px-2 py-2">
                    {articles.map((a) => (
                        <div key={a.article_id} className="flex-shrink-0 w-72">
                            <NewsCard {...a} />
                        </div>
                    ))}
                </div>

                {/* Fade left */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white to-transparent" />

                {/* Fade right */}
                <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent" />
            </div>

            {/* Today's Summary Section */}
            <h2 className="text-xl font-bold mt-8 mb-4">Today's News Summary</h2>

            <div className="grid mt-4 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {articles.map((a) => (
                    <NewsCard key={a.article_id} {...a} />
                ))}
            </div>
        </div>
    );
}
