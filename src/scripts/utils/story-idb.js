import { getDB, OBJECT_STORE_NAME } from "./database";

export async function saveStory(story) {
	const db = await getDB();

	return db.put(OBJECT_STORE_NAME, story);
}

export async function getAllStories() {
	const db = await getDB();

	return db.getAll(OBJECT_STORE_NAME);
}

export async function deleteStory(id) {
	const db = await getDB();

	return db.delete(OBJECT_STORE_NAME, id);
}

export async function getStory(id) {
	const db = await getDB();

	return db.get(OBJECT_STORE_NAME, id);
}