import { useEffect, useState } from 'react';
import { MangaDexService, Manga } from '@/services/mangadex';
import { MangaCard } from '@/components/features/MangaCard';
import { Loader2, TrendingUp, History, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Link } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';

export const HomePage = () => {
    const [hotManga, setHotManga] = useState<Manga[]>([]);
    const [latestManga, setLatestManga] = useState<Manga[]>([]);
    const [topRankingManga, setTopRankingManga] = useState<Manga[]>([]);
    const [rankingTimeframe, setRankingTimeframe] = useState<'trending' | 'week' | 'all'>('trending');
    const [loading, setLoading] = useState(true);
    const [rankingLoading, setRankingLoading] = useState(false);
    const { history, user } = useAuthStore();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 300; // Adjust scroll amount as needed
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [hot, latest] = await Promise.all([
                    MangaDexService.getPopular(10),
                    MangaDexService.getLatestUpdates(18)
                ]);
                setHotManga(hot);
                setLatestManga(latest);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchRanking = async () => {
            setRankingLoading(true);
            try {
                const ranking = await MangaDexService.getTopRanking(rankingTimeframe);
                setTopRankingManga(ranking);
            } catch (e) {
                console.error(e);
            } finally {
                setRankingLoading(false);
            }
        }
        fetchRanking();
    }, [rankingTimeframe]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-8 pb-10">
                {/* Main Content */}
                <div className="flex-1 space-y-10 min-w-0">

                    {/* Hot Updates (Horizontal Scroll) */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                                <span className="w-1 h-6 bg-primary rounded-full shadow-[0_0_10px_#00e5ff]" />
                                Hot Updates
                            </h2>
                        </div>

                        <div className="relative group">
                            {/* Left Arrow */}
                            <button
                                onClick={() => scroll('left')}
                                className="absolute left-0 top-[35%] -translate-y-1/2 z-10 bg-black/60 hover:bg-primary/80 text-white hover:text-black p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 -translate-x-1/2"
                                aria-label="Scroll left"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>

                            <div
                                ref={scrollContainerRef}
                                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
                            >
                                {hotManga.map((manga, i) => (
                                    <div key={manga.id} className="min-w-[160px] sm:min-w-[180px] snap-start">
                                        <MangaCard manga={manga} priority={i < 4} />
                                    </div>
                                ))}
                            </div>

                            {/* Right Arrow */}
                            <button
                                onClick={() => scroll('right')}
                                className="absolute right-0 top-[35%] -translate-y-1/2 z-10 bg-black/60 hover:bg-primary/80 text-white hover:text-black p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 translate-x-1/2"
                                aria-label="Scroll right"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            {/* Gradient Fade for scroll indication */}
                            <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
                        </div>
                    </section>

                    {/* Latest Updates (Grid) */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                                <span className="w-1 h-6 bg-primary rounded-full shadow-[0_0_10px_#00e5ff]" />
                                Latest Updates
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {latestManga.map((manga) => (
                                <MangaCard key={manga.id} manga={manga} />
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar (History & Ranking) */}
                <aside className="w-full lg:w-80 space-y-8 flex-shrink-0">

                    {/* Top Ranking Section */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2 uppercase">
                                <TrendingUp className="text-primary" />
                                Ranking
                            </h3>
                            <div className="flex gap-2">
                                {['trending', 'week', 'all'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setRankingTimeframe(t as any)}
                                        className={`px-2 py-1 text-[10px] font-bold rounded cursor-pointer transition-colors uppercase
                                        ${rankingTimeframe === t
                                                ? 'bg-primary text-black'
                                                : 'bg-surface text-gray-400 hover:text-white'
                                            }
                                    `}
                                    >
                                        {t === 'week' ? 'Top Week' : t === 'all' ? 'All Time' : t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {rankingLoading ? (
                                <div className="flex justify-center py-10">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            ) : (
                                topRankingManga.map((manga, index) => (
                                    <div key={manga.id} className="flex gap-4 group cursor-pointer border-b border-white/5 pb-4 last:border-0 hover:bg-white/5 p-2 rounded-lg transition-colors">
                                        {/* Rank Number */}
                                        <div className={`
                                        text-2xl font-bold italic w-8 text-center flex items-center justify-center
                                        ${index === 0 ? 'text-primary' :
                                                index === 1 ? 'text-green-400' :
                                                    index === 2 ? 'text-blue-400' : 'text-gray-600'}
                                    `}>
                                            {index + 1}
                                        </div>

                                        {/* Cover Image */}
                                        <div className="w-16 h-24 flex-shrink-0 relative">
                                            <img
                                                src={manga.cover}
                                                alt={manga.title}
                                                className="w-full h-full object-cover rounded shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div>
                                                <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-primary transition-colors">
                                                    {manga.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                                    {manga.status}
                                                </p>
                                            </div>

                                            {/* Rating Bar */}
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between text-[10px] text-gray-400">
                                                    <div className="flex items-center gap-1 text-yellow-500">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        <span className="font-bold text-white">{(Math.random() * 2 + 8).toFixed(1)}</span>
                                                    </div>
                                                    <span>{(Math.random() * 5000 + 1000).toFixed(0)} votes</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-primary to-green-400"
                                                        style={{ width: `${Math.random() * 40 + 60}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <button className="w-full py-3 text-xs font-bold text-gray-400 hover:text-white hover:bg-surface rounded transition-colors uppercase tracking-wider mt-4">
                            View Full Ranking
                        </button>
                    </div>

                    {/* History Section */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2 uppercase">
                            <History className="text-primary" />
                            History
                        </h3>

                        {!user ? (
                            <div className="bg-surface/30 rounded-lg p-6 text-center border border-white/5">
                                <p className="text-gray-400 text-sm mb-4">Sign in to track your reading history and pick up where you left off.</p>
                                {/* We can't easily trigger the auth modal from here without prop drilling or context, 
                                but the header button does it. For now just a message. */}
                                <div className="text-primary text-sm font-bold">Please Sign In</div>
                            </div>
                        ) : history.length === 0 ? (
                            <div className="bg-surface/30 rounded-lg p-6 text-center border border-white/5">
                                <p className="text-gray-400 text-sm">You haven't read any manga yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {history.slice(0, 3).map((item) => (
                                    <Link to={`/read/${item.chapterId}`} key={item.mangaId} className="flex gap-3 bg-surface/40 p-2 rounded-lg hover:bg-surface/60 transition-colors group">
                                        <img src={item.cover} alt={item.title} className="w-16 h-24 object-cover rounded shadow-md" />
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <h4 className="font-bold text-white text-sm line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h4>
                                                <p className="text-xs text-gray-400 mt-1">Read at: {new Date(item.lastReadAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-xs text-primary font-medium">Continue Reading &rarr;</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </aside>
            </div>

            {/* Footer */}
            <Footer />
        </>
    );
};

// Removed StarRating component as it is replaced by the new Rating Bar UI
