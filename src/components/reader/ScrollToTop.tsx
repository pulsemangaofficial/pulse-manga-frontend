"use client";

import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-20 right-6 z-50 p-3 bg-primary text-white rounded-full shadow-glow hover:bg-primary/80 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
            aria-label="Scroll to top"
        >
            <ChevronUp size={24} />
        </button>
    );
}
