import { Porto, Mode } from 'porto';
import { Platform } from 'react-native';

// Create Porto instance with React Native mode for mobile, dialog mode for web
export const porto = Porto.create({
  mode: Platform.select({
    web: Mode.dialog(),
    default: Mode.reactNative(),
  }),
});

// Export Porto types for convenience
export type { Porto } from 'porto';


