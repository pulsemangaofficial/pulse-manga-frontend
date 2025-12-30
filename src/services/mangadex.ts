import axios from 'axios';

const BASE_URL = 'https://mangadex-proxy.pulsemangaofficial.workers.dev/';
const COVER_URL = 'https://mangadex-proxy.pulsemangaofficial.workers.dev/covers';

export interface Manga {
    id: string;
    title: string;
    cover: string;
    rating?: number;
    status: string;
    synopsis?: string;
    tags?: string[];
    year?: number;
    author?: string;
    altTitles?: string[];
}

export interface Chapter {
    id: string;
    volume: string;
    chapter: string;
    title: string;
    publishAt: string;
    pages?: number;
    scanlator?: string;
}

// Helper to resolve cover URL
const getCoverUrl = (mangaId: string, fileName: string) => {
    return `${COVER_URL}/${mangaId}/${fileName}.256.jpg`;
};

// Helper to transform MangaDex response
const transformManga = (data: any): Manga => {
    const attrs = data.attributes;
    const rels = data.relationships || [];
    const coverRel = rels.find((r: any) => r.type === 'cover_art');
    const coverFileName = coverRel?.attributes?.fileName;

    // Find title (priority: en -> first available)
    const title = attrs.title.en || Object.values(attrs.title)[0] || 'Unknown Title';

    return {
        id: data.id,
        title: String(title),
        cover: coverFileName ? getCoverUrl(data.id, coverFileName) : '/placeholder.jpg',
        status: attrs.status,
        synopsis: attrs.description?.en || '',
        year: attrs.year,
        tags: attrs.tags.map((t: any) => t.attributes.name.en),
    };
};

export const MangaDexService = {
    // Get Popular / Trending
    // Get Popular / Trending
    getPopular: async (limit = 20, offset = 0) => {
        try {
            const response = await axios.get(`${BASE_URL}/manga`, {
                params: {
                    limit,
                    offset,
                    includes: ['cover_art'],
                    order: { followedCount: 'desc' },
                    contentRating: ['safe', 'suggestive'],
                    hasAvailableChapters: 'true'
                }
            });
            return response.data.data.map(transformManga);
        } catch (error) {
            console.error("MangaDex API Error:", error);
            return [];
        }
    },

    // Get Top Ranking (Filtered)
    getTopRanking: async (timeframe: 'trending' | 'week' | 'all') => {
        let order: any = { followedCount: 'desc' };

        if (timeframe === 'week') {
            // "Top Week" - Since we lack view stats, we'll proxy with "relevance" or "createdAt" for new & hot
            // However, users expect "Top" to be popular.
            // Let's use 'relevance' to give a different flavor than 'followedCount'
            order = { relevance: 'desc' };
        } else if (timeframe === 'all') {
            // All Time Best = Highest Rated
            order = { rating: 'desc', followedCount: 'desc' };
        }

        try {
            const response = await axios.get(`${BASE_URL}/manga`, {
                params: {
                    limit: 10,
                    includes: ['cover_art'],
                    order,
                    contentRating: ['safe', 'suggestive'],
                    hasAvailableChapters: 'true'
                }
            });
            return response.data.data.map(transformManga);
        } catch (error) {
            return [];
        }
    },


    // Get Latest Updates
    getLatestUpdates: async (limit = 20) => {
        // Note: To get latest chapters we usually query /chapter, but for home page updates section usually we show manga with new chapters.
        // For simplicity, let's query manga sorted by updatedAt or latestUploadedChapter
        try {
            const response = await axios.get(`${BASE_URL}/manga`, {
                params: {
                    limit,
                    includes: ['cover_art'],
                    order: { latestUploadedChapter: 'desc' },
                    contentRating: ['safe', 'suggestive'],
                }
            });
            return response.data.data.map(transformManga);
        } catch (error) {
            console.error("MangaDex API Error:", error);
            return [];
        }
    },

    // Search
    search: async (query: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/manga`, {
                params: {
                    title: query,
                    limit: 10,
                    includes: ['cover_art'],
                }
            });
            return response.data.data.map(transformManga);
        } catch (error) {
            return [];
        }
    },

    // Get Manga Details
    getMangaDetails: async (id: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/manga/${id}`, {
                params: { includes: ['cover_art', 'author', 'artist'] }
            });
            const data = response.data.data;
            const authorRel = data.relationships.find((r: any) => r.type === 'author');

            return {
                ...transformManga(data),
                author: authorRel?.attributes?.name || 'Unknown',
            };
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    // Get Chapters
    getChapters: async (mangaId: string, limit = 100, offset = 0) => {
        try {
            const response = await axios.get(`${BASE_URL}/manga/${mangaId}/feed`, {
                params: {
                    limit,
                    offset,
                    translatedLanguage: ['en'],
                    order: { chapter: 'desc' },
                    contentRating: ['safe', 'suggestive', 'erotica']
                }
            });

            return response.data.data.map((ch: any) => ({
                id: ch.id,
                volume: ch.attributes.volume,
                chapter: ch.attributes.chapter,
                title: ch.attributes.title,
                publishAt: ch.attributes.publishAt,
                pages: ch.attributes.pages
            })) as Chapter[];
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    // Get Chapter Pages (for Reader)
    getChapterPages: async (chapterId: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/at-home/server/${chapterId}`);
            const baseUrl = response.data.baseUrl;
            const hash = response.data.chapter.hash;
            const files = response.data.chapter.data; // High quality

            return files.map((file: string) => `${baseUrl}/data/${hash}/${file}`);
        } catch (error) {
            console.error("Error fetching pages:", error);
            return [];
        }
    }
};
