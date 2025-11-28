import { describe, it, expect, beforeEach } from "vitest";
import { useHistoryStore } from "@/lib/stores/historyStore";
import type { SearchHistoryItem } from "@/lib/types/weather.types";

/**
 * Тесты для historyStore 
 * 
 * Что тестируем:
 * - Добавление города в историю
 * - Дубликаты (если есть такой же город перемещает наверх)
 * - Лимит в 10 элементов
 * - Удаление элементов
 * - Очистку истории
 * - Работу с localStorage
 */

describe("historyStore", () => {
  /**
   * Делаем мок localStorage
   */
  
  const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      clear: () => {
        store = {};
      },
      removeItem: (key: string) => {
        delete store[key];
      },
    };
  })();

  // Меняем глобальный localStorage и window на наши моки
  beforeEach(() => {
    // @ts-expect-error - игнорируем ошибку типизации для мока
    global.localStorage = localStorageMock;
    
    // @ts-expect-error - мокаем window чтобы проверка typeof window !== 'undefined' работала
    global.window = { localStorage: localStorageMock };
    
    localStorageMock.clear(); // Очищаем перед каждым тестом
    
  
    useHistoryStore.setState({ history: [], hydrated: false });
  });

  /**
   * Тест 1: Добавление нового города если история пустая
   */
    it("должен добавить новый город в пустую историю", () => {
      const store = useHistoryStore.getState();

      store.addToHistory({
        city: "Одесса",
        country: "UA",
        lat: 46.4825,
        lon: 30.7233,
      });

      const state = useHistoryStore.getState();
      expect(state.history).toHaveLength(1);
      expect(state.history[0].city).toBe("Одесса");
      expect(state.history[0].country).toBe("UA");
      expect(state.history[0]).toHaveProperty("id"); // id должен сгенериться
      expect(state.history[0]).toHaveProperty("searchedAt"); // timestamp должен сгенериться
    });

  /**
   * Тест 2: Добавление нескольких разных городов
   */
    it("должен добавить несколько городов в порядке LIFO (последний первый)", () => {
      
    const store = useHistoryStore.getState();


    store.addToHistory({ city: "Одесса", country: "UA", lat: 46.48, lon: 30.72 });
    store.addToHistory({ city: "Киев", country: "UA", lat: 50.45, lon: 30.52 });
    store.addToHistory({ city: "Львов", country: "UA", lat: 49.84, lon: 24.03 });

  
    const state = useHistoryStore.getState();
    expect(state.history).toHaveLength(3);
    expect(state.history[0].city).toBe("Львов"); // последний добавленный
    expect(state.history[1].city).toBe("Киев");
    expect(state.history[2].city).toBe("Одесса"); // первый добавленный
  });

  /**
   * Тест 3: Такой же город должен переместиться наверх
   */
  it("должен переместить существующий город наверх при повторном добавлении", () => {
   
    const store = useHistoryStore.getState();
    store.addToHistory({ city: "Одесса", country: "UA", lat: 46.48, lon: 30.72 });
    store.addToHistory({ city: "Киев", country: "UA", lat: 50.45, lon: 30.52 });
    store.addToHistory({ city: "Львов", country: "UA", lat: 49.84, lon: 24.03 });


    store.addToHistory({ city: "Одесса", country: "UA", lat: 46.48, lon: 30.72 });


    const state = useHistoryStore.getState();
    expect(state.history).toHaveLength(3); // не увеличилось
    expect(state.history[0].city).toBe("Одесса"); // переместилась наверх
    expect(state.history[1].city).toBe("Львов");
    expect(state.history[2].city).toBe("Киев");
  });

  /**
   * Тест 4: Лимит в 10 городо в списке
   */
  it("должен ограничить историю до 10 элементов", () => {
   
    const store = useHistoryStore.getState();


    for (let i = 1; i <= 12; i++) {
      store.addToHistory({
        city: `Город${i}`,
        country: "UA",
        lat: 50 + i,
        lon: 30 + i,
      });
    }

    // должно остаться только 10
    const state = useHistoryStore.getState();
    expect(state.history).toHaveLength(10);
    
    // Последний добавленный (Город12) должен быть первым
    expect(state.history[0].city).toBe("Город12");
    
    // Первый добавленный (Город1 и Город2) должны удалиться
    const cities = state.history.map(h => h.city);
    expect(cities).not.toContain("Город1");
    expect(cities).not.toContain("Город2");
    
    // Город3 должен быть последним (10-й элемент)
    expect(state.history[9].city).toBe("Город3");
  });

  /**
   * Тест 5: Удаление элемента из истории
   */
  it("должен удалить элемент из истории по id", () => {
    
    const store = useHistoryStore.getState();
    store.addToHistory({ city: "Одесса", country: "UA", lat: 46.48, lon: 30.72 });
    store.addToHistory({ city: "Киев", country: "UA", lat: 50.45, lon: 30.52 });
    store.addToHistory({ city: "Львов", country: "UA", lat: 49.84, lon: 24.03 });

    const state = useHistoryStore.getState();
    const kievId = state.history.find(h => h.city === "Киев")?.id;

    store.removeFromHistory(kievId!);

    const newState = useHistoryStore.getState();
    expect(newState.history).toHaveLength(2);
    expect(newState.history.find(h => h.city === "Киев")).toBeUndefined();
    expect(newState.history[0].city).toBe("Львов");
    expect(newState.history[1].city).toBe("Одесса");
  });

  /**
   * Тест 6: Очистка всей истории
   */
  it("должен очистить всю историю", () => {

    const store = useHistoryStore.getState();
    store.addToHistory({ city: "Одесса", country: "UA", lat: 46.48, lon: 30.72 });
    store.addToHistory({ city: "Киев", country: "UA", lat: 50.45, lon: 30.52 });
    store.addToHistory({ city: "Львов", country: "UA", lat: 49.84, lon: 24.03 });

    store.clearHistory();

    const state = useHistoryStore.getState();
    expect(state.history).toHaveLength(0);
    expect(state.history).toEqual([]);
  });

  /**
   * Тест 7: Сохранение в localStorage
   */
  it("должен сохранять историю в localStorage при добавлении", () => {
    
    const store = useHistoryStore.getState();

    store.addToHistory({ city: "Одесса", country: "UA", lat: 46.48, lon: 30.72 });

    const saved = localStorage.getItem("weather-search-history");
    expect(saved).not.toBeNull();
    
    const parsed = JSON.parse(saved!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].city).toBe("Одесса");
  });

  /**
   * Тест 8: Загрузка из localStorage при инициализации
   */
  it("должен загружать историю из localStorage при инициализации", () => {
  
    const mockData: SearchHistoryItem[] = [
      {
        id: "odessa-123",
        city: "Одесса",
        country: "UA",
        lat: 46.48,
        lon: 30.72,
        searchedAt: Date.now(),
      },
      {
        id: "kyiv-456",
        city: "Киев",
        country: "UA",
        lat: 50.45,
        lon: 30.52,
        searchedAt: Date.now(),
      },
    ];
    localStorage.setItem("weather-search-history", JSON.stringify(mockData));

    
    const store = useHistoryStore.getState();
    store.initializeHistory();

  
    const state = useHistoryStore.getState();
    expect(state.history).toHaveLength(2);
    expect(state.history[0].city).toBe("Одесса");
    expect(state.history[1].city).toBe("Киев");
    expect(state.hydrated).toBe(true); // флаг гидрации установлен
  });

  /**
   * Тест 9: Удаление из localStorage при очистке истории
   */
  it("должен очистить localStorage при очистке истории", () => {
   
    const store = useHistoryStore.getState();
    store.addToHistory({ city: "Одесса", country: "UA", lat: 46.48, lon: 30.72 });
    
    // Проверяем что данные есть
    expect(localStorage.getItem("weather-search-history")).not.toBeNull();

    store.clearHistory();

    const saved = localStorage.getItem("weather-search-history");
    const parsed = saved ? JSON.parse(saved) : [];
    expect(parsed).toEqual([]);
  });

  /**
   * Тест 10: Генерация уникального id для каждого элемента
   */
  it("должен генерировать уникальный id для каждого добавленного элемента", async () => {

    const store = useHistoryStore.getState();

    store.addToHistory({ city: "Одесса", country: "UA", lat: 46.48, lon: 30.72 });
    
    const state1 = useHistoryStore.getState();
    const id1 = state1.history[0].id;

    // Ждём 10мс чтобы timestamp точно изменился
    await new Promise(resolve => setTimeout(resolve, 10));

    // Добавляем тот же город снова (должен переместиться с новым id)
    store.addToHistory({ city: "Одесса", country: "UA", lat: 46.48, lon: 30.72 });
    
    const state2 = useHistoryStore.getState();
    const id2 = state2.history[0].id;


    expect(id1).not.toBe(id2);
    expect(id1).toContain("Одесса");
    expect(id2).toContain("Одесса");
    
    // Длина массива должна остаться 1 
    expect(state2.history).toHaveLength(1);
  });
});
