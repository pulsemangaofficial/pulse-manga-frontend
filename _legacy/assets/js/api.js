/**
 * PULSE MANGA - API Module
 * Responsibility: Centralized Data Fetching
 * Version: Final 1.0
 */

const API_BASE = "https://dev-pulse-manga.pantheonsite.io/wp-json/pulse-manga/v1";

const PulseAPI = {
    /**
     * Fetches a list of manga for the homepage grid.
     * Supports pagination and real-time search queries.
     */
    async getMangaList(page = 1, query = "") {
        let url = `${API_BASE}/manga?page=${page}`;
        if (query) {
            url += `&s=${encodeURIComponent(query)}`;
        }
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Network response was not ok");
            return await response.json();
        } catch (error) {
            console.error("Error fetching manga list:", error);
            return { data: [], total: 0 };
        }
    },

    /**
     * Fetches full details for a single manga, including its chapter list.
     */
    async getMangaDetail(slug) {
        try {
            const response = await fetch(`${API_BASE}/manga/${slug}`);
            if (!response.ok) throw new Error("Manga not found");
            return await response.json();
        } catch (error) {
            console.error("Error fetching manga detail:", error);
            return { code: 'no_manga', message: 'Not found' };
        }
    },

    /**
     * Fetches chapter data (MangaDex images and navigation) for the reader.
     */
    async getChapter(slug) {
        try {
            const response = await fetch(`${API_BASE}/chapter/${slug}`);
            if (!response.ok) throw new Error("Chapter not found");
            return await response.json();
        } catch (error) {
            console.error("Error fetching chapter data:", error);
            return null;
        }
    },

    /**
     * Fetches trending manga for the sidebar ranking.
     */
    async getTrending() {
        try {
            const response = await fetch(`${API_BASE}/trending`);
            if (!response.ok) throw new Error("Trending data unavailable");
            return await response.json();
        } catch (error) {
            console.error("Error fetching trending data:", error);
            return [];
        }
    },

    /**
     * Fetches comments for a specific post (Manga or Chapter).
     */
    async getComments(postId) {
        try {
            const response = await fetch(`${API_BASE}/comments/${postId}`);
            if (!response.ok) throw new Error("Comments unavailable");
            return await response.json();
        } catch (error) {
            console.error("Error fetching comments:", error);
            return [];
        }
    },

    /**
     * Helper to get local history from localStorage
     */
    getLocalHistory() {
        const history = localStorage.getItem('pm_history');
        return history ? JSON.parse(history) : [];
    },

    /**
     * Helper to save a manga to local history
     */
    saveToHistory(mangaTitle, chapterNum, slug) {
        let history = this.getLocalHistory();
        // Remove duplicate if exists
        history = history.filter(item => item.slug !== slug);
        // Add to top
        history.unshift({ title: mangaTitle, chapter: chapterNum, slug: slug });
        // Keep only top 10
        history = history.slice(0, 10);
        localStorage.setItem('pm_history', JSON.stringify(history));
    }
};