import HomePresenter from "../../presenters/home-presenter";

export default class HomePage {
	async render() {
		return `
      <section class="min-h-screen px-4 pt-24 md:px-8 py-6 
                      ext-gray-200 font-mono">

        <!-- HEADER -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 class="text-2xl font-bold text-cyan-400 tracking-wide">
              [ STORIES ]
            </h1>
            <p class="text-cyan-400 text-sm">
              jelajahi cerita pengguna lain
            </p>
          </div>

          <a 
            href="#/add-story"
            class="inline-block px-4 py-2 rounded-lg 
                   border border-cyan-400 text-cyan-400
                   hover:bg-cyan-400 hover:text-black
                   transition text-sm font-semibold"
          >
            + EXECUTE NEW
          </a>
        </div>

        <!-- SEARCH -->
        <form id="searchForm" class="mb-6">
          <div class="relative">
            <input 
              id="searchInput"
              type="text" 
              placeholder="search..."
              class="w-full px-4 py-2 pl-10 rounded-xl text-cyan-400
                     bg-black/40 border border-gray-700
                     focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400
                     outline-none transition text-sm"
            />
            <span class="absolute left-3 top-2 text-cyan-400">⌕</span>
          </div>
        </form>

        <!-- LOADING -->
        <div id="loading" class="text-center text-gray-500 mb-6 animate-pulse">
          loading data...
        </div>

        <!-- EMPTY -->
        <div id="empty" class="hidden text-center text-gray-500 mb-6">
          no data found
        </div>

        <!-- STORIES -->
        <div id="stories" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"></div>

      </section>
    `;
	}

	async afterRender() {
		let allStories = stories;
    const searchInput = document.getElementById("searchInput");

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
					const empty = document.getElementById("empty");

					if (stories.length === 0) {
						empty.classList.remove("hidden");
						container.innerHTML = "";
						return;
					} else {
						empty.classList.add("hidden");
					}

					container.innerHTML = stories
						.map(
							(story) => `
              <a href="#/stories/${story.id}" class="block h-full">
                <article class="h-full group rounded-2xl overflow-hidden
                                bg-black/40 border border-cyan-500/20
                                hover:border-cyan-400/40
                                shadow-[0_0_25px_rgba(0,255,255,0.05)]
                                hover:shadow-[0_0_40px_rgba(0,255,255,0.1)]
                                transition duration-300">

                  <!-- IMAGE -->
                  <div class="relative overflow-hidden">
                    <img 
                      src="${story.photoUrl}" 
                      alt="story image"
                      class="w-full h-48 object-cover 
                             opacity-80 group-hover:opacity-100
                             group-hover:scale-105 transition duration-300"
                    />

                    <!-- overlay subtle -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>

                  <!-- CONTENT -->
                  <div class="p-4">

                    <h3 class="font-semibold text-lg text-cyan-300 mb-1 truncate">
                      ${story.name}
                    </h3>

                    <p class="text-sm text-gray-400 line-clamp-3 mb-3">
                      ${story.description}
                    </p>

                    <div class="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        ${new Date(story.createdAt).toLocaleString()}
                      </span>

                      <span class="text-cyan-400 opacity-70 group-hover:opacity-100 transition">
                        view ->
                      </span>
                    </div>

                  </div>

                </article>
              </a>
              `,
						)
						.join("");
				},

				showError: (msg) => {
					document.getElementById("stories").innerHTML = `
            <p class="text-red-500 text-center col-span-full self-center justify-self-center">${msg}</p>
          `;
				},
			},
		});

		await presenter.init();

		// 🔍 SEARCH FEATURE
		// document.getElementById("searchInput").addEventListener("input", (e) => {
		// 	const keyword = e.target.value.toLowerCase().trim();

		// 	if (!keyword) {
		// 		presenter.view.renderStories(allStories);
		// 		return;
		// 	}

		// 	const filtered = allStories.filter(
		// 		(story) =>
		// 			story.description.toLowerCase().includes(keyword) ||
		// 			story.name.toLowerCase().includes(keyword),
		// 	);

    //   presenter.view.renderStories(filtered);
		// });

    searchInput.addEventListener("input", (e) => {
      const keyword = e.target.value.toLowerCase().trim();

      console.log(keyword);
    });
	}
}
