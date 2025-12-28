"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { MangaPanels } from "@/components/reader/MangaPanels";
import { ReaderHeader } from "@/components/reader/ReaderHeader";
import { ReaderNav } from "@/components/reader/ReaderNav";
import { ProgressSaver } from "@/components/reader/ProgressSaver";
import { ReaderRecommendations } from "@/components/reader/ReaderRecommendations";
import { ReaderKeyboardHandler } from "@/components/reader/ReaderKeyboardHandler";
import { ScrollToTop } from "@/components/reader/ScrollToTop";
import { MangaComments } from "@/components/manga/MangaComments";

interface AstroReaderWrapperProps {
    manga: any; // Type strictly if possible, but 'any' matches previous code context
    chapterId: string;
    currentChNum: number;
    pages: string[];
}

export function AstroReaderWrapper({
    manga,
    chapterId,
    currentChNum,
    pages,
}: AstroReaderWrapperProps) {
    return (
        <AuthProvider>
            <div className="bg-black min-h-screen text-text-main pb-20 relative">
                <ReaderKeyboardHandler mangaId={manga.id} currentChapter={currentChNum} />
                <ProgressSaver mangaId={manga.id} chapterId={chapterId} />

                {/* Immersion Header */}
                <ReaderHeader
                    mangaTitle={manga.title}
                    chapterCurrent={chapterId}
                    mangaId={manga.id}
                />

                <main className="pt-14">
                    {/* Top Ad */}
                    <div className="container mx-auto px-4 my-4 hidden">
                        <div className="h-20 bg-surface/20 border border-white/10 flex items-center justify-center text-xs text-text-muted">
                            Header Ad
                        </div>
                    </div>

                    {/* Top Nav */}
                    <ReaderNav mangaId={manga.id} currentChapter={currentChNum} />

                    {/* Panels */}
                    <MangaPanels pages={pages} />

                    {/* Bottom Nav */}
                    <ReaderNav mangaId={manga.id} currentChapter={currentChNum} />

                    {/* Bottom Ad */}
                    <div className="container mx-auto px-4 my-8 hidden">
                        <div className="h-60 bg-surface/20 border border-white/10 flex items-center justify-center text-xs text-text-muted">
                            Footer Ad
                        </div>
                    </div>

                    {/* Chapter Comments */}
                    <div className="max-w-4xl mx-auto px-4 mt-8">
                        <MangaComments />
                    </div>

                    {/* Recommendations */}
                    <ReaderRecommendations />
                </main>

                <ScrollToTop />
            </div>
        </AuthProvider>
    );
}
