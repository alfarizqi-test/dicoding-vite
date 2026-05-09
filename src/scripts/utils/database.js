import { openDB } from "idb";

const DATABASE_NAME = "story-app-db";
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = "saved-stories";

export async function getDB() {
	return openDB(DATABASE_NAME, DATABASE_VERSION, {
		upgrade(database) {
			if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
				const store = database.createObjectStore(OBJECT_STORE_NAME, {
					keyPath: "id",
				});

				store.createIndex("name", "name");
				store.createIndex("createdAt", "createdAt");
			}
		},
	});
}

export { OBJECT_STORE_NAME };