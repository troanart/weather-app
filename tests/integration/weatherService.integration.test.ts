/**
 * ИНТЕГРАЦИОННЫЕ ТЕСТЫ для weatherService
 * В ЭТОМ ФАЙЛЕ мы тестируем:
 * - Взаимодействие между weatherApi и weatherService
 * - Флоу : запрос к API --> трансформация данных --> возврат результата
 * - Обработку ошибок на уровне интеграции
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { fetchWeatherForCity, transformWeatherData } from "@/lib/api/weatherService";
import { getWeatherByCity } from "@/lib/api/weatherApi";
import type { CityGeoData, WeatherApiResponse } from "@/lib/types/weather.types";

// Мокаем модуль weatherApi  что бы точно знать что возвращают данные , что возвращает API
// без реальных HTTP запросов
vi.mock("@/lib/api/weatherApi");

describe("Интеграционные тесты: weatherService + weatherApi", () => {
  /**
   * ПОДГОТОВКА: Создаём мок-данные, которые будут возвращать наши моки API
   */
  const mockCityData: CityGeoData = {
    name: "Одесса",
    country: "UA",
    lat: 46.4825,
    lon: 30.7233,
    state: "Odessa Oblast",
  };

  const mockWeatherApiResponse: WeatherApiResponse = {
    current: {
      temp: 24.5,
      wind_speed: 4.57,
      humidity: 70,
      weather: [
        {
          description: "ясно",
          icon: "01d",
        },
      ],
    },
    daily: [
      {
        temp: {
          min: 21.3,
          max: 26.7,
        },
      },
    ],
  };

  /**
   * Очистка всех моков, что бы тесты не влияли друг на друга
   */
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * ТЕСТ 1: Полный флоу успешного поиска погоды
   *
   * Что проверяем:
   * 1. API вызывается с правильными параметрами
   * 2. Данные правильно трансформируются
   * 3. Результат содержит все нужные поля
   * 4. История сохраняется в store
   */
  it("должен успешно получить и трансформировать данные о погоде", async () => {
    //  Настраиваем мок что бы он возвращал наши тестовые данные
    vi.mocked(getWeatherByCity).mockResolvedValue({
      cityData: mockCityData,
      weatherData: mockWeatherApiResponse,
    });

    // Вызываем функцию, которую тестируем
    const result = await fetchWeatherForCity("Одесса");

    //Проверяем результаты
    // 1. Проверяем, что API был вызван с правильным параметром
    expect(getWeatherByCity).toHaveBeenCalledWith("Одесса");
    expect(getWeatherByCity).toHaveBeenCalledTimes(1);

    // 2. Проверяем, что результат содержит правильные данные
    expect(result.weather).toBeDefined();
    expect(result.cityData).toBeDefined();

    // 3. Проверяем трансформацию данных
    expect(result.weather.city).toBe("Одесса");
    expect(result.weather.country).toBe("UA");
    expect(result.weather.temperature).toBe(25); // 24.5 округляется до 25
    expect(result.weather.humidity).toBe(70);
    expect(result.weather.description).toBe("ясно");
    expect(result.weather.icon).toBe("01d");
    expect(result.weather.minTemp).toBe(21); // 21.3 округляется до 21
    expect(result.weather.maxTemp).toBe(27); // 26.7 округляется до 27
    expect(result.weather.windSpeed).toBe(4.6); // 4.57 округляется до 4.6

    // 4. Проверяем, что добавились метаданные
    expect(result.weather.id).toContain("Одесса");
    expect(result.weather.timestamp).toBeGreaterThan(0);

    // 5. Проверяем, что cityData передаётся правильно
    expect(result.cityData).toEqual(mockCityData);
  });

  /**
   * ТЕСТ 2: Обработка ошибки, когда город не найден
   *
   * Что проверяем:
   * Когда API возвращает ошибку, она правильно пробрасывается
   */
  it("должен пробросить ошибку, когда город не найден", async () => {
    // Настраиваем мок, чтобы он выбрасывал ошибку
    const error = {
      message: "Город не найден",
      type: "api" as const,
      code: "404",
    };
    vi.mocked(getWeatherByCity).mockRejectedValue(error);

    // Ожидаем, что ошибка будет проброшена
    await expect(fetchWeatherForCity("НесуществующийГород")).rejects.toEqual(
      error
    );

    // Проверяем, что API был вызван
    expect(getWeatherByCity).toHaveBeenCalledWith("НесуществующийГород");
  });

  /**
   * ТЕСТ 3: Проверка трансформации данных с разными значениями
   *
   * Что проверяем:
   * - Правильность округления в разных сценариях
   * - Корректность работы с граничными значениями
   */
  it("должен правильно трансформировать данные с разными температурами", async () => {
    // Создаём данные с разными температурами
    const coldWeather: WeatherApiResponse = {
      current: {
        temp: -5.7,
        wind_speed: 10.99,
        humidity: 90,
        weather: [{ description: "снег", icon: "13d" }],
      },
      daily: [
        {
          temp: {
            min: -8.2,
            max: -3.1,
          },
        },
      ],
    };

    vi.mocked(getWeatherByCity).mockResolvedValue({
      cityData: mockCityData,
      weatherData: coldWeather,
    });

    const result = await fetchWeatherForCity("Одесса");

    // Проверяем округление
    expect(result.weather.temperature).toBe(-6); // -5.7 округляется до -6
    expect(result.weather.minTemp).toBe(-8); // -8.2 округляется до -8
    expect(result.weather.maxTemp).toBe(-3); // -3.1 округляется до -3
    expect(result.weather.windSpeed).toBe(11.0); // 10.99 округляется до 11.0
  });

  /**
   * ТЕСТ 4: Проверка работы с несколькими запросами идущими друг за другом
   *
   * Что проверяем:
   * - Каждый запрос обрабатывается независимо
   * - Моки правильно сбрасываются между запросами
   */
  it("должен обрабатывать несколько последовательных запросов", async () => {
    //  Настраиваем мок для первого города
    const kyivData: CityGeoData = {
      name: "Киев",
      country: "UA",
      lat: 50.45,
      lon: 30.52,
    };

    const kyivWeather: WeatherApiResponse = {
      current: {
        temp: 20.0,
        wind_speed: 3.5,
        humidity: 60,
        weather: [{ description: "облачно", icon: "03d" }],
      },
      daily: [{ temp: { min: 18.0, max: 22.0 } }],
    };

    // Первый запрос
    vi.mocked(getWeatherByCity).mockResolvedValueOnce({
      cityData: mockCityData,
      weatherData: mockWeatherApiResponse,
    });

    // Второй запрос
    vi.mocked(getWeatherByCity).mockResolvedValueOnce({
      cityData: kyivData,
      weatherData: kyivWeather,
    });

    //  Делаем два запроса
    const result1 = await fetchWeatherForCity("Одесса");
    const result2 = await fetchWeatherForCity("Киев");

    // Проверяем, что каждый запрос вернул правильные данные
    expect(result1.weather.city).toBe("Одесса");
    expect(result1.weather.temperature).toBe(25);

    expect(result2.weather.city).toBe("Киев");
    expect(result2.weather.temperature).toBe(20);

    // Проверяем, что API был вызван дважды
    expect(getWeatherByCity).toHaveBeenCalledTimes(2);
  });

  /**
   * ТЕСТ 5: Интеграция трансформации данных
   *
   * Что проверяем:
   * - Функция transformWeatherData правильно работает с реальными данными
   * - Все поля корректно маппятся
   */
  it("должен правильно трансформировать данные через transformWeatherData", () => {
    //  Подготавливаем данные
    const cityData: CityGeoData = {
      name: "Львов",
      country: "UA",
      lat: 49.84,
      lon: 24.03,
    };

    const weatherData: WeatherApiResponse = {
      current: {
        temp: 15.8,
        wind_speed: 5.23,
        humidity: 75,
        weather: [{ description: "дождь", icon: "10d" }],
      },
      daily: [{ temp: { min: 12.5, max: 18.9 } }],
    };

    // Вызываем функцию трансформации напрямую
    const result = transformWeatherData(cityData, weatherData);

    //  Проверяем все поля
    expect(result.city).toBe("Львов");
    expect(result.country).toBe("UA");
    expect(result.temperature).toBe(16); // 15.8 -> 16
    expect(result.humidity).toBe(75);
    expect(result.description).toBe("дождь");
    expect(result.icon).toBe("10d");
    expect(result.minTemp).toBe(13); // 12.5 -> 13
    expect(result.maxTemp).toBe(19); // 18.9 -> 19
    expect(result.windSpeed).toBe(5.2); // 5.23 -> 5.2
    expect(result.id).toContain("Львов");
    expect(result.timestamp).toBeGreaterThan(0);
  });
});

