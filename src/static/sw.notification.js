this.addEventListener('push', (event) => {
  const data = event.data.json()
  clients.matchAll().then((allClients) => {
    if (allClients.length) {
      const client = allClients[0]
      client.postMessage(data.notifications_count)
    }
  })
  this.registration.showNotification(data.title, {
    icon: '/icon-512.png',
    body: data.text,
    data,
  })
})

this.addEventListener('notificationclick', (event) => {
  event.notification.close()
  if (clients.openWindow && event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url))
  }
})
