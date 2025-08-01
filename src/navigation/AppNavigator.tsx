import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen } from '../screens/HomeScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { RewardsScreen } from '../screens/RewardsScreen';
import { WorldAppScreen } from '../screens/WorldAppScreen';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#1e1e1e',
            borderTopColor: '#333333',
            borderTopWidth: 1,
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          tabBarActiveTintColor: '#667eea',
          tabBarInactiveTintColor: '#B0B0B0',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Inicio',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ color, fontSize: size }}>🏠</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Transactions"
          component={TransactionsScreen}
          options={{
            tabBarLabel: 'Transacciones',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ color, fontSize: size }}>📋</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Rewards"
          component={RewardsScreen}
          options={{
            tabBarLabel: 'Recompensas',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ color, fontSize: size }}>🎁</Text>
            ),
          }}
        />
        <Tab.Screen
          name="WorldApp"
          component={WorldAppScreen}
          options={{
            tabBarLabel: 'World App',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ color, fontSize: size }}>🔗</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}; 