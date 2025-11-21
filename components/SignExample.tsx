import React, { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAccount, useSignMessage } from 'wagmi';

export function SignExample() {
  const { isConnected } = useAccount();
  const { signMessage, isPending } = useSignMessage();
  const [message, setMessage] = useState('Hello World');
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSign = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setError(null);
      setSignature(null);

      // Sign the message using Wagmi
      signMessage(
        { message },
        {
          onSuccess: (sig) => {
            setSignature(sig);
          },
          onError: (err) => {
            setError(err.message || 'Signing failed');
            console.error('Sign error:', err);
          },
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signing failed');
      console.error('Sign error:', err);
    }
  };

  return (
    <View className="flex-1 p-4">
      <View className="mb-6">
        <Text className="mb-2 text-2xl font-bold">Sign a Message</Text>
        <Text className="text-gray-600">Sign any text with your Porto wallet</Text>
      </View>

      {!isConnected && (
        <View className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <Text className="mb-1 font-semibold text-yellow-800">⚠️ Wallet not connected</Text>
          <Text className="text-sm text-yellow-700">
            Please connect your wallet using the button above to sign messages
          </Text>
        </View>
      )}

      <View className="mb-4">
        <Text className="mb-2 text-sm font-semibold">Message to Sign</Text>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Enter message to sign"
          multiline
          numberOfLines={3}
          className="rounded-lg border border-gray-300 bg-white p-4 text-base"
          editable={!isPending && isConnected}
        />
      </View>

      <TouchableOpacity
        onPress={handleSign}
        disabled={isPending || !isConnected}
        className={`mb-6 items-center rounded-lg p-4 ${
          isPending || !isConnected ? 'bg-gray-300' : 'bg-blue-500'
        }`}
        activeOpacity={0.7}>
        {isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-base font-semibold text-white">Sign Message</Text>
        )}
      </TouchableOpacity>

      {error && (
        <View className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <Text className="mb-1 font-semibold text-red-800">Error</Text>
          <Text className="text-sm text-red-700">{error}</Text>
        </View>
      )}

      {signature && (
        <View className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4">
          <Text className="mb-2 font-semibold text-green-800">✓ Signature</Text>
          <View className="rounded border border-gray-200 bg-white p-3">
            <Text className="font-mono text-xs text-gray-700" selectable>
              {signature.slice(0, 100)}...{signature.slice(-100)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
