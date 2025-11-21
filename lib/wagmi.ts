import { base } from 'porto/core/Chains';
import { Mode } from 'porto/react-native';
import { porto } from 'porto/wagmi';
import { Platform } from 'react-native';
import { createConfig, http } from 'wagmi';

export const config = createConfig({
  chains: [base],
  connectors: [
    porto({
      ...Platform.select({
        web: { mode: Mode.dialog() },
        default: { mode: Mode.reactNative() },
      }),
    }),
  ],
  multiInjectedProviderDiscovery: false,
  transports: {
    [base.id]: http(),
  },
});
