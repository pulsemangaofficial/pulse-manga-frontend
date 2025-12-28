"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";

const MOCK_COMMENTS = [
    { user: "DemonKing", manga: "Solo Leveling", comment: "The art in this chapter is insane!", time: "2m ago" },
    { user: "Reader99", manga: "One Piece", comment: "Luffy is actually...", time: "5m ago" },
    { user: "Simp4Makima", manga: "Chainsaw Man", comment: "Woof woof", time: "12m ago" },
    { user: "AnyaPeanuts", manga: "Spy x Family", comment: "Waku waku!", time: "1h ago" },
];

export function GlobalComments() {
    return (
        <section className="mt-12 pt-8 border-t border-border">
            <h2 className="mb-6 text-xl font-bold flex items-center gap-2 text-white">
                <MessageSquare className="text-secondary" />
                LATEST DISCUSSIONS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {MOCK_COMMENTS.map((item, idx) => (
                    <div key={idx} className="bg-surface border border-border p-3 rounded hover:border-primary transition-colors">
                        <div className="flex justify-between items-start text-xs mb-2">
                            <span className="font-bold text-primary">{item.user}</span>
                            <span className="text-text-muted">{item.time}</span>
                        </div>
                        <Link href="#" className="text-xs font-bold text-white hover:text-secondary line-clamp-1 block mb-1">
                            {item.manga}
                        </Link>
                        <p className="text-sm text-text-muted line-clamp-2">
                            &quot;{item.comment}&quot;
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
