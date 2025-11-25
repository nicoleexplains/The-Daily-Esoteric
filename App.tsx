import React, { useState, useEffect } from 'react';
import { fetchDailyWisdom, fetchExplanation, generateMysticImage } from './services/geminiService';
import { DailyContent, LoadingState } from './types';
import WisdomCard from './components/WisdomCard';
import LoadingSpinner from './components/LoadingSpinner';
import ExplanationView from './components/ExplanationView';
import { Moon, Star, History, Info } from 'lucide-react';

const STORAGE_KEY_PREFIX = 'daily_esoteric_';

const App: React.FC = () => {
  const [dailyContent, setDailyContent] = useState<DailyContent | null>(null);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [explainStatus, setExplainStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [visualStatus, setVisualStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [showExplanation, setShowExplanation] = useState(false);

  // Helper to get today's date string YYYY-MM-DD
  const getTodayString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    const loadDailyContent = async () => {
      setStatus(LoadingState.LOADING);
      const today = getTodayString();
      const storageKey = `${STORAGE_KEY_PREFIX}${today}`;
      
      // 1. Try to load from Local Storage
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as DailyContent;
          setDailyContent(parsed);
          setStatus(LoadingState.SUCCESS);
          return;
        } catch (e) {
          console.error("Cache corrupted, clearing");
          localStorage.removeItem(storageKey);
        }
      }

      // 2. If not found, fetch from Gemini
      try {
        const wisdom = await fetchDailyWisdom();
        
        // Initial image attempt (optional, can be done on demand to save tokens/time)
        // Let's do it on demand to be faster initially, unless we want a "complete" daily feel.
        // We'll leave image as null initially.

        const newContent: DailyContent = {
          date: today,
          wisdom,
        };

        setDailyContent(newContent);
        localStorage.setItem(storageKey, JSON.stringify(newContent));
        setStatus(LoadingState.SUCCESS);
        
        // Auto-trigger image generation in background if not present
        handleVisualize(newContent, storageKey);

      } catch (error) {
        console.error(error);
        setStatus(LoadingState.ERROR);
      }
    };

    loadDailyContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExplain = async () => {
    if (!dailyContent) return;
    if (dailyContent.fullExplanation) {
      setShowExplanation(true);
      return;
    }

    setExplainStatus(LoadingState.LOADING);
    try {
      const explanation = await fetchExplanation(dailyContent.wisdom);
      
      const updatedContent = { ...dailyContent, fullExplanation: explanation };
      setDailyContent(updatedContent);
      
      // Update cache
      const storageKey = `${STORAGE_KEY_PREFIX}${dailyContent.date}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedContent));
      
      setShowExplanation(true);
      setExplainStatus(LoadingState.SUCCESS);
    } catch (e) {
      setExplainStatus(LoadingState.ERROR);
    }
  };

  const handleVisualize = async (contentToUpdate: DailyContent, key: string) => {
    if (contentToUpdate.imageUrl) return;

    setVisualStatus(LoadingState.LOADING);
    try {
        const imageUrl = await generateMysticImage(contentToUpdate.wisdom);
        if (imageUrl) {
            const updatedContent = { ...contentToUpdate, imageUrl };
            setDailyContent(updatedContent);
            localStorage.setItem(key, JSON.stringify(updatedContent));
        }
        setVisualStatus(LoadingState.SUCCESS);
    } catch (e) {
        setVisualStatus(LoadingState.ERROR);
    }
  };

  const manualVisualizeTrigger = () => {
    if (dailyContent) {
        const key = `${STORAGE_KEY_PREFIX}${dailyContent.date}`;
        handleVisualize(dailyContent, key);
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-x-hidden selection:bg-amber-900 selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617] opacity-80"></div>
         <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-amber-900/50 to-transparent"></div>
      </div>

      <nav className="relative z-10 p-6 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
            <Moon className="text-amber-500 w-5 h-5" />
            <h1 className="font-display text-lg tracking-widest text-amber-100/90">THE DAILY ESOTERIC</h1>
        </div>
        <div className="flex gap-4">
            <button className="text-slate-500 hover:text-amber-200 transition-colors" title="History"><History size={20} /></button>
            <button className="text-slate-500 hover:text-amber-200 transition-colors" title="About"><Info size={20} /></button>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-4 py-8 md:py-12 max-w-4xl min-h-[80vh] flex flex-col items-center">
        
        <div className="text-center mb-10 space-y-2">
          <div className="flex items-center justify-center gap-2 text-amber-700/60 mb-2">
            <div className="h-px w-8 bg-amber-800/50"></div>
            <Star size={12} className="fill-current" />
            <div className="h-px w-8 bg-amber-800/50"></div>
          </div>
          <p className="font-display text-amber-500/80 tracking-[0.2em] text-sm uppercase">Daily Wisdom • {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>

        {status === LoadingState.LOADING && <LoadingSpinner />}
        
        {status === LoadingState.ERROR && (
           <div className="text-center p-8 border border-red-900/30 bg-red-950/10 rounded-lg">
             <p className="text-red-400 font-display">The connection to the ether is disrupted.</p>
             <button onClick={() => window.location.reload()} className="mt-4 text-xs underline text-red-300">Try Again</button>
           </div>
        )}

        {status === LoadingState.SUCCESS && dailyContent && (
          <div className="w-full space-y-8 animate-[fadeIn_1s_ease-out]">
            <WisdomCard 
              wisdom={dailyContent.wisdom} 
              imageUrl={dailyContent.imageUrl}
              onExplain={handleExplain}
              onVisualize={manualVisualizeTrigger}
              isExplaining={explainStatus === LoadingState.LOADING}
              isVisualizing={visualStatus === LoadingState.LOADING}
            />

            {showExplanation && dailyContent.fullExplanation && (
               <div className="animate-[slideUp_0.5s_ease-out]">
                 <ExplanationView 
                   content={dailyContent.fullExplanation} 
                   onClose={() => setShowExplanation(false)} 
                 />
               </div>
            )}
          </div>
        )}
      </main>

      <footer className="relative z-10 py-8 text-center text-slate-700 text-xs font-display tracking-widest border-t border-white/5 mt-auto">
        <p>CURATED BY NICOLE EXPLAINS IT ALL</p>
      </footer>
    </div>
  );
};

export default App;