/**
 * Weather API клиент
 * Функции для работы с OpenWeatherMap API
 */

import { geoApiClient, weatherApiClient } from './apiClient';
import { API_CONFIG, API_ENDPOINTS, WEATHER_UNITS } from '@/lib/constants/api.constants';
import { CityGeoData, WeatherApiResponse } from '@/lib/types/weather.types';

/**
 * Получить API ключ из переменных окружения
 */
const getApiKey = (): string => {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('API ключ не найден в переменных окружения');
  }
  return apiKey;
};

/**
 * Получить координаты города по названию 
 * @param cityName - название города
 * @returns массив с данными о городе
 */
export const getCityCoordinates = async (cityName: string): Promise<CityGeoData[]> => {
  const response = await geoApiClient.get<CityGeoData[]>(API_ENDPOINTS.GEOCODING, {
    params: {
      q: cityName,
      limit: API_CONFIG.GEO_LIMIT,
      appid: getApiKey(),
    },
  });

  return response as unknown as CityGeoData[];
};

/**
 * Получить погоду по координатам 
 * @param lat - широта
 * @param lon - долгота
 * @returns данные о погоде
 */
export const getWeatherByCoordinates = async (
  lat: number,
  lon: number
): Promise<WeatherApiResponse> => {
  const response = await weatherApiClient.get<WeatherApiResponse>(API_ENDPOINTS.ONE_CALL, {
    params: {
      lat,
      lon,
      units: WEATHER_UNITS.METRIC,
      appid: getApiKey(),
    },
  });

  return response as unknown as WeatherApiResponse;
};

/**
 * Получить полную информацию о погоде по названию города
 * Юзаем geocoding + weather запросы
 * @param cityName - название города
 * @returns объект с координатами города и данными о погоде
 */
export const getWeatherByCity = async (
  cityName: string
): Promise<{ cityData: CityGeoData; weatherData: WeatherApiResponse }> => {
  // Шаг 1: Получаем координаты города
  const cityResults = await getCityCoordinates(cityName);

  if (!cityResults || cityResults.length === 0) {
    throw {
      message: 'Город не найден',
      type: 'api',
      code: '404',
    };
  }

  const cityData = cityResults[0];

  // Шаг 2: Получаем погоду по координатам
  const weatherData = await getWeatherByCoordinates(cityData.lat, cityData.lon);

  return { cityData, weatherData };
};

