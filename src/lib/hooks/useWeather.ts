import { useState, useCallback } from "react";
import { WeatherData, CityGeoData } from "@/lib/types/weather.types";
import { UseWeatherReturn } from "@/lib/types/hooks.types";
import { fetchWeatherForCity } from "@/lib/api/weatherService";
import { getWeatherByCoordinates } from "@/lib/api/weatherApi";
import { transformWeatherData } from "@/lib/api/weatherService";
import { useHistoryStore } from "@/lib/stores/historyStore";
import { ERROR_MESSAGES } from "@/lib/constants/messages.constants";
import { UI_CONFIG } from "@/lib/constants/ui.constants";

/**
 * Хук для работы с данными о погоде
 * 
 * @returns Объект с данными о погоде и методами для их загрузки
 */
export const useWeather = (): UseWeatherReturn => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const addToHistory = useHistoryStore((state) => state.addToHistory);

  /**
   * Поиск погоды по названию города
   */
  const searchWeather = useCallback(async (cityName: string) => {
    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      const { weather: weatherData, cityData } = await fetchWeatherForCity(cityName);
      
      // Минимальная задержка для улучшения UX (предотвращает слишком быстрое мигание индикатора загрузки)
      const elapsed = Date.now() - startTime;
      if (elapsed < UI_CONFIG.MIN_LOADING_DELAY) {
        await new Promise((resolve) => setTimeout(resolve, UI_CONFIG.MIN_LOADING_DELAY - elapsed));
      }
      
      setWeather(weatherData);
      addToHistory({
        city: cityData.name,
        country: cityData.country,
        lat: cityData.lat,
        lon: cityData.lon,
      });
    } catch (error) {
      throw error; // Пробрасываем ошибку для обработки в компоненте
    } finally {
      setIsLoading(false);
    }
  }, [addToHistory]);

  /**
   * Загрузка погоды по координатам (из истории)
   */
  const loadWeatherByCoordinates = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true);
    try {
      const weatherData = await getWeatherByCoordinates(lat, lon);
      
      // Находим элемент истории для получения данных о городе
      // Получаем актуальное состояние store внутри функции
      const history = useHistoryStore.getState().history;
      const historyItem = history.find((item) => item.lat === lat && item.lon === lon);
      
      if (historyItem) {
        const cityData: CityGeoData = {
          name: historyItem.city,
          country: historyItem.country,
          lat: historyItem.lat,
          lon: historyItem.lon,
        };
        
        const transformedWeather = transformWeatherData(cityData, weatherData);
        setWeather(transformedWeather);
      } else {
        throw new Error(ERROR_MESSAGES.CITY_NOT_FOUND);
      }
    } catch (error) {
      throw error; // Пробрасываем ошибку для обработки в компоненте
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Очистка данных о погоде
   */
  const clearWeather = useCallback(() => {
    setWeather(null);
  }, []);

  return {
    weather,
    isLoading,
    searchWeather,
    loadWeatherByCoordinates,
    clearWeather,
  };
};

