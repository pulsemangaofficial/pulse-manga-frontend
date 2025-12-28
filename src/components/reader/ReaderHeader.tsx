"use client";

import Link from "next/link";
import { ArrowLeft, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ReaderHeaderProps {
    mangaTitle: string;
    chapterCurrent: string;
    mangaId: string;
}

export function ReaderHeader({ mangaTitle, chapterCurrent, mangaId }: ReaderHeaderProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const router = useRouter();
    const currentCh = parseInt(chapterCurrent) || 1;

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false); // Hide on scroll down
            } else {
                setIsVisible(true); // Show on scroll up
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const navigateChapter = (direction: 'next' | 'prev') => {
        if (direction === 'prev' && currentCh > 1) {
            router.push(`/manga/${mangaId}/chapter/${currentCh - 1}`);
        } else if (direction === 'next') {
            router.push(`/manga/${mangaId}/chapter/${currentCh + 1}`);
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 w-full h-16 bg-surface/95 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-4 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
        >
            <div className="flex items-center gap-4 w-1/4">
                <Link href={`/manga/${mangaId}`} className="text-text-muted hover:text-white transition-colors flex items-center gap-2">
                    <ArrowLeft size={20} />
                    <span className="hidden md:inline text-sm font-medium">Back</span>
                </Link>
            </div>

            {/* Center Navigation */}
            <div className="flex items-center gap-4 justify-center flex-1">
                <button
                    onClick={() => navigateChapter('prev')}
                    disabled={currentCh <= 1}
                    className="p-1.5 rounded hover:bg-white/10 text-text-muted hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Previous Chapter"
                >
                    <ChevronLeft size={24} />
                </button>

                <div className="flex flex-col items-center cursor-default">
                    <span className="text-white font-bold text-sm">Chapter {chapterCurrent}</span>
                    <span className="text-xs text-text-muted max-w-[150px] truncate hidden md:block">{mangaTitle}</span>
                </div>

                <button
                    onClick={() => navigateChapter('next')}
                    className="p-1.5 rounded hover:bg-white/10 text-text-muted hover:text-white"
                    title="Next Chapter"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            <div className="flex items-center justify-end gap-4 w-1/4">
                <button className="text-text-muted hover:text-white hidden md:block">
                    <Settings size={20} />
                </button>
                <Link href="/" className="flex items-center text-xl font-bold tracking-tight">
                    <span className="text-primary">PULSE</span>
                    <span className="text-white">MANGA</span>
                </Link>
            </div>
        </header>
    );
}
