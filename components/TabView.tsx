import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface Tab {
  id: string;
  label: string;
  component: React.ReactNode;
}

interface TabViewProps {
  tabs: Tab[];
}

export function TabView({ tabs }: TabViewProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <View className="flex-1">
      {/* Tab Bar */}
      <View className="flex-row border-b border-gray-200 bg-white">
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            className={`flex-1 items-center border-b-2 px-4 py-3 ${
              activeTab === tab.id
                ? 'border-blue-500'
                : 'border-transparent'
            }`}
            activeOpacity={0.7}>
            <Text
              className={`text-sm font-semibold ${
                activeTab === tab.id
                  ? 'text-blue-500'
                  : 'text-gray-600'
              }`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView className="flex-1">
        {activeTabContent}
      </ScrollView>
    </View>
  );
}

