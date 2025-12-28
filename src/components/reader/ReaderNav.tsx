"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ReaderNavProps {
    mangaId: string;
    currentChapter: number;
}

export function ReaderNav({ mangaId, currentChapter }: ReaderNavProps) {
    return (
        <div className="flex items-center justify-between max-w-2xl mx-auto my-6 px-4">
            <Link
                href={`/manga/${mangaId}/chapter/${currentChapter - 1}`}
                className="flex items-center gap-2 bg-surface hover:bg-primary/20 hover:text-primary text-text-muted px-4 py-2 rounded border border-border transition-colors disabled:opacity-50"
                aria-disabled={currentChapter <= 1}
                style={{ pointerEvents: currentChapter <= 1 ? 'none' : 'auto', opacity: currentChapter <= 1 ? 0.5 : 1 }}
            >
                <ChevronLeft size={16} /> Prev
            </Link>

            <select
                className="bg-surface border border-border text-white px-4 py-2 rounded outline-none focus:border-primary cursor-pointer max-w-[150px] md:max-w-xs"
                defaultValue={currentChapter}
            >
                <option value={currentChapter}>Chapter {currentChapter}</option>
                <option value={currentChapter + 1}>Chapter {currentChapter + 1}</option>
                <option value={currentChapter + 2}>Chapter {currentChapter + 2}</option>
            </select>

            <Link
                href={`/manga/${mangaId}/chapter/${currentChapter + 1}`}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded font-bold shadow-glow transition-colors"
            >
                Next <ChevronRight size={16} />
            </Link>
        </div>
    );
}
