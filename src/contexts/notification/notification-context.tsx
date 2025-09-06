/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from 'react';
import { messaging } from '@/config/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { useCreateNotificationMutation } from '@/api/services/notification';
import { useSelector } from 'react-redux';
import { selectPerson } from '@/store/person/selector';

type NotificationContextType = {
  fcmToken: string | null;
};

const NotificationContext = createContext<NotificationContextType>({
  fcmToken: null,
});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const notification = useCreateNotificationMutation();
  const person = useSelector(selectPerson);

  useEffect(() => {
    const requestPermissionAndToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const token = await getToken(messaging, {
            vapidKey: 'BOgH5zxkSj2Fjq4Z6sNAWw4WDGZTbTbp305jJ6LdxuNEX3uNpGOLT0GJ4l0QwG6tBlByvgWl9_romEfcwe0PT6c',
          });

          if (token && person) {
            setFcmToken(token);
            notification.mutate({ personId: person.id, token });
          }

        } else {
          console.warn('Notification permission not granted');
        }
      } catch (err) {
        console.error('Error getting FCM token:', err);
      }
    };

    requestPermissionAndToken();

    onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);

      const notification = payload.notification;
      if (!notification) return;

      const title = notification.title ?? 'New Report Alert';
      const body = notification.body ?? '';
      const image = (notification as any).image;

      new Notification(title, {
        body,
        icon: '/logo.png',
        ...(image ? { image } : {}),
      });
    });
  }, [person]);

  return (
    <NotificationContext.Provider value={{ fcmToken }}>
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => useContext(NotificationContext);
