# Weather App



## Технологический стек

- **Frontend Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Radix UI
- **State Management:** Zustand (client state) + React Query (server state)
- **HTTP Client:** Axios
- **Testing:** Vitest + Testing Library + Playwright
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
│   ├── components/               React компоненты
│   │   ├── ui/                   Переиспользуемые UI компоненты (atoms)
│   │   │                         Button, Input, Card, Toast, Spinner, etc.
│   │   │
│   │   └── features/             Фича-компоненты (molecules/organisms)
│   │       ├── weather/          Компоненты для отображения погоды
│   │       │                     WeatherCard, WeatherDetails, WeatherIcon
│   │       │
│   │       └── search-history/   Компоненты истории поиска
│   │                             SearchBar, HistoryList, HistoryItem
│   │
│   └── lib/                      Бизнес-логика и утилиты
│       ├── api/                  API клиенты и сервисы
│       │                         weatherApi.ts, weatherService.ts, apiClient.ts
│       │
│       ├── hooks/                Custom React Hooks
│       │                         useWeather, useSearchHistory, useDebounce
│       │
│       ├── stores/               Zustand State Management
│       │                         weatherStore.ts, historyStore.ts
│       │
│       ├── types/                TypeScript типы и интерфейсы
│       │                         weather.types.ts, common.types.ts
│       │
│       ├── utils/                Утилитные функции
│       │                         weather.utils.ts, date.utils.ts, storage.utils.ts
│       │
│       └── constants/            Константы приложения
│                                 api.constants.ts, messages.constants.ts
│
├── tests/                        Тесты
│   ├── unit/                     Unit тесты
│   └── integration/              Интеграционные тесты
│
├── public/                       Статические файлы
│   └── icons/                    Иконки и изображения
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

- Поиск текущей погоды по названию города
- Отображение детальной информации о погоде
- История успешных поисков
- Быстрый доступ к ранее найденным городам
- Удаление элементов из истории
- Обработка ошибок и граничных случаев
- Адаптивный дизайн

## Начало работы

### Установка зависимостей

```bash
npm install
```

### Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
NEXT_PUBLIC_WEATHER_API_URL=https://api.openweathermap.org/data/2.5
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
