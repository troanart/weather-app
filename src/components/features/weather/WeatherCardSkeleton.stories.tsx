import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import WeatherCardSkeleton from './WeatherCardSkeleton';

const meta = {
  title: 'Features/WeatherCardSkeleton',
  component: WeatherCardSkeleton,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: 'linear-gradient(135deg, #1e1b4b 0%, #581c87 50%, #0f172a 100%)',
        },
      ],
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '800px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WeatherCardSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Story: Базовое состояние загрузки
export const Default: Story = {};

// Story: В мобильной версии
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '375px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

// Story: В планшетной версии
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '768px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

// Story: В десктопной версии
export const Desktop: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '1200px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

// Story: Анимация (имитация долгой загрузки)
export const LoadingAnimation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Skeleton показывается во время загрузки данных с сервера. Анимация пульсации привлекает внимание пользователя.',
      },
    },
  },
};

// Story: Сравнение с реальной карточкой (для документации)
export const Comparison: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Skeleton компонент имитирует структуру реальной WeatherCard, предотвращая layout shift при загрузке.',
      },
    },
  },
};

