export interface Manga {
    id: string;
    title: string;
    cover: string;
    rating?: number;
    status: string;
    latestChapter?: string;
    updatedAt?: string;
    genres?: string[];
    description?: string;
}

export interface Chapter {
    id: string;
    chapter: string;
    title?: string;
    publishAt: string;
    manga: {
        id: string;
        title: string;
        cover: string;
    };
}
