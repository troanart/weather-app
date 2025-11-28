import { describe, it, expect } from 'vitest';
import { getWeatherGif } from '@/lib/utils/weatherGifs';

/**
 * Тесты для функции getWeatherGif
 * Эта функция выбирает GIF на основе иконки погоды  (например "10d") и преобразует путь к нужной GIF
 */
describe('getWeatherGif', () => {
  /**
   * Тест 1: Проверяем известные коды погоды
   */
  it('должен вернуть правильный GIF для известного кода погоды', () => {
    expect(getWeatherGif("10d")).toBe('/weather-gifs/rain.gif');
  });

  /**
   * Тест 2: Проверяем что вернёт  для неизвестного кода
   */
  it('должен вернуть fallback GIF для неизвестного кода', () => { 
    expect(getWeatherGif("99x")).toBe("/weather-gifs/partly-cloudy.gif");
  });

  /**
   * Тест 3: Проверяем что суффиксы  d|n  игнорируются 
   */
  it('должен игнорировать суффикс и использовать только первые 2 символа', () => {
    expect(getWeatherGif("13d")).toBe("/weather-gifs/snow.gif");
    expect(getWeatherGif('13n')).toBe('/weather-gifs/snow.gif');
    expect(getWeatherGif("13d")).toBe(getWeatherGif("13n")); // дополнительная проверка что они идентичны
  });

  /**
   * Тест 4: Проверка на множественное использование 
   */
  it('должен корректно обрабатывать различные погодные коды', () => {
    // Arrange + Act + Assert в компактной форме
    expect(getWeatherGif('01d')).toBe('/weather-gifs/partly-cloudy.gif');
    expect(getWeatherGif('09n')).toBe('/weather-gifs/heavy-rain.gif');    
    expect(getWeatherGif('11d')).toBe('/weather-gifs/thunderstorm.gif');  
    expect(getWeatherGif('50n')).toBe('/weather-gifs/fog.gif');           
  });
});

