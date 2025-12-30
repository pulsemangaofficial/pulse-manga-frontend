import { create } from 'zustand';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/services/firebase';

interface ReadingHistory {
    mangaId: string;
    chapterId: string;
    lastReadAt: number;
    title?: string; // Optional for storing basic info
    cover?: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    bookmarks: string[];
    history: ReadingHistory[];
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    fetchBookmarks: () => Promise<void>;
    toggleBookmark: (mangaId: string) => Promise<void>;
    fetchHistory: () => Promise<void>;
    addToHistory: (entry: ReadingHistory) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    loading: true,
    bookmarks: [],
    history: [],
    setUser: (user) => {
        set({ user });
        if (user) {
            get().fetchBookmarks();
            get().fetchHistory();
        } else {
            set({ bookmarks: [], history: [] });
        }
    },
    setLoading: (loading) => set({ loading }),
    fetchBookmarks: async () => {
        const { user } = get();
        if (!user) return;

        try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                set({ bookmarks: userDoc.data().bookmarks || [] });
            } else {
                await setDoc(userDocRef, { bookmarks: [] });
                set({ bookmarks: [] });
            }
        } catch (error) {
            console.error("Error fetching bookmarks:", error);
        }
    },
    fetchHistory: async () => {
        const { user } = get();
        if (!user) return;

        try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists() && userDoc.data().history) {
                set({ history: userDoc.data().history });
            }
        } catch (e) {
            console.error("Error fetching history", e);
        }
    },
    toggleBookmark: async (mangaId) => {
        const { user, bookmarks } = get();
        if (!user) {
            throw new Error("User must be logged in");
        }

        const isBookmarked = bookmarks.includes(mangaId);
        const userDocRef = doc(db, 'users', user.uid);

        try {
            if (isBookmarked) {
                set({ bookmarks: bookmarks.filter(id => id !== mangaId) });
                await updateDoc(userDocRef, {
                    bookmarks: arrayRemove(mangaId)
                });
            } else {
                set({ bookmarks: [...bookmarks, mangaId] });
                await updateDoc(userDocRef, {
                    bookmarks: arrayUnion(mangaId)
                });
            }
        } catch (error) {
            console.error("Error toggling bookmark:", error);
            set({ bookmarks });
            throw error;
        }
    },
    addToHistory: async (entry) => {
        const { user, history } = get();
        if (!user) return;

        const userDocRef = doc(db, 'users', user.uid);

        // Remove existing entry for this manga if exists
        const newHistory = [entry, ...history.filter(h => h.mangaId !== entry.mangaId)].slice(0, 20); // Keep last 20

        set({ history: newHistory });

        try {
            await updateDoc(userDocRef, {
                history: newHistory
            });
        } catch (error) {
            console.error("Error updating history:", error);
        }
    }
}));
