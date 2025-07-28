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

  const notificationOptions = {
    body: body,
    icon: '/icon.png',
    ...(image ? { image } : {}),
  };

  self.registration.showNotification(title, notificationOptions);
});