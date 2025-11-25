import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-amber-900/30 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-amber-500 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-amber-500 text-xs font-serif">
          ✦
        </div>
      </div>
      <p className="text-amber-500/80 font-display text-sm animate-pulse tracking-widest">
        CONSULTING THE AETHER...
      </p>
    </div>
  );
};

export default LoadingSpinner;