import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ExplanationViewProps {
  content: string;
  onClose: () => void;
}

const ExplanationView: React.FC<ExplanationViewProps> = ({ content, onClose }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-1 bg-gradient-to-b from-amber-900/20 to-transparent rounded-xl">
        <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-6 sm:p-8 border border-amber-900/30">
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-display text-amber-200">The Deeper Meaning</h3>
                <button onClick={onClose} className="text-slate-500 hover:text-amber-200 transition-colors">✕</button>
            </div>
            
            <div className="prose prose-invert prose-amber max-w-none font-light leading-relaxed text-slate-300">
                {/* 
                   Using a simple whitespace renderer if markdown is complex, 
                   but since we don't have the markdown library installed in this specific env, 
                   we will simulate simple paragraph breaks.
                */}
                {content.split('\n').map((paragraph, idx) => (
                    paragraph.trim() ? 
                    <p key={idx} className="mb-4">{paragraph.replace(/^#+\s/, '').replace(/\*\*/g, '')}</p> 
                    : <div key={idx} className="h-2" />
                ))}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 text-center">
                <p className="text-xs text-slate-500 font-display tracking-widest">FROM THE ARCHIVES OF NICOLE EXPLAINS IT ALL</p>
            </div>
        </div>
    </div>
  );
};

export default ExplanationView;