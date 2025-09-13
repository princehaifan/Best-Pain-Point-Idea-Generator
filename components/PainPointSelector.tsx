
import React, { useState, useMemo } from 'react';
import { PainPoint } from '../types';
import { PAIN_POINTS } from '../constants/painPoints';

interface PainPointSelectorProps {
  selectedPainPoints: PainPoint[];
  onTogglePainPoint: (painPoint: PainPoint) => void;
}

const PainPointSelector: React.FC<PainPointSelectorProps> = ({ selectedPainPoints, onTogglePainPoint }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = useMemo(() => {
    const categoryMap = PAIN_POINTS.reduce((acc, point) => {
      (acc[point.category] = acc[point.category] || []).push(point);
      return acc;
    }, {} as Record<string, PainPoint[]>);
    return Object.entries(categoryMap);
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;

    const lowercasedFilter = searchTerm.toLowerCase();
    
    return categories.map(([category, points]) => {
      const filteredPoints = points.filter(p => 
        p.name.toLowerCase().includes(lowercasedFilter) ||
        p.description.toLowerCase().includes(lowercasedFilter)
      );
      return [category, filteredPoints] as [string, PainPoint[]];
    }).filter(([, points]) => points.length > 0);

  }, [searchTerm, categories]);

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="sticky top-0 bg-base-100 py-4 z-10">
        <input
          type="text"
          placeholder="🔍 Search for pain points (e.g., 'procrastination', 'sleep')..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 bg-base-200 border border-base-300 rounded-md focus:ring-2 focus:ring-brand-secondary focus:outline-none transition"
        />
      </div>
      
      <div className="space-y-6 mt-4">
        {filteredCategories.map(([category, points]) => (
          <div key={category}>
            <h3 className="text-xl font-semibold text-slate-300 mb-3 border-b border-base-300 pb-2">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {points.map(point => {
                const isSelected = selectedPainPoints.some(p => p.name === point.name);
                return (
                  <button
                    key={point.name}
                    onClick={() => onTogglePainPoint(point)}
                    className={`px-3 py-1.5 text-sm rounded-full cursor-pointer transition-all duration-200 border
                      ${isSelected 
                        ? 'bg-brand-secondary text-white border-brand-secondary shadow-md' 
                        : 'bg-base-200 text-slate-300 border-base-300 hover:bg-base-300 hover:border-slate-500'}`
                    }
                  >
                    {point.emoji} {point.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PainPointSelector;
