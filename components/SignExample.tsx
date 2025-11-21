import { useAccount } from 'lib/AccountContext';
import { usePorto } from 'lib/PortoProvider';
import React, { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';

export function SignExample() {
  const porto = usePorto();
  const { account } = useAccount();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Hello World');
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper function to convert string to hex
  const stringToHex = (str: string): `0x${string}` => {
    const hex = Array.from(str)
      .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');
    return `0x${hex}` as `0x${string}`;
  };

  const handleSign = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSignature(null);

      // Convert message to hex format (required by Porto)
      const messageHex: `0x${string}` = stringToHex(message);

      // Sign the message using Porto wallet
      const sig = (await porto.provider.request({
        method: 'personal_sign',
        params: [messageHex, account as `0x${string}`],
      })) as string;

      setSignature(sig);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signing failed');
      console.error('Sign error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-4">
      <View className="mb-6">
        <Text className="mb-2 text-2xl font-bold">Sign a Message</Text>
        <Text className="text-gray-600">Sign any text with your Porto wallet</Text>
      </View>

      {!account && (
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
          editable={!loading && !!account}
        />
      </View>

      <TouchableOpacity
        onPress={handleSign}
        disabled={loading || !account}
        className={`mb-6 items-center rounded-lg p-4 ${
          loading || !account ? 'bg-gray-300' : 'bg-blue-500'
        }`}
        activeOpacity={0.7}>
        {loading ? (
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
              {signature}
            </Text>
          </View>
        </View>
      )}

      <View className="mt-auto rounded-lg border border-blue-200 bg-blue-50 p-4">
        <Text className="mb-2 text-sm font-semibold text-blue-900">💡 About Signing</Text>
        <Text className="mb-1 text-xs text-blue-800">• Personal sign uses your private key</Text>
        <Text className="mb-1 text-xs text-blue-800">
          • Porto prompts you to authorize the signature
        </Text>
        <Text className="text-xs text-blue-800">• Signatures can be verified on-chain</Text>
      </View>
    </View>
  );
}
