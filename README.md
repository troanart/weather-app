# Weather App

Ознамиться с приложением можно по ссылке [https://weather-app-sltq.vercel.app/](weather-app-sltq.vercel.app/)



## Технологический стек

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + MUI (кастомная тема + готовые компоненты)
- **State Management:** Zustand + LocalStorage (история запросов)
- **HTTP Client:** Axios (обёртка с единым обработчиком ошибок)
- **UI / Анимации:** MUI Icons, кастомные GIF/градиенты
- **Testing:** Vitest + Testing Library (Playwright используется только для Storybook тестов)
- **Documentation:** Storybook
- **Code Quality:** ESLint + Prettier

## Структура проекта

```
weather-app/
│
├── src/                          Весь исходный код приложения
│   │
│   ├── app/                      Next.js App Router
│   │   ├── layout.tsx            Корневой layout приложения
│   │   ├── page.tsx              Главная страница
│   │   ├── globals.css           Глобальные стили
│   │   ├── favicon.ico           Иконка сайта
│   │   └── fonts/                Шрифты приложения
│   │       ├── GeistVF.woff
│   │       └── GeistMonoVF.woff
│   │
│   ├── components/               UI и feature компоненты
│   │   ├── ui/                   Базовые элементы (кнопки и т.д.)
│   │   └── features/             Блоки функциональности
│   │       ├── weather/          WeatherCard и связанные части
│   │       ├── search-history/   SearchBar
│   │       └── history-list/     HistoryList с собственным скроллом
│   │
│   └── lib/                      Бизнес-логика и утилиты
│       ├── api/                  API клиенты и сервисы
│       │                         weatherApi.ts, weatherService.ts, apiClient.ts
│       │
│       ├── hooks/                Зарезервировано под кастомные хуки
│       ├── stores/               Zustand store (historyStore.ts)
│       ├── theme/                Настройка MUI темы + реестр
│       ├── types/                TypeScript типы (weather, store, components)
│       ├── utils/                Утилиты (иконки, GIF-анимации)
│       └── constants/            Константы (API, сообщения и т.д.)
│
├── tests/                        Тесты
│   ├── unit/                     Unit тесты
│   │   ├── historyStore.test.ts           Тесты для Zustand store
│   │   ├── transformWeatherData.test.ts   Тесты трансформации данных
│   │   ├── validation.test.ts             Тесты валидации
│   │   └── weatherGifs.test.ts            Тесты утилит для GIF
│   └── integration/              Интеграционные тесты
│       ├── weatherService.integration.test.ts    API + Service интеграция
│       ├── historyStore.integration.test.ts      Store + localStorage + API
│       └── components.integration.test.tsx        React компоненты + Store
│
├── public/                       Статические файлы
│   ├── icons/                    SVG/PNG иконки
│   └── weather-gifs/             Анимации для карточки погоды
│
├── stories/                      Storybook компоненты
│
├── tsconfig.json                 TypeScript конфигурация
├── package.json                  Зависимости проекта
├── tailwind.config.ts            Tailwind CSS конфигурация
├── vitest.config.ts              Конфигурация тестов
└── next.config.mjs               Next.js конфигурация
```

## Основные возможности

### Поиск погоды
- Поиск текущей погоды по названию города (геокодинг + One Call API)
- Русская локализация описаний погоды
- Автокомплит при вводе (показывает до 3 вариантов)
- Валидация ввода названия города

### Отображение данных
- Динамическая карточка погоды с:
  - Текущей температурой
  - Диапазоном min/max температур
  - Скоростью ветра
  - Влажностью
  - Описанием погоды
  - Анимированным фоном (GIF) в зависимости от типа погоды
  - Иконками погоды из MUI

### История поиска
- Сохранение истории успешных запросов (Zustand + LocalStorage)
- Ограничение до 10 элементов (старые автоматически удаляются)
- Повторный запрос погоды по клику на элемент истории
- Удаление записей из истории
- Перемещение дубликатов наверх при повторном поиске
- Восстановление последнего удаленного элемента

### UX особенности
- Snackbar-уведомления об успехе / ошибке
- Skeleton загрузка для карточки погоды
- Обработка ошибок с понятными сообщениями
- Адаптивный дизайн (mobile-first)


## Архитектура и подходы

### Слои приложения

- **API слой** (`lib/api/weatherApi.ts`): HTTP запросы к OpenWeatherMap API
  - Геокодинг (поиск координат города)
  - One Call API (получение погоды по координатам)
  - Обработка ошибок через interceptors

- **Service слой** (`lib/api/weatherService.ts`): Бизнес-логика и трансформация данных
  - Преобразование данных API в формат UI
  - Округление температур и форматирование
  - Объединение геокодинга и погодных данных

- **UI слой** (`components/features/`): React компоненты
  - `SearchBar` - поиск с автокомплитом
  - `WeatherCard` - отображение погоды
  - `HistoryList` - история поиска

### State Management

- **Zustand store** (`lib/stores/historyStore.ts`): 
  - Управление историей поиска
  - Синхронизация с localStorage
  - Лимит в 10 элементов
  - Обработка дубликатов

### Дополнительные подходы

- **Константы сообщений** (`lib/constants/messages.constants.ts`): Централизованное хранение текстов для ошибок, плейсхолдеров и кнопок
- **Тема**: Кастомная MUI тема (`lib/theme`) + Tailwind CSS для стилизации
- **Валидация** (`lib/utils/validation.ts`): Валидация пользовательского ввода
- **Утилиты**: Иконки погоды, GIF анимации, debounce хук 

## Начало работы

### Установка зависимостей

```bash
npm install
```

### Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
```

**Как получить API ключ:**
1. Зарегистрируйтесь на [OpenWeatherMap](https://openweathermap.org/api)
2. Перейдите в раздел [API keys](https://home.openweathermap.org/api_keys)
3. Создайте новый API ключ (бесплатный план включает 1000 запросов/день)
4. Скопируйте ключ в файл `.env.local`

### Запуск development сервера

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Запуск тестов

```bash
npm run test                    # Запуск всех тестов
npm run test:watch              # Watch режим
npm run test:ui                 # Запуск с UI интерфейсом
npm run test:coverage           # С покрытием кода
npm test tests/unit             # Только unit тесты
npm test tests/integration      # Только интеграционные тесты
```

### Запуск Storybook

```bash
npm run storybook
```

Откройте [http://localhost:6006](http://localhost:6006) для просмотра компонентов.

## Скрипты

```bash
npm run dev              # Запуск dev сервера
npm run build            # Сборка для production
npm run start            # Запуск production сервера
npm run lint             # Проверка кода линтером
npm run test             # Запуск тестов
npm run storybook        # Запуск Storybook
npm run build-storybook  # Сборка Storybook
```

## Импорты

Проект использует alias `@/` для удобного импорта:

```typescript
import { WeatherCard } from '@/components/features/weather/WeatherCard';
import { useWeather } from '@/lib/hooks/useWeather';
import { WeatherData } from '@/lib/types/weather.types';
```

## Code Style

- Используется ESLint для проверки кода
- Prettier для форматирования
- TypeScript strict mode включен
- Следование принципам SOLID

## Тестирование

Проект использует комплексный подход к тестированию с использованием Vitest и Testing Library.

**Примечание:** Playwright используется только для запуска тестов Storybook в браузере. Основные unit и интеграционные тесты используют jsdom окружение.

### Unit тесты

Unit тесты проверяют изолированную работу отдельных функций и модулей:

- **`historyStore.test.ts`** (10 тестов) - Тестирование Zustand store:
  - Добавление городов в историю
  - Обработка дубликатов (перемещение наверх)
  - Лимит в 10 элементов
  - Удаление и очистка истории
  - Работа с localStorage

- **`transformWeatherData.test.ts`** - Тестирование трансформации данных:
  - Округление температур
  - Форматирование скорости ветра
  - Маппинг полей из API в UI формат

- **`validation.test.ts`** - Тестирование валидации:
  - Валидация названий городов
  - Обработка некорректных данных

- **`weatherGifs.test.ts`** - Тестирование утилит:
  - Выбор правильных GIF по коду погоды
  - Fallback для неизвестных кодов

### Интеграционные тесты

Интеграционные тесты проверяют взаимодействие между несколькими модулями:

- **`weatherService.integration.test.ts`** (5 тестов) - Интеграция API + Service:
  - Полный поток: запрос к API → трансформация данных → возврат результата
  - Обработка ошибок на уровне интеграции
  - Работа с разными типами данных
  - Последовательные запросы

- **`historyStore.integration.test.ts`** (5 тестов) - Интеграция Store + localStorage + API:
  - Полный поток: поиск погоды → сохранение в историю → localStorage
  - Загрузка истории из localStorage при инициализации
  - Полный жизненный цикл: добавление → удаление → очистка
  - Лимит истории при множественных запросах
  - Перемещение дубликатов наверх

- **`components.integration.test.tsx`** - Интеграция React компонентов:
  - Взаимодействие SearchBar с API и Store
  - Отображение истории из Store
  - Полный пользовательский сценарий: поиск → отображение → сохранение
  - Работа автокомплита

### Статистика тестов

- **Unit тесты:** 4 файла, ~15+ тестов
- **Интеграционные тесты:** 3 файла, 10+ тестов
- **Покрытие:** Основные модули покрыты тестами

### Запуск конкретных тестов

```bash
# Запуск всех тестов
npm test

# Только unit тесты
npm test tests/unit

# Только интеграционные тесты
npm test tests/integration

# Конкретный файл
npm test tests/unit/historyStore.test.ts

# С покрытием кода
npm run test:coverage
```



## License

MIT
