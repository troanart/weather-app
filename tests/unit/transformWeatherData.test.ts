import { describe, it, expect } from "vitest";
import { transformWeatherData } from "@/lib/api/weatherService";
import type { CityGeoData, WeatherApiResponse } from "@/lib/types/weather.types";

/**
 * Тесты для функции transformWeatherData
 * Эта функция берёт данные из API и превращает в формат для UI
 * 
 * Что она делает:
 * - Округляет температуры
 * - Извлекает нужные поля
 * - Форматирует скорость ветра
 * - Добавляет метаданные (id, timestamp)
 */

describe("transformWeatherData", () => {
  /**
   * Подготовка: создаём мок данные и имитируем ответ от АПИ
   */

  const mockCityData: CityGeoData = {
    name: "Одесса",
    country: "UA",
    lat: 46.4825,
    lon: 30.7233,
  };

  const mockWeatherApiResponse: WeatherApiResponse = {
    current: {
      temp: 24.12,
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
   * Тест 1: Проверяем правильно ли  округляется  температура
   */
  it("должен округлить текущую температуру до целого числа", () => {
    const apiData = { ...mockWeatherApiResponse };
    apiData.current.temp = 23.67; // 23.67 должно преобразовать в  24

    expect(transformWeatherData(mockCityData, apiData).temperature).toBe(24); // далее будет обработка с помощью Math.round , и на выходе мы получим целое число 24
  });

  /**
   * Тест 2: Проверяем округляется ли минимальная и максимальная температура
   */
  it("должен округлить минимальную и максимальную температуру до целых чисел", () => {
    const apiData = { ...mockWeatherApiResponse };
    apiData.daily[0].temp.min = 18.42; // должно быть 18
    apiData.daily[0].temp.max = 25.89; // должно быть 26

    expect(transformWeatherData(mockCityData, apiData).minTemp).toBe(18);
    expect(transformWeatherData(mockCityData, apiData).maxTemp).toBe(26);
  });

  /**
   * Тест 3: Проверяем округляется ли скорость ветра (до 1 знака после запятой)
   */
  it("должен округлить скорость ветра до 1 знака после запятой", () => {
    const apiData = { ...mockWeatherApiResponse };
    apiData.current.wind_speed = 5.832; // → 5.8

    expect(transformWeatherData(mockCityData, apiData).windSpeed).toBe(5.8); // далее будет обработка с помощью Math.round и разделённое на 10 , и на выходе мы получим  число 5.8 
  });

  /**
   * Тест 4: Проверяем правильно ли  извлекаются данные из  полей из API
   */
    it("должен правильно извлечь все поля из ответа API", () => {
        const result = transformWeatherData(mockCityData, mockWeatherApiResponse);
        
        expect(result.city).toBe("Одесса");
        expect(result.country).toBe("UA");
        expect(result.humidity).toBe(70); 
        expect(result.description).toBe("ясно"); 
        expect(result.icon).toBe("01d"); 
    });

  /**
   * Тест 5: Проверяем генерацию id и timestamp
   */
  it("должен сгенерировать уникальный id и timestamp", () => {
    //  время ДО вызова функции
    const beforeTimestamp = Date.now();
    
    const result = transformWeatherData(mockCityData, mockWeatherApiResponse);
    
    // время ПОСЛЕ вызова функции
    const afterTimestamp = Date.now();

    // Проверяем что id содержит название города
    expect(result.id).toContain("Одесса");
    
    // Проверяем что timestamp находится между beforeTimestamp и afterTimestamp
    expect(result.timestamp).toBeGreaterThanOrEqual(beforeTimestamp);
    expect(result.timestamp).toBeLessThanOrEqual(afterTimestamp);
  });

  /**
   * Тест 6: Проверяем работу с разными городами
   */
  it("должен работать с разными городами", () => {
    const londonCityData: CityGeoData = {
      name: "London",
      country: "GB",
      lat: 51.5074,
      lon: -0.1278,
    };

    const result = transformWeatherData(londonCityData, mockWeatherApiResponse);
      
    expect(result.city).toBe("London");
    expect(result.country).toBe("GB");
  });

  /**
   * Тест 7: Проверяем всю структуру результата
   */
  it("должен вернуть объект с правильной структурой WeatherData", () => {

    const result = transformWeatherData(mockCityData, mockWeatherApiResponse);

 
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("city");
    expect(result).toHaveProperty("country");
    expect(result).toHaveProperty("temperature");
    expect(result).toHaveProperty("humidity");
    expect(result).toHaveProperty("description");
    expect(result).toHaveProperty("icon");
    expect(result).toHaveProperty("minTemp");
    expect(result).toHaveProperty("maxTemp");
    expect(result).toHaveProperty("windSpeed");
    expect(result).toHaveProperty("timestamp");


    expect(typeof result.id).toBe("string");
    expect(typeof result.city).toBe("string");
    expect(typeof result.country).toBe("string");
    expect(typeof result.temperature).toBe("number");
    expect(typeof result.humidity).toBe("number");
    expect(typeof result.description).toBe("string");
    expect(typeof result.icon).toBe("string");
    expect(typeof result.minTemp).toBe("number");
    expect(typeof result.maxTemp).toBe("number");
    expect(typeof result.windSpeed).toBe("number");
    expect(typeof result.timestamp).toBe("number");
  });

  /**
   * Тест 8: Проверяем  случаи с отрицательными температурами
   */
  it("должно корректно обрабатывать отрицательные температуры", () => {
  
    const winterData: WeatherApiResponse = {
      current: {
        temp: -15.67, // должно быть -16
        wind_speed: 8.3,
        humidity: 80,
        weather: [{ description: "снег", icon: "13d" }],
      },
      daily: [
        {
          temp: {
            min: -20.4, // должно быть -20
            max: -10.6, // должно быть -11
          },
        },
      ],
    };


    const result = transformWeatherData(mockCityData, winterData);

    expect(result.temperature).toBe(-16);
    expect(result.minTemp).toBe(-20);
    expect(result.maxTemp).toBe(-11);
  });
});