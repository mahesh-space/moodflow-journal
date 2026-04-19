import { JournalEntry } from '../types';

const STORAGE_KEY = 'moodflow_entries_v1';

export const saveEntry = (entry: JournalEntry): JournalEntry => {
  const existing = getEntries();
  const index = existing.findIndex(e => e.id === entry.id);
  
  if (index >= 0) {
    existing[index] = entry;
  } else {
    existing.unshift(entry);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  return entry;
};

export const getEntries = (): JournalEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load entries", e);
    return [];
  }
};

export const getEntryById = (id: string): JournalEntry | undefined => {
  return getEntries().find(e => e.id === id);
};

export const deleteEntry = (id: string): void => {
  const existing = getEntries();
  const filtered = existing.filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};
