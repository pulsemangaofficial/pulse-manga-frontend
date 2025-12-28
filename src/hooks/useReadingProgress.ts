import { useState, useEffect, useCallback } from "react";

export function useReadingProgress(mangaId: string) {
    const [lastChapter, setLastChapter] = useState<string | null>(null);

    useEffect(() => {
        // Load progress
        const history = JSON.parse(localStorage.getItem("pulse_reading_history") || "{}");
        if (history[mangaId]) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setLastChapter(history[mangaId]);
        }
    }, [mangaId]);

    const saveProgress = useCallback((chapterId: string) => {
        const history = JSON.parse(localStorage.getItem("pulse_reading_history") || "{}");
        history[mangaId] = chapterId;
        localStorage.setItem("pulse_reading_history", JSON.stringify(history));
        setLastChapter(chapterId);
    }, [mangaId]);

    return { lastChapter, saveProgress };
}
