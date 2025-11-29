/**
 * Менеджер состояний ( стор )
 */
import { create } from 'zustand';
import { SearchHistoryItem } from '@/lib/types/weather.types';
import { HistoryStore } from "@/lib/types/store.types";

// Ключ для localStorage
const STORAGE_KEY = 'weather-search-history';



// Функция загрузки ИЗ localStorage
const loadFromStorage = (): SearchHistoryItem[] => {
  if (typeof window === 'undefined') return []; // SSR проверка
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as SearchHistoryItem[];
  } catch (error) {
    console.error('Ошибка загрузки истории из localStorage:', error);
    return [];
  }
};

// Функция сохранения В localStorage
const saveToStorage = (history: SearchHistoryItem[]): void => {
  if (typeof window === 'undefined') return; 
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Ошибка сохранения истории в localStorage:', error);
  }
};

// Создание store
export const useHistoryStore = create<HistoryStore>((set) => ({
  history: [],
  hydrated: false,

  // Инициализация истории из localStorage (только на клиенте)
  initializeHistory: () => {
    set(() => {
      const storedHistory = loadFromStorage();
      return { history: storedHistory, hydrated: true };
    });
  },

  // Добавить элемент в историю
  addToHistory: (item) => {
    set((state) => {
      const newItem: SearchHistoryItem = {
        ...item,
        id: `${item.city}-${Date.now()}`,
        searchedAt: Date.now(),
      };

   
      const existingIndex = state.history.findIndex(
        (h) => h.city === item.city && h.country === item.country
      );

      let newHistory: SearchHistoryItem[];

      if (existingIndex !== -1) {
     
        newHistory = [
          newItem,
          ...state.history.filter((_, index) => index !== existingIndex),
        ];
      } else {
        // Если города нет - добавляем в начало
        newHistory = [newItem, ...state.history];
      }

 
      const limitedHistory = newHistory.slice(0, 10);

      // Сохраняем в localStorage
      saveToStorage(limitedHistory);

      return { history: limitedHistory };
    });
  },

  // Удалить элемент из истории
  removeFromHistory: (id) => {
    set((state) => {
      const newHistory = state.history.filter((item) => item.id !== id);
      saveToStorage(newHistory);
      return { history: newHistory };
    });
  },

  // Очистить всю историю
  clearHistory: () => {
    set(() => {
      saveToStorage([]);
      return { history: [] };
    });
  },

 
  _loadFromStorage: loadFromStorage,
  _saveToStorage: saveToStorage,
}));