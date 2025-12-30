import { Link } from 'react-router-dom';
import { Search, Menu, User as UserIcon, X, Bookmark, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { AuthModal } from '@/components/auth/AuthModal';
import { useState, useEffect, useRef } from 'react';
import { MangaDexService, Manga } from '@/services/mangadex';

export const Header = () => {
    const { user } = useAuthStore();
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Search Logic State
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Manga[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const navLinks = [
        { name: 'Popular', path: '/popular' },
        { name: 'Latest', path: '/latest' },
        { name: 'Top', path: '/top' },
        { name: 'Genres', path: '/genres' },
        { name: 'Manga List', path: '/list' },
        { name: 'Discussions', path: '/discussions' },
    ];

    // Debounce Search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim()) {
                setIsSearching(true);
                setShowResults(true);
                try {
                    const data = await MangaDexService.search(query);
                    setResults(data);
                } catch (error) {
                    console.error("Search failed", error);
                    setResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query.trim()) {
            setShowResults(false);
            // navigate(`/search?q=${query}`); 
        }
    }

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0f0f16]/95 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 z-50 mr-8 flex-shrink-0">
                        <span className="text-2xl font-bold tracking-tighter text-white">
                            PULSE<span className="text-primary">MANGA</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden 2xl:flex items-center gap-6 mr-auto">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-sm font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-wide"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            to="/ai-recommendation"
                            className="text-sm font-bold text-yellow-500 hover:text-yellow-400 transition-colors uppercase tracking-wide"
                        >
                            AI Recommendation
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search Bar Container */}
                        <div className="hidden md:flex relative w-64 lg:w-80" ref={searchRef}>
                            <div className="relative w-full group">
                                <input
                                    type="text"
                                    placeholder="Search Pulse Manga..."
                                    value={query}
                                    onChange={handleSearchInput}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => query.trim() && setShowResults(true)}
                                    className="w-full bg-[#1e1e2aec] border border-white/5 rounded-full py-1.5 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-600"
                                />
                                {isSearching ? (
                                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />
                                ) : (
                                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                )}
                            </div>

                            {/* Search Results Dropdown */}
                            {showResults && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e1e2ae6] backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-[70vh] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {results.length === 0 && !isSearching ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">No manga found...</div>
                                    ) : (
                                        <div className="p-2 space-y-1">
                                            {results.map((manga) => (
                                                <Link
                                                    to={`/manga/${manga.id}`}
                                                    key={manga.id}
                                                    onClick={() => setShowResults(false)}
                                                    className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors group"
                                                >
                                                    <img src={manga.cover} alt={manga.title} className="w-10 h-14 object-cover rounded shadow-sm flex-shrink-0" />
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{manga.title}</h4>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                                                                {manga.status}
                                                            </span>
                                                            {manga.tags?.[0] && (
                                                                <span className="text-[10px] text-gray-400 truncate">{manga.tags[0]}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="hidden md:flex items-center gap-1 border-l border-white/10 pl-4 h-8">
                            {/* Bookmarks */}
                            <Link to="/bookmarks">
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white px-2">
                                    <Bookmark className="h-5 w-5" />
                                </Button>
                            </Link>

                            {/* History */}
                            <Link to="/history">
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white px-2">
                                    <Clock className="h-5 w-5" />
                                </Button>
                            </Link>

                            {/* User Profile / Auth */}
                            {user ? (
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white px-2">
                                    <UserIcon className="h-5 w-5" />
                                </Button>
                            ) : (
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white px-2" onClick={() => setIsAuthOpen(true)}>
                                    <UserIcon className="h-5 w-5" />
                                </Button>
                            )}
                        </div>


                        {/* Mobile Menu Toggle */}
                        <Button variant="ghost" size="sm" className="md:hidden z-[100] text-gray-400 relative" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Sidebar - Outside Header */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[90] md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Sidebar */}
                    <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-[#1a1c2e] flex flex-col shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <Link to="/" onClick={() => setIsMenuOpen(false)}>
                                <span className="text-xl font-bold tracking-tighter">
                                    PULSE<span className="text-primary">MANGA</span>
                                </span>
                            </Link>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex-1 overflow-y-auto py-6 px-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block py-3 text-base text-gray-300 hover:text-white transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                to="/ai-recommendation"
                                onClick={() => setIsMenuOpen(false)}
                                className="block py-3 text-base text-yellow-500 hover:text-yellow-400 font-semibold transition-colors"
                            >
                                AI Recommendation
                            </Link>
                        </nav>

                        {/* Bottom Icons */}
                        <div className="flex items-center justify-center gap-8 p-6 border-t border-white/10">
                            <Link to="/bookmarks" onClick={() => setIsMenuOpen(false)}>
                                <Bookmark className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
                            </Link>
                            <Link to="/history" onClick={() => setIsMenuOpen(false)}>
                                <Clock className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
                            </Link>
                            <button onClick={() => { setIsAuthOpen(true); setIsMenuOpen(false); }}>
                                <UserIcon className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </>
    );
};
