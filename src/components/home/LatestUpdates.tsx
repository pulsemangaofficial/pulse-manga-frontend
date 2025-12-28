import { Manga } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

interface LatestUpdatesProps {
    initialData: Manga[];
}

export function LatestUpdates({ initialData = [] }: LatestUpdatesProps) {
    if (initialData.length === 0) {
        return <div className="text-text-muted">No updates found.</div>;
    }

    return (
        <section>
            <div className="mb-6 flex items-center justify-between border-b border-border pb-2">
                <h2 className="text-xl font-bold border-l-4 border-primary pl-3 text-white">
                    LATEST UPDATES
                </h2>
                <Link href="/latest" className="text-sm text-text-muted hover:text-primary transition-colors">
                    View All
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {initialData.map((manga) => (
                    <Link key={manga.id} href={`/manga/${manga.id}`} className="group relative block">
                        <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-border bg-surface shadow-sm transition-all group-hover:shadow-glow group-hover:border-primary">
                            <Image
                                src={manga.cover || "/placeholder.svg"}
                                alt={manga.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2 pt-8">
                                <div className="flex items-center gap-1 text-[10px] text-primary font-bold">
                                    <span className="bg-surface/80 px-1 rounded backdrop-blur-sm">CH {manga.latestChapter}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <h3 className="truncate text-sm font-bold text-text-main group-hover:text-primary transition-colors">
                                {manga.title}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-text-muted mt-1">
                                <Clock size={12} />
                                <span>{manga.updatedAt}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
