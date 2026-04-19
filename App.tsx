import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { PenTool, LayoutDashboard, History, Heart } from 'lucide-react';

import AdaptiveBackground from './components/AdaptiveBackground';
import JournalEditor from './components/JournalEditor';
import EntryList from './components/EntryList';
import Dashboard from './components/Dashboard';

import { getEntries } from './services/storageService';
import { JournalEntry, EmotionAnalysis } from './types';

// Helper for location-based nav highlighting
const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${isActive ? 'bg-white shadow-md text-black' : 'hover:bg-white/20 opacity-70 hover:opacity-100'}`}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const AppContent = () => {
  const [currentAnalysis, setCurrentAnalysis] = useState<EmotionAnalysis | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  const refreshEntries = () => {
    setEntries(getEntries());
  };

  useEffect(() => {
    refreshEntries();
  }, []);

  return (
    <AdaptiveBackground emotion={currentAnalysis?.primary_emotion || null}>
      <div className="min-h-screen flex flex-col p-4 md:p-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 z-50 relative">
          <div className="flex items-center gap-3">
            <div className="bg-white/30 p-2 rounded-xl backdrop-blur-sm">
              <Heart className="text-rose-500 fill-rose-500" size={28} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">MoodFlow</h1>
          </div>
          
          <nav className="flex gap-2 bg-black/5 p-1 rounded-full backdrop-blur-md">
            <NavItem to="/" icon={PenTool} label="Journal" />
            <NavItem to="/history" icon={History} label="History" />
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Insights" />
          </nav>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full z-10 relative">
          <Routes>
            <Route 
              path="/" 
              element={
                <JournalEditor 
                  onEntrySaved={() => {
                    refreshEntries();
                    setEditingEntry(null);
                  }} 
                  initialEntry={editingEntry}
                  onEmotionChange={setCurrentAnalysis}
                />
              } 
            />
            <Route 
              path="/history" 
              element={
                <EntryList 
                  entries={entries} 
                  onSelect={(entry) => {
                    setEditingEntry(entry);
                    setCurrentAnalysis(entry.analysis);
                    // Navigate handled by link via NavItem usually, but here we need to switch tabs manually if we were using a different router structure. 
                    // Since we use HashRouter, we can render a redirect or just conditionally render.
                    // For simplicity in this structure:
                    window.location.hash = '#/';
                  }}
                  onDelete={refreshEntries}
                />
              } 
            />
            <Route 
              path="/dashboard" 
              element={<Dashboard entries={entries} />} 
            />
          </Routes>
        </main>

        <footer className="mt-12 flex justify-center pb-4">
          <div className="flex items-center justify-center gap-2 px-6 py-3 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            <p className="text-xs text-black">Crafted with ❤️ by MG Jiwana • Emotion Aware Journaling</p>
          </div>
        </footer>
      </div>
    </AdaptiveBackground>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
