import RegisterPresenter from "../../presenters/register-presenter";

export default class RegisterPage {
	async render() {
		return `
      <section class="container mx-auto px-4 py-8 max-w-md">
        <h1 class="text-2xl font-bold mb-6 text-center">Register</h1>

        <form id="registerForm" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium">Nama</label>
            <input 
              id="name"
              type="text"
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

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
            class="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            Register
          </button>
        </form>

        <p id="message" class="text-red-500 mt-4 text-center"></p>

        <p class="text-center mt-4 text-sm">
          Sudah punya akun?
          <a href="#/login" class="text-blue-500 hover:underline">Login</a>
        </p>
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
