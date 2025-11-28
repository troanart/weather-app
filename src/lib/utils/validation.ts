/**
 * Утилиты для валидации пользовательского ввода
 */

import { ERROR_MESSAGES } from "@/lib/constants/messages.constants";

/**
 * Результат валидации
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Валидация названия города
 * 
 * Правила:
 * - Инпут не пустой 
 * - От 2 до 50 символов
 * - Только буквы, пробелы и дефис
 * 
 * @param cityName - название города для проверки
 * @returns объект с результатом валидации
 */
export const validateCityName = (cityName: string): ValidationResult => {
  const trimmed = cityName.trim();

  // Проверка на пустой ввод
  if (!trimmed) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.EMPTY_INPUT,
    };
  }

  // Проверка на длину
  if (trimmed.length < 2 || trimmed.length > 50) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.INVALID_LENGTH,
    };
  }

  // Проверка на недопустимые символы (латиница, кириллица, украинские буквы)
  if (!/^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ\s\-]+$/.test(trimmed)) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.INVALID_INPUT,
    };
  }

 
  return {
    isValid: true,
  };
};

