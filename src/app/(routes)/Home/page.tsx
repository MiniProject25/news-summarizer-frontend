'use client';

import { useEffect, useState } from 'react';
import Category from '../../../components/Category';
import NewsCard from '../../../components/NewsCard';
import type { articleType, Source } from '@/types/types';

export default function Home({ searchQuery }: { searchQuery: string }) {
    const [articles, setArticles] = useState<articleType[]>([]);
    // const [trending, setTrending] = useState([]);

    // Fetch today's articles
    useEffect(() => {
        const fetchArticles = async () => {
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/article/articles/?${params.toString()}`);
                const data = await res.json();
                setArticles(data);
            } catch (err) {
                console.error('Error fetching articles:', err);
            }
        };

        fetchArticles();
    }, [searchQuery]);

    return (
        <div>
            {/* Daily Section */}
            <h2 className="text-xl font-bold flex items-center">
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
