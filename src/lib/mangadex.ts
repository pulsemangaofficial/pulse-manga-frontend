import axios from "axios";
import { CONFIG } from "./config";
import { Manga } from "./types";

const client = axios.create({
    baseURL: CONFIG.mangadex.apiUrl,
    timeout: 10000, // 10 seconds timeout to prevent hanging
});

// Helper to construct cover URL
export const getCoverUrl = (mangaId: string, fileName: string) => {
    return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.256.jpg`; // Use optimized thumbnails
};

export const getPopularManga = async (limit = 10): Promise<Manga[]> => {
    try {
        const response = await client.get("/manga", {
            params: {
                limit,
                includes: ["cover_art"],
                order: { followedCount: "desc" },
                contentRating: ["safe", "suggestive"],
                hasAvailableChapters: "true",
            },
        });

        return response.data.data.map((manga: any) => {
            const coverFileName = manga.relationships.find((r: any) => r.type === "cover_art")?.attributes?.fileName;
            return {
                id: manga.id,
                title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
                cover: coverFileName ? getCoverUrl(manga.id, coverFileName) : "",
                status: manga.attributes.status,
                updatedAt: new Date(manga.attributes.updatedAt).toLocaleDateString(),
                description: manga.attributes.description.en || "",
                latestChapter: "...", // Required extra call or feed
            };
        });
    } catch (error) {
        console.error("Error fetching popular manga:", error);
        return [];
    }
};

export const getLatestChapters = async (limit = 16): Promise<Manga[]> => {
    try {
        const response = await client.get("/chapter", {
            params: {
                limit,
                includes: ["scanlation_group", "manga"],
                order: { readableAt: "desc" },
                translatedLanguage: ["en"],
                contentRating: ["safe", "suggestive"],
            },
        });

        const seenManga = new Set();
        const updates: Manga[] = [];

        for (const chapter of response.data.data) {
            const mangaRel = chapter.relationships.find((r: any) => r.type === "manga");
            if (!mangaRel || seenManga.has(mangaRel.id)) continue;

            seenManga.add(mangaRel.id);

            updates.push({
                id: mangaRel.id,
                title: "Loading...", // Placeholder
                cover: "", // Placeholder
                status: "Ongoing",
                latestChapter: chapter.attributes.chapter,
                updatedAt: new Date(chapter.attributes.readableAt).toLocaleDateString(),
            });
        }

        // Populate Manga Details (Titles/Covers) for these chapters
        if (updates.length > 0) {
            const mangaIds = updates.map(u => u.id);
            const mangaResponse = await client.get("/manga", {
                params: {
                    ids: mangaIds,
                    includes: ["cover_art"],
                    limit: mangaIds.length,
                }
            });

            const mangaMap = new Map(mangaResponse.data.data.map((m: any) => [m.id, m]));

            return updates.map(update => {
                const manga = mangaMap.get(update.id);
                if (!manga) return update;

                const coverFileName = manga.relationships.find((r: any) => r.type === "cover_art")?.attributes?.fileName;

                return {
                    ...update,
                    title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
                    cover: coverFileName ? getCoverUrl(manga.id, coverFileName) : "",
                };
            });
        }

        return updates;
    } catch (error) {
        console.error("Error fetching latest chapters:", error);
        return [];
    }
}

export const getMangaById = async (id: string): Promise<Manga | null> => {
    try {
        const response = await client.get(`/manga/${id}`, {
            params: {
                includes: ["cover_art", "author", "artist"],
            },
        });

        const manga = response.data.data;
        const coverFileName = manga.relationships.find((r: any) => r.type === "cover_art")?.attributes?.fileName;
        const author = manga.relationships.find((r: any) => r.type === "author")?.attributes?.name || "Unknown Author";

        return {
            id: manga.id,
            title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
            cover: coverFileName ? getCoverUrl(manga.id, coverFileName) : "",
            status: manga.attributes.status,
            updatedAt: new Date(manga.attributes.updatedAt).toLocaleDateString(),
            description: manga.attributes.description.en || "",
            latestChapter: "...",
            rating: 0,
            genres: manga.attributes.tags.map((tag: any) => tag.attributes.name.en),
        };
    } catch (error) {
        console.error(`Error fetching manga ${id}:`, error);
        return null;
    }
}

export const getChapterList = async (mangaId: string, limit = 100, offset = 0) => {
    try {
        const response = await client.get(`/manga/${mangaId}/feed`, {
            params: {
                limit,
                offset,
                translatedLanguage: ["en"],
                order: { chapter: "desc" },
                includes: ["scanlation_group"],
                contentRating: ["safe", "suggestive", "erotica"], // Include all ratings user might want? Maybe stick to safe/suggestive
            },
        });

        return response.data.data.map((chapter: any) => ({
            id: chapter.id,
            chapter: chapter.attributes.chapter,
            title: chapter.attributes.title,
            publishAt: new Date(chapter.attributes.publishAt).toLocaleDateString(),
            scanlationGroup: chapter.relationships.find((r: any) => r.type === "scanlation_group")?.attributes?.name,
        }));
    } catch (error) {
        console.error(`Error fetching chapters for ${mangaId}:`, error);
        return [];
    }
}

export const getChapterPages = async (chapterId: string): Promise<string[]> => {
    try {
        const response = await client.get(`/at-home/server/${chapterId}`);
        const { baseUrl, chapter } = response.data;
        return chapter.data.map((fileName: string) => `${baseUrl}/data/${chapter.hash}/${fileName}`);
    } catch (error) {
        console.error(`Error fetching pages for chapter ${chapterId}:`, error);
        return [];
    }
}

export const getChapterIdByNumber = async (mangaId: string, chapterNumber: string): Promise<string | null> => {
    try {
        const response = await client.get(`/manga/${mangaId}/feed`, {
            params: {
                limit: 1,
                chapter: chapterNumber,
                translatedLanguage: ["en"],
                contentRating: ["safe", "suggestive", "erotica"],
                includes: ["scanlation_group"],
                // We don't filter by group, just take the first one or most popular. 
                // MangaDex might return multiple for same number.
            },
        });

        if (response.data.data && response.data.data.length > 0) {
            return response.data.data[0].id;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching chapter ID for ${mangaId} ch ${chapterNumber}:`, error);
        return null;
    }
}
