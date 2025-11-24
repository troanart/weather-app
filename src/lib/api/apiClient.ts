/**
 * Базовый HTTP клиент на основе Axios
 * Содержит настройку interceptors и обработку ошибок
 */

import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { API_CONFIG } from '@/lib/constants/api.constants';
import { ERROR_MESSAGES } from '@/lib/constants/messages.constants';
import { WeatherError } from '@/lib/types/weather.types';

/**
 * Создание экземпляра Аксиос для геокодирования и обратного геокодирования 
 */
export const geoApiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.GEO_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Создание экземпляра Аксиос для АПИ Погоды 
 */
export const weatherApiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.WEATHER_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 *  Обробатываем успешные ответы  
 */
const responseInterceptor = (response: AxiosResponse) => {
  return response.data;
};

/**
 * Обробатываем ошибки 
 */
const errorInterceptor = (error: AxiosError): Promise<WeatherError> => {
  let weatherError: WeatherError = {
    message: ERROR_MESSAGES.UNKNOWN_ERROR,
    type: 'unknown',
  };

  if (error.response) {
    // Сервер ответил с ошибкой (4xx, 5xx)
    const status = error.response.status;

    switch (status) {
      case 404:
        weatherError = {
          message: ERROR_MESSAGES.CITY_NOT_FOUND,
          code: '404',
          type: 'api',
        };
        break;
      case 401:
        weatherError = {
          message: ERROR_MESSAGES.INVALID_API_KEY,
          code: '401',
          type: 'api',
        };
        break;
      case 500:
      case 502:
      case 503:
        weatherError = {
          message: ERROR_MESSAGES.API_ERROR,
          code: status.toString(),
          type: 'api',
        };
        break;
      default:
        weatherError = {
          message: ERROR_MESSAGES.API_ERROR,
          code: status.toString(),
          type: 'api',
        };
    }
  } else if (error.request) {
    // Запрос был отправлен, но ответа не было
    weatherError = {
      message: ERROR_MESSAGES.NETWORK_ERROR,
      type: 'network',
    };
  } else if (error.code === 'ECONNABORTED') {
    // Timeout
    weatherError = {
      message: ERROR_MESSAGES.TIMEOUT_ERROR,
      type: 'network',
    };
  }

  return Promise.reject(weatherError);
};

// Юзаем перехватчики которые срабатывают до или после запроса.
geoApiClient.interceptors.response.use(responseInterceptor, errorInterceptor);
weatherApiClient.interceptors.response.use(responseInterceptor, errorInterceptor);

