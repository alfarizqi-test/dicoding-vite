import L from "leaflet";
import "leaflet/dist/leaflet.css";

let map;
let markers = [];

export function initMap() {
	map = L.map("map").setView([-2.5, 118], 5);

	const street = L.tileLayer(
		"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
	);
	street.addTo(map);

	return map;
}

export function renderMarkers(stories, onClick) {
	// hapus marker lama
	markers.forEach((m) => m.remove());
	markers = [];

	stories.forEach((story) => {
		if (!story.lat || !story.lon) return;

		const marker = L.marker([story.lat, story.lon])
			.addTo(map)
			.bindPopup(`<b>${story.name}</b><br>${story.description}`);

		marker.on("click", () => onClick(story.id));

		markers.push({ id: story.id, marker });
	});
}

export function focusMarker(id) {
	const target = markers.find((m) => m.id === id);
	if (!target) return;

	map.setView(target.marker.getLatLng(), 10);
	target.marker.openPopup();
}
