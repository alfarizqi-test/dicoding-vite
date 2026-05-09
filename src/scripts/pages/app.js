import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { isLoggedIn, logout } from '../data/api';
import NotificationPresenter from "../presenters/notification-presenter";

function renderNav() {
	const navList = document.getElementById("nav-list");

	if (isLoggedIn()) {
		navList.innerHTML = `
      <li><a href="#/">Beranda</a></li>
			<li><a href="#/saved">Simpanan</a></li>
      <li><a href="#" id="logoutBtn">Logout</a></li>
			<button id="pushToggle" class="px-4 py-2 rounded-lg border border-cyan-400 text-cyan-400 text-xs hover:bg-cyan-400 hover:text-black transition">
  			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=""><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden text-red-400 hover:text-black transition"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M22 8c0-2.3-.8-4.3-2-6"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/><path d="M4 2C2.8 3.7 2 5.7 2 8"/></svg>
			</button>
    `;
	} else {
		navList.innerHTML = `
      <li><a href="#/login">Login</a></li>
      <li><a href="#/register">Register</a></li>
    `;
	}
}

function setupLogout() {
	const btn = document.getElementById("logoutBtn");

	if (btn) {
		btn.addEventListener("click", (e) => {
			e.preventDefault();
			logout();
			location.hash = "/login";
			renderNav();
		});
	}
}

class App {
	#content = null;
	#drawerButton = null;
	#navigationDrawer = null;

	constructor({ navigationDrawer, drawerButton, content }) {
		this.#content = content;
		this.#drawerButton = drawerButton;
		this.#navigationDrawer = navigationDrawer;

		this.#setupDrawer();
	}

	#setupDrawer() {
		this.#drawerButton.addEventListener("click", () => {
			this.#navigationDrawer.classList.toggle("open");
		});

		document.body.addEventListener("click", (event) => {
			if (
				!this.#navigationDrawer.contains(event.target) &&
				!this.#drawerButton.contains(event.target)
			) {
				this.#navigationDrawer.classList.remove("open");
			}

			this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
				if (link.contains(event.target)) {
					this.#navigationDrawer.classList.remove("open");
				}
			});
		});
	}

	async renderPage() {
		const url = getActiveRoute();
		let page = routes[url];

		const protectedRoutes = ["/", "/add-story", "/stories/:id"];

		const isProtected = protectedRoutes.includes(url);

		if (isProtected && !isLoggedIn()) {
			location.hash = "/login";
			return;
		}

		if (isLoggedIn() && (url === "/login" || url === "/register")) {
			location.hash = "/";
			return;
		}

		renderNav();

		function setupPushNotification() {
			const pushToggle = document.getElementById("pushToggle");
			if (!pushToggle) return;

			const icons = pushToggle.querySelectorAll("svg");

			const presenter = new NotificationPresenter({
				view: {
					updateButtonState: (isSubscribed) => {
						pushToggle.classList.toggle("bg-cyan-400", isSubscribed);

						icons[0].classList.toggle("hidden", isSubscribed);
						icons[1].classList.toggle("hidden", !isSubscribed);
					},
				},
			});

			navigator.serviceWorker.ready.then(async (registration) => {
				const subscription = await registration.pushManager.getSubscription();
				const isSubscribed = !!subscription;

				if (isSubscribed) {
					pushToggle.classList.add("bg-cyan-400", "text-black");
					icons[0].classList.add("hidden");
					icons[1].classList.remove("hidden");
				}
			});

			pushToggle.addEventListener("click", async () => {
				const isSubscribed = pushToggle.classList.contains("bg-cyan-400");
				await presenter.toggleSubscription(!isSubscribed);
			});
		}

		setupPushNotification();
		setupLogout();

		if (!document.startViewTransition) {
			this.#content.innerHTML = await page.render();
			await page.afterRender();
			return;
		}

		await document.startViewTransition(async () => {
			this.#content.innerHTML = await page.render();
			await page.afterRender();
		});
	}
}

export default App;
