/**
 * Weather Service - логика и трансформация данных
 * Переделываем в удобынй формат для работы с данными
 */

import { getWeatherByCity } from './weatherApi';
import { WeatherData, CityGeoData, WeatherApiResponse } from '@/lib/types/weather.types';

/**
 * Переделываем данные
 * @param cityData - данные о городе от Geocoding API
 * @param weatherData - данные о погоде от Weather API
 * @returns упрощенный объект WeatherData 
 */
export const transformWeatherData = (
  cityData: CityGeoData,
  weatherData: WeatherApiResponse
): WeatherData => {
  const { current, daily } = weatherData;

  return {
    id: `${cityData.name}-${Date.now()}`,
    city: cityData.name,
    country: cityData.country,
    temperature: Math.round(current.temp),
    humidity: current.humidity,
    description: current.weather[0].description,
    icon: current.weather[0].icon,
    minTemp: Math.round(daily[0].temp.min),
    maxTemp: Math.round(daily[0].temp.max),
    windSpeed: Math.round(current.wind_speed * 10) / 10,
    timestamp: Date.now(),
  };
};

/**
 * Получить погоду по названию города и преобразовать в формат UI
 * Функцию будут юзать компаненты
 * @param cityName - название города
 * @returns данные о погоде в формате UI
 */
export const fetchWeatherForCity = async (cityName: string): Promise<WeatherData> => {

  const { cityData, weatherData } = await getWeatherByCity(cityName);

  const transformedData = transformWeatherData(cityData, weatherData);

  return transformedData;
};


