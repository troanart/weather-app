import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import WeatherCard from './WeatherCard';
import { WeatherData } from '@/lib/types/weather.types';

const meta = {
  title: 'Features/WeatherCard',
  component: WeatherCard,
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
  argTypes: {
    weather: {
      control: 'object',
      description: 'Данные о погоде или null',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '800px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WeatherCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Моковые данные для разных погодных условий
const mockWeatherClear: WeatherData = {
  id: '1',
  timestamp: Date.now(),
  temperature: 24,
  minTemp: 18,
  maxTemp: 28,
  description: 'ясно',
  icon: '01d',
  humidity: 45,
  windSpeed: 3.5,
  city: 'Київ',
  country: 'UA',
};

const mockWeatherCloudy: WeatherData = {
  id: '2',
  timestamp: Date.now(),
  temperature: 15,
  minTemp: 12,
  maxTemp: 18,
  description: 'облачно с прояснениями',
  icon: '02d',
  humidity: 68,
  windSpeed: 5.2,
  city: 'Лондон',
  country: 'GB',
};

const mockWeatherRain: WeatherData = {
  id: '3',
  timestamp: Date.now(),
  temperature: 10,
  minTemp: 8,
  maxTemp: 12,
  description: 'дождь',
  icon: '10d',
  humidity: 85,
  windSpeed: 7.8,
  city: 'Париж',
  country: 'FR',
};

const mockWeatherSnow: WeatherData = {
  id: '4',
  timestamp: Date.now(),
  temperature: -5,
  minTemp: -8,
  maxTemp: -2,
  description: 'снег',
  icon: '13d',
  humidity: 92,
  windSpeed: 4.1,
  city: 'Львів',
  country: 'UA',
};

const mockWeatherThunderstorm: WeatherData = {
  id: '5',
  timestamp: Date.now(),
  temperature: 18,
  minTemp: 16,
  maxTemp: 20,
  description: 'гроза',
  icon: '11d',
  humidity: 88,
  windSpeed: 12.5,
  city: 'Нью-Йорк',
  country: 'US',
};

const mockWeatherFog: WeatherData = {
  id: '6',
  timestamp: Date.now(),
  temperature: 8,
  minTemp: 6,
  maxTemp: 10,
  description: 'туман',
  icon: '50d',
  humidity: 95,
  windSpeed: 2.1,
  city: 'Токио',
  country: 'JP',
};

const mockWeatherHot: WeatherData = {
  id: '7',
  timestamp: Date.now(),
  temperature: 38,
  minTemp: 32,
  maxTemp: 42,
  description: 'ясно',
  icon: '01d',
  humidity: 15,
  windSpeed: 1.5,
  city: 'Дубай',
  country: 'AE',
};

const mockWeatherCold: WeatherData = {
  id: '8',
  timestamp: Date.now(),
  temperature: -25,
  minTemp: -30,
  maxTemp: -20,
  description: 'ясно',
  icon: '01n',
  humidity: 70,
  windSpeed: 8.5,
  city: 'Луганськ',
  country: 'UA',
};

// Story: Пустое состояние (нет данных)
export const Empty: Story = {
  args: {
    weather: null,
  },
};

// Story: Ясная погода
export const ClearWeather: Story = {
  args: {
    weather: mockWeatherClear,
  },
};

// Story: Облачная погода
export const CloudyWeather: Story = {
  args: {
    weather: mockWeatherCloudy,
  },
};

// Story: Дождь
export const RainyWeather: Story = {
  args: {
    weather: mockWeatherRain,
  },
};

// Story: Снег
export const SnowyWeather: Story = {
  args: {
    weather: mockWeatherSnow,
  },
};

// Story: Гроза
export const ThunderstormWeather: Story = {
  args: {
    weather: mockWeatherThunderstorm,
  },
};

// Story: Туман
export const FoggyWeather: Story = {
  args: {
    weather: mockWeatherFog,
  },
};

// Story: Жаркая погода
export const HotWeather: Story = {
  args: {
    weather: mockWeatherHot,
  },
};

// Story: Холодная погода
export const ColdWeather: Story = {
  args: {
    weather: mockWeatherCold,
  },
};

// Story: Высокая влажность
export const HighHumidity: Story = {
  args: {
    weather: {
      ...mockWeatherClear,
      humidity: 95,
      description: 'влажно',
    },
  },
};

// Story: Сильный ветер
export const StrongWind: Story = {
  args: {
    weather: {
      ...mockWeatherClear,
      windSpeed: 25.5,
      description: 'ветрено',
    },
  },
};

