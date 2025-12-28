import { getLatestChapters, getPopularManga } from "@/lib/mangadex";
import { GlobalComments } from "@/components/home/GlobalComments";
import { HotUpdates } from "@/components/home/HotUpdates";
import { LatestUpdates } from "@/components/home/LatestUpdates";
import { SidebarRanking } from "@/components/home/SidebarRanking";

export default async function Home() {
  const [popularManga, latestChapters] = await Promise.all([
    getPopularManga(10), // For HotUpdates slider
    getLatestChapters(16) // For LatestUpdates grid
  ]);

  return (
    <div className="pb-10">
      {/* Banner Ad Slot (Future) */}
      <div className="container mx-auto px-4 mt-4 mb-2 hidden">
        <div className="h-24 bg-surface border border-border flex items-center justify-center text-text-muted text-sm">
          Advertisement
        </div>
      </div>

      <HotUpdates initialData={popularManga} />

      <div className="container mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <LatestUpdates initialData={latestChapters} />
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-[320px] flex-shrink-0">
          <SidebarRanking initialData={popularManga} />
          {/* Sidebar Ad (Future) */}
          <div className="mt-8 h-64 bg-surface/30 border border-border rounded flex items-center justify-center text-text-muted text-xs">
            Ad Space
          </div>
        </aside>
      </div>

      <div className="container mx-auto px-4">
        <GlobalComments />
      </div>
    </div>
  );
}
