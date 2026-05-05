import { getDetailStory } from "../data/api";

export default class DetailPresenter {
	#view;
	#model;

	constructor({ view }) {
		this.#view = view;
	}

	async loadStoryDetail(id) {
		try {

			const story = await getDetailStory(id);

			if (!story) {
				this.#view.showError("Story not found");
				return;
			}

			this.#view.renderDetail(story);
		} catch (err) {
			this.#view.showError(err.message);
		}
	}
}
