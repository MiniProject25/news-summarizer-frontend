'use client';

import { articleType, NewsSource, RelatedArticle, SourceBreakdownData } from '@/types/types';
import React, { useEffect, useState } from 'react';

type BiasIndicatorProps = {
    left: number;
    center: number;
    right: number;
};

const BiasIndicator = ({ left, center, right }: BiasIndicatorProps) => {
    const total = left + center + right;

    if (total === 0) {
        return <p className="text-center text-sm text-gray-500 mt-2">No bias breakdown available.</p>;
    }

    const leftPercent = (left / total) * 100;
    const centerPercent = (center / total) * 100;
    const rightPercent = (right / total) * 100;

    const data = [
        { label: 'Left', percent: leftPercent, color: 'bg-blue-500', textColor: 'text-blue-600' },
        { label: 'Center', percent: centerPercent, color: 'bg-green-500', textColor: 'text-green-600' },
        { label: 'Right', percent: rightPercent, color: 'bg-red-500', textColor: 'text-red-600' },
    ];

    return (
        <div className="p-5 bg-white rounded-xl shadow-inner border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Bias Breakdown</h3>

            <div className="flex justify-between text-xs font-medium mb-1">
                <span className={data[0].textColor}>Left {leftPercent.toFixed(0)}%</span>
                <span className={data[1].textColor}>Center {centerPercent.toFixed(0)}%</span>
                <span className={data[2].textColor}>Right {rightPercent.toFixed(0)}%</span>
            </div>

            {/* Continuous Proportional Bar */}
            <div className="flex h-3 rounded-full overflow-hidden mb-2 shadow-md">
                {data.map((item, index) => (
                    // Only render segments with a non-zero percentage
                    item.percent > 0 && (
                        <div
                            key={index}
                            className={item.color}
                            style={{ width: `${item.percent}%` }}
                            title={`${item.label}: ${item.percent.toFixed(1)}%`}
                        ></div>
                    )
                ))}
            </div>

            <p className="text-xs text-gray-400 text-center mt-3">
                Distribution based on the article's detected language and framing.
            </p>
        </div>
    );
};

