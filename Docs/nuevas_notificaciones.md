# Guia: Notificaciones de la App de Citas - React Native Expo

Este documento describe los tipos de notificaciones push que el backend envia y como manejarlos en la app React Native Expo.

## Tipos de Notificaciones

El backend envia los siguientes tipos de notificaciones push:

| Tipo | Evento | Datos en payload |
|------|--------|------------------|
| `like_received` | Alguien te dio like | `swiper_id` |
| `superlike_received` | Alguien te hizo superlike | `swiper_id` |
| `match_created` | Se confirmo un match mutuo | `match_user_id` |
| `message_received` | Recibiste un mensaje | `match_pair_id`, `sender_id` |
| `photo_rejected` | Tu foto fue rechazada por moderacion | `photo_id`, `reason` |
| `test_notification` | Prueba de notificaciones | - |

## Payload de las Notificaciones

Cada notificacion push incluye un payload `data` con informacion extra:

```json
{
  "notification": {
    "title": "Nuevo Like!",
    "body": "Alguien te dio like. Si tambien te gusta, sera match!"
  },
  "data": {
    "type": "like_received",
    "swiper_id": "123"
  }
}
```

## Configuracion del Listener

En tu archivo principal de la app (App.tsx o similar), configura los listeners:

```tsx
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  useEffect(() => {
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notificacion recibida:', notification);
        const { type, ...data } = notification.request.content.data;
        console.log('Tipo:', type, 'Datos:', data);
      }
    );

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Usuario toco notificacion:', response);
        const data = response.notification.request.content.data;
        
        if (data && typeof data === 'object' && 'type' in data) {
          handleNotificationTap(data as NotificationPayload);
        }
      }
    );

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return { /* tu app */ };
}
```

## Tipos para TypeScript

```typescript
interface NotificationPayload {
  type: 'like_received' | 'superlike_received' | 'match_created' | 'message_received' | 'photo_rejected' | 'test_notification';
  swiper_id?: string;
  match_user_id?: string;
  match_pair_id?: string;
  sender_id?: string;
  photo_id?: string;
  reason?: string;
}
```

## Navegacion segun el Tipo de Notificacion

```typescript
import { router } from 'expo-router';

function handleNotificationTap(data: NotificationPayload) {
  switch (data.type) {
    case 'like_received':
    case 'superlike_received':
      router.push('/(app)/activity');
      break;
      
    case 'match_created':
      if (data.match_user_id) {
        router.push({
          pathname: '/(app)/matches/[id]',
          params: { id: data.match_user_id }
        });
      }
      break;
      
    case 'message_received':
      if (data.match_pair_id) {
        router.push({
          pathname: '/(app)/chat/[pairId]',
          params: { pairId: data.match_pair_id }
        });
      }
      break;
      
    case 'photo_rejected':
      router.push('/(app)/profile/edit/photos');
      break;
      
    default:
      router.push('/(app)/matches');
  }
}
```

## Manejo de Notificaciones en Segundo Plano

```typescript
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND_NOTIFICATION_TASK';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error }) => {
  if (error) {
    console.error('Error en notificacion en segundo plano:', error);
    return;
  }
  
  if (data) {
    const notificationData = data as { type?: string; [key: string]: any };
    console.log('Notificacion en segundo plano:', notificationData);
  }
});

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
```

## Pruebas

### Prueba de notificacion general

```bash
curl -X GET "https://tu-dominio.com/match-api/notifications/test-push?title=Test&body=Mensaje%20de%20prueba" \
  -H "Authorization: Bearer {MATCH_USER_TOKEN}" \
  -H "Accept: application/json"
```

### Simular un like

1. Usuario A likea a Usuario B
2. Verificar que B recibe la notificacion tipo `like_received`
3. Usuario B likea a Usuario A
4. Verificar que A recibe `match_created` y B recibe `match_created`

## Checklist de Implementacion

- [ ] Instalar `expo-notifications` y `expo-device`
- [ ] Configurar Firebase en Android (`google-services.json`)
- [ ] Implementar `addNotificationReceivedListener`
- [ ] Implementar `addNotificationResponseReceivedListener`
- [ ] Crear funcion `handleNotificationTap`
- [ ] Definir rutas de navegacion segun tipo
- [ ] Probar con la ruta de test