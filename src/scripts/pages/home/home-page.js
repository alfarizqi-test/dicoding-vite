import HomePresenter from "../../presenters/home-presenter";

export default class HomePage {
	async render() {
		return `
      <section class="container mx-auto px-4 py-6">
        <h1 class="text-2xl font-bold mb-6">Home</h1>

		<form id="searchForm" class="mb-6">
		  <input 
			type="text" 
			placeholder="Search stories" 
			class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
		  />
		</form>

        <div id="loading" class="text-center text-gray-500 mb-4">
          Loading...
        </div>

        <div id="stories" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"></div>
      </section>
    `;
	}

	async afterRender() {
		const presenter = new HomePresenter({
			view: {
				showLoading: () => {
					document.getElementById("loading").style.display = "block";
				},

				hideLoading: () => {
					document.getElementById("loading").style.display = "none";
				},

				renderStories: (stories) => {
					const container = document.getElementById("stories");

					container.innerHTML = stories
						.map(
							(story) => `
                <article class="bg-white rounded-xl shadow p-4 hover:shadow-md transition">
                  <img 
                    src="${story.photoUrl}" 
                    alt="story image"
                    class="w-full h-40 object-cover rounded-lg mb-3"
                  />

                  <h3 class="font-semibold text-lg">${story.name}</h3>

                  <p class="text-sm text-gray-600 line-clamp-3">
                    ${story.description}
                  </p>
                </article>
              `,
						)
						.join("");
				},

				showError: (msg) => {
					document.getElementById("stories").innerHTML = `
            <p class="text-red-500 text-center">${msg}</p>
          `;
				},
			},
		});

		presenter.init();
	}
}
