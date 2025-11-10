export interface Source {
    reference_id: number;
    article_id: number;
    source_url: string;
    published_date: Date;
    source_name: string;
    bias: string
    article: articleType;
}

export interface articleType {
    article_id: string;
    image_url?: string;
    title: string;
    summary: string;
    created_at: string | Date;
    category?: string;
    left_bias?: number;
    center_bias?: number;
    right_bias?: number;
    views?: number;
    sources?: Source[];
    content_hash: string;
}

export interface RelatedArticle {
    id: string; // The articleId returned by your RAG service
    title: string;
    url: string; // URL to the article page
}

export interface NewsSource {
    name: string;
    url: string;
    publication_date: string; // ISO string or similar
}

export interface SourceBreakdownData {
    left: NewsSource[];
    center: NewsSource[];
    right: NewsSource[];
}