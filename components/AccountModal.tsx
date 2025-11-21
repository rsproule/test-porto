import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { usePorto } from 'lib/PortoProvider';

interface AccountModalProps {
  visible: boolean;
  onClose: () => void;
  account: string;
}

export function AccountModal({ visible, onClose, account }: AccountModalProps) {
  const porto = usePorto();
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (visible && account) {
      fetchBalance();
    }
  }, [visible, account]);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const balanceHex = await porto.provider.request({
        method: 'eth_getBalance',
        params: [account, 'latest'],
      }) as string;
      
      // Convert hex to ETH
      const balanceWei = BigInt(balanceHex);
      const balanceEth = Number(balanceWei) / 1e18;
      setBalance(balanceEth.toFixed(4));
    } catch (err) {
      console.error('Failed to fetch balance:', err);
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
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        className="flex-1 bg-black/50 justify-center items-center"
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity 
          className="bg-white rounded-2xl p-6 mx-4 w-11/12 max-w-md"
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View className="mb-4">
            <Text className="text-xl font-bold mb-1">Account Details</Text>
            <Text className="text-gray-600 text-sm">Your Porto Wallet</Text>
          </View>

          <View className="bg-gray-100 p-4 rounded-lg mb-4">
            <Text className="text-xs text-gray-600 mb-2">Address</Text>
            <Text className="text-sm font-mono text-gray-900 mb-3">
              {account}
            </Text>
            
            <TouchableOpacity
              onPress={handleCopy}
              className={`${copied ? 'bg-green-500' : 'bg-blue-500'} p-3 rounded-lg items-center`}
              activeOpacity={0.7}
            >
              <Text className="text-white font-semibold">
                {copied ? '✓ Copied!' : '📋 Copy Address'}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="bg-gray-100 p-4 rounded-lg mb-4">
            <Text className="text-xs text-gray-600 mb-2">Balance</Text>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text className="text-2xl font-bold text-gray-900">
                {balance ? `${balance} ETH` : 'Error loading'}
              </Text>
            )}
          </View>

          <View className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
            <Text className="text-sm font-semibold text-blue-900 mb-1">
              💰 Need funds?
            </Text>
            <Text className="text-xs text-blue-800">
              Use a faucet to get test ETH for your wallet
            </Text>
          </View>

          <TouchableOpacity
            onPress={onClose}
            className="bg-gray-200 p-4 rounded-lg items-center"
            activeOpacity={0.7}
          >
            <Text className="text-gray-700 font-semibold">Close</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

