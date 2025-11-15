importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyD4TAlwhhNSoOiguM8TK8SgwfsIVzxTG3M',
  authDomain: 'report-in.firebaseapp.com',
  projectId: 'report-in',
  messagingSenderId: '529512012769',
  appId: '1:529512012769:web:035d6ef6e5de0458d210a0',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notification = payload.notification;

  if (!notification) return;

  const title = notification.title || 'New Report Alert';
  const body = notification.body || '';
  const image = (notification.image || '');
  const clickUrl = payload.data?.click_action || '/';

  const notificationOptions = {
    body: body,
    icon: '/icon.png',
    ...(image ? { image } : {}),
    data: { url: clickUrl },
  };

  self.registration.showNotification(title, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});