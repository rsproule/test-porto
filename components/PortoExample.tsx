import { usePorto } from 'lib/PortoProvider';
import React, { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

export function PortoExample() {
  const porto = usePorto();
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use EIP-1193 provider interface to request accounts
      const accounts = (await porto.provider.request({
        method: 'eth_requestAccounts',
      })) as string[];

      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
      console.error('Porto connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setAccount(null);
    setError(null);
  };

  return (
    <View className="w-full p-4">
      <Text className="mb-4 text-center text-lg font-bold">Porto Example</Text>

      {error && (
        <View className="mb-4 rounded bg-red-100 p-3">
          <Text className="text-red-800">{error}</Text>
        </View>
      )}

      {!account ? (
        <TouchableOpacity
          onPress={handleConnect}
          disabled={loading}
          className="items-center rounded bg-blue-500 p-4">
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="font-semibold text-white">Connect Wallet</Text>
          )}
        </TouchableOpacity>
      ) : (
        <View>
          <View className="mb-4 rounded bg-green-100 p-4">
            <Text className="mb-2 font-semibold text-green-800">Connected</Text>
            <Text className="text-xs text-green-700">{account}</Text>
          </View>

          <TouchableOpacity
            onPress={handleDisconnect}
            className="items-center rounded bg-gray-500 p-4">
            <Text className="font-semibold text-white">Disconnect</Text>
          </TouchableOpacity>
        </View>
      )}

      <View className="mt-6 rounded bg-gray-100 p-4">
        <Text className="mb-2 text-sm text-gray-600">
          💡 This example shows how to use Porto to connect a wallet.
        </Text>
        <Text className="text-xs text-gray-500">
          Porto will handle authentication using passkeys for a seamless user experience.
        </Text>
      </View>
    </View>
  );
}
