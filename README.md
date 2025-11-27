# Weather App

Ознамиться с приложением можно по ссылке [https://weather-app-sltq.vercel.app/](weather-app-sltq.vercel.app/)



## Технологический стек

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + MUI (кастомная тема + готовые компоненты)
- **State Management:** Zustand + LocalStorage (история запросов)
- **HTTP Client:** Axios (обёртка с единым обработчиком ошибок)
- **UI / Анимации:** MUI Icons, кастомные GIF/градиенты
- **Testing (план):** Vitest + Testing Library + Playwright
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
│   └── integration/              Интеграционные тесты
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

- Поиск текущей погоды (геокодинг + One Call API) с русской локализацией описаний
- Динамическая карточка: температура, диапазон min/max, ветер, влажность, фон‑GIF по иконке
- История успешных запросов (Zustand + LocalStorage, ограничение до 10 элементов)
- Возможность повторного запроса из истории и удаления записей
- Snackbar‑уведомления об успехе / ошибке с использованием констант сообщений
- Валидация


## Архитектура и подходы

- **Слой API → сервис → UI**: `weatherApi.ts` отвечает за HTTP, `weatherService.ts` — за трансформацию данных, компоненты получают уже готовый `WeatherData`.
- **Zustand store**: `historyStore` (`initializeHistory`), 
- **Константы сообщений**: `messages.constants.ts`  тексты для ошибок, плейсхолдеров и кнопок.
- **Тема**: кастомная MUI тема (`lib/theme`) + Tailwind 
- **UI‑компоненты**: `SearchBar`, `WeatherCard`, `HistoryList` 

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

### Запуск development сервера

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Запуск тестов

```bash
npm run test          # Запуск всех тестов
npm run test:watch    # Watch режим
npm run test:coverage # С покрытием кода
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

- **Unit тесты:** Для утилит, хуков и чистых функций
- **Integration тесты:** Для API сервисов и компонентов с логикой
- **Component тесты:** Для UI компонентов через Storybook + Vitest



## License

MIT
