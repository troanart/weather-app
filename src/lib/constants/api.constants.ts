/**
 * API константы и конфигурация тут 
 */

export const API_CONFIG = {
  
  GEO_BASE_URL: 'https://api.openweathermap.org/geo/1.0',
  WEATHER_BASE_URL: 'https://api.openweathermap.org/data/3.0',
  ICON_URL: 'https://openweathermap.org/img/wn',
  

  TIMEOUT: 10000,
  

  GEO_LIMIT: 5, 
} as const;

export const API_ENDPOINTS = {
  // Geocoding API
  GEOCODING: '/direct',
  
  // Weather API
  ONE_CALL: '/onecall',
} as const;

export const WEATHER_UNITS = {
  METRIC: 'metric', 
  IMPERIAL: 'imperial', 
} as const;

export const WEATHER_LANG = {
  RUSSIAN: "ru",
  ENGLISH: "en",
} as const;

export const QUERY_KEYS = {
  WEATHER: 'weather', 
  GEOCODING: 'geocoding', // ключ для геокодинга
  HISTORY: 'search-history', // ключ для истории
} as const;

// Настройки React Query
export const QUERY_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 минут - данные считаются свежими
  CACHE_TIME: 10 * 60 * 1000, // 10 минут - храним в кэше
  RETRY: 2, // количество повторных попыток при ошибке
} as const;

