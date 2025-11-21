/* eslint-disable import/first */
// Import Buffer polyfill for React Native (needed for x402)
import { Buffer } from 'buffer';
global.Buffer = Buffer;

// Import Porto polyfills for React Native
// Porto handles crypto.randomUUID and crypto.getRandomValues polyfills
import 'porto/react-native/register';

// Import the default Expo entry point
import 'expo/AppEntry.js';
