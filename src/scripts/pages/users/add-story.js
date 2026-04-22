import AddStoryPresenter from "../../presenters/add-story-presenter";

export default class AddStoryPage {
	async render() {
		return `
      <section class="pt-24 min-h-screen text-gray-200 font-mono px-4 py-8">

        <div class="max-w-xl mx-auto p-6 rounded-2xl
                    bg-black/40 border border-cyan-500/20
                    shadow-[0_0_40px_rgba(0,255,255,0.05)]">

          <h1 class="text-xl font-bold text-cyan-400 mb-6">
            [ ADD STORY ]
          </h1>

          <form id="storyForm" class="space-y-5">

            <!-- PHOTO -->
            <div class="flex flex-col gap-2">

              <!-- hidden input -->
              <input id="photo" type="file" accept="image/*" class="hidden" />

              <!-- custom button -->
              <label for="photo" id="dropZone"
                class="cursor-pointer flex flex-col items-center justify-center
                       border border-cyan-500/30 rounded-xl
                       bg-black/40 hover:bg-cyan-400 hover:text-black
                       transition p-4 text-sm text-cyan-400">

                <span id="upText">📁 click or drop photo</span>
                <span class="text-xs text-gray-500 mt-1">
                  max size: 1mb
                </span>
              </label>

              <!-- file name -->
              <p id="fileName" class="text-xs text-gray-500 text-center">
                no file selected
              </p>

              <!-- preview -->
              <div id="previewContainer" class="hidden mt-2">
                <img id="previewImage"
                  class="w-full h-auto object-cover rounded-lg border border-gray-700"/>
              </div>

            </div>

            <!-- DESCRIPTION -->
            <div>
              <label class="text-sm text-gray-400">description</label>
              <textarea id="description"
                class="w-full mt-1 px-3 py-2 rounded-lg
                       bg-black/40 border border-gray-700
                       focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400
                       outline-none text-sm"
                rows="4"
                required></textarea>
            </div>

            <!-- LAT LON -->
            <div class="grid grid-cols-2 gap-3">
              <input id="lat" type="number" step="any" placeholder="latitude" value="0"
                class="px-3 py-2 rounded-lg bg-black/40 border border-gray-700 text-sm"/>

              <input id="lon" type="number" step="any" placeholder="longitude" value="0"
                class="px-3 py-2 rounded-lg bg-black/40 border border-gray-700 text-sm"/>
            </div>

            <!-- BUTTON -->
            <button type="submit"
              class="w-full py-2 rounded-lg
                     border border-cyan-400 text-cyan-400
                     hover:bg-cyan-400 hover:text-black transition">
              EXECUTE
            </button>

          </form>

          <p id="message" class="text-sm text-center mt-4"></p>

        </div>

      </section>
    `;
	}

	async afterRender() {
    const dropZone = document.getElementById("dropZone");
    const inputFile = document.getElementById("photo");
    const fileName = document.getElementById("fileName");
    const previewContainer = document.getElementById("previewContainer");
    const previewImage = document.getElementById("previewImage");
    const upText = document.getElementById("upText");

    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.classList.remove("text-cyan-400", "hover:text-black");
      dropZone.classList.add("bg-cyan-400", "text-black");
      upText.textContent = "drop image here";
    });

    dropZone.addEventListener("dragleave", () => {
			dropZone.classList.remove("bg-cyan-400", "text-black");
      dropZone.classList.add("text-cyan-400", "hover:text-black");
      upText.textContent = "📁 click or drop photo";
    });

    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      inputFile.files = e.dataTransfer.files;
      inputFile.dispatchEvent(new Event("change"));
      dropZone.classList.remove("bg-cyan-400");
    });

    inputFile.addEventListener("change", () => {
      const file = inputFile.files[0];

      if (!file.type.startsWith("image/")) {
        fileName.textContent = "[ERROR] invalid file type";
        upText.textContent = "📁 click or drop photo";
        dropZone.classList.add("text-cyan-400", "hover:text-black");
        fileName.classList.remove("text-gray-500");
				fileName.classList.add("text-red-400");
        return;
      }

      if (file.size > 1000000) {
        fileName.textContent = "[ERROR] file exceeds 1MB limit";
        dropZone.classList.add("text-cyan-400", "hover:text-black");
        fileName.classList.remove("text-gray-500");
				fileName.classList.add("text-red-400");
        return;
      }

      if (file) {
        fileName.textContent = file.name;
        upText.textContent = "Change file";
        dropZone.classList.add("text-cyan-400", "hover:text-black");
        previewContainer.classList.remove("hidden");
        fileName.classList.remove("text-red-400");
				fileName.classList.add("text-gray-500");
        previewImage.src = URL.createObjectURL(file);
      } else {
        upText.textContent = "📁 click to upload";
        fileName.textContent = "no file selected";
        previewContainer.classList.add("hidden");
      }
    });

		const presenter = new AddStoryPresenter({
			view: {
				showMessage: (msg, isError = false) => {
					const el = document.getElementById("message");
					el.textContent = msg;
					el.className = isError
						? "text-red-400 mt-4 text-center"
						: "text-green-400 mt-4 text-center";
				},
				redirect: () => {
					location.hash = "/";
				},
			},
		});

		document.getElementById("storyForm").addEventListener("submit", (e) => {
			e.preventDefault();

			const description = document.getElementById("description").value;
			const photo = document.getElementById("photo").files[0];
			const lat = document.getElementById("lat").value;
			const lon = document.getElementById("lon").value;

			presenter.addStory({ description, photo, lat, lon });
		});
	}
}