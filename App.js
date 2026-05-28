import React, { useEffect } from 'react';
import AppNavigator, { navigationRef } from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/theme/ThemeContext';
import { initializeNotifications, setupTokenRefreshListener } from './src/services/NotificationService';
import MatchService from './src/services/MatchService';
import './src/i18n';

function handleNotificationTap(data, attempts = 0) {
  if (!data) return;

  if (!navigationRef.current) {
    if (attempts < 20) {
      setTimeout(() => handleNotificationTap(data, attempts + 1), 250);
    }
    return;
  }

  const { type, match_user_id, match_pair_id } = data;

  switch (type) {
    case 'like_received':
    case 'superlike_received':
      navigationRef.current.navigate('Matches');
      break;

    case 'match_created':
      if (match_user_id) {
        navigationRef.current.navigate('MatchDetail', { matchId: match_user_id });
      } else {
        navigationRef.current.navigate('Matches');
      }
      break;

    case 'message_received':
      navigationRef.current.navigate('Matches');
      break;

    case 'photo_rejected':
      navigationRef.current.navigate('EditProfile');
      break;

    case 'test_notification':
    default:
      navigationRef.current.navigate('Notifications');
      break;
  }
}

export default function App() {
  useEffect(() => {
    let cleanupNotifications;

    initializeNotifications(handleNotificationTap).then((cleanup) => {
      cleanupNotifications = cleanup;
    });

    const unsubscribeTokenRefresh = setupTokenRefreshListener((token) => {
      MatchService.syncPushToken(token);
    });

    return () => {
      if (cleanupNotifications) {
        cleanupNotifications();
      }
      unsubscribeTokenRefresh();
    };
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
