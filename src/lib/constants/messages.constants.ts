/**
 * Константы для пользовательских сообщений
 */

export const ERROR_MESSAGES = {
  // Валидация
  EMPTY_INPUT: 'Пожалуйста, введите название города.',
  INVALID_INPUT: 'Название города содержит недопустимые символы.',
  MIN_LENGTH: 'Название города должно содержать минимум 2 символа.',
  INVALID_LENGTH: 'Название города должно быть от 2 до 50 символов.',
  
  // API ошибки
  CITY_NOT_FOUND: 'Город не найден. Проверьте правильность написания.',
  CITIES_LOAD_ERROR: 'Ошибка при загрузке городов.',
  NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету.',
  API_ERROR: 'Ошибка получения данных. Попробуйте позже.',
  TIMEOUT_ERROR: 'Превышено время ожидания. Попробуйте еще раз.',
  INVALID_API_KEY: 'Неверный API ключ. Проверьте конфигурацию.',
  
  // Общие ошибки
  UNKNOWN_ERROR: 'Произошла неизвестная ошибка. Попробуйте еще раз.',
  STORAGE_ERROR: 'Ошибка сохранения данных в локальном хранилище.',
} as const;

export const SUCCESS_MESSAGES = {
  WEATHER_LOADED: 'Данные о погоде успешно загружены.',
  HISTORY_CLEARED: 'История поиска очищена.',
  ITEM_REMOVED: 'Элемент удален из истории.',
  ITEM_RESTORED: 'Элемент восстановлен.',
} as const;

export const INFO_MESSAGES = {
  INITIAL_STATE: 'Введите название города, чтобы узнать погоду.',
  LOADING: 'Загрузка данных о погоде...',
  NO_HISTORY: 'История поиска пуста',
} as const;

export const PLACEHOLDERS = {
  SEARCH_INPUT: 'Введите название города...',
} as const;

export const BUTTON_LABELS = {
  SEARCH: 'Поиск',
  CANCEL: 'Отмена',
  DELETE: 'Удалить',
  RESTORE: 'Восстановить',
} as const;

export const DIALOG_MESSAGES = {
  DELETE_TITLE: 'Удалить запись?',
  DELETE_CONFIRMATION: 'Вы уверены, что хотите удалить эту запись из истории? Вы сможете восстановить её с помощью кнопки "Restore".',
} as const;



