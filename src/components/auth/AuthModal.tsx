"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type AuthView = "login" | "register";

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [view, setView] = useState<AuthView>("login");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-surface border border-border rounded-xl shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-text-secondary hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="p-6 text-center border-b border-border">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {view === "login" ? "Welcome Back" : "Create Account"}
                    </h2>
                    <p className="text-sm text-text-secondary">
                        {view === "login"
                            ? "Enter your details to access your account"
                            : "Join Pulse Manga community today"}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-border">
                    <button
                        onClick={() => setView("login")}
                        className={`flex-1 py-3 text-sm font-medium transition-colors relative ${view === "login"
                                ? "text-primary bg-primary/5"
                                : "text-text-secondary hover:text-white hover:bg-surface-light"
                            }`}
                    >
                        Sign In
                        {view === "login" && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                        )}
                    </button>
                    <button
                        onClick={() => setView("register")}
                        className={`flex-1 py-3 text-sm font-medium transition-colors relative ${view === "register"
                                ? "text-primary bg-primary/5"
                                : "text-text-secondary hover:text-white hover:bg-surface-light"
                            }`}
                    >
                        Sign Up
                        {view === "register" && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                        )}
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {view === "login" ? (
                        <LoginForm onSuccess={onClose} />
                    ) : (
                        <RegisterForm onSuccess={onClose} />
                    )}
                </div>

                {/* Footer Switcher */}
                <div className="p-4 text-center border-t border-border bg-surface-light/50 rounded-b-xl">
                    <p className="text-sm text-text-secondary">
                        {view === "login" ? (
                            <>
                                Don't have an account?{" "}
                                <button
                                    onClick={() => setView("register")}
                                    className="text-primary hover:text-primary-light font-medium transition-colors"
                                >
                                    Sign up
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button
                                    onClick={() => setView("login")}
                                    className="text-primary hover:text-primary-light font-medium transition-colors"
                                >
                                    Sign in
                                </button>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
