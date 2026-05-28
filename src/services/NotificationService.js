import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// Configure how notifications are displayed when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Request notification permissions and configure Android channel.
 * @returns {Promise<boolean>} true if permissions were granted.
 */
export async function requestPermission() {
  if (!Device.isDevice) {
    console.warn('Las notificaciones push requieren un dispositivo fisico.');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#ffffff',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('El usuario no concedio permisos de notificaciones.');
    return false;
  }

  return true;
}

/**
 * Get the native FCM token using expo-notifications.
 * This returns the raw FCM token (NOT an Expo Push Token).
 * @returns {Promise<string|null>}
 */
export async function getFcmToken() {
  try {
    const devicePushToken = await Notifications.getDevicePushTokenAsync();
    const token = devicePushToken?.data;

    if (!token) {
      return null;
    }

    console.log('FCM token:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

/**
 * Convenience wrapper: request permissions + get FCM token.
 * Used by MatchService during login/register.
 * @returns {Promise<string|null>}
 */
export async function getFcmTokenForLogin() {
  return registerForPushNotificationsAsync();
}

/**
 * Full registration flow: permissions + token.
 * @returns {Promise<string|null>}
 */
export async function registerForPushNotificationsAsync() {
  const hasPermission = await requestPermission();

  if (!hasPermission) {
    return null;
  }

  return getFcmToken();
}

/**
 * Listen for token refreshes via expo-notifications.
 * When the FCM token rotates, the callback fires with the new token.
 * @param {(token: string) => void} onTokenRefresh
 * @returns {() => void} unsubscribe function
 */
export function setupTokenRefreshListener(onTokenRefresh) {
  const subscription = Notifications.addPushTokenListener((tokenData) => {
    const token = tokenData?.data;
    if (token) {
      console.log('FCM token refreshed:', token);
      onTokenRefresh(token);
    }
  });

  return () => subscription.remove();
}

/**
 * Set up notification listeners and check for initial notification.
 *
 * - Foreground: logs received notifications (display is handled by setNotificationHandler above)
 * - Tap response: delegates to onNotificationTap callback for navigation
 * - Initial: handles the case where app was opened from a killed state via notification
 *
 * @param {(data: object) => void} onNotificationTap
 * @returns {Promise<() => void>} cleanup function
 */
export async function initializeNotifications(onNotificationTap) {
  const hasPermission = await requestPermission();

  if (hasPermission) {
    await getFcmToken();
  }

  // Listener: notification received while app is in foreground
  const receivedSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log('Notificacion recibida (foreground):', notification);
    }
  );

  // Listener: user tapped on a notification
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const data = response.notification.request.content.data;
      console.log('Usuario toco la notificacion:', data);
      if (onNotificationTap) {
        onNotificationTap(data);
      }
    }
  );

  // Check if app was opened from a killed state via notification tap
  const lastResponse = await Notifications.getLastNotificationResponseAsync();
  if (lastResponse && onNotificationTap) {
    const data = lastResponse.notification.request.content.data;
    console.log('App abierta desde notificacion (cold start):', data);
    onNotificationTap(data);
  }

  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
}
