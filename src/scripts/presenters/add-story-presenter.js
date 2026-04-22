import { addStory } from "../data/api";

export default class AddStoryPresenter {
	#view;

	constructor({ view }) {
		this.#view = view;
	}

	async addStory({ description, photo, lat, lon }) {
		try {
			if (!photo) {
				this.#view.showMessage("photo wajib diisi", true);
				return;
			}

			// 🔥 validasi ukuran (ini sering dilupakan)
			if (photo.size > 1024 * 1024) {
				this.#view.showMessage("maks ukuran 1MB", true);
				return;
			}

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