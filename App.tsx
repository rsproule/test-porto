import { Header } from 'components/Header';
import { SignExample } from 'components/SignExample';
import { TabView } from 'components/TabView';
import { X402Example } from 'components/X402Example';
import { StatusBar } from 'expo-status-bar';
import { AccountProvider } from 'lib/AccountContext';
import { PortoProvider } from 'lib/PortoProvider';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import './global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <PortoProvider>
        <AccountProvider>
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
        </AccountProvider>
      </PortoProvider>
    </SafeAreaProvider>
  );
}