// Related Articles Component
const RelatedArticlesList: React.FC<{ articles: RelatedArticle[] }> = ({ articles }) => {
    if (articles.length === 0) {
        return (
            <div>
                No related Articles
            </div>
        )
    };
    return (
        <div className="p-5 bg-white rounded-xl shadow-2xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">⭐ Similar Articles</h3>
            <ul className="space-y-3">
                {articles.map((art) => (
                    <li key={art.id} className="text-sm">
                        <a
                            href={`${art.url}`}
                            className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-150 ease-in-out block"
                        >
                            {art.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Source breakdown component
const SourceColumn: React.FC<{ title: string, color: string, sources: NewsSource[] }> = ({ title, color, sources }) => (
    <div className={`p-4 rounded-xl border border-${color}-100 w-full`}>
        <h4 className={`text-lg font-semibold text-${color}-700 mb-3`}>{title} ({sources.length})</h4>
        <ul className="space-y-2 text-sm">
            {sources.length > 0 ? (
                sources.map((source) => (
                    <li key={source.url} className="border-b border-gray-100 pb-1 last:border-b-0">
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 font-normal">
                            {source.name}
                            <span className="text-xs text-gray-400 ml-2">({new Date(source.publication_date).toLocaleDateString()})</span>
                        </a>
                    </li>
                ))
            ) : (
                <p className="text-sm text-gray-500 italic">No sources found.</p>
            )}
        </ul>
    </div>
);

export default function ArticlePage() {

    // State to hold the article ID extracted from the browser's URL
    const [articleId, setArticleId] = useState<string | null>(null);
    const [article, setArticle] = useState<articleType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([])
    // const [sourceList, setSourceList] = useState<SourceBreakdownData[]>([])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const path = window.location.pathname;
            // Assumes the ID is the last segment of the path (e.g., /home/123 -> 123)
            const segments = path.split('/').filter(Boolean);
            const id = segments[segments.length - 1];
            setArticleId(id);
        }
    }, []);

    useEffect(() => {
        const finalId = articleId;

        // Only proceed if the ID has been extracted and is valid
        if (!finalId) {
            // Set loading to false only if we have determined the ID is missing/null
            if (articleId !== null) setLoading(false);
            return;
        }

        const fetchArticle = async () => {
            setLoading(true);
            setError(null);

            try {
                // Use the state variable finalId directly in the fetch URL
                const [res, relatedIdsRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/article/${finalId}`),
                    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/article/similar-articles/${finalId}`)
                ]);

                if (!res.ok) {
                    throw new Error(`Failed to fetch article ${finalId}: HTTP ${res.status}`);
                }
                if (!relatedIdsRes.ok) console.warn("Could not fetch related article IDs.")

                const data = await res.json() as articleType;
                setArticle(data);

                const relatedIdsResponse = await relatedIdsRes.json();
                const relatedIdsData: number[] = relatedIdsResponse.results || []
                if (relatedIdsData.length > 0) {
                    const relatedArticlesRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/article/details?ids=${relatedIdsData.join(',')}`)
                    if (relatedArticlesRes.ok) {
                        const relatedArticlesData = await relatedArticlesRes.json();
                        setRelatedArticles(relatedArticlesData);
                    }
                }
            } catch (err: any) {
                console.error("Error fetching article:", err);
                setError(err.message || 'An unknown error occurred while fetching the article.');
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [articleId]); // Dependency is the ID from state, not props

    // --- Component Rendering ---

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-xl font-medium text-indigo-600 animate-pulse">Loading article details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-20 bg-red-100 border border-red-400 text-red-700 rounded-xl max-w-lg mx-auto mt-10 shadow-lg">
                <h2 className="text-2xl font-bold mb-2">Fetch Error</h2>
                <p className="text-lg">Error loading article: {error}</p>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="text-center p-20 text-gray-500 text-xl font-medium">
                Article ID <span className="font-mono text-gray-800 bg-gray-200 px-2 py-1 rounded-md">{articleId || 'N/A'}</span> not found.
            </div>
        );
    }

    // Determine if bias data exists to render the sidebar/indicator
    const hasBiasData =
        article.left_bias !== undefined ||
        article.center_bias !== undefined ||
        article.right_bias !== undefined;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content Area (Col Span 2) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 sm:p-10 rounded-xl shadow-2xl">

                        {/* Article Header & Metadata */}
                        <div className="pb-6 border-b border-gray-100">
                            <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">{article.category}</span>
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mt-4 mb-4 leading-tight">
                                {article.title}
                            </h1>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>{new Date(article.created_at).toLocaleDateString()}</span>
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                                    {article.views}
                                </span>
                            </div>
                        </div>

                        {/* Image */}
                        {article.image_url && (
                            <img
                                src={article.image_url.trim()}
                                alt={article.title}
                                onError={(e) => { e.currentTarget.src = 'https://placehold.co/800x400/6366f1/ffffff?text=Article+Image+Missing'; }}
                                className="w-full h-auto max-h-96 object-cover rounded-xl mt-8 mb-8 shadow-md"
                            />
                        )}

                        {/* Summary */}
                        <p className="text-xl italic text-gray-700 mb-10 border-l-4 border-indigo-500 pl-4 bg-indigo-50 p-4 rounded-lg">
                            {article.summary}
                        </p>
                    </div>
                </div>

                {/* Sidebar Area (Col Span 1) */}
                <div className="lg:col-span-1 space-y-8">

                    {/* Bias Breakdown Card */}
                    {hasBiasData && (
                        <BiasIndicator
                            left={article.left_bias || 0}
                            center={article.center_bias || 0}
                            right={article.right_bias || 0}
                        />
                    )}

                    <RelatedArticlesList articles={relatedArticles} />
                </div>
            </div>
        </div>
    );
}
