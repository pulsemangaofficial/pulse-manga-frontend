"use client";

import { useEffect, useState } from "react";
import { X, BookOpen, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MOCK_MANGA } from "@/data/mock";

interface BookmarksModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function BookmarksModal({ isOpen, onClose }: BookmarksModalProps) {
    const [bookmarks, setBookmarks] = useState<typeof MOCK_MANGA>([]);

    useEffect(() => {
        if (isOpen) {
            const storedIds = JSON.parse(localStorage.getItem("bookmarks") || "[]");
            // Find full manga details from mock data
            const savedManga = MOCK_MANGA.filter(m => storedIds.includes(m.id));
            setBookmarks(savedManga);
        }
    }, [isOpen]);

    const removeBookmark = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const storedIds = JSON.parse(localStorage.getItem("bookmarks") || "[]");
        const newIds = storedIds.filter((bid: string) => bid !== id);
        localStorage.setItem("bookmarks", JSON.stringify(newIds));

        // Update local state
        setBookmarks(prev => prev.filter(m => m.id !== id));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
                className="bg-surface border border-border w-full max-w-2xl rounded-xl shadow-glow overflow-hidden flex flex-col max-h-[80vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b border-border flex items-center justify-between bg-surface/50">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="text-primary" />
                        YOUR BOOKMARKS
                    </h2>
                    <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
                    {bookmarks.length === 0 ? (
                        <div className="text-center py-12 text-text-muted">
                            <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No bookmarks yet.</p>
                            <p className="text-sm">Start reading and save your favorites!</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {bookmarks.map(manga => (
                                <Link
                                    key={manga.id}
                                    href={`/manga/${manga.id}`}
                                    onClick={onClose}
                                    className="flex items-center gap-4 bg-background border border-border p-3 rounded-lg hover:border-primary transition-all group"
                                >
                                    <div className="relative w-16 h-24 flex-shrink-0 rounded overflow-hidden">
                                        <Image src={manga.cover} alt={manga.title} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white group-hover:text-primary transition-colors truncate">{manga.title}</h3>
                                        <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
                                            <span className="bg-surface px-1.5 py-0.5 rounded border border-border">CH {manga.latestChapter}</span>
                                            <span>{manga.status}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => removeBookmark(manga.id, e)}
                                        className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                        title="Remove Bookmark"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
