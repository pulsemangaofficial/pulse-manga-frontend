"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ReaderKeyboardHandlerProps {
    mangaId: string;
    currentChapter: number;
}

export function ReaderKeyboardHandler({ mangaId, currentChapter }: ReaderKeyboardHandlerProps) {
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Avoid interfering with inputs (like comments)
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            switch (e.key) {
                case "ArrowUp":
                    window.scrollBy({ top: -300, behavior: "smooth" });
                    break;
                case "ArrowDown":
                    window.scrollBy({ top: 300, behavior: "smooth" });
                    break;
                case "ArrowLeft":
                    // Previous Chapter
                    if (currentChapter > 1) {
                        router.push(`/manga/${mangaId}/chapter/${currentChapter - 1}`);
                    }
                    break;
                case "ArrowRight":
                    // Next Chapter
                    router.push(`/manga/${mangaId}/chapter/${currentChapter + 1}`);
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [mangaId, currentChapter, router]);

    return null;
}
