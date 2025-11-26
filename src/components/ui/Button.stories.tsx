import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';
import SearchIcon from '@mui/icons-material/Search';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Содержимое кнопки',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключена ли кнопка',
    },
    onClick: {
      action: 'clicked',
      description: 'Обработчик клика',
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Кнопка',
  },
};

export const WithIcon: Story = {
  args: {
    children: <SearchIcon sx={{ fontSize: 20, color: 'white' }} />,
  },
};

export const WithTextAndIcon: Story = {
  args: {
    children: (
      <>
        <SearchIcon sx={{ fontSize: 20, color: 'white' }} />
        Поиск
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    children: 'Отключена',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: '...',
    disabled: true,
  },
};

