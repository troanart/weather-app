import { ERROR_MESSAGES } from "@/lib/constants/messages.constants";

/**
 * Извлекает сообщение об ошибке из объекта ошибки
 * 
 * @param error - Объект ошибки (может быть Error, WeatherError или unknown)
 * @returns Строка с сообщением об ошибке
 */
export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    return String(error.message);
  }
  
  return ERROR_MESSAGES.UNKNOWN_ERROR;
};

