"use client";

import Link from "next/link";
import Image from "next/image";
import { MOCK_MANGA } from "@/data/mock";

export function ReaderRecommendations() {
    // Just pick 4 random mangas for now, excluding the current one ideally but mock data is small
    const recommendations = MOCK_MANGA.slice(0, 4);

    return (
        <section className="py-12 border-t border-border mt-12 bg-surface/30">
            <div className="container mx-auto px-4">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    YOU MIGHT ALSO LIKE
                </h3>

                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
                    {recommendations.map((manga) => (
                        <Link
                            key={manga.id}
                            href={`/manga/${manga.id}`}
                            className="group block bg-surface border border-border rounded overflow-hidden hover:border-primary transition-all hover:-translate-y-1"
                        >
                            <div className="aspect-[2/3] relative">
                                <Image
                                    src={manga.cover}
                                    alt={manga.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                <div className="absolute bottom-0 left-0 p-2 w-full">
                                    <h4 className="font-bold text-white text-xs line-clamp-1 group-hover:text-primary transition-colors">
                                        {manga.title}
                                    </h4>
                                    <div className="flex items-center justify-between mt-0.5">
                                        <span className="text-[9px] text-text-muted bg-black/50 px-1 py-0.5 rounded">
                                            {manga.rating} ★
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
