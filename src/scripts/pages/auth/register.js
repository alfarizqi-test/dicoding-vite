import RegisterPresenter from "../../presenters/register-presenter";

export default class RegisterPage {
	async render() {
		return `
      <section class="min-h-screen flex items-center justify-center 
                text-gray-200 font-mono px-4">

        <div class="w-full max-w-md p-8 rounded-2xl 
                    border border-cyan-500/30
                    bg-[#020617]/80 backdrop-blur
                    shadow-[0_0_40px_rgba(0,255,255,0.08)]">

          <!-- TITLE -->
          <h1 class="text-2xl font-bold text-center text-cyan-400 mb-6 tracking-wide">
            [ REGISTER ]
          </h1>

          <form id="registerForm" class="space-y-5">

            <!-- NAME -->
            <div>
              <label for="name" class="text-sm text-gray-400 block mb-1">
                name
              </label>
              <input 
                id="name"
                type="text"
                placeholder="your name"
                class="w-full px-3 py-2 rounded-lg 
                       bg-black/40 border border-gray-700
                       focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400
                       outline-none transition text-sm"
                required
              />
            </div>

            <!-- EMAIL -->
            <div>
              <label for="email" class="text-sm text-gray-400 block mb-1">
                email
              </label>
              <input 
                id="email"
                type="email"
                placeholder="user@arch.local"
                class="w-full px-3 py-2 rounded-lg 
                       bg-black/40 border border-gray-700
                       focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400
                       outline-none transition text-sm"
                required
              />
            </div>

            <!-- PASSWORD -->
            <div>
              <label for="password" class="text-sm text-gray-400 block mb-1">
                password
              </label>
              <input 
                id="password"
                type="password"
                placeholder="••••••••"
                class="w-full px-3 py-2 rounded-lg 
                       bg-black/40 border border-gray-700
                       focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400
                       outline-none transition text-sm"
                required
              />
            </div>

            <!-- BUTTON -->
            <button 
              type="submit"
              class="w-full py-2 rounded-lg 
                     bg-cyan-500/10 border border-cyan-400 text-cyan-400
                     hover:bg-cyan-400 hover:text-black
                     transition duration-200 font-semibold tracking-wide"
            >
              INITIALIZE ACCOUNT
            </button>

          </form>

          <!-- MESSAGE -->
          <p id="message" class="text-red-400 text-sm text-center mt-4"></p>

          <!-- FOOTER -->
          <p class="text-center mt-6 text-xs text-gray-500">
            already registered?
            <a href="#/login" class="text-cyan-400 hover:underline">
              login
            </a>
          </p>

        </div>
      </section>
    `;
	}

	async afterRender() {
		const presenter =
			new RegisterPresenter({
				view: {
					showError: (msg) => {
						document.getElementById("message").innerText = msg;
					},
					showSuccess: (msg) => {
						document.getElementById("message").innerText = msg;
						document.getElementById("message").classList.remove("text-red-500");
						document.getElementById("message").classList.add("text-green-500");
					},
					redirect: () => {
						location.hash = "/login";
					},
				},
			});

		document.getElementById("registerForm").addEventListener("submit", (e) => {
			e.preventDefault();

			const name = document.getElementById("name").value;
			const email = document.getElementById("email").value;
			const password = document.getElementById("password").value;

			presenter.handleRegister({ name, email, password });
		});
	}
}
