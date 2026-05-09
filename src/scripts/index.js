// CSS imports
import "../styles/styles.css";

import App from "./pages/app";

document.addEventListener("DOMContentLoaded", async () => {
	const app = new App({
		content: document.querySelector("#main-content"),
		drawerButton: document.querySelector("#drawer-button"),
		navigationDrawer: document.querySelector("#navigation-drawer"),
	});
	await app.renderPage();

	window.addEventListener("hashchange", async () => {
		await app.renderPage();
	});
});

navigator.serviceWorker.register('./sw.js').then(
  (registration) => {
    console.log('Service worker registration succeeded:', registration);
  },
  (error) => {
    console.error('Service worker registration failed:', error);
  },
);