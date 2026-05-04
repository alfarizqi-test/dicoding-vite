import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { isLoggedIn, logout } from '../data/api';

function renderNav() {
	const navList = document.getElementById("nav-list");

	if (isLoggedIn()) {
		navList.innerHTML = `
      <li><a href="#/">Beranda</a></li>
      <li><a href="#" id="logoutBtn">Logout</a></li>
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
