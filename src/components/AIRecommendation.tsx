"use client";

import { useState } from "react";
import { Sparkles, X, Check } from "lucide-react";
import { MOCK_MANGA } from "@/data/mock";

export function AIRecommendationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState<string[]>([]);
    const [recommendations, setRecommendations] = useState<typeof MOCK_MANGA>([]);

    if (!isOpen) return null;

    const handleAnswer = (ans: string) => {
        const newAnswers = [...answers, ans];
        setAnswers(newAnswers);

        if (step < 3) {
            setStep(step + 1);
        } else {
            // Logic Mock
            const recommended = MOCK_MANGA.sort(() => Math.random() - 0.5).slice(0, 3);
            setRecommendations(recommended);
            setStep(4); // Result
        }
    };

    const reset = () => {
        setStep(1);
        setAnswers([]);
        setRecommendations([]);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-surface border border-primary w-full max-w-lg rounded-xl shadow-glow-blue overflow-hidden relative animate-in fade-in zoom-in duration-200">
                <button onClick={reset} className="absolute top-4 right-4 text-text-muted hover:text-white">
                    <X size={24} />
                </button>

                <div className="p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <Sparkles className="text-secondary animate-pulse" />
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                            AI Magic Recommender
                        </h2>
                    </div>

                    {step === 1 && (
                        <QuizStep
                            question="What are you in the mood for?"
                            options={["Adrenaline Action", "Wholesome Slice of Life", "Mind-bending Mystery", "Romantic Fluff"]}
                            onSelect={handleAnswer}
                        />
                    )}

                    {step === 2 && (
                        <QuizStep
                            question="Choose a protagonist vibe:"
                            options={["Overpowered Edgelord", "Underdog Hero", "Genius Strategist", "Chaos Gremlin"]}
                            onSelect={handleAnswer}
                        />
                    )}

                    {step === 3 && (
                        <QuizStep
                            question="Preferred setting?"
                            options={["Modern World", "Fantasy Realm", "Sci-Fi Future", "Historical"]}
                            onSelect={handleAnswer}
                        />
                    )}

                    {step === 4 && (
                        <div className="space-y-6">
                            <p className="text-text-main text-center">Based on your answers, we found these gems:</p>
                            <div className="grid gap-4">
                                {recommendations.map(m => (
                                    <div key={m.id} className="flex gap-4 bg-background p-3 rounded border border-border hover:border-primary transition-colors cursor-pointer">
                                        <div className="relative w-12 h-16 rounded overflow-hidden"> {/* Adjusted div for Image component */}
                                            <img
                                                src={m.cover}
                                                alt={m.title}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{m.title}</h4>
                                            <p className="text-xs text-text-muted mt-1 line-clamp-2">
                                                Because you like {answers[0]} and {answers[2]} settings.
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={reset} className="w-full bg-primary py-3 rounded font-bold text-white hover:bg-primary/90">
                                Close & Happy Reading
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function QuizStep({ question, options, onSelect }: { question: string; options: string[]; onSelect: (val: string) => void }) {
    return (
        <div>
            <h3 className="text-lg text-white font-medium mb-6 text-center">{question}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {options.map(opt => (
                    <button
                        key={opt}
                        onClick={() => onSelect(opt)}
                        className="p-4 bg-background border border-border rounded text-sm text-text-main hover:bg-primary hover:text-white hover:border-primary transition-all text-left flex items-center justify-between group"
                    >
                        {opt}
                        <Check size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                ))}
            </div>
        </div>
    );
}
