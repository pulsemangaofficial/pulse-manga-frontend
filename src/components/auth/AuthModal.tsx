import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { auth, googleProvider } from '@/services/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const { setUser } = useAuthStore();

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            setError('');
            const result = await signInWithPopup(auth, googleProvider);
            setUser(result.user);
            onClose();
        } catch (error: any) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const result = await signInWithEmailAndPassword(auth, email, password);
                setUser(result.user);
                onClose();
            } else {
                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match");
                }
                const result = await createUserWithEmailAndPassword(auth, email, password);
                setUser(result.user);
                onClose();
            }
        } catch (error: any) {
            console.error(error);
            // Improve error messages for users
            let message = error.message;
            if (error.code === 'auth/invalid-credential') message = 'Invalid email or password.';
            if (error.code === 'auth/email-already-in-use') message = 'Email already in use.';
            if (error.code === 'auth/weak-password') message = 'Password should be at least 6 characters.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[400px] border-none bg-[#13131f]">
            {/* Tabs */}
            <div className="flex mb-6 border-b border-gray-800">
                <button
                    className={`flex-1 pb-3 text-center text-sm font-medium transition-colors relative ${isLogin ? 'text-primary' : 'text-gray-400 hover:text-white'
                        }`}
                    onClick={() => { setIsLogin(true); setError(''); }}
                >
                    Sign In
                    {isLogin && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_rgba(0,229,255,0.5)]" />}
                </button>
                <button
                    className={`flex-1 pb-3 text-center text-sm font-medium transition-colors relative ${!isLogin ? 'text-primary' : 'text-gray-400 hover:text-white'
                        }`}
                    onClick={() => { setIsLogin(false); setError(''); }}
                >
                    Sign Up
                    {!isLogin && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_rgba(0,229,255,0.5)]" />}
                </button>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
                {error && (
                    <div className="p-3 text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                        {error}
                    </div>
                )}

                <Input
                    placeholder="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-[#0a0a12] border-gray-800 focus:border-primary/50"
                />
                <Input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-[#0a0a12] border-gray-800 focus:border-primary/50"
                />

                {!isLogin && (
                    <Input
                        placeholder="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="bg-[#0a0a12] border-gray-800 focus:border-primary/50"
                    />
                )}

                {isLogin && (
                    <div className="flex items-center justify-between text-xs text-gray-400">
                        <label className="flex items-center gap-2 cursor-pointer hover:text-gray-300">
                            <input type="checkbox" className="rounded border-gray-700 bg-[#0a0a12] text-primary focus:ring-primary/20" />
                            Remember me
                        </label>
                        <button type="button" className="hover:text-primary transition-colors">Forgot password?</button>
                    </div>
                )}

                <Button fullWidth variant="primary" type="submit" disabled={loading} className="mt-6 font-bold">
                    {loading ? 'PROCESSING...' : (isLogin ? 'LOG IN' : 'REGISTER')}
                </Button>

                <div className="relative flex items-center gap-2 my-4">
                    <div className="h-px w-full bg-gray-800" />
                    <span className="text-xs text-gray-500 whitespace-nowrap">OR LOGIN WITH</span>
                    <div className="h-px w-full bg-gray-800" />
                </div>

                <div className="grid grid-cols-1 gap-2">
                    <Button type="button" variant="outline" className="w-full text-xs font-medium border-gray-700 bg-[#1a1a2e] hover:bg-[#252540]" onClick={handleGoogleLogin} disabled={loading}>
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 mr-2" />
                        {loading ? 'Connecting...' : 'Google'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
