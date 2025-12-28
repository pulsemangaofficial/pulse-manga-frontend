"use client";

import { Manga } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface HotUpdatesProps {
    initialData: Manga[];
}

export function HotUpdates({ initialData = [] }: HotUpdatesProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === "left") {
                current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }
    };

    if (initialData.length === 0) return null;

    return (
        <section className="relative w-full bg-gradient-to-b from-surface to-background py-8 border-b border-border">
            <div className="container mx-auto px-4">
                <h2 className="mb-4 text-xl font-bold border-l-4 border-primary pl-3 flex items-center text-white">
                    HOT UPDATES <span className="ml-2 text-primary animate-pulse">🔥</span>
                </h2>

                <div className="relative group">
                    {/* Controls */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-4 h-10 w-10 rounded-full bg-black/70 text-white flex items-center justify-center border border-border hover:bg-primary transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-4 h-10 w-10 rounded-full bg-black/70 text-white flex items-center justify-center border border-border hover:bg-primary transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Slider */}
                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
                        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
                    >
                        {initialData.map((manga, idx) => (
                            <a
                                key={`${manga.id}-${idx}`}
                                href={`/manga/${manga.id}`}
                                className="flex-none w-[160px] snap-center group/card"
                            >
                                <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-border shadow-md group-hover/card:shadow-glow transition-all">
                                    <img
                                        src={manga.cover || "/placeholder.svg"}
                                        alt={manga.title}
                                        className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                                    />
                                    {manga.latestChapter !== "..." && (
                                        <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                            CH {manga.latestChapter}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
                                    <div className="absolute bottom-0 p-2 w-full">
                                        <h3 className="text-sm font-semibold text-white truncate drop-shadow-md">{manga.title}</h3>
                                        <p className="text-xs text-text-muted">{manga.updatedAt}</p>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
