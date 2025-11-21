import { Porto, Mode } from 'porto';

// Create Porto instance with React Native mode for mobile, dialog mode for web
export const porto = Porto.create({
  mode: Mode.reactNative(),
});

// Export Porto types for convenience
export type { Porto } from 'porto';
