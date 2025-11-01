// public/sw.js
self.addEventListener('push', function(event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon || '/favicon.ico', // Fallback icon
    badge: data.badge || '/favicon.ico', // Badge icon for mobile
    image: data.image,
    data: {
      url: data.data?.url || '/', // URL to open on click
      ...data.data,
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // Close the notification

  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    clients.openWindow(urlToOpen) // Open the URL when notification is clicked
  );
});