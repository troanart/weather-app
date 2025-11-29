import type { Preview } from '@storybook/react';
import React from 'react';
import { ThemeRegistry } from '../src/lib/theme/ThemeRegistry';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  decorators: [
    (Story) => (
      <ThemeRegistry>
        <Story />
      </ThemeRegistry>
    ),
  ],
};

export default preview;

