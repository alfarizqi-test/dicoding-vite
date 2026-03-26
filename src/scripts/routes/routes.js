import HomePage from "../pages/home/home-page";
import LoginPage from '../pages/auth/login';
import RegisterPage from "../pages/auth/register";
// import AboutPage from '../pages/about/about-page';

const routes = {
  '/register': new RegisterPage(),
  '/login': new LoginPage(),
	'/': new HomePage(),
};

export async function router() {
	const page = routes[url];

	if (!page) {
		console.error("Route tidak ditemukan:", url);
		return;
	}

	const content = await page.render();
	app.innerHTML = content;

	await page.afterRender();
}

export default routes;