"use client";

import { Star, Play, Bookmark, History } from "lucide-react";
import { useState, useEffect } from "react";
import { Manga } from "@/data/mock";
import { useReadingProgress } from "@/hooks/useReadingProgress";

interface MangaInfoProps {
    manga: Manga;
}

export function MangaInfo({ manga }: MangaInfoProps) {
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
        if (bookmarks.includes(manga.id)) {
            setIsBookmarked(true);
        }
    }, [manga.id]);

    const toggleBookmark = () => {
        const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
        if (isBookmarked) {
            const newBookmarks = bookmarks.filter((id: string) => id !== manga.id);
            localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
            setIsBookmarked(false);
        } else {
            bookmarks.push(manga.id);
            localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
            setIsBookmarked(true);
        }
    };

    return (
        <section className="bg-surface/50 border-b border-border pb-8">
            {/* Backdrop Blur (Optional visual flair) */}
            <div className="absolute inset-0 h-[300px] w-full overflow-hidden opacity-20 pointer-events-none">
                <img src={manga.cover} alt="backdrop" className="absolute inset-0 w-full h-full object-cover blur-3xl" />
                <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />
            </div>

            <div className="container mx-auto px-4 pt-8 relative z-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Cover Image */}
                    <div className="flex-shrink-0 w-full md:w-[240px] aspect-[2/3] relative rounded-lg border-2 border-border shadow-2xl overflow-hidden group">
                        <img src={manga.cover} alt={manga.title} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Info Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-end pb-2">
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight drop-shadow-lg">
                            {manga.title}
                        </h1>
                        <p className="text-text-muted mb-4 text-sm">Alternative Titles: {manga.title} (JP), {manga.title} (KR)</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {manga.genres.map(g => (
                                <span key={g} className="px-2 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide cursor-pointer hover:bg-primary hover:text-white transition-colors">
                                    {g}
                                </span>
                            ))}
                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${manga.status === 'Ongoing' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'}`}>
                                {manga.status}
                            </span>
                        </div>

                        <div className="flex items-center gap-6 mb-6 text-sm">
                            <div className="flex flex-col">
                                <span className="text-text-muted text-xs">Rating</span>
                                <div className="flex items-center gap-1 text-accent-orange font-bold text-lg">
                                    <span className="text-2xl">{manga.rating}</span> <Star size={16} fill="currentColor" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-text-muted text-xs">Author</span>
                                <span className="text-white font-semibold">Unknown Author</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-text-muted text-xs">Latest</span>
                                <span className="text-white font-semibold">Chapter {manga.latestChapter}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4 mt-auto">
                            <StartReadingButton mangaId={manga.id} />

                            <button
                                onClick={toggleBookmark}
                                className={`flex items-center gap-2 border px-4 py-3 rounded font-bold uppercase tracking-wide transition-all ${isBookmarked ? 'bg-primary border-primary text-white' : 'bg-text-muted/10 border-text-muted/30 text-text-muted hover:border-white hover:text-white'}`}
                            >
                                <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} /> {isBookmarked ? "Bookmarked" : "Bookmark"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function StartReadingButton({ mangaId }: { mangaId: string }) {
    const { lastChapter } = useReadingProgress(mangaId);

    return (
        <>
            <a
                href={`/manga/${mangaId}/chapter/1`}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded font-bold uppercase tracking-wide shadow-glow transition-all active:scale-95"
            >
                <Play size={20} fill="currentColor" /> Start Reading
            </a>

            {lastChapter && lastChapter !== '1' && (
                <a
                    href={`/manga/${mangaId}/chapter/${lastChapter}`}
                    className="flex items-center gap-2 bg-surface border border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded font-bold uppercase tracking-wide transition-all active:scale-95"
                >
                    <History size={20} /> Continue Ch {lastChapter}
                </a>
            )}
        </>
    );
}
