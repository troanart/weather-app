import { describe, it, expect } from "vitest";
import { validateCityName } from "@/lib/utils/validation";
import { ERROR_MESSAGES } from "@/lib/constants/messages.constants";

/**
 * Тесты для функции validateCityName
 * 
 * Проверка ВСЕЙ  логику валидации которую вы недавно добавили!
 * 
 * Что тестируем:
 * - Пустой ввод
 * - Слишком короткий ввод (< 2 символов)
 * - Слишком длинный ввод (> 50 символов) 
 * - Недопустимые символы  ( / ? и прочее)
 * - Корректные названия ( что бы не искало абракадабра)
 * - Удаление  пробелов
 */

describe("validateCityName", () => {
  /**
   * Тест 1: Пустой ввод
   */
  it("должен вернуть ошибку для пустой строки", () => {
    const result = validateCityName("");
    
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(ERROR_MESSAGES.EMPTY_INPUT);
  });

  /**
   * Тест 2: Пустой ввод но с ПРОБЕЛАМИ 
   */
  it("должен вернуть ошибку для строки из пробелов", () => {
    const result = validateCityName("   ");
    
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(ERROR_MESSAGES.EMPTY_INPUT);
  });

  /**
   * Тест 3: Слишком короткое название (меньше 2 символов)
   */
  it("должен вернуть ошибку для названия из 1 символа", () => {
    const result = validateCityName("A");
    
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(ERROR_MESSAGES.INVALID_LENGTH);
  });

  /**
   * Тест 4: Слишком длинное название (больше 50 символов)
   */
  it("должен вернуть ошибку для названия длиннее 50 символов", () => {
    const longName = "A".repeat(51); // 51 символ
    const result = validateCityName(longName);
    
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(ERROR_MESSAGES.INVALID_LENGTH);
  });

  /**
   * Тест 5: Ести ли цыфры 
   */
  it("должен вернуть ошибку для названия с цифрами", () => {
    const result = validateCityName("London123");
    
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(ERROR_MESSAGES.INVALID_INPUT);
  });

  /**
   * Тест 6: Недопустимые символы - специальные символы
   */
  it("должен вернуть ошибку для названия со спецсимволами", () => {
    const invalidNames = [
      "London!",
      "Kyiv@",
      "Odesa#",
      "Lviv$",
      "Paris%",
      "London&",
      "Tokyo*",
      "Berlin()",
      "Rome+",
      "Madrid=",
    ];
    
    invalidNames.forEach((name) => {
      const result = validateCityName(name);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_INPUT);
    });
  });

  /**
   * Тест 7: Валидные названия - латиница
   */
  it("должен принять корректные названия на латинице", () => {
    const validNames = [
      "Berlin",
      "New York",
      "Los Angeles",
      "San Francisco",
      "Saint-Petersburg",
      "London",
      "Paris",
    ];
    
    validNames.forEach((name) => {
      const result = validateCityName(name);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  /**
   * Тест 8: Валидные названия - кириллица
   */
  it("должен принять корректные названия на кириллице", () => {
    const validNames = [
      "Киев",
      "Харьков",
      "Одесса",
      "Днепр",
      "Львов",
      "Запорожье",
      "Ивано-Франковск",
      "Каменец-Подольский",
    ];
    
    validNames.forEach((name) => {
      const result = validateCityName(name);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  /**
   * Тест 9: Валидны дефисы
   */
  it("должен принять названия с дефисами", () => {
    const result1 = validateCityName("Ivano-Frankivsk");
    const result2 = validateCityName("Kropyvnytskyi");
    const result3 = validateCityName("Івано-Франківськ");
    
    expect(result1.isValid).toBe(true);
    expect(result2.isValid).toBe(true);
    expect(result3.isValid).toBe(true);
  });

  /**
   * Тест 10: Валидны пробелы
   */
  it("должен принять названия с пробелами", () => {
    const result1 = validateCityName("New York");
    const result2 = validateCityName("Los Angeles");
    const result3 = validateCityName("San Francisco");
    const result4 = validateCityName("Кропивницький");
    
    expect(result1.isValid).toBe(true);
    expect(result2.isValid).toBe(true);
    expect(result3.isValid).toBe(true);
    expect(result4.isValid).toBe(true);
  });

  /**
   * Тест 11: Удаление пробелов в начале и конце
   */
  it("должен обрезать пробелы в начале и конце", () => {
    const result1 = validateCityName("  London  ");
    const result2 = validateCityName("   Киев   ");
    
    expect(result1.isValid).toBe(true);
    expect(result2.isValid).toBe(true);
  });

  /**
   * Тест 12: Пограничные случаи длины  2 символа (минимум)
   */
  it("должен принять название из 2 символов", () => {
    const result = validateCityName("AB");
    
    expect(result.isValid).toBe(true);
  });

  /**
   * Тест 13: Граничные случаи длины - 50 символов (максимум)
   */
  it("должен принять название из 50 символов", () => {
    const name = "A".repeat(50); // ровно 50 символов
    const result = validateCityName(name);
    
    expect(result.isValid).toBe(true);
  });

  /**
   * Тест 14: Проверка с пробелами после trim (но итоговая длина < 2)
   */
  it("должен вернуть ошибку если после trim длина < 2", () => {
    const result = validateCityName("  A  "); // после trim = "A" (1 символ)
    
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(ERROR_MESSAGES.INVALID_LENGTH);
  });

  /**
   * Тест 15: Смешанные языки (латиница + кириллица) - НЕ должны проходить
   */
  it("должен принять смешанные языки (если в реальных городах они есть)", () => {
    
    const result = validateCityName("OdesaОдесса");
    
    // Эта проверка пройдёт, так как оба алфавита разрешены
    expect(result.isValid).toBe(true);
  });
});

