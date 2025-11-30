import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// Расширяем expect матчерами из jest-dom
expect.extend(matchers);

// Настройка jsdom для тестов
// Исправляем проблему с instanceof для HTMLElement
if (typeof window !== 'undefined') {
  // Добавляем недостающие глобальные объекты
  global.HTMLElement = window.HTMLElement;
  global.HTMLInputElement = window.HTMLInputElement;
  global.HTMLButtonElement = window.HTMLButtonElement;
}

