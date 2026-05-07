import React, { useState, useEffect, useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import UserListScreen from '../screens/UserListScreen';
import PhotoModerationScreen from '../screens/PhotoModerationScreen';
import SettingsScreen from '../screens/SettingsScreen';

import adminApiService from '../services/AdminApiService';

const COLORS = {
  primary: '#FF4458',
  primaryLight: '#FF6B7A',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AdminTabs({ onLogout }: { onLogout: () => void }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Users') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Moderation') {
            iconName = focused ? 'images' : 'images-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: COLORS.surface,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        headerShadowVisible: false,
      })}
    >
      <Tab.Screen name="Dashboard">
        {() => <DashboardScreen api={adminApiService} />}
      </Tab.Screen>
      <Tab.Screen name="Users">
        {() => <UserListScreen api={adminApiService} />}
      </Tab.Screen>
      <Tab.Screen name="Moderation">
        {() => <PhotoModerationScreen api={adminApiService} />}
      </Tab.Screen>
      <Tab.Screen name="Settings">
        {() => <SettingsScreen api={adminApiService} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await adminApiService.init();
      if (adminApiService.getToken()) {
        setIsAuthenticated(true);
      }
      setInitialized(true);
    };
    init();
  }, []);

  const handleLogin = useCallback(async () => {
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(async () => {
    await adminApiService.logout();
    setIsAuthenticated(false);
  }, []);

  if (!initialized) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="AdminRoot">
            {() => <AdminTabs onLogout={handleLogout} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Login">
            {() => <LoginScreen api={adminApiService} onLogin={handleLogin} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}