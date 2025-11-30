import { useState, useCallback } from "react";
import { UseWeatherSearchReturn } from "@/lib/types/hooks.types";
import { validateCityName } from "@/lib/utils/validation";
import { ERROR_MESSAGES } from "@/lib/constants/messages.constants";

/**
 * Хук для управления поиском погоды
 * Включает валидацию и управление состоянием поиска
 * 
 * @returns Объект с состоянием поиска и обработчиками
 */
export const useWeatherSearch = (): UseWeatherSearchReturn => {
  const [inputValue, setInputValue] = useState("");
  const [validationError, setValidationError] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  /**
   * Обработка изменения input
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Очищаем ошибку валидации при вводе, если она есть
    setValidationError((prev) => {
      if (prev) {
        return "";
      }
      return prev;
    });
  }, []);

  /**
   * Обработка поиска с валидацией
   */
  const handleSearch = useCallback(async (onSearch: () => Promise<void>) => {
    // Валидация названия города
    const validationResult = validateCityName(inputValue);
    
    if (!validationResult.isValid) {
      setValidationError(validationResult.error || ERROR_MESSAGES.INVALID_INPUT);
      return;
    }

    // Очищаем ошибку валидации
    setValidationError("");
    
    setIsSearching(true);
    try {
      await onSearch();
      // Очищаем input после успешного поиска
      setInputValue("");
    } finally {
      setIsSearching(false);
    }
  }, [inputValue]);

  /**
   * Очистка input
   */
  const clearInput = useCallback(() => {
    setInputValue("");
    setValidationError("");
  }, []);

  return {
    inputValue,
    validationError,
    isSearching,
    handleInputChange,
    handleSearch,
    clearInput,
  };
};

