import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import HistoryList from './HistoryList';
import { useHistoryStore } from '@/lib/stores/historyStore';
import { useEffect } from 'react';

const meta = {
  title: 'Features/HistoryList',
  component: HistoryList,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(99, 102, 241, 0.4) 100%)',
        },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onItemClick: {
      action: 'item-clicked',
      description: 'Обработчик клика по элементу истории',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px', height: '450px', maxWidth: '100%', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onItemClick: fn(),
  },
} satisfies Meta<typeof HistoryList>;

export default meta;
type Story = StoryObj<typeof meta>;

// Story: Пустая история
export const Empty: Story = {
  render: function Render(args) {
    useEffect(() => {
      // Очищаем историю для этого story
      useHistoryStore.getState().clearHistory();
    }, []);

    return <HistoryList {...args} />;
  },
};

// Story: Один элемент
export const OneItem: Story = {
  render: function Render(args) {
    useEffect(() => {
      const store = useHistoryStore.getState();
      store.clearHistory();
      store.addToHistory({
        city: 'Київ',
        country: 'UA',
        lat: 50.4501,
        lon: 30.5234,
      });
    }, []);

    return <HistoryList {...args} />;
  },
};

// Story: Несколько элементов
export const MultipleItems: Story = {
  render: function Render(args) {
    useEffect(() => {
      const store = useHistoryStore.getState();
      store.clearHistory();
      
      const cities = [
        { city: 'Київ', country: 'UA', lat: 50.4501, lon: 30.5234 },
        { city: 'Лондон', country: 'GB', lat: 51.5074, lon: -0.1278 },
        { city: 'Париж', country: 'FR', lat: 48.8566, lon: 2.3522 },
        { city: 'Токио', country: 'JP', lat: 35.6762, lon: 139.6503 },
        { city: 'Нью-Йорк', country: 'US', lat: 40.7128, lon: -74.0060 },
      ];

      cities.forEach((cityData) => {
        store.addToHistory(cityData);
      });
    }, []);

    return <HistoryList {...args} />;
  },
};

// Story: Полная история (10 элементов)
export const FullHistory: Story = {
  render: function Render(args) {
    useEffect(() => {
      const store = useHistoryStore.getState();
      store.clearHistory();
      
      const cities = [
        { city: 'Київ', country: 'UA', lat: 50.4501, lon: 30.5234 },
        { city: 'Лондон', country: 'GB', lat: 51.5074, lon: -0.1278 },
        { city: 'Париж', country: 'FR', lat: 48.8566, lon: 2.3522 },
        { city: 'Токио', country: 'JP', lat: 35.6762, lon: 139.6503 },
        { city: 'Нью-Йорк', country: 'US', lat: 40.7128, lon: -74.0060 },
        { city: 'Сидней', country: 'AU', lat: -33.8688, lon: 151.2093 },
        { city: 'Берлин', country: 'DE', lat: 52.5200, lon: 13.4050 },
        { city: 'Рим', country: 'IT', lat: 41.9028, lon: 12.4964 },
        { city: 'Мадрид', country: 'ES', lat: 40.4168, lon: -3.7038 },
        { city: 'Пекін', country: 'CN', lat: 39.9042, lon: 116.4074 },
      ];

      cities.forEach((cityData) => {
        store.addToHistory(cityData);
      });
    }, []);

    return <HistoryList {...args} />;
  },
};

// Story: Длинные названия городов
export const LongCityNames: Story = {
  render: function Render(args) {
    useEffect(() => {
      const store = useHistoryStore.getState();
      store.clearHistory();
      
      const cities = [
        { city: 'Днепр', country: 'UA', lat: 48.4647, lon: 35.0462 },
        { city: 'Івано-Франковск', country: 'UA', lat: 48.9226, lon: 24.7111 },
        { city: 'Кам\'янець-Подільський', country: 'UA', lat: 48.6819, lon: 26.5858 },
      ];

      cities.forEach((cityData) => {
        store.addToHistory(cityData);
      });
    }, []);

    return <HistoryList {...args} />;
  },
};

// Story: Интерактивное состояние
export const Interactive: Story = {
  render: function Render() {
    useEffect(() => {
      const store = useHistoryStore.getState();
      store.clearHistory();
      
      const cities = [
        { city: 'Київ', country: 'UA', lat: 50.4501, lon: 30.5234 },
        { city: 'Лондон', country: 'GB', lat: 51.5074, lon: -0.1278 },
        { city: 'Париж', country: 'FR', lat: 48.8566, lon: 2.3522 },
      ];

      cities.forEach((cityData) => {
        store.addToHistory(cityData);
      });
    }, []);

    const handleItemClick = (lat: number, lon: number) => {
      alert(`Клик по городу с координатами: ${lat}, ${lon}`);
    };

    return <HistoryList onItemClick={handleItemClick} />;
  },
};

// Story: Украинские  города
export const UkrainianCities: Story = {
  render: function Render(args) {
    useEffect(() => {
      const store = useHistoryStore.getState();
      store.clearHistory();
      
      const cities = [
        { city: 'Киев', country: 'UA', lat: 50.4501, lon: 30.5234 },
        { city: 'Львов', country: 'UA', lat: 49.8397, lon: 24.0297 },
        { city: 'Одесса', country: 'UA', lat: 46.4825, lon: 30.7233 },
        { city: 'Харьков', country: 'UA', lat: 49.9935, lon: 36.2304 },
        { city: 'Днепр', country: 'UA', lat: 48.4647, lon: 35.0462 },
      ];

      cities.forEach((cityData) => {
        store.addToHistory(cityData);
      });
    }, []);

    return <HistoryList {...args} />;
  },
};

// Story: Европейские города
export const EuropeanCities: Story = {
  render: function Render(args) {
    useEffect(() => {
      const store = useHistoryStore.getState();
      store.clearHistory();
      
      const cities = [
        { city: 'Лондон', country: 'GB', lat: 51.5074, lon: -0.1278 },
        { city: 'Париж', country: 'FR', lat: 48.8566, lon: 2.3522 },
        { city: 'Берлин', country: 'DE', lat: 52.5200, lon: 13.4050 },
        { city: 'Рим', country: 'IT', lat: 41.9028, lon: 12.4964 },
        { city: 'Мадрид', country: 'ES', lat: 40.4168, lon: -3.7038 },
      ];

      cities.forEach((cityData) => {
        store.addToHistory(cityData);
      });
    }, []);

    return <HistoryList {...args} />;
  },
};

