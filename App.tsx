
import React, { useState, useCallback } from 'react';
import { PainPoint, BusinessIdea } from './types';
import { generateBusinessIdeas } from './services/geminiService';
import Header from './components/Header';
import Footer from './components/Footer';
import PainPointSelector from './components/PainPointSelector';
import IdeaCard from './components/IdeaCard';

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-secondary"></div>
        <p className="text-slate-400">Generating brilliant ideas...</p>
    </div>
);

const App: React.FC = () => {
    const [selectedPainPoints, setSelectedPainPoints] = useState<PainPoint[]>([]);
    const [ideas, setIdeas] = useState<BusinessIdea[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleTogglePainPoint = (painPoint: PainPoint) => {
        setSelectedPainPoints(prev =>
            prev.some(p => p.name === painPoint.name)
                ? prev.filter(p => p.name !== painPoint.name)
                : [...prev, painPoint]
        );
    };

    const handleGenerateIdeas = useCallback(async () => {
        if (selectedPainPoints.length === 0) {
            setError("Please select at least one pain point to generate ideas.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setIdeas(null);
        try {
            const result = await generateBusinessIdeas(selectedPainPoints);
            setIdeas(result);
        } catch (err: any) {
            setError(err.message || "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [selectedPainPoints]);

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="bg-base-200 rounded-lg p-6 shadow-xl border border-base-300">
                    <h2 className="text-2xl font-bold mb-4 text-white">1. Select Your Pain Points</h2>
                    <PainPointSelector selectedPainPoints={selectedPainPoints} onTogglePainPoint={handleTogglePainPoint} />
                </div>

                <div className="text-center my-8">
                    <button
                        onClick={handleGenerateIdeas}
                        disabled={isLoading || selectedPainPoints.length === 0}
                        className="bg-brand-primary text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-brand-secondary transition-all duration-300 disabled:bg-base-300 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
                    >
                        {isLoading ? "Generating..." : "Generate Ideas"}
                    </button>
                </div>

                <div className="mt-10">
                    {isLoading && <LoadingSpinner />}
                    {error && (
                        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center">
                            <strong className="font-bold">Error: </strong>
                            <span>{error}</span>
                        </div>
                    )}
                    {ideas && ideas.length > 0 && (
                         <div>
                            <h2 className="text-3xl font-bold text-center mb-8 text-white">Here are your business ideas:</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {ideas.map((idea, index) => (
                                    <IdeaCard key={index} idea={idea} index={index} />
                                ))}
                            </div>
                        </div>
                    )}
                     {ideas && ideas.length === 0 && !isLoading && (
                        <div className="text-center text-slate-400 py-8">
                            <p>No ideas were generated. Try selecting different pain points or refining your search.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;
