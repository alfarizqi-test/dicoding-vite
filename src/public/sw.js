// public/sw.js
self.addEventListener("push", (event) => {
	const data = event.data ? event.data.json() : {};

	// Mengikuti schema: { title, options: { body, data: { id } } }
	const title = data.title || "Story Baru";
	const options = {
		body: data.options?.body || "Cek story terbaru sekarang!",
		icon: "/favicon.png",
		badge: "/favicon.png",
		data: {
			// Navigasi ke detail menggunakan ID dari data.id
			url: data.options?.data?.id ? `#/stories/${data.options.data.id}` : "#/",
		},
	};

	event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();

	const storyId = event.notification.data.url;

	// URL final langsung
	const targetUrl = `${self.location.origin}/#${storyId}`;

	event.waitUntil(clients.openWindow(targetUrl));
});