import { addStory } from "../data/api";

export default class AddStoryPresenter {
	#view;

	constructor({ view }) {
		this.#view = view;
	}

	async addStory({ description, photo, lat, lon }) {
		try {
			if (!photo) {
				this.#view.showMessage("foto wajib diisi", true);
				return;
			}

			if (!description) {
				this.#view.showMessage("deskripsi wajib diisi", true);
				return;
			}

			if (!lat || !lon) {
				this.#view.showMessage("lokasi wajib diisi", true);
				return;
			}

			this.#view.showMessage("uploading...");

			await addStory({
				description,
				photo,
				lat: lat || undefined,
				lon: lon || undefined,
			});

			this.#view.showMessage("success!");

			setTimeout(() => {
				this.#view.redirect();
			}, 1000);
		} catch (err) {
			this.#view.showMessage(err.message, true);
		}
	}
}