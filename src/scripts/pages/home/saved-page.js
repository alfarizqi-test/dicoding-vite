import { getAllStories, deleteStory } from "../../utils/story-idb";

export default class SavedPage {
	async render() {
		return `
			<section class="p-4 pt-24">

				<h1 class="text-2xl mb-4 font-bold text-cyan-400">
					Saved Stories
				</h1>

				<div id="savedStories" class="space-y-4 mb-4 text-gray-400"></div>

			</section>
		`;
	}

	async afterRender() {
		const stories = await getAllStories();

		const container = document.getElementById("savedStories");

		if (!stories.length) {
			container.innerHTML = `
				<p>
					Belum ada story tersimpan
				</p>
			`;

			return;
		}

		container.innerHTML = stories
			.map(
				(story) => `
				<div class="mb-4 border p-4 rounded">

					<img
						src="${story.photoUrl}"
						class="rounded mb-2"
					/>

					<h2>
						${story.name}
					</h2>

					<button
						class="delete-btn"
						data-id="${story.id}"
					>
						Hapus
					</button>

				</div>
			`,
			)
			.join("");

		document.querySelectorAll(".delete-btn").forEach((button) => {
			button.addEventListener("click", async () => {
				await deleteStory(button.dataset.id);

				location.reload();
			});
		});
	}
}
