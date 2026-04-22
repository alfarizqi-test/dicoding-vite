import { getDetailStory } from "../../data/api";
import { getActivePathname } from "../../routes/url-parser";

export default class DetailPage {
	async render() {
		return `
      <section class="min-h-screen pt-24 text-gray-200 font-mono px-4 py-6">
        <div id="detail" class="max-w-5xl mx-auto">
          <p class="text-gray-500 text-center animate-pulse">loading...</p>
        </div>
      </section>
    `;
	}

	async afterRender() {
		const path = getActivePathname(); // /stories/xxx
		const id = path.split("/")[2];

		try {
			const story = await getDetailStory(id);

			const container = document.getElementById("detail");

			container.innerHTML = `
        <article class="md:flex rounded-2xl overflow-hidden
                        bg-black/40 border border-cyan-500/20
                        shadow-[0_0_30px_rgba(0,255,255,0.05)]">

          <img 
            src="${story.photoUrl}" 
            class="w-full h-auto object-cover md:w-1/2 md:h-auto"
          />

          <div class="flex flex-col justify-between p-5">

            <div>
              <h1 class="text-xl font-bold text-cyan-400 mb-2">
                ${story.name}
              </h1>

              <p class="text-gray-400 mb-4">
                ${story.description}
              </p>

              <div class="text-sm text-gray-500">
                ${new Date(story.createdAt).toLocaleString()}
              </div>

              ${
						  	story.lat && story.lon
						  		? `<div class="mt-4 text-xs text-cyan-400">
                      📍 ${story.lat}, ${story.lon}
                    </div>`
						  		: ""
						  }
            </div>

            <a  href="#/" class="text-cyan-400 opacity-70 group-hover:opacity-100 transition">
              <- back
            </a>

          </div>

        </article>
      `;
		} catch (err) {
			document.getElementById("detail").innerHTML = `
        <p class="text-red-400 text-center">${err.message}</p>
      `;
		}
	}
}