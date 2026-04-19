import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Save, Sparkles, RefreshCcw } from 'lucide-react';
import { JournalEntry, EmotionAnalysis } from '../types';
import { analyzeEmotion } from '../services/geminiService';
import { saveEntry } from '../services/storageService';
import EmotionIndicator from './EmotionIndicator';

interface JournalEditorProps {
  onEntrySaved: () => void;
  initialEntry?: JournalEntry | null;
  onEmotionChange: (analysis: EmotionAnalysis | null) => void;
}

const JournalEditor: React.FC<JournalEditorProps> = ({ onEntrySaved, initialEntry, onEmotionChange }) => {
  const [text, setText] = useState(initialEntry?.text || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<EmotionAnalysis | null>(initialEntry?.analysis || null);
  const [lastSaved, setLastSaved] = useState<Date | null>(initialEntry ? new Date(initialEntry.updatedAt) : null);
  const [currentEntryId, setCurrentEntryId] = useState<string>(initialEntry?.id || crypto.randomUUID());

  // Reset if initialEntry changes (e.g. creating new vs editing)
  useEffect(() => {
    if (initialEntry) {
      setText(initialEntry.text);
      setAnalysis(initialEntry.analysis);
      setCurrentEntryId(initialEntry.id);
      setLastSaved(new Date(initialEntry.updatedAt));
      onEmotionChange(initialEntry.analysis);
    } else {
      // New Entry
      setText('');
      setAnalysis(null);
      setCurrentEntryId(crypto.randomUUID());
      setLastSaved(null);
      onEmotionChange(null);
    }
  }, [initialEntry, onEmotionChange]);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeEmotion(text);
      setAnalysis(result);
      onEmotionChange(result);
      
      // Auto-save after analysis
      const entry: JournalEntry = {
        id: currentEntryId,
        text,
        createdAt: initialEntry?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        analysis: result
      };
      saveEntry(entry);
      setLastSaved(new Date());
      onEntrySaved();
      
    } catch (err) {
      console.error(err);
      alert('Failed to analyze emotion. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Simple auto-draft save every 30s if text changed
  useEffect(() => {
    const timer = setInterval(() => {
      if (text.trim() && text !== initialEntry?.text) {
         // We don't save full entry to persistent storage automatically to avoid overwriting analysis
         // In a real app, we would save to a "drafts" table. 
         // For now, we only update the Last Saved indicator visually or strictly if user analyzed.
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [text, initialEntry]);

  const handleClear = () => {
    if (window.confirm("Start a new entry? Unsaved changes will be lost.")) {
       setText('');
       setAnalysis(null);
       onEmotionChange(null);
       setCurrentEntryId(crypto.randomUUID());
       setLastSaved(null);
    }
  };

  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;

  return (
    <div className="max-w-4xl mx-auto w-full transition-all">
      
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm opacity-70 font-medium">
          {lastSaved ? `Saved ${lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 'Unsaved Draft'}
        </div>
        <div className="flex gap-2">
           <button 
            onClick={handleClear}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            title="New Entry"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      <div className="relative group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="How are you feeling right now? Write your thoughts..."
          className="w-full min-h-[40vh] p-8 text-lg md:text-xl bg-white/40 backdrop-blur-md rounded-3xl shadow-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 resize-y placeholder-gray-500/50 transition-all duration-300"
          spellCheck={false}
        />
        <div className="absolute bottom-4 right-6 text-xs opacity-50 font-mono pointer-events-none">
          {wordCount} words
        </div>
      </div>

      <div className="flex justify-end mt-6 gap-4">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || text.length < 5}
          className={`
            flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white shadow-lg
            transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl
            ${isAnalyzing ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'}
          `}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Analyze & Save
            </>
          )}
        </button>
      </div>

      {analysis && <EmotionIndicator analysis={analysis} />}

    </div>
  );
};

export default JournalEditor;
