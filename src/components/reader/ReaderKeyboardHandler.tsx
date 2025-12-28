"use client";

import { useEffect } from "react";

interface ReaderKeyboardHandlerProps {
    mangaId: string;
    currentChapter: number;
}

export function ReaderKeyboardHandler({ mangaId, currentChapter }: ReaderKeyboardHandlerProps) {

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
                        window.location.href = `/manga/${mangaId}/chapter/${currentChapter - 1}`;
                    }
                    break;
                case "ArrowRight":
                    // Next Chapter
                    window.location.href = `/manga/${mangaId}/chapter/${currentChapter + 1}`;
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [mangaId, currentChapter]);

    return null;
}
