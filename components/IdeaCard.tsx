
import React from 'react';
import { BusinessIdea } from '../types';

interface IdeaCardProps {
  idea: BusinessIdea;
  index: number;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, index }) => {
  const animationDelay = `${index * 100}ms`;
  return (
    <div 
        className="bg-base-200 rounded-lg shadow-lg p-6 border border-base-300 transform hover:-translate-y-1 transition-transform duration-300 animate-fade-in"
        style={{ animationDelay }}
    >
      <h3 className="text-2xl font-bold text-brand-secondary mb-2">{idea.name}</h3>
      <p className="text-slate-300 mb-4">{idea.concept}</p>
      <div className="text-sm text-slate-400">
        <span className="font-semibold">Target Audience:</span> {idea.targetAudience}
      </div>
    </div>
  );
};

export default IdeaCard;
