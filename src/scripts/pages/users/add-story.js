import AddStoryPresenter from "../../presenters/add-story-presenter";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default class AddStoryPage {
	async render() {
		return `
    <section class="pt-24 min-h-screen text-gray-200 font-mono px-4 py-8">

      <div class="max-w-xl mx-auto p-6 rounded-2xl
                  bg-black/40 border border-cyan-500/20
                  shadow-[0_0_40px_rgba(0,255,255,0.05)]">

        <h1 class="text-xl text-center font-bold text-cyan-400 mb-6">
          [ ADD STORY ]
        </h1>

        <form id="storyForm" class="space-y-5">

          <!-- PHOTO -->
          <div class="flex flex-col gap-2">

            <label class="text-sm text-gray-400">photo</label>

            <!-- preview -->
            <div id="previewContainer" class="hidden">
              <img id="previewImage"
                class="w-full rounded-lg border border-gray-700"/>
            </div>

            <p id="fileName" class="text-xs text-gray-500 text-center">
              no file selected
            </p>

            <input id="photo" type="file" accept="image/*" class="hidden"/>

            <div class="flex gap-2">

              <!-- Upload -->
              <label for="photo" id="dropZone"
                class="flex-1 cursor-pointer flex flex-col items-center justify-center
                       border border-cyan-500/30 rounded-xl
                       bg-black/40 hover:bg-cyan-400 hover:text-black
                       transition p-4 text-sm text-cyan-400">
                📁 upload
              </label>

              <!-- Camera -->
              <button type="button" id="camera"
                class="flex-1 border border-cyan-500/30 rounded-xl
                       bg-black/40 hover:bg-cyan-400 hover:text-black
                       transition p-4 text-sm text-cyan-400">
                📸 camera
              </button>

            </div>

            <!-- CAMERA UI -->
            <div id="cameraContainer" class="hidden space-y-2">
              <video id="video" autoplay playsinline
                class="w-full rounded-lg border border-gray-700"></video>

              <div class="flex gap-2">
                <button type="button" id="captureBtn"
                  class="flex-1 border border-cyan-400 text-cyan-400 rounded-lg py-2">
                  CAPTURE
                </button>

                <button type="button" id="closeCamera"
                  class="flex-1 border border-red-400 text-red-400 rounded-lg py-2">
                  CLOSE
                </button>
              </div>
            </div>

          </div>

          <!-- DESCRIPTION -->
          <textarea id="description" placeholder="description"
            class="w-full px-3 py-2 rounded-lg bg-black/40 border border-gray-700"></textarea>

          <!-- MAP -->
          <div id="map" class="w-full h-48 rounded-lg border border-gray-700"></div>

          <div class="grid grid-cols-2 gap-2">
            <input id="lat" type="number" step="any" placeholder="lat" class="px-3 py-2 rounded-lg bg-black/40 border border-gray-700 text-sm"/>
            <input id="lon" type="number" step="any" placeholder="lon" class="px-3 py-2 rounded-lg bg-black/40 border border-gray-700 text-sm"/>
          </div>

          <button type="submit"
            class="w-full py-2 rounded-lg
                   border border-cyan-400 text-cyan-400
                   hover:bg-cyan-400 hover:text-black transition">
            EXECUTE
          </button>
          
        </form>

        <div class="mt-6 flex flex-col items-center">
          <p id="message"></p>
        </div>

      </div>
    </section>
    `;
	}

	async afterRender() {
		const inputFile = document.getElementById("photo");
		const dropZone = document.getElementById("dropZone");
		const fileName = document.getElementById("fileName");
		const preview = document.getElementById("previewImage");
		const previewContainer = document.getElementById("previewContainer");

		const cameraBtn = document.getElementById("camera");
		const video = document.getElementById("video");
		const captureBtn = document.getElementById("captureBtn");
		const closeCamera = document.getElementById("closeCamera");
		const cameraContainer = document.getElementById("cameraContainer");

		let stream;

		/* ================= FILE HANDLER ================= */
		function handleFile(file) {
			if (!file) return;

			fileName.classList.remove("text-red-400");
			fileName.classList.add("text-gray-500");

			if (!file.type.startsWith("image/")) {
				fileName.textContent = "[ERROR] invalid file";
				fileName.classList.add("text-red-400");
				return;
			}

			if (file.size > 1024 * 1024) {
				fileName.textContent = "[ERROR] max 1MB";
				fileName.classList.add("text-red-400");
				return;
			}

			fileName.textContent = file.name;
			preview.src = URL.createObjectURL(file);
			previewContainer.classList.remove("hidden");

			const dt = new DataTransfer();
			dt.items.add(file);
			inputFile.files = dt.files;
		}

		/* ================= UPLOAD ================= */
		inputFile.addEventListener("change", () => {
			handleFile(inputFile.files[0]);
		});

		dropZone.addEventListener("dragover", (e) => {
			e.preventDefault();
		});

		dropZone.addEventListener("drop", (e) => {
			e.preventDefault();
			handleFile(e.dataTransfer.files[0]);
		});

		/* ================= CAMERA ================= */
		async function startCamera() {
			stream = await navigator.mediaDevices.getUserMedia({ video: true });
			video.srcObject = stream;
			cameraContainer.classList.remove("hidden");
		}

		function stopCamera() {
			if (stream) {
				stream.getTracks().forEach((t) => t.stop());
			}
			cameraContainer.classList.add("hidden");
		}

		cameraBtn.addEventListener("click", startCamera);
		closeCamera.addEventListener("click", stopCamera);

		captureBtn.addEventListener("click", () => {
			const canvas = document.createElement("canvas");
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;

			const ctx = canvas.getContext("2d");
			ctx.drawImage(video, 0, 0);

			canvas.toBlob((blob) => {
				const file = new File([blob], "camera.jpg", { type: "image/jpeg" });
				handleFile(file);
			});

			stopCamera();
		});

		/* ================= MAP ================= */
		const map = L.map("map").setView([-6.2, 106.8], 5);

		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
			map,
		);

		setTimeout(() => map.invalidateSize(), 200);

		let marker;
		map.on("click", (e) => {
			const { lat, lng } = e.latlng;

			document.getElementById("lat").value = lat;
			document.getElementById("lon").value = lng;

			if (marker) marker.setLatLng(e.latlng);
			else marker = L.marker(e.latlng).addTo(map);
		});

		/* ================= SUBMIT ================= */
		const presenter = new AddStoryPresenter({
			view: {
				showMessage: (msg, err) => {
					const el = document.getElementById("message");
					el.textContent = msg;
					el.className = err ? "text-red-400" : "text-green-400";
				},
				redirect: () => (location.hash = "/"),
			},
		});

		document.getElementById("storyForm").addEventListener("submit", (e) => {
			e.preventDefault();

			const latValue = document.getElementById("lat").value;
			const lonValue = document.getElementById("lon").value;

			presenter.addStory({
				description: document.getElementById("description").value,
				photo: inputFile.files[0],
				lat: latValue !== "" ? parseFloat(latValue) : null,
				lon: lonValue !== "" ? parseFloat(lonValue) : null,
			});
		});
	}
}
