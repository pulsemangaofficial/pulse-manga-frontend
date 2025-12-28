"use client";

import Link from "next/link";
import Image from "next/image";
import { Bookmark, Clock, User, Menu } from "lucide-react";
import { useState } from "react";
import { SearchSystem } from "@/components/SearchSystem";
import { AIRecommendationModal } from "@/components/AIRecommendation";
import { BookmarksModal } from "@/components/BookmarksModal";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [imgError, setImgError] = useState(false);
    const { user, logout } = useAuth();

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-border bg-surface text-text-main shadow-lg">
                <div className="container mx-auto flex h-[70px] items-center justify-between px-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center text-2xl font-bold tracking-tight">
                        <span className="text-primary">PULSE</span>
                        <span className="text-white">MANGA</span>
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden text-text-secondary hover:text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu size={24} />
                    </button>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-6">
                        <NavLink href="/popular">Popular</NavLink>
                        <NavLink href="/latest">Latest</NavLink>
                        <NavLink href="/top">Top</NavLink>
                        <NavLink href="/genres">Genres</NavLink>
                        <NavLink href="/manga-list">Manga List</NavLink>
                        <NavLink href="/discussions">Discussions</NavLink>
                        <button
                            onClick={() => setIsAIModalOpen(true)}
                            className="text-sm font-medium text-secondary hover:text-white transition-colors"
                        >
                            AI Recommendation
                        </button>
                    </nav>

                    {/* Right Section: Search & Icons */}
                    <div className="hidden lg:flex items-center gap-4">
                        <SearchSystem />

                        <div className="flex items-center gap-3 border-l border-border pl-4">
                            <IconButton icon={<Bookmark size={20} />} label="Bookmarks" onClick={() => setIsBookmarksOpen(true)} />
                            <IconButton icon={<Clock size={20} />} label="History" />

                            {user ? (
                                <button onClick={logout} className="flex items-center gap-2">
                                    {user.photoURL && !imgError ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={user.photoURL}
                                            width={32}
                                            height={32}
                                            className="rounded-full border border-primary object-cover"
                                            alt="avatar"
                                            onError={() => setImgError(true)}
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full border border-primary bg-surface flex items-center justify-center text-primary">
                                            <User size={16} />
                                        </div>
                                    )}
                                </button>
                            ) : (
                                <IconButton icon={<User size={20} />} label="Login" onClick={() => setIsAuthModalOpen(true)} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-surface border-t border-border absolute w-full left-0 px-4 py-4 flex flex-col gap-4 shadow-xl">
                        <NavLink href="/popular">Popular</NavLink>
                        <NavLink href="/latest">Latest</NavLink>
                        <NavLink href="/top">Top</NavLink>
                        <NavLink href="/genres">Genres</NavLink>
                        <NavLink href="/manga-list">Manga List</NavLink>
                        <NavLink href="/discussions">Discussions</NavLink>
                        <button onClick={() => setIsAIModalOpen(true)} className="text-left text-sm font-medium text-secondary">AI Recommendation</button>
                        <div className="border-t border-border pt-4 flex gap-4 justify-center">
                            <IconButton icon={<Bookmark size={20} />} label="Bookmarks" onClick={() => { setIsBookmarksOpen(true); setIsMobileMenuOpen(false); }} />
                            <IconButton icon={<Clock size={20} />} label="History" />
                            {user ? (
                                <button onClick={logout} className="text-text-muted hover:text-primary">Logout</button>
                            ) : (
                                <IconButton icon={<User size={20} />} label="Login" onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }} />
                            )}
                        </div>
                    </div>
                )}
            </header >

            <AIRecommendationModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
            <BookmarksModal isOpen={isBookmarksOpen} onClose={() => setIsBookmarksOpen(false)} />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );
}

function NavLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
    return (
        <Link
            href={href}
            className={`text-sm font-medium text-text-muted hover:text-white transition-colors ${className}`}
        >
            {children}
        </Link>
    );
}

function IconButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
    return (
        <button onClick={onClick} className="text-text-muted hover:text-primary transition-colors p-1" title={label}>
            {icon}
        </button>
    );
}
