import DetailPresenter from "../../presenters/detail-presenter";
import { getActivePathname } from "../../routes/url-parser";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { saveStory } from "../../utils/story-idb";

export default class DetailPage {
	async render() {
		return `
      <main class="min-h-screen pt-24 text-gray-200 font-mono px-4 py-6">
        <div id="detail" class="max-w-5xl mx-auto">
          <p class="text-gray-500 text-center animate-pulse" aria-live="polite">loading...</p>
        </div>
      </main>
    `;
	}

	async afterRender() {
		const path = getActivePathname();
		const id = path.split("/")[2];

		const presenter = new DetailPresenter({
			view: {
				renderDetail: (story) => this._displayDetail(story),
				showError: (msg) => {
					document.getElementById("detail").innerHTML = `
            <p class="text-red-400 text-center" aria-live="assertive">${msg}</p>
          `;
				},
			},
		});

		// Panggil logika melalui presenter
		await presenter.loadStoryDetail(id);
	}

	_displayDetail(story) {
		const container = document.getElementById("detail");

		container.innerHTML = `
      <article class="md:flex rounded-2xl overflow-hidden bg-black/40 border border-cyan-500/20 shadow-[0_0_30px_rgba(0,255,255,0.05)]">
        <img 
          src="${story.photoUrl}" 
          alt="Photo of ${story.name} story"
          style="view-transition-name: story-img-${story.id}"
          class="w-full h-auto object-cover md:w-1/2 md:h-auto"
        />

        <div class="flex flex-col flex-1 justify-between p-5">
          <div class="w-full">
            <h1 class="text-xl font-bold text-cyan-400 mb-2">${story.name}</h1>
            <p class="text-gray-400 mb-4">${story.description}</p>
            <div class="text-sm text-gray-500">
              <time datetime="${story.createdAt}">${new Date(story.createdAt).toLocaleString()}</time>
            </div>

            ${
							story.lat !== null && story.lon !== null
								? `
                <div class="mt-4 text-xs text-cyan-400">📍 ${story.lat}, ${story.lon}</div>
                <div id="map" role="application" aria-label="Location Map" class="w-full h-48 mt-3 rounded-lg border border-gray-700"></div>
              `
								: ""
						}
          </div>

          <div class="flex justify-between">
						<a href="#/" class="text-cyan-400 pt-6 opacity-70 hover:opacity-100 transition inline-block">
          	  <- back
          	</a>
						<button id="saveStoryBtn" class="text-cyan-400 pt-6 opacity-70 hover:opacity-100 transition inline-block">
							Simpan Offline
						</button>
					</div>
        </div>
      </article>
    `;

		if (story.lat !== null && story.lon !== null) {
			this._initMap(story);
		}

		const saveButton = document.getElementById("saveStoryBtn");

		saveButton.addEventListener("click", async () => {
			try {
				await saveStory({
					id: story.id,
					name: story.name,
					description: story.description,
					photoUrl: story.photoUrl,
					createdAt: story.createdAt,
					lat: story.lat,
					lon: story.lon,
				});

				alert("Story berhasil disimpan offline");
			} catch (error) {
				console.error(error);

				alert("Gagal menyimpan story");
			}
		});
	}

	_initMap(story) {
		const osm = L.tileLayer(
			"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
			{
				attribution: "&copy; OpenStreetMap",
			},
		);

		const satellite = L.tileLayer(
			"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
			{
				attribution: "Tiles &copy; Esri",
			},
		);

		const map = L.map("map", {
			center: [story.lat, story.lon],
			zoom: 13,
			layers: [osm],
		});

		const baseMaps = {
			Default: osm,
			Satelit: satellite,
		};

		L.control.layers(baseMaps).addTo(map);

		L.marker([story.lat, story.lon])
			.addTo(map)
			.bindPopup(`<b>${story.name}</b>`)
			.openPopup();

		setTimeout(() => map.invalidateSize(), 200);
	}
}
