"use client";

import { useReadingProgress } from "@/hooks/useReadingProgress";
import { useEffect } from "react";

export function ProgressSaver({ mangaId, chapterId }: { mangaId: string; chapterId: string }) {
    const { saveProgress } = useReadingProgress(mangaId);

    useEffect(() => {
        saveProgress(chapterId);
    }, [mangaId, chapterId, saveProgress]);

    return null;
}
