import { Header } from 'components/Header';
import { X402Example } from 'components/X402Example';
import { StatusBar } from 'expo-status-bar';
import { AccountProvider } from 'lib/AccountContext';
import { PortoProvider } from 'lib/PortoProvider';
import { View } from 'react-native';

import './global.css';

export default function App() {
  return (
    <PortoProvider>
      <AccountProvider>
        <View className="flex-1 bg-gray-50">
          <Header />
          <X402Example />
        </View>
        <StatusBar style="auto" />
      </AccountProvider>
    </PortoProvider>
  );
}
