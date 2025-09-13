
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-8 px-4 border-b border-base-300">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
        Pain Point <span className="text-brand-secondary">Idea Generator</span>
      </h1>
      <p className="text-slate-400 max-w-2xl mx-auto">
        Inspired by hugely successful apps that solve one big problem. Select common frustrations below to generate your next big business idea.
      </p>
    </header>
  );
};

export default Header;
