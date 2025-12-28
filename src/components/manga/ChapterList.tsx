"use client";

import { useState } from "react";
import { useReadingProgress } from "@/hooks/useReadingProgress";

interface Chapter {
    id: string;
    chapter: string;
    title: string;
    publishAt: string;
    scanlationGroup?: string;
}

interface ChapterListProps {
    mangaId: string;
    chapters: Chapter[];
}

export function ChapterList({ mangaId, chapters }: ChapterListProps) {
    const [searchQuery, setSearchQuery] = useState("");

    // Sort chapters by number descending just in case
    const sortedChapters = [...chapters].sort((a, b) => parseFloat(b.chapter) - parseFloat(a.chapter));

    const filteredChapters = sortedChapters.filter(ch => {
        if (!searchQuery) return true;
        return ch.chapter.includes(searchQuery);
    });

    return (
        <div className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                <h2 className="text-xl font-bold text-white">CHAPTERS</h2>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search (e.g. 49)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-background border border-border text-sm pl-3 pr-3 py-1.5 rounded focus:border-primary focus:outline-none w-32 md:w-48 text-white placeholder:text-text-muted"
                        />
                    </div>
                    <div className="text-sm text-text-muted">{chapters.length} Chapters</div>
                </div>
            </div>

            {/* Chapter Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredChapters.map((ch) => (
                    <a
                        key={ch.id}
                        href={`/manga/${mangaId}/chapter/${ch.chapter}`} // Using chapter number for URL for now, ideally use ID but our router uses ID? No wait, reading page uses chapter number usually. Let's start with number.
                        className="flex flex-col bg-background border border-border p-3 rounded hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-text-main group-hover:text-primary leading-tight">
                                Chapter {ch.chapter}
                            </span>
                        </div>
                        {ch.title && <span className="text-xs text-text-muted truncate mt-1" title={ch.title}>{ch.title}</span>}
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] text-text-muted">{ch.publishAt}</span>
                            {ch.scanlationGroup && (
                                <span className="text-[10px] text-primary/70 bg-primary/5 px-1.5 py-0.5 rounded truncate max-w-[80px]" title={ch.scanlationGroup}>
                                    {ch.scanlationGroup}
                                </span>
                            )}
                        </div>
                    </a>
                ))}

                {filteredChapters.length === 0 && (
                    <div className="col-span-full text-center text-text-muted py-8">
                        No chapters found.
                    </div>
                )}
            </div>
        </div>
    );
}
