import { useAccount } from 'lib/AccountContext';
import { usePorto } from 'lib/PortoProvider';
import React, { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AccountModal } from './AccountModal';

export function Header() {
  const porto = usePorto();
  const { account, setAccount } = useAccount();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);

      const accounts = (await porto.provider.request({
        method: 'eth_requestAccounts',
      })) as string[];

      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (err) {
      console.error('Porto connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setAccount(null);
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

          {!account ? (
            <TouchableOpacity
              onPress={handleConnect}
              disabled={loading}
              className="rounded bg-blue-500 px-4 py-2"
              activeOpacity={0.7}>
              {loading ? (
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
                  {account.slice(0, 6)}...{account.slice(-4)}
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

      {account && (
        <AccountModal visible={showModal} onClose={() => setShowModal(false)} account={account} />
      )}
    </>
  );
}
