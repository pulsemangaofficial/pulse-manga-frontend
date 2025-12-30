import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MangaDexService } from '@/services/mangadex';
import { Button } from '@/components/ui/Button';
import { Loader2, ArrowLeft, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export const ReaderPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [pages, setPages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [showControls, setShowControls] = useState(true);
    const [scrollTopVisible, setScrollTopVisible] = useState(false);

    // Auto-hide controls on scroll
    useEffect(() => {
        let lastScrollY = window.scrollY;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > 100) {
                setShowControls(currentScrollY < lastScrollY);
                setScrollTopVisible(true);
            } else {
                setShowControls(true);
                setScrollTopVisible(false);
            }
            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!id) return;
        const loadChapter = async () => {
            setLoading(true);
            const imgs = await MangaDexService.getChapterPages(id);
            setPages(imgs);
            setLoading(false);
        };
        loadChapter();
    }, [id]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNext = () => {
        // Logic to go to next chapter - in a real app this would find the next chapter ID
        // For now, we'll just show an alert or placeholder as requested
        alert("Next chapter logic to be implemented with real API data linking");
    };

    const handlePrev = () => {
        alert("Previous chapter logic to be implemented with real API data linking");
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowRight':
                    handleNext();
                    break;
                case 'ArrowLeft':
                    handlePrev();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    window.scrollBy({ top: -100, behavior: 'smooth' });
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    window.scrollBy({ top: 100, behavior: 'smooth' });
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // ... (rest of loading checks)

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-gray-400 animate-pulse">Loading Chapter...</p>
            </div>
        );
    }

    if (pages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <p className="text-red-500">Failed to load pages or chapter is empty.</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-black">
            {/* Top Bar (Floating) */}
            <div className={cn(
                "fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 p-4 transition-transform duration-300",
                showControls ? "translate-y-0" : "-translate-y-full"
            )}>
                <div className="container mx-auto flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                        <ArrowLeft className="mr-2 w-4 h-4" /> Back
                    </Button>
                    <span className="text-white font-medium text-sm">Chapter Viewer</span>
                    <div className="flex gap-2">
                        {/* Placeholder for Next/Prev logic */}
                        <Button variant="outline" size="sm" onClick={handlePrev}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleNext}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Reading Canvas */}
            <div className="max-w-3xl mx-auto flex flex-col min-h-screen bg-[#111]">
                {pages.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        loading="lazy"
                        alt={`Page ${index + 1}`}
                        className="w-full h-auto block select-none"
                    />
                ))}
            </div>

            {/* Bottom Controls (Reader Footer) */}
            <div className="py-10 flex justify-center gap-4 bg-black">
                <Button variant="outline" size="lg" className="h-14 px-8" onClick={handlePrev}>
                    <ChevronLeft className="mr-2 w-5 h-5" /> Prev Chapter
                </Button>
                <Button variant="primary" size="lg" className="h-14 px-8" onClick={handleNext}>
                    Next Chapter <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
            </div>

            {/* Scroll To Top FAB */}
            <button
                onClick={scrollToTop}
                className={cn(
                    "fixed bottom-6 right-6 z-40 p-3 rounded-full bg-primary text-black shadow-glow hover:scale-110 transition-all duration-300",
                    scrollTopVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
                )}
            >
                <ArrowUp className="w-6 h-6" />
            </button>
        </div>
    );
};
