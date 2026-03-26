import LoginPresenter from "../../presenters/login-presenter";

export default class LoginPage {
	async render() {
		return `
      <section class="container mx-auto px-4 py-8 max-w-md">
        <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>

        <form id="loginForm" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium">Email</label>
            <input 
              id="email" 
              type="email" 
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              required 
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium">Password</label>
            <input 
              id="password" 
              type="password" 
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              required 
            />
          </div>

          <button 
            type="submit" 
            class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>

        <p id="message" class="text-red-500 mt-4 text-center"></p>
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
						location.hash = "/home";
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