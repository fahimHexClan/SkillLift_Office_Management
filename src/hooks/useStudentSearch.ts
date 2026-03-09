import { useState, useEffect } from 'react';
import { StudentProfile, SearchType } from '@/types';
import { searchStudent } from '@/lib/api';

const HISTORY_KEY = 'skilift_search_history';
const HISTORY_MAX = 10;

function loadHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: string[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {}
}

export function useStudentSearch() {
  const [profile, setProfile]             = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading]         = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    setSearchHistory(loadHistory());
  }, []);

  const search = async (value: string, type: SearchType) => {
    if (!value.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = await searchStudent(type, value);
      setProfile(data);

      // Update search history
      setSearchHistory((prev) => {
        const label    = `[${type.replace(/\s/g, '')}] ${value}`;
        const filtered = prev.filter((h) => h !== label);
        const next     = [label, ...filtered].slice(0, HISTORY_MAX);
        saveHistory(next);
        return next;
      });
    } catch (err: unknown) {
      console.error('Search error:', err);
      const raw = err instanceof Error ? err.message : String(err);
      const msg = typeof raw === 'string' ? raw : JSON.stringify(raw);
      setError(msg);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    saveHistory([]);
  };

  return { profile, isLoading, error, searchHistory, search, clearHistory };
}
