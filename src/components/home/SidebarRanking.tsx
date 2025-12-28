"use client";

import { Crown } from "lucide-react";
import { useState, useEffect } from "react";
import { Manga } from "@/lib/types";

type RankingType = "Trending" | "Top Week" | "All Time";

interface SidebarRankingProps {
    initialData?: Manga[];
}

export function SidebarRanking({ initialData = [] }: SidebarRankingProps) {
    const [activeTab, setActiveTab] = useState<RankingType>("Trending");
    const [displayData, setDisplayData] = useState<Manga[]>(initialData);

    useEffect(() => {
        // Simple client-side shuffle to simulate different lists for tabs
        // In reality, you'd fetch specific endpoints for each tab
        if (initialData.length > 0) {
            const shuffled = [...initialData].sort(() => Math.random() - 0.5);
            setDisplayData(shuffled);
        }
    }, [activeTab, initialData]);

    return (
        <div className="w-full bg-surface/50 border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                <Crown size={20} className="text-secondary" />
                <h3 className="text-lg font-bold text-white">RANKING</h3>
            </div>

            <div className="flex bg-background rounded-md p-1 mb-4">
                {["Trending", "Top Week", "All Time"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as RankingType)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${activeTab === tab
                            ? "bg-primary text-white shadow-sm"
                            : "text-text-muted hover:text-white"
                            }`}
                    >
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-3">
                {displayData.slice(0, 5).map((manga, index) => (
                    <a
                        key={manga.id}
                        href={`/manga/${manga.id}`}
                        className="flex items-center gap-3 group hover:bg-background/50 p-2 rounded transition-colors"
                    >
                        <div className={`
              text-xl font-black w-6 text-center
              ${index === 0 ? "text-secondary" :
                                index === 1 ? "text-primary/80" :
                                    index === 2 ? "text-primary/60" : "text-border"}
            `}>
                            {index + 1}
                        </div>
                        <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded border border-border">
                            {manga.cover ? (
                                <img src={manga.cover} alt={manga.title} className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-surface flex items-center justify-center text-xs text-text-muted">No Img</div>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h4 className="truncate text-sm font-bold text-text-main group-hover:text-primary transition-colors">
                                {manga.title}
                            </h4>
                            <p className="text-xs text-text-muted mt-1">
                                {manga.latestChapter ? `Chapter ${manga.latestChapter}` : manga.status}
                            </p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
