// Crypto module shim for React Native
// Porto already polyfills crypto.getRandomValues via 'porto/react-native/register'
// This shim just re-exports from the global crypto object for Node-style imports

export const getRandomValues = (array) => {
  return crypto.getRandomValues(array);
};

export const randomUUID = () => {
  return crypto.randomUUID();
};

// Default export
export default {
  getRandomValues,
  randomUUID,
};
