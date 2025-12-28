import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, User, Loader2, AlertCircle } from "lucide-react";
import { isDisposableEmail, isValidEmail } from "@/lib/validation";

export function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
    const { registerWithCredentials, loginWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!isValidEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (isDisposableEmail(email)) {
            setError("Temporary email addresses are not allowed. Please use a valid email service.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);

        try {
            await registerWithCredentials(email, name, password);
            onSuccess();
        } catch (err: any) {
            setError(err.message || "Failed to create account");
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
            setError(err.message || "Failed to sign up with Google");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-500/10 text-red-500 text-sm p-3 rounded-md border border-red-500/20 flex gap-2 items-start">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-background-input border border-border rounded-lg pl-10 pr-4 py-2 text-text-main focus:outline-none focus:border-primary transition-colors"
                            placeholder="Enter your name"
                        />
                    </div>
                </div>

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
                            placeholder="Create a password"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
                </button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-surface px-2 text-text-muted">Or sign up with</span>
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
