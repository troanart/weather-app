import { WeatherData } from "./weather.types";

/**
 * Типы для хуков
 */

export type SnackbarSeverity = "success" | "error";

/**
 *  useSnackbar
 */
export interface UseSnackbarReturn {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
  show: (message: string, severity: SnackbarSeverity) => void;
  close: () => void;
}

/**
 * useWeather
 */
export interface UseWeatherReturn {
  weather: WeatherData | null;
  isLoading: boolean;
  searchWeather: (cityName: string) => Promise<void>;
  loadWeatherByCoordinates: (lat: number, lon: number) => Promise<void>;
  clearWeather: () => void;
}

/**
 *  useWeatherSearch
 */
export interface UseWeatherSearchReturn {
  inputValue: string;
  validationError: string;
  isSearching: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: (onSearch: () => Promise<void>) => Promise<void>;
  clearInput: () => void;
}

