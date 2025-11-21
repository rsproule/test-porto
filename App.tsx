import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from 'components/Header';
import { SignExample } from 'components/SignExample';
import { TabView } from 'components/TabView';
import { X402Example } from 'components/X402Example';
import { StatusBar } from 'expo-status-bar';
import { config } from 'lib/wagmi';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WagmiProvider } from 'wagmi';

import './global.css';

const queryClient = new QueryClient();

export default function App() {
  return (
    <SafeAreaProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <View className="flex-1 bg-gray-50">
            <Header />
            <TabView
              tabs={[
                {
                  id: 'sign',
                  label: 'Sign Message',
                  component: <SignExample />,
                },
                {
                  id: 'x402',
                  label: 'X402 Payment',
                  component: <X402Example />,
                },
              ]}
            />
          </View>
          <StatusBar style="auto" />
        </QueryClientProvider>
      </WagmiProvider>
    </SafeAreaProvider>
  );
}
