import { useAccount } from 'lib/AccountContext';
import { usePorto } from 'lib/PortoProvider';
import React, { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { wrapFetchWithPayment } from 'x402-fetch';

export function X402Example() {
  const porto = usePorto();
  const { account } = useAccount();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('https://api.example.com/paid-endpoint');
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResponse(null);

      // Wrap fetch with payment handling using Porto wallet
      const fetchWithPay = wrapFetchWithPayment(fetch, porto.provider);

      // Make the request
      const res = await fetchWithPay(url, {
        method: 'GET',
      });

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
      console.error('X402 request error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-4">
      <View className="mb-6">
        <Text className="mb-2 text-2xl font-bold">Make a Paid API Request</Text>
        <Text className="text-gray-600">Enter an API endpoint that supports X402 payments</Text>
      </View>

      {!account && (
        <View className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <Text className="mb-1 font-semibold text-yellow-800">⚠️ Wallet not connected</Text>
          <Text className="text-sm text-yellow-700">
            Please connect your wallet using the button above to make X402 requests
          </Text>
        </View>
      )}

      <View className="mb-4">
        <Text className="mb-2 text-sm font-semibold">API Endpoint URL</Text>
        <TextInput
          value={url}
          onChangeText={setUrl}
          placeholder="https://api.example.com/paid-endpoint"
          className="rounded-lg border border-gray-300 bg-white p-4 text-base"
          editable={!loading && !!account}
        />
      </View>

      <TouchableOpacity
        onPress={handleRequest}
        disabled={loading || !account}
        className={`mb-6 items-center rounded-lg p-4 ${
          loading || !account ? 'bg-gray-300' : 'bg-purple-500'
        }`}
        activeOpacity={0.7}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-base font-semibold text-white">Make Paid Request</Text>
        )}
      </TouchableOpacity>

      {error && (
        <View className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <Text className="mb-1 font-semibold text-red-800">Error</Text>
          <Text className="text-sm text-red-700">{error}</Text>
        </View>
      )}

      {response && (
        <View className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4">
          <Text className="mb-2 font-semibold text-green-800">✓ Response</Text>
          <View className="rounded border border-gray-200 bg-white p-3">
            <Text className="font-mono text-xs text-gray-700">{response}</Text>
          </View>
        </View>
      )}

      <View className="mt-auto rounded-lg border border-blue-200 bg-blue-50 p-4">
        <Text className="mb-2 text-sm font-semibold text-blue-900">💡 How it works</Text>
        <Text className="mb-1 text-xs text-blue-800">• API returns 402 Payment Required</Text>
        <Text className="mb-1 text-xs text-blue-800">• Porto wallet signs the payment</Text>
        <Text className="text-xs text-blue-800">• Request retries with payment header</Text>
      </View>
    </View>
  );
}
