// presenters/notification-presenter.js
import { subscribeNotifications, unsubscribeNotifications } from "../data/api";

export default class NotificationPresenter {
	constructor({ view }) {
		this._view = view;
	}

	async toggleSubscription(isSubscribing) {
		try {
			const registration = await navigator.serviceWorker.ready;

			if (isSubscribing) {
				// Melakukan proses subscribe ke Push Service browser
				const subscription = await registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey:
						"BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk",
				});

				// Mengonversi subscription menjadi JSON untuk mengambil keys
				const subJSON = subscription.toJSON();

				// Menyusun body sesuai dengan schema API yang dibutuhkan
				const body = {
					endpoint: subJSON.endpoint,
					keys: {
						p256dh: subJSON.keys.p256dh,
						auth: subJSON.keys.auth,
					},
				};

				// Mengirim data langganan ke server melalui fungsi di api.js
				await subscribeNotifications(body);
				this._view.updateButtonState(true);
			} else {
				// Mengambil status langganan saat ini
				const subscription = await registration.pushManager.getSubscription();

				if (subscription) {
					// Menghapus data langganan dari server
					await unsubscribeNotifications(subscription.endpoint);
					// Menghentikan langganan pada browser
					await subscription.unsubscribe();
				}

				this._view.updateButtonState(false);
			}
		} catch (err) {
			console.error("Push Notification Error:", err);
			// Opsional: berikan feedback ke user jika gagal (misal lewat alert)
		}
	}
}