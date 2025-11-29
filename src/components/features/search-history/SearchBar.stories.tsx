import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import SearchBar from './SearchBar';
import { useState } from 'react';

const meta = {
  title: 'Features/SearchBar',
  component: SearchBar,
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
    value: {
      control: 'text',
      description: 'Текущее значение инпута',
    },
    isLoading: {
      control: 'boolean',
      description: 'Флаг загрузки',
    },
    onChange: {
      action: 'changed',
      description: 'Обработчик изменения значения',
    },
    onSearch: {
      action: 'searched',
      description: 'Обработчик поиска',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', maxWidth: '100%', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onChange: fn(),
    onSearch: fn(),
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Story: Пустое состояние
export const Empty: Story = {
  args: {
    value: '',
    isLoading: false,
  },
};

// Story: С текстом
export const WithText: Story = {
  args: {
    value: 'Київ',
    isLoading: false,
  },
};

// Story: Состояние загрузки
export const Loading: Story = {
  args: {
    value: 'Лондон',
    isLoading: true,
  },
};

// Story: Длинное название города
export const LongCityName: Story = {
  args: {
    value: 'Івано-Франківськ',
    isLoading: false,
  },
};

// Story: Интерактивное состояние
export const Interactive: Story = {
  render: function Render() {
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        alert(`Поиск города: ${value}`);
      }, 2000);
    };

    return (
      <SearchBar
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onSearch={handleSearch}
        isLoading={isLoading}
      />
    );
  },
};

// Story: Різні міста
export const Kyiv: Story = {
  args: {
    value: 'Київ',
    isLoading: false,
  },
};

export const London: Story = {
  args: {
    value: 'London',
    isLoading: false,
  },
};

export const NewYork: Story = {
  args: {
    value: 'New York',
    isLoading: false,
  },
};

export const Tokyo: Story = {
  args: {
    value: '東京',
    isLoading: false,
  },
};

