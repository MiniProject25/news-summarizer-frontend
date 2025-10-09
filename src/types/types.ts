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
}