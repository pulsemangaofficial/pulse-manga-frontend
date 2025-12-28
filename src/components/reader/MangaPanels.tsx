"use client";

// Image import removed

interface MangaPanelsProps {
    pages: string[];
}

export function MangaPanels({ pages }: MangaPanelsProps) {
    if (pages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-text-muted">
                <p>No pages found for this chapter.</p>
                <p className="text-sm mt-2">MangaDex API might be rate limiting or chapter is unavailable.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-0 w-full max-w-3xl mx-auto bg-black">
            {pages.map((src, i) => (
                <div key={i} className="relative w-full min-h-[500px]">
                    {/* Use simple img for now to avoid layout issues with unknown aspect ratios, or use width/height auto */}
                    <img
                        src={src}
                        alt={`Page ${i + 1}`}
                        className="w-full h-auto block"
                        loading={i < 2 ? "eager" : "lazy"}
                    />
                </div>
            ))}
        </div>
    );
}
