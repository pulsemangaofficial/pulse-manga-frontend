import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MangaDexService, Manga, Chapter } from '@/services/mangadex';
import { Button } from '@/components/ui/Button';
import { Loader2, BookOpen, Bookmark, Star, User as UserIcon, Calendar, Search, ArrowUpDown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils/cn';

export const MangaDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [manga, setManga] = useState<Manga | null>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortAsc, setSortAsc] = useState(false); // false = descending (newest first), true = ascending
    const { bookmarks, toggleBookmark, user } = useAuthStore();

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const [details, chaps] = await Promise.all([
                    MangaDexService.getMangaDetails(id),
                    MangaDexService.getChapters(id)
                ]);
                setManga(details);
                setChapters(chaps);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleBookmark = async () => {
        if (!user || !id) {
            alert("Please sign in to bookmark manga");
            return;
        }
        try {
            await toggleBookmark(id);
        } catch (error) {
            console.error("Bookmark failed", error);
        }
    };

    // Filter and sort chapters
    const filteredAndSortedChapters = useMemo(() => {
        let filtered = chapters;

        // Filter by search query
        if (searchQuery.trim()) {
            // Extract numbers from search query
            const searchNumber = searchQuery.replace(/[^0-9.]/g, '');

            filtered = chapters.filter(chapter => {
                const chapterNum = chapter.chapter || '';
                const chapterTitle = chapter.title?.toLowerCase() || '';
                const queryLower = searchQuery.toLowerCase();

                // Match by chapter number or title
                if (searchNumber) {
                    // If searching for a number, match chapters containing that number
                    return chapterNum.includes(searchNumber) || chapterTitle.includes(queryLower);
                }

                return chapterTitle.includes(queryLower);
            });
        }

        // Sort chapters
        const sorted = [...filtered].sort((a, b) => {
            const numA = parseFloat(a.chapter || '0');
            const numB = parseFloat(b.chapter || '0');
            return sortAsc ? numA - numB : numB - numA;
        });

        return sorted;
    }, [chapters, searchQuery, sortAsc]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!manga) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-400">Manga not found</p>
            </div>
        );
    }

    const isBookmarked = bookmarks.includes(id || '');
    const firstChapterId = chapters.length > 0 ? chapters[chapters.length - 1].id : null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a1c2e] to-background pb-10">
            {/* Hero Section */}
            <div className="relative">
                {/* Blurred Background */}
                <div
                    className="absolute inset-0 h-[300px] md:h-[400px] opacity-20"
                    style={{
                        backgroundImage: `url(${manga.cover})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(50px)',
                        maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)'
                    }}
                />

                <div className="relative container mx-auto px-4 py-6 md:py-8">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                        {/* Cover Image */}
                        <div className="flex-shrink-0 mx-auto md:mx-0">
                            <div className="w-[160px] md:w-[230px] aspect-[2/3] rounded-lg overflow-hidden shadow-2xl border-2 border-white/10">
                                <img
                                    src={manga.cover}
                                    alt={manga.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Manga Info */}
                        <div className="flex-1 space-y-3 md:space-y-4">
                            <div>
                                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-3">
                                    {manga.title}
                                </h1>

                                {/* Alternative Titles (if available) */}
                                {manga.altTitles && manga.altTitles.length > 0 && (
                                    <p className="text-xs md:text-sm text-gray-400 mb-2 md:mb-3">
                                        Alternative titles: {manga.altTitles.join(', ')}
                                    </p>
                                )}

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                                    {manga.tags?.slice(0, 6).map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 md:px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded text-[10px] md:text-xs font-bold uppercase tracking-wider"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    <span className="px-2 md:px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-[10px] md:text-xs font-bold uppercase tracking-wider">
                                        {manga.status}
                                    </span>
                                </div>

                                {/* Meta Info */}
                                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-400 mb-3 md:mb-4">
                                    <div className="flex items-center gap-2">
                                        <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-yellow-500" />
                                        <span className="font-bold text-white">{manga.rating || '0'}</span>
                                        <span className="text-gray-500">★</span>
                                    </div>

                                    {manga.author && (
                                        <div className="flex items-center gap-2">
                                            <UserIcon className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                                            <span>{manga.author}</span>
                                        </div>
                                    )}

                                    {manga.year && (
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                                            <span>{manga.year}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                                        <span>Chapter {chapters.length > 0 ? chapters[0].chapter : '...'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                {firstChapterId && (
                                    <Link to={`/read/${firstChapterId}`}>
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            className="px-6 md:px-8 py-2 md:py-3 text-sm md:text-base font-bold shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                                        >
                                            <BookOpen className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                                            START READING
                                        </Button>
                                    </Link>
                                )}
                                <Button
                                    variant={isBookmarked ? "primary" : "outline"}
                                    size="lg"
                                    onClick={handleBookmark}
                                    className={cn(
                                        "px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-bold",
                                        isBookmarked && "bg-white/10 border-white/20"
                                    )}
                                >
                                    <Bookmark className={cn("mr-2 w-4 h-4 md:w-5 md:h-5", isBookmarked && "fill-current")} />
                                    BOOKMARK
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
                {/* Synopsis */}
                <div className="bg-[#1a1c2e]/50 border border-white/5 rounded-xl p-4 md:p-6 backdrop-blur-sm">
                    <h2 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 uppercase tracking-wider">Synopsis</h2>
                    <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                        {manga.synopsis || "No synopsis available."}
                    </p>
                </div>

                {/* Chapters Section */}
                <div className="bg-[#1a1c2e]/50 border border-white/5 rounded-xl p-4 md:p-6 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                            Chapters ({chapters.length})
                        </h2>

                        <div className="flex items-center gap-3">
                            {/* Search Bar */}
                            <div className="relative flex-1 md:flex-none md:w-64">
                                <input
                                    type="text"
                                    placeholder="Search (e.g. 49)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-surface/50 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-all"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            </div>

                            {/* Sort Button */}
                            <button
                                onClick={() => setSortAsc(!sortAsc)}
                                className="p-2 bg-surface/50 hover:bg-surface border border-white/10 hover:border-primary/30 rounded-lg transition-all group"
                                title={sortAsc ? "Sort Descending (Newest First)" : "Sort Ascending (Oldest First)"}
                            >
                                <ArrowUpDown className={cn(
                                    "w-5 h-5 text-gray-400 group-hover:text-primary transition-colors",
                                    sortAsc && "rotate-180"
                                )} />
                            </button>

                            <span className="hidden md:block text-sm text-gray-500">{filteredAndSortedChapters.length} Chapters</span>
                        </div>
                    </div>

                    {/* Chapters List/Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                        {filteredAndSortedChapters.length === 0 ? (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                {searchQuery ? 'No chapters found matching your search' : 'No chapters available'}
                            </div>
                        ) : (
                            filteredAndSortedChapters.map((chapter) => (
                                <Link
                                    key={chapter.id}
                                    to={`/read/${chapter.id}`}
                                    className="group relative bg-surface/30 hover:bg-surface border border-white/5 hover:border-primary/30 rounded-lg p-3 md:p-4 transition-all"
                                >
                                    <div className="space-y-2">
                                        <h3 className="font-bold text-white group-hover:text-primary transition-colors text-sm line-clamp-2">
                                            {chapter.title || `Chapter ${chapter.chapter}`}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500 font-mono">
                                                {chapter.chapter ? `Ch. ${chapter.chapter}` : 'Oneshot'}
                                            </span>
                                            {chapter.publishAt && (
                                                <span className="text-xs text-gray-600">
                                                    {new Date(chapter.publishAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
