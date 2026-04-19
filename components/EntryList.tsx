import React, { useMemo, useState } from 'react';
import { JournalEntry, EmotionType } from '../types';
import { EMOTION_THEMES, ICON_MAP } from '../constants';
import { Trash2, Calendar, ChevronRight } from 'lucide-react';
import { deleteEntry } from '../services/storageService';

interface EntryListProps {
  entries: JournalEntry[];
  onSelect: (entry: JournalEntry) => void;
  onDelete: () => void;
}

const EntryList: React.FC<EntryListProps> = ({ entries, onSelect, onDelete }) => {
  const [filter, setFilter] = useState<EmotionType | 'ALL'>('ALL');

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this entry?")) {
      deleteEntry(id);
      onDelete();
    }
  };

  const filteredEntries = useMemo(() => {
    if (filter === 'ALL') return entries;
    return entries.filter(e => e.analysis?.primary_emotion === filter);
  }, [entries, filter]);

  if (entries.length === 0) {
    return (
      <div className="text-center py-20 opacity-60">
        <p className="text-xl">No journal entries yet.</p>
        <p className="text-sm mt-2">Start writing to track your emotional journey.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex overflow-x-auto pb-4 gap-2 mb-6 scrollbar-hide">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
            filter === 'ALL' ? 'bg-white text-black shadow-md' : 'bg-white/20 hover:bg-white/40'
          }`}
        >
          All Entries
        </button>
        {Object.values(EmotionType).map(emotion => (
          <button
            key={emotion}
            onClick={() => setFilter(emotion)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize whitespace-nowrap ${
              filter === emotion ? 'bg-white text-black shadow-md' : 'bg-white/20 hover:bg-white/40'
            }`}
          >
            {emotion}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredEntries.map(entry => {
          const analysis = entry.analysis;
          if (!analysis) return null;
          
          const theme = EMOTION_THEMES[analysis.primary_emotion];
          const Icon = ICON_MAP[theme.iconName as keyof typeof ICON_MAP] || ICON_MAP.Meh;

          return (
            <div 
              key={entry.id}
              onClick={() => onSelect(entry)}
              className="group relative flex items-center gap-4 p-5 bg-white/30 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/50 transition-all cursor-pointer hover:shadow-lg"
            >
              <div className={`p-3 rounded-full ${theme.accentColor} bg-opacity-40`}>
                <Icon size={24} className={theme.textColor} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-lg capitalize truncate pr-4">{analysis.primary_emotion}</h4>
                  <div className="flex items-center text-xs opacity-60 gap-1">
                    <Calendar size={12} />
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-sm opacity-80 line-clamp-2 pr-8">{entry.text}</p>
                <div className="flex gap-2 mt-2">
                    {analysis.themes.slice(0, 2).map(t => (
                        <span key={t} className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-black/5">{t}</span>
                    ))}
                </div>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                 <button 
                  onClick={(e) => handleDelete(e, entry.id)}
                  className="p-2 hover:bg-red-500/20 hover:text-red-700 rounded-full transition-colors"
                 >
                    <Trash2 size={18} />
                 </button>
                 <ChevronRight size={20} className="opacity-40" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EntryList;
