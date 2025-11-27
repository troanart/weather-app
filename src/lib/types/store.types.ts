import { SearchHistoryItem } from "./weather.types";

export interface HistoryStore {
  history: SearchHistoryItem[];
  hydrated: boolean;
  initializeHistory: () => void;
  addToHistory: (item: Omit<SearchHistoryItem, "id" | "searchedAt">) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  _loadFromStorage: () => SearchHistoryItem[];
  _saveToStorage: (history: SearchHistoryItem[]) => void;
}
