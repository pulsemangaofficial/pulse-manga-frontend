import { useState } from "react";
import { loginWithCredentials, loginWithGoogle } from "@/lib/authStore";
import { Mail, Lock, Loader2 } from "lucide-react";

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await loginWithCredentials(email, password);
            onSuccess();
        } catch (err: any) {
            setError(err.message || "Failed to login");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        setLoading(true);
        try {
            await loginWithGoogle();
            onSuccess();
        } catch (err: any) {
            setError(err.message || "Failed to login with Google");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-500/10 text-red-500 text-sm p-3 rounded-md border border-red-500/20">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-background-input border border-border rounded-lg pl-10 pr-4 py-2 text-text-main focus:outline-none focus:border-primary transition-colors"
                            placeholder="Enter your email"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-background-input border border-border rounded-lg pl-10 pr-4 py-2 text-text-main focus:outline-none focus:border-primary transition-colors"
                            placeholder="Enter your password"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="peer sr-only"
                            />
                            <div className="w-4 h-4 border border-border rounded bg-background-input peer-checked:bg-primary peer-checked:border-primary transition-colors" />
                            <div className="absolute inset-0 text-white opacity-0 peer-checked:opacity-100 flex items-center justify-center pointer-events-none">
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <span className="text-sm text-text-muted group-hover:text-text-main transition-colors">Remember me</span>
                    </label>
                    <button type="button" className="text-sm text-text-muted hover:text-primary transition-colors">
                        Forgot Password?
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
                </button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-surface px-2 text-text-muted">Or continue with</span>
                </div>
            </div>

            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-2 rounded-lg border border-gray-200 transition-colors flex items-center justify-center gap-2"
            >
                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                    <path
                        d="M12.0003 20.45c4.6667 0 7.9583-3.2084 7.9583-7.9584 0-.6666-.0833-1.4583-.2083-2.0833H12.0003v3.9167h4.4583c-.1666 1.0833-1.0833 2.9166-4.5 2.9166-2.6667 0-4.9167-2.125-4.9167-4.8333s2.25-4.8333 4.9167-4.8333c1.375 0 2.5833.4583 3.5417 1.375l2.9583-2.9167c-1.875-1.7916-4.3333-2.7916-6.5-2.7916C7.2086 3.25 3.2503 7.2083 3.2503 12s3.9583 8.75 8.75 8.75z"
                        fill="currentColor"
                    />
                </svg>
                Google
            </button>
        </div>
    );
}
