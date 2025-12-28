import { MangaInfo } from "@/components/manga/MangaInfo";
import { ChapterList } from "@/components/manga/ChapterList";
import { MangaComments } from "@/components/manga/MangaComments"; // Using existing comment system for now
import { getMangaById, getChapterList } from "@/lib/mangadex";
import { notFound } from "next/navigation";

// Since we are fetching data, we can also generate dynamic metadata
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const manga = await getMangaById(id);
  if (!manga) return { title: "Manga Not Found" };
  return {
    title: `${manga.title} - Pulse Manga`,
    description: manga.description?.slice(0, 160),
  };
}

export default async function MangaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [manga, chapters] = await Promise.all([
    getMangaById(id),
    getChapterList(id)
  ]);

  if (!manga) return notFound();

  return (
    <div className="pb-20">
      <MangaInfo manga={manga as any} />

      <div className="container mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-8">
        <main className="flex-1 min-w-0">
          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-2 pb-2 border-b border-border">SYNOPSIS</h3>
            <p className="text-text-secondary leading-relaxed text-sm md:text-base">
              {manga.description || "No description available."}
            </p>
          </div>

          <ChapterList mangaId={id} chapters={chapters} />

          <MangaComments />
        </main>

        <aside className="w-full lg:w-[320px] flex-shrink-0">
          <div className="bg-surface/30 border border-border rounded p-4 h-fit sticky top-24">
            <div className="text-center text-text-muted text-xs py-10">Sidebar Ad</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
