import { login } from "../data/api";

export default class LoginPresenter {
	constructor({ view }) {
		this.view = view;
	}

	async handleLogin({ email, password }) {
		try {
			await login({ email, password });
			this.view.redirect();
		} catch (err) {
			this.view.showError(err.message);
		}
	}
}