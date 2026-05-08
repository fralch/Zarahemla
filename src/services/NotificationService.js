import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import messaging from '@react-native-firebase/messaging';
import apiService from './ApiService';

export async function requestPermission() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return true;
}

export async function getFcmToken() {
  try {
    const token = await messaging().getToken();
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

export async function saveFcmTokenToBackend(token) {
  try {
    await apiService.post('/match/fcm-token', { fcm_token: token });
    console.log('FCM token saved successfully');
  } catch (error) {
    console.error('Error saving FCM token:', error);
  }
}

export function onMessageReceived(message) {
  console.log('Notification received:', message);
}

export function setupNotificationListeners(onNotificationTap) {
  const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
    onMessageReceived(remoteMessage);
  });

  const unsubscribeNotificationResponse = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;
    if (onNotificationTap) {
      onNotificationTap(data);
    }
  });

  return () => {
    unsubscribeForeground();
    unsubscribeNotificationResponse();
  };
}

export async function initializeNotifications(onNotificationTap) {
  const hasPermission = await requestPermission();
  
  if (hasPermission) {
    const token = await getFcmToken();
    if (token) {
      await saveFcmTokenToBackend(token);
    }
  }

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Background message:', remoteMessage);
  });

  const cleanup = setupNotificationListeners(onNotificationTap);
  return cleanup;
}