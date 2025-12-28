import { MangaPanels } from "@/components/reader/MangaPanels";
import { ReaderHeader } from "@/components/reader/ReaderHeader";
import { ReaderNav } from "@/components/reader/ReaderNav";
import { ProgressSaver } from "@/components/reader/ProgressSaver";
import { ReaderRecommendations } from "@/components/reader/ReaderRecommendations";
import { ReaderKeyboardHandler } from "@/components/reader/ReaderKeyboardHandler";
import { ScrollToTop } from "@/components/reader/ScrollToTop";
import { MangaComments } from "@/components/manga/MangaComments";
import { getMangaById, getChapterIdByNumber, getChapterPages } from "@/lib/mangadex";
import { notFound } from "next/navigation";

export default async function ChapterPage({ params }: { params: Promise<{ id: string; chapterId: string }> }) {
    const { id, chapterId } = await params;
    const currentChNum = parseFloat(chapterId) || 1;

    // Parallel fetch: Manga Details + Chapter ID (by number)
    const [manga, realChapterId] = await Promise.all([
        getMangaById(id),
        getChapterIdByNumber(id, chapterId)
    ]);

    if (!manga) return notFound();

    // If we found the real Chapter ID, fetch its pages. 
    // If NOT found (e.g. chapter doesn't exist on MD), we pass empty pages and let MangaPanels show error.
    let pages: string[] = [];
    if (realChapterId) {
        pages = await getChapterPages(realChapterId);
    }

    return (
        <div className="bg-black min-h-screen text-text-main pb-20 relative">
            <ReaderKeyboardHandler mangaId={id} currentChapter={currentChNum} />
            <ProgressSaver mangaId={id} chapterId={chapterId} />

            {/* Immersion Header */}
            <ReaderHeader mangaTitle={manga.title} chapterCurrent={chapterId} mangaId={id} />

            <main className="pt-14">
                {/* Top Ad */}
                <div className="container mx-auto px-4 my-4 hidden">
                    <div className="h-20 bg-surface/20 border border-white/10 flex items-center justify-center text-xs text-text-muted">
                        Header Ad
                    </div>
                </div>

                {/* Top Nav */}
                <ReaderNav mangaId={id} currentChapter={currentChNum} />

                {/* Panels */}
                <MangaPanels pages={pages} />

                {/* Bottom Nav */}
                <ReaderNav mangaId={id} currentChapter={currentChNum} />

                {/* Bottom Ad */}
                <div className="container mx-auto px-4 my-8 hidden">
                    <div className="h-60 bg-surface/20 border border-white/10 flex items-center justify-center text-xs text-text-muted">
                        Footer Ad
                    </div>
                </div>

                {/* Chapter Comments */}
                <div className="max-w-4xl mx-auto px-4 mt-8">
                    <MangaComments />
                </div>

                {/* Recommendations */}
                <ReaderRecommendations />
            </main>

            <ScrollToTop />
        </div>
    );
}
