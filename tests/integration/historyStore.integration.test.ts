/**
 * ИНТЕГРАЦИОННЫЕ ТЕСТЫ для historyStore + API + localStorage
 * 
 * ЧТО МЫ ТЕСТИРУЕМ:
 * Этот файл проверяет интеграцию между:
 * 1. historyStore (Zustand store)
 * 2. localStorage (браузерное хранилище)
 * 3. API вызовами (моки)
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { useHistoryStore } from "@/lib/stores/historyStore";
import { fetchWeatherForCity } from "@/lib/api/weatherService";
import { getWeatherByCity } from "@/lib/api/weatherApi";
import type { SearchHistoryItem, CityGeoData, WeatherApiResponse } from "@/lib/types/weather.types";

// Мокаем weatherService, чтобы контролировать, что он возвращает
vi.mock("@/lib/api/weatherService");
vi.mock("@/lib/api/weatherApi");

describe("Интеграционные тесты: historyStore + API + localStorage", () => {
  /**
   *  Создаём мок localStorage
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
      get length() {
        return Object.keys(store).length;
      },
      key: (index: number) => {
        const keys = Object.keys(store);
        return keys[index] || null;
      },
    };
  })();

  // Мок-данные для тестов
  const mockCityData: CityGeoData = {
    name: "Одесса",
    country: "UA",
    lat: 46.4825,
    lon: 30.7233,
  };

  const mockWeatherData: WeatherApiResponse = {
    current: {
      temp: 24.5,
      wind_speed: 4.57,
      humidity: 70,
      weather: [{ description: "ясно", icon: "01d" }],
    },
    daily: [{ temp: { min: 21.3, max: 26.7 } }],
  };

  /**
   * beforeEach - выполняется перед каждым тестом
   * Тут мы делаем следующее :
   * 1. Настраиваем моки для localStorage
   * 2. Очищаем store
   * 3. Очищаем все моки API
   */
  beforeEach(() => {
    // Настраиваем глобальный localStorage
    global.localStorage = localStorageMock as Storage;
    global.window = { localStorage: localStorageMock } as Window & typeof globalThis;

    // Очищаем localStorage перед каждым тестом
    localStorageMock.clear();

    // Сбрасываем состояние store
    useHistoryStore.setState({ history: [], hydrated: false });

    // Очищаем все моки
    vi.clearAllMocks();
  });

  /**
   * ТЕСТ 1: Полный флоу - поиск погоды и сохранение в историю
   * 
   * Что проверяем:
   * 1. API вызывается для получения погоды
   * 2. Данные сохраняются в store
   * 3. Данные сохраняются в localStorage
   * 4. История обновляется правильно
   */
  it("должен сохранить город в историю после успешного поиска погоды", async () => {
    //  Настраиваем мок API, чтобы он возвращал данные
    vi.mocked(getWeatherByCity).mockResolvedValue({
      cityData: mockCityData,
      weatherData: mockWeatherData,
    });

    vi.mocked(fetchWeatherForCity).mockResolvedValue({
      weather: {
        id: "Одесса-123",
        city: "Одесса",
        country: "UA",
        temperature: 25,
        humidity: 70,
        description: "ясно",
        icon: "01d",
        minTemp: 21,
        maxTemp: 27,
        windSpeed: 4.6,
        timestamp: Date.now(),
      },
      cityData: mockCityData,
    });

    //  Симулируем поиск погоды (как это делает компонент)
    const { cityData } = await fetchWeatherForCity("Одесса");
    
    // Добавляем в историю (как это делает компонент page.tsx)
    const store = useHistoryStore.getState();
    store.addToHistory({
      city: cityData.name,
      country: cityData.country,
      lat: cityData.lat,
      lon: cityData.lon,
    });

    //  Проверяем результаты
    const state = useHistoryStore.getState();

    // 1. Проверяем, что данные в store
    expect(state.history).toHaveLength(1);
    expect(state.history[0].city).toBe("Одесса");
    expect(state.history[0].country).toBe("UA");
    expect(state.history[0].lat).toBe(46.4825);
    expect(state.history[0].lon).toBe(30.7233);

    // 2. Проверяем, что данные сохранились в localStorage
    const saved = localStorage.getItem("weather-search-history");
    expect(saved).not.toBeNull();

    const parsed = JSON.parse(saved!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].city).toBe("Одесса");

    // 3. Проверяем, что API был вызван
    expect(fetchWeatherForCity).toHaveBeenCalledWith("Одесса");
  });

  /**
   * ТЕСТ 2: Загрузка истории из localStorage при инициализации
   * 
   * Что проверяем:
   * - Store правильно загружает данные из localStorage
   * - Флаг hydrated устанавливается ( он нужен что бы не возникала ошибка гидрации )
   */
  it("должен загрузить историю из localStorage при инициализации", () => {
    //Сохраняем данные в localStorage вручную
    const mockHistory: SearchHistoryItem[] = [
      {
        id: "odessa-1",
        city: "Одесса",
        country: "UA",
        lat: 46.48,
        lon: 30.72,
        searchedAt: Date.now() - 10000, // 10 секунд назад
      },
      {
        id: "kyiv-2",
        city: "Киев",
        country: "UA",
        lat: 50.45,
        lon: 30.52,
        searchedAt: Date.now() - 5000, // 5 секунд назад
      },
    ];

    localStorage.setItem("weather-search-history", JSON.stringify(mockHistory));

    //  Инициализируем store как это делает компонент в useEffect
    const store = useHistoryStore.getState();
    store.initializeHistory();

    //  Проверяем, что данные загрузились
    const state = useHistoryStore.getState();
    expect(state.history).toHaveLength(2);
    expect(state.history[0].city).toBe("Одесса");
    expect(state.history[1].city).toBe("Киев");
    expect(state.hydrated).toBe(true);
  });

  /**
   * ТЕСТ 3: Полный цикл - поиск, сохранение, удаление, восстановление
   * 
   * Что проверяем:
   * - Весь жизненный цикл элемента истории
   */
  it("должен правильно обрабатывать полный цикл: добавление -> удаление -> очистка", async () => {
    //  Настраиваем мок API
    vi.mocked(fetchWeatherForCity).mockResolvedValue({
      weather: {
        id: "test-1",
        city: "Одесса",
        country: "UA",
        temperature: 25,
        humidity: 70,
        description: "ясно",
        icon: "01d",
        minTemp: 21,
        maxTemp: 27,
        windSpeed: 4.6,
        timestamp: Date.now(),
      },
      cityData: mockCityData,
    });

    const store = useHistoryStore.getState();

    //  Добавляем город
    const { cityData } = await fetchWeatherForCity("Одесса");
    store.addToHistory({
      city: cityData.name,
      country: cityData.country,
      lat: cityData.lat,
      lon: cityData.lon,
    });

    // Проверяем добавление
    let state = useHistoryStore.getState();
    expect(state.history).toHaveLength(1);
    const itemId = state.history[0].id;

    // Удаляем город
    store.removeFromHistory(itemId);

    //  Проверяем удаление
    state = useHistoryStore.getState();
    expect(state.history).toHaveLength(0);

    // Проверяем, что localStorage тоже очистился
    const saved = localStorage.getItem("weather-search-history");
    const parsed = saved ? JSON.parse(saved) : [];
    expect(parsed).toHaveLength(0);

    //  Очищаем всю историю (если бы что-то осталось)
    store.clearHistory();

    //  Проверяем очистку
    state = useHistoryStore.getState();
    expect(state.history).toHaveLength(0);
  });

  /**
   * ТЕСТ 4: Проверка лимита истории при интеграции с API
   * 
   * Что проверяем:
   * - Когда добавляется больше 10 городов, старые удаляются
   * - localStorage тоже обновляется
   */
  it("должен ограничить историю до 10 элементов при множественных запросах", async () => {
    //  Настраиваем мок для множественных запросов
    vi.mocked(fetchWeatherForCity).mockImplementation(async (cityName: string) => {
      return {
        weather: {
          id: `${cityName}-1`,
          city: cityName,
          country: "UA",
          temperature: 20,
          humidity: 60,
          description: "ясно",
          icon: "01d",
          minTemp: 18,
          maxTemp: 22,
          windSpeed: 3.5,
          timestamp: Date.now(),
        },
        cityData: {
          name: cityName,
          country: "UA",
          lat: 50,
          lon: 30,
        },
      };
    });

    const store = useHistoryStore.getState();

    // ACT: Добавляем 12 городов
    for (let i = 1; i <= 12; i++) {
      const { cityData } = await fetchWeatherForCity(`Город${i}`);
      store.addToHistory({
        city: cityData.name,
        country: cityData.country,
        lat: cityData.lat,
        lon: cityData.lon,
      });
    }

    //  Проверяем, что осталось только 10
    const state = useHistoryStore.getState();
    expect(state.history).toHaveLength(10);

    // Проверяем, что последний добавленный первый
    expect(state.history[0].city).toBe("Город12");

    // Проверяем, что первые два удалились
    const cities = state.history.map((h) => h.city);
    expect(cities).not.toContain("Город1");
    expect(cities).not.toContain("Город2");

    // Проверяем localStorage
    const saved = localStorage.getItem("weather-search-history");
    const parsed = JSON.parse(saved!);
    expect(parsed).toHaveLength(10);
  });

  /**
   * ТЕСТ 5: Проверка перемещения дубликата наверх
   * 
   * Что проверяем:
   * - Когда ищем тот же город снова, он перемещается наверх
   * - localStorage обновляется
   */
  it("должен переместить существующий город наверх при повторном поиске", async () => {
  
    vi.mocked(fetchWeatherForCity).mockResolvedValue({
      weather: {
        id: "test-1",
        city: "Одесса",
        country: "UA",
        temperature: 25,
        humidity: 70,
        description: "ясно",
        icon: "01d",
        minTemp: 21,
        maxTemp: 27,
        windSpeed: 4.6,
        timestamp: Date.now(),
      },
      cityData: mockCityData,
    });

    const store = useHistoryStore.getState();

    //  Добавляем несколько городов
    const cities = [
      { city: "Одесса", country: "UA", lat: 46.48, lon: 30.72 },
      { city: "Киев", country: "UA", lat: 50.45, lon: 30.52 },
      { city: "Львов", country: "UA", lat: 49.84, lon: 24.03 },
    ];

    for (const city of cities) {
      await fetchWeatherForCity(city.city);
      store.addToHistory(city);
    }

    // Проверяем начальное состояние
    let state = useHistoryStore.getState();
    expect(state.history[0].city).toBe("Львов");
    expect(state.history[2].city).toBe("Одесса");

    // Ищем Одессу снова
    await fetchWeatherForCity("Одесса");
    store.addToHistory({
      city: "Одесса",
      country: "UA",
      lat: 46.48,
      lon: 30.72,
    });

    //  Одесса должна быть наверху
    state = useHistoryStore.getState();
    expect(state.history).toHaveLength(3); 
    expect(state.history[0].city).toBe("Одесса"); // Одесса наверху
    expect(state.history[1].city).toBe("Львов");
    expect(state.history[2].city).toBe("Киев");

    // Проверяем localStorage
    const saved = localStorage.getItem("weather-search-history");
    const parsed = JSON.parse(saved!);
    expect(parsed[0].city).toBe("Одесса");
  });
});

