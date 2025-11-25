import React from 'react';
import { EsotericWisdom } from '../types';
import { Share2, Sparkles, BookOpen } from 'lucide-react';

interface WisdomCardProps {
  wisdom: EsotericWisdom;
  imageUrl?: string;
  onExplain: () => void;
  onVisualize: () => void;
  isExplaining: boolean;
  isVisualizing: boolean;
}

const WisdomCard: React.FC<WisdomCardProps> = ({ 
  wisdom, 
  imageUrl, 
  onExplain, 
  onVisualize,
  isExplaining,
  isVisualizing
}) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto bg-slate-900 border border-amber-900/40 rounded-xl shadow-2xl overflow-hidden group">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-600/50 rounded-tl-md"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-600/50 rounded-tr-md"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-600/50 rounded-bl-md"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-600/50 rounded-br-md"></div>

      {/* Image Section */}
      <div className="relative h-64 sm:h-80 w-full bg-slate-950 flex items-center justify-center overflow-hidden border-b border-amber-900/30">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={wisdom.topic} 
            className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center text-slate-600">
             <div className="w-24 h-24 border border-slate-700 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-slate-700" />
             </div>
             <p className="font-display tracking-widest text-xs">VISUALIZATION NOT MANIFESTED</p>
             <button 
                onClick={onVisualize}
                disabled={isVisualizing}
                className="mt-4 px-4 py-2 bg-amber-900/20 hover:bg-amber-900/40 text-amber-500 text-xs tracking-widest border border-amber-900/50 rounded transition-all"
             >
                {isVisualizing ? 'CONJURING...' : 'CONJURE IMAGE'}
             </button>
          </div>
        )}
        
        {/* Overlay Topic Badge */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-sm border border-amber-500/30 rounded-full">
          <span className="text-amber-400 text-xs font-display tracking-widest uppercase">{wisdom.topic}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 text-center relative">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 mb-6 drop-shadow-sm leading-relaxed">
            "{wisdom.quote}"
          </h2>
          <p className="text-amber-700/80 font-serif italic text-lg">— {wisdom.source}</p>
        </div>

        <div className="w-12 h-px bg-amber-900/50 mx-auto my-6"></div>

        <p className="text-slate-400 font-light leading-relaxed mb-8">
          {wisdom.briefInterpretation}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onExplain}
            disabled={isExplaining}
            className="flex items-center gap-2 px-6 py-3 bg-amber-950 hover:bg-amber-900 text-amber-200 text-sm font-display tracking-wide rounded border border-amber-800/50 hover:border-amber-500 transition-all shadow-[0_0_15px_rgba(180,83,9,0.1)] hover:shadow-[0_0_20px_rgba(180,83,9,0.3)] disabled:opacity-50"
          >
            <BookOpen size={16} />
            {isExplaining ? 'DECIPHERING...' : 'NICOLE EXPLAINS IT'}
          </button>
          
          <button className="flex items-center gap-2 px-6 py-3 bg-transparent hover:bg-slate-800 text-slate-400 hover:text-amber-200 text-sm font-display tracking-wide rounded border border-slate-800 hover:border-amber-900/50 transition-all">
            <Share2 size={16} />
            SHARE
          </button>
        </div>
      </div>
    </div>
  );
};

export default WisdomCard;