import CONFIG from "../config";

const ENDPOINTS = {
	REGISTER: `${CONFIG.BASE_URL}/register`,
	LOGIN: `${CONFIG.BASE_URL}/login`,
	ADD_STORY: `${CONFIG.BASE_URL}/stories`,
	ADD_STORY_GUEST: `${CONFIG.BASE_URL}/stories/guest`,
	GET_STORIES: `${CONFIG.BASE_URL}/stories`,
	DETAIL_STORY: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
};

function getToken() {
	return localStorage.getItem("token");
}

function createHeaders({ isJson = false } = {}) {
	const headers = {};

	if (isJson) {
		headers["Content-Type"] = "application/json";
	}

	const token = getToken();
	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	return headers;
}

async function fetchJSON(url, options = {}) {
	const response = await fetch(url, options);
	const result = await response.json();

	if (!response.ok || result.error) {
		throw new Error(result.message || "Terjadi kesalahan");
	}

	return result;
}

export async function register({ name, email, password }) {
	return fetchJSON(ENDPOINTS.REGISTER, {
		method: "POST",
		headers: createHeaders({ isJson: true }),
		body: JSON.stringify({ name, email, password }),
	});
}

export async function login({ email, password }) {
	const result = await fetchJSON(ENDPOINTS.LOGIN, {
		method: "POST",
		headers: createHeaders({ isJson: true }),
		body: JSON.stringify({ email, password }),
	});

	localStorage.setItem("token", result.loginResult.token);

	return result.loginResult;
}

export function logout() {
	localStorage.removeItem("token");
}

export function isLoggedIn() {
	return !!getToken();
}

export async function getStories({ page = 1, size = 10, location = 0 } = {}) {
	const url = `${ENDPOINTS.GET_STORIES}?page=${page}&size=${size}&location=${location}`;

	const result = await fetchJSON(url, {
		headers: createHeaders(),
	});

	return result.listStory;
}

export async function getDetailStory(id) {
	const result = await fetchJSON(ENDPOINTS.DETAIL_STORY(id), {
		headers: createHeaders(),
	});

	return result.story;
}

export async function addStory({ description, photo, lat, lon }) {
	const formData = new FormData();
	formData.append("description", description);
	formData.append("photo", photo);

	if (lat) formData.append("lat", lat);
	if (lon) formData.append("lon", lon);

	return fetchJSON(ENDPOINTS.ADD_STORY, {
		method: "POST",
		headers: createHeaders(), // ❗ jangan set Content-Type
		body: formData,
	});
}

export async function addStoryGuest({ description, photo, lat, lon }) {
	const formData = new FormData();
	formData.append("description", description);
	formData.append("photo", photo);

	if (lat) formData.append("lat", lat);
	if (lon) formData.append("lon", lon);

	return fetchJSON(ENDPOINTS.ADD_STORY_GUEST, {
		method: "POST",
		body: formData,
	});
}
