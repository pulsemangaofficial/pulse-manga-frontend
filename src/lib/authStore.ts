import { atom } from 'nanostores';
import {
    onAuthStateChanged,
    type User,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';
import { auth } from './firebase';

export const $user = atom<User | null>(null);
export const $authLoading = atom<boolean>(true);

// Subscribe to Firebase Auth state
onAuthStateChanged(auth, (user: User | null) => {
    $user.set(user);
    $authLoading.set(false);
});

// Helper functions
export const logout = async () => {
    await signOut(auth);
};

export const loginWithCredentials = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const registerWithCredentials = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
};

export { updateProfile };
