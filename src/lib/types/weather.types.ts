/**
 * Типы для работы с погодными данными
 */

// ------------------------ Типы  Geocoding API ---------------------------
export interface CityGeoData {
  name: string;
  lat: number;
  lon: number;
  state?: string;
  country: string;
}

// ------------------------ Типы для One Call API ответа (только нужные поля) ------------------------
export interface WeatherApiResponse {
  current: {
    temp: number;
    wind_speed: number; 
    humidity: number; 
    weather: Array<{
      description: string; 
      icon: string; 
    }>;
  };
  daily: Array<{
    temp: {
      min: number; 
      max: number; 
    };
  }>;
}

// ------------------------ Упрощенный тип для UI (только требуемые поля) ------------------------
export interface WeatherData {
  id: string; 
  city: string; 
  country: string; 
  temperature: number; 
  humidity: number; 
  description: string; 
  icon: string; 
  minTemp: number; 
  maxTemp: number; 
  windSpeed: number; 
  timestamp: number; 
}

// ------------------------ История поиска ------------------------
export interface SearchHistoryItem {
  id: string; 
  city: string; 
  country: string; 
  searchedAt: number; 
  lat: number; // координаты 
  lon: number;
}

// ------------------------ Ошибки ------------------------
export interface WeatherError {
  message: string; // сообщение для пользователя
  code?: string; // код ошибки 
  type?: 'validation' | 'network' | 'api' | 'unknown'; // тип ошибки
}

