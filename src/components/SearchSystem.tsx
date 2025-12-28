"use client";

import { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, X, Loader2 } from "lucide-react";
import { MOCK_MANGA } from "@/data/mock";

export function SearchSystem() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<typeof MOCK_MANGA>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setIsOpen(false);
            return;
        }

        setLoading(true);
        setIsOpen(true);

        // Debounce 300ms
        const timeoutId = setTimeout(() => {
            const filtered = MOCK_MANGA.filter(
                (m) =>
                    m.title.toLowerCase().includes(query.toLowerCase()) ||
                    m.genres.some((g) => g.toLowerCase().includes(query.toLowerCase()))
            );
            setResults(filtered.slice(0, 8)); // Max 8
            setLoading(false);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <div className="relative group w-full max-w-md" ref={dropdownRef}>
            <div className="flex items-center bg-background border border-border rounded-full px-3 py-1.5 w-64 focus-within:w-full focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all duration-300">
                <input
                    type="text"
                    placeholder="Search manga..."
                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-text-muted text-text-main"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                />
                {loading ? (
                    <Loader2 size={16} className="text-primary animate-spin" />
                ) : query ? (
                    <X size={16} className="text-text-muted cursor-pointer hover:text-white" onClick={() => setQuery("")} />
                ) : (
                    <SearchIcon size={16} className="text-text-muted" />
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-surface border border-border rounded-lg shadow-xl overflow-hidden z-50">
                    {loading ? (
                        <div className="p-4 text-center text-xs text-text-muted">Searching...</div>
                    ) : results.length > 0 ? (
                        <ul>
                            {results.map((manga) => (
                                <li key={manga.id}>
                                    <a
                                        href={`/manga/${manga.id}`}
                                        className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors border-b border-border/50 last:border-none"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <img src={manga.cover} alt="" width={32} height={48} className="object-cover rounded" />
                                        <div>
                                            <div className="text-sm font-bold text-white">{manga.title}</div>
                                            <div className="text-xs text-text-muted">
                                                CH {manga.latestChapter} • {manga.status}
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-xs text-text-muted">No manga found</div>
                    )}
                </div>
            )}
        </div>
    );
}
