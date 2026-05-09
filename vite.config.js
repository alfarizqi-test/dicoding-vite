import { defineConfig } from "vite";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	root: resolve(__dirname, "src"),

	base: "/dicoding-vite/",

	publicDir: resolve(__dirname, "src", "public"),

	build: {
		outDir: resolve(__dirname, "dist"),
		emptyOutDir: true,
	},

	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
		},
	},

	plugins: [
		tailwindcss(),

		VitePWA({
			registerType: "autoUpdate",

			injectRegister: "auto",

			manifest: {
				name: "Story App",
				short_name: "StoryApp",

				description: "Aplikasi Story",

				theme_color: "#06b6d4",
				background_color: "#0f172a",

				display: "standalone",

				start_url: "/dicoding-vite/",

				scope: "/dicoding-vite/",

				icons: [
					{
						src: "/dicoding-vite/favicon.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/dicoding-vite/favicon.png",
						sizes: "512x512",
						type: "image/png",
					},
				],

				screenshots: [
					{
						src: "/dicoding-vite/images/screenshot-mobile.png",
						sizes: "540x720",
						type: "image/png",
					},
					{
						src: "/dicoding-vite/images/screenshot-desktop.png",
						sizes: "1280x720",
						type: "image/png",
						form_factor: "wide",
					},
				],
			},

			workbox: {
				globPatterns: ["**/*.{js,css,html,png,svg,jpg,json}"],

				runtimeCaching: [
					{
						urlPattern: /^https:\/\/story-api\.dicoding\.dev\/v1\//,

						handler: "NetworkFirst",

						options: {
							cacheName: "api-cache",

							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 60 * 60 * 24,
							},

							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
				],
			},
		}),
	],
});
