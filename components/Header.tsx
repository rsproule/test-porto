import React, { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { AccountModal } from './AccountModal';

export function Header() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [showModal, setShowModal] = useState(false);

  const handleConnect = () => {
    const portoConnector = connectors[0]; // Porto connector
    if (portoConnector) {
      connect({ connector: portoConnector });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setShowModal(false);
  };

  return (
    <>
      <SafeAreaView
        edges={['top']}
        className="border-b border-gray-200 bg-white"
        style={{ zIndex: 10 }}>
        <View className="flex-row items-center justify-between px-4 py-3">
          <Text className="text-xl font-bold">Porto X402</Text>

          {!isConnected ? (
            <TouchableOpacity
              onPress={handleConnect}
              disabled={isPending}
              className="rounded bg-blue-500 px-4 py-2"
              activeOpacity={0.7}>
              {isPending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="font-semibold text-white">Connect</Text>
              )}
            </TouchableOpacity>
          ) : (
            <View className="flex-row items-center" style={{ gap: 8 }}>
              <TouchableOpacity
                onPress={() => setShowModal(true)}
                className="rounded bg-green-100 px-3 py-2"
                activeOpacity={0.7}>
                <Text className="font-mono text-xs text-green-800">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDisconnect}
                className="rounded bg-gray-200 px-3 py-2"
                activeOpacity={0.7}>
                <Text className="text-xs text-gray-700">✕</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>

      {address && (
        <AccountModal visible={showModal} onClose={() => setShowModal(false)} account={address} />
      )}
    </>
  );
}
