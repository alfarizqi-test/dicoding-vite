import { getStories } from "../data/api";

export default class HomePresenter {
	constructor({ view }) {
		this.view = view;
	}

	async init() {
		try {
			this.view.showLoading();

			const stories = await getStories({ location: 1 });

			this.view.renderStories(stories);
			this.view.hideLoading();
		} catch (err) {
			this.view.showError(err.message);
		}
	}
}