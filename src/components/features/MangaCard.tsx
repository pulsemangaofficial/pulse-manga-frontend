import { Star, Clock, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Manga } from '@/services/mangadex';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store/authStore';

interface MangaCardProps {
    manga: Manga;
    priority?: boolean;
}

export const MangaCard = ({ manga, priority = false }: MangaCardProps) => {
    const { bookmarks, toggleBookmark, user } = useAuthStore();
    const isBookmarked = bookmarks.includes(manga.id);

    const handleBookmark = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            alert("Please sign in to bookmark manga");
            return;
        }

        try {
            await toggleBookmark(manga.id);
        } catch (error) {
            // Error handling handled in store
        }
    };

    return (
        <Link
            to={`/manga/${manga.id}`}
            className="group relative flex flex-col gap-2 w-full"
        >
            <div className={cn(
                "relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-surface",
                "border-2 border-transparent hover:border-primary/50",
                "transition-all duration-300 ease-out",
                "group-hover:scale-102 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]"
            )}>
                <img
                    src={manga.cover}
                    alt={manga.title}
                    loading={priority ? "eager" : "lazy"}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Hover Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Status Badge */}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-xs font-medium text-white uppercase border border-white/10">
                    {manga.status}
                </div>

                {/* Bookmark Button - Only visible on hover or if bookmarked */}
                <button
                    onClick={handleBookmark}
                    className={cn(
                        "absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all duration-200 z-10",
                        isBookmarked
                            ? "bg-primary text-black opacity-100 shadow-[0_0_10px_rgba(0,229,255,0.5)]"
                            : "bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-white hover:text-black"
                    )}
                >
                    <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
                </button>
            </div>

            <div className="flex flex-col gap-1">
                <h3 className="font-bold text-white line-clamp-1 group-hover:text-primary transition-colors text-shadow">
                    {manga.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        {manga.rating ? manga.rating : 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {manga.year || '2024'}
                    </span>
                </div>
            </div>
        </Link>
    );
};
