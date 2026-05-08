import React, { useEffect, useRef } from 'react';
import AppNavigator, { navigationRef } from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/theme/ThemeContext';
import { initializeNotifications } from './src/services/NotificationService';
import './src/i18n';

function handleNotificationTap(data) {
  if (!navigationRef.current) return;
  
  if (data?.type === 'match') {
    navigationRef.current.navigate('Matches');
  } else if (data?.type === 'message') {
    navigationRef.current.navigate('Matches');
  } else if (data?.type === 'photo_rejected') {
    navigationRef.current.navigate('Profile');
  }
}

export default function App() {
  useEffect(() => {
    initializeNotifications(handleNotificationTap);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
