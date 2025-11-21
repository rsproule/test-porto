import * as Clipboard from 'expo-clipboard';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from 'react-native';
import { useConnectorClient } from 'wagmi';

interface AccountModalProps {
  visible: boolean;
  onClose: () => void;
  account: string;
}

export function AccountModal({ visible, onClose, account }: AccountModalProps) {
  const { data: client } = useConnectorClient();
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (visible && account && client) {
      fetchBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, account, client]);

  const fetchBalance = async () => {
    if (!client) return;

    try {
      setLoading(true);

      // USDC contract address on Base
      const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

      // Encode balanceOf(address) call
      // Function signature: balanceOf(address) = 0x70a08231
      const paddedAddress = account.slice(2).padStart(64, '0');
      const data = `0x70a08231${paddedAddress}` as `0x${string}`;

      // Call USDC contract using Wagmi client
      const balanceHex = (await client.request({
        method: 'eth_call',
        params: [
          {
            to: USDC_ADDRESS,
            data: data,
          },
          'latest',
        ],
      })) as string;

      // Convert hex to USDC (6 decimals)
      const balanceRaw = BigInt(balanceHex);
      const balanceUsdc = Number(balanceRaw) / 1e6;
      setBalance(balanceUsdc.toFixed(2));
    } catch (err) {
      console.error('Failed to fetch USDC balance:', err);
      setBalance('Error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        className="flex-1 items-center justify-center bg-black/50"
        activeOpacity={1}
        onPress={onClose}>
        <TouchableOpacity
          className="mx-4 w-11/12 max-w-md rounded-2xl bg-white p-6"
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}>
          <View className="mb-4">
            <Text className="mb-1 text-xl font-bold">Account Details</Text>
            <Text className="text-sm text-gray-600">Your Porto Wallet on Base</Text>
          </View>

          <View className="mb-4 rounded-lg bg-gray-100 p-4">
            <Text className="mb-2 text-xs text-gray-600">Address</Text>
            <Text className="mb-3 font-mono text-sm text-gray-900">{account}</Text>

            <TouchableOpacity
              onPress={handleCopy}
              className={`${copied ? 'bg-green-500' : 'bg-blue-500'} items-center rounded-lg p-3`}
              activeOpacity={0.7}>
              <Text className="font-semibold text-white">
                {copied ? '✓ Copied!' : 'Copy Address'}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mb-4 rounded-lg bg-gray-100 p-4">
            <Text className="mb-2 text-xs text-gray-600">USDC Balance (Base)</Text>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text className="text-2xl font-bold text-gray-900">
                {balance ? `$${balance}` : 'Error loading'}
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={onClose}
            className="items-center rounded-lg bg-gray-200 p-4"
            activeOpacity={0.7}>
            <Text className="font-semibold text-gray-700">Close</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
