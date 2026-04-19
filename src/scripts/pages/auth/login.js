import LoginPresenter from "../../presenters/login-presenter";

export default class LoginPage {
	async render() {
		return `
      <section class="min-h-screen flex items-center justify-center text-gray-200 font-mono">

        <div class="w-full max-w-md p-8 rounded-2xl border border-cyan-500/30 
                    bg-[#020617]/80 backdrop-blur shadow-[0_0_40px_rgba(0,255,255,0.08)]">
        
          <h1 class="text-2xl font-bold text-center text-cyan-400 mb-6 tracking-wide">
            [ LOGIN ]
          </h1>
        
          <form id="loginForm" class="space-y-5">
        
            <!-- EMAIL -->
            <div>
              <label for="email" class="text-sm text-gray-400 block mb-1">
                email
              </label>
              <input 
                id="email" 
                type="email"
                placeholder="example@email.com"
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
              EXECUTE
            </button>
        
          </form>
        
          <!-- MESSAGE -->
          <p id="message" class="text-red-400 text-sm text-center mt-4"></p>
        
          <!-- FOOTER -->
          <p class="text-center text-xs text-gray-600 mt-6">
            powered by arch btw
          </p>
        
        </div>
      </section>
    `;
	}

	async afterRender() {
		const presenter = new LoginPresenter(
			{
				view: {
					showError: (msg) => {
						document.getElementById("message").innerText = msg;
					},
					redirect: () => {
						location.hash = "#/";
					},
				},
			},
		);

		document.getElementById("loginForm").addEventListener("submit", (e) => {
			e.preventDefault();

			const email = document.getElementById("email").value;
			const password = document.getElementById("password").value;

			presenter.handleLogin({ email, password });
		});
	}
}