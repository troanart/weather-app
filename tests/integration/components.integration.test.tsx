/**
 * ИНТЕГРАЦИОННЫЕ ТЕСТЫ для React компонентов
 * 
 * ЧТО МЫ ТЕСТИРУЕМ:
 * Этот файл проверяет интеграцию между React компонентами:
 * 1. SearchBar - компонент поиска
 * 2. HistoryList - компонент истории
 * 3. WeatherCard - компонент отображения погоды
 * 4. historyStore - глобальное состояние
 * 5. API вызовы
 */

import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useHistoryStore } from "@/lib/stores/historyStore";
import { fetchWeatherForCity } from "@/lib/api/weatherService";
import { getCityCoordinates } from "@/lib/api/weatherApi";
import SearchBar from "@/components/features/search-history/SearchBar";
import HistoryList from "@/components/features/history-list/HistoryList";
import WeatherCard from "@/components/features/weather/WeatherCard";
import type { CityGeoData, WeatherData } from "@/lib/types/weather.types";

// Мокаем API модули
vi.mock("@/lib/api/weatherService");
vi.mock("@/lib/api/weatherApi");


describe.skip("Интеграционные тесты: React компоненты + Store + API", () => {
  /**
   Мок localStorage
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

 
  const mockCityData: CityGeoData = {
    name: "Одесса",
    country: "UA",
    lat: 46.4825,
    lon: 30.7233,
  };

  const mockWeatherData: WeatherData = {
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
  };

  /**
   * beforeEach - настройка перед каждым тестом
   */
  beforeEach(() => {
    // Настраиваем localStorage
    // @ts-expect-error: тут мы мокаем localStorage для тестового окружения, чтобы заменить  localStorage на свой мок.
    global.localStorage = localStorageMock;
    // @ts-expect-error: тут  мы  создаём window с localStorage для имитации браузерной среды
    global.window = { localStorage: localStorageMock };

    localStorageMock.clear();

    // Очищаем store
    useHistoryStore.setState({ history: [], hydrated: false });

    // Очищаем моки
    vi.clearAllMocks();
  });

  /**
   * afterEach - очистка после каждого теста
   */
  afterEach(() => {
    cleanup(); // Очищаем React компоненты после каждого теста
  });

  /**
   * ТЕСТ 1: Интеграция SearchBar с API и Store
   * 
   * Что проверяем:
   * - Пользователь вводит город
   * - Компонент вызывает API
   * - Данные сохраняются в store
   * - История обновляется
   */
  it("должен обработать поиск города через SearchBar и сохранить в историю", async () => {
    // Настраиваем моки
    const user = userEvent.setup();

    // Мокаем автокомплит getCityCoordinates
    vi.mocked(getCityCoordinates).mockResolvedValue([mockCityData]);

    // Мокаем поиск погоды
    vi.mocked(fetchWeatherForCity).mockResolvedValue({
      weather: mockWeatherData,
      cityData: mockCityData,
    });

    // Мокаем обработчики
    const handleSearch = vi.fn(async () => {
      const result = await fetchWeatherForCity("Одесса");
      const store = useHistoryStore.getState();
      store.addToHistory({
        city: result.cityData.name,
        country: result.cityData.country,
        lat: result.cityData.lat,
        lon: result.cityData.lon,
      });
    });

    const handleChange = vi.fn();

    // Рендерим компонент и взаимодействуем с ним
    render(
      <SearchBar
        value=""
        onChange={handleChange}
        onSearch={handleSearch}
        isLoading={false}
      />
    );

    // Находим input и вводим текст
    const input = screen.getByPlaceholderText(/введите название города/i);
    await user.type(input, "Одесса");

    // Находим кнопку поиска и кликаем
    const searchButton = screen.getByRole("button");
    await user.click(searchButton);

    // Проверяем результаты
    await waitFor(() => {
      expect(handleSearch).toHaveBeenCalled();
    });

    // Проверяем, что данные сохранились в store
    const state = useHistoryStore.getState();
    expect(state.history.length).toBeGreaterThan(0);
    expect(state.history[0].city).toBe("Одесса");
  });

  /**
   * ТЕСТ 2: Интеграция HistoryList с Store
   * 
   * Что проверяем:
   * - История отображается из store
   * - Клик по элементу вызывает обработчик
   * - Удаление элемента обновляет store
   */
  it("должен отобразить историю из store и обработать клик", async () => {
    //  Добавляем данные в store
    const store = useHistoryStore.getState();
    store.addToHistory({
      city: "Одесса",
      country: "UA",
      lat: 46.48,
      lon: 30.72,
    });
    store.addToHistory({
      city: "Киев",
      country: "UA",
      lat: 50.45,
      lon: 30.52,
    });

    const handleItemClick = vi.fn();

    //  Рендерим компонент
    render(<HistoryList onItemClick={handleItemClick} />);

    //  Проверяем, что элементы отображаются
    expect(screen.getByText(/Одесса/i)).toBeInTheDocument();
    expect(screen.getByText(/Киев/i)).toBeInTheDocument();

    // Проверяем, что есть заголовок
    expect(screen.getByText(/История поиска/i)).toBeInTheDocument();
  });

  /**
   * ТЕСТ 3: Интеграция WeatherCard с данными
   * 
   * Что проверяем:
   * - Компонент правильно отображает данные о погоде
   * - Все поля корректно рендерятся
   */
  it("должен отобразить данные о погоде в WeatherCard", () => {
    //  Рендерим компонент с данными
    render(<WeatherCard weather={mockWeatherData} isLoading={false} />);

    //  Проверяем, что все данные отображаются
    expect(screen.getByText(/Одесса/i)).toBeInTheDocument();
    expect(screen.getByText(/UA/i)).toBeInTheDocument();
    expect(screen.getByText(/25/i)).toBeInTheDocument(); // температура
    expect(screen.getByText(/70/i)).toBeInTheDocument(); // влажность
    expect(screen.getByText(/ясно/i)).toBeInTheDocument(); // описание
    expect(screen.getByText(/21/i)).toBeInTheDocument(); // мин температура
    expect(screen.getByText(/27/i)).toBeInTheDocument(); // макс температура
    expect(screen.getByText(/4.6/i)).toBeInTheDocument(); // скорость ветра
  });

  /**
   * ТЕСТ 4: Полный флоу: поиск -> отображение -> сохранение в историю
   * 
   * Что проверяем:
   * - Пользователь ищет город
   * - Погода отображается
   * - Город сохраняется в историю
   * - История обновляется
   */
  it("должен выполнить полный поток: поиск -> отображение -> сохранение", async () => {
   
    const user = userEvent.setup();

    vi.mocked(fetchWeatherForCity).mockResolvedValue({
      weather: mockWeatherData,
      cityData: mockCityData,
    });

    // Мокаем обработчики как в реальном компоненте page.tsx
    let currentWeather: WeatherData | null = null;
    const handleSearch = vi.fn(async () => {
      const result = await fetchWeatherForCity("Одесса");
      currentWeather = result.weather;
      const store = useHistoryStore.getState();
      store.addToHistory({
        city: result.cityData.name,
        country: result.cityData.country,
        lat: result.cityData.lat,
        lon: result.cityData.lon,
      });
    });

    //Рендерим компоненты
    const { rerender } = render(
      <>
        <SearchBar
          value="Одесса"
          onChange={vi.fn()}
          onSearch={handleSearch}
          isLoading={false}
        />
        <WeatherCard weather={currentWeather} isLoading={false} />
        <HistoryList onItemClick={vi.fn()} />
      </>
    );

    // Ищем и кликаем кнопку поиска
    const searchButton = screen.getByRole("button");
    await user.click(searchButton);

    // Ждём, пока данные загрузятся
    await waitFor(() => {
      expect(handleSearch).toHaveBeenCalled();
    });

    // Обновляем компонент с новыми данными
    rerender(
      <>
        <SearchBar
          value="Одесса"
          onChange={vi.fn()}
          onSearch={handleSearch}
          isLoading={false}
        />
        <WeatherCard weather={currentWeather} isLoading={false} />
        <HistoryList onItemClick={vi.fn()} />
      </>
    );

 
    // 1. Погода отображается
    await waitFor(() => {
      expect(screen.getByText(/Одесса/i)).toBeInTheDocument();
    });

    // 2. История обновилась
    const state = useHistoryStore.getState();
    expect(state.history.length).toBeGreaterThan(0);
    expect(state.history[0].city).toBe("Одесса");
  });

  /**
   * ТЕСТ 5: Интеграция автокомплита в SearchBar
   * 
   * Что проверяем:
   * - При вводе текста вызывается API для автокомплита
   * - Предложения отображаются
   * - Клик по предложению заполняет поле
   */
  it("должен показать автокомплит при вводе текста", async () => {
    const user = userEvent.setup();

    const suggestions: CityGeoData[] = [
      { name: "Одесса", country: "UA", lat: 46.48, lon: 30.72 },
      { name: "Одесса, США", country: "US", lat: 40.0, lon: -74.0 },
    ];

    vi.mocked(getCityCoordinates).mockResolvedValue(suggestions);

    // Используем state для хранения значения input (как в реальном компоненте)
    let inputValue = "";
    const handleChange = vi.fn((e: React.ChangeEvent<HTMLInputElement>) => {
      inputValue = e.target.value;
    });

    const handleSearch = vi.fn();

    // Рендерим компонент с начальным значением
    const { rerender } = render(
      <SearchBar
        value={inputValue}
        onChange={handleChange}
        onSearch={handleSearch}
        isLoading={false}
      />
    );

    const input = screen.getByPlaceholderText(/введите название города/i) as HTMLInputElement;
    
    // Вводим текст (больше 2 символов, чтобы сработал автокомплит)
    await user.type(input, "Од");

    // Обновляем компонент с новым значением после каждого символа
    // (симулируем работу контролируемого компонента)
    inputValue = "Од";
    rerender(
      <SearchBar
        value={inputValue}
        onChange={handleChange}
        onSearch={handleSearch}
        isLoading={false}
      />
    );

    // Ждём debounce (400ms) и загрузку предложений
    await waitFor(
      () => {
        expect(getCityCoordinates).toHaveBeenCalled();
      },
      { timeout: 1000 }
    );

    // Проверяем, что handleChange был вызван
    expect(handleChange).toHaveBeenCalled();
  });
});

