import { register } from "../data/api";

export default class RegisterPresenter {
  constructor({ view }) {
    this.view = view;
  }

  async handleRegister({ name, email, password }) {
    try {
      // validasi sederhana
      if (password.length < 8) {
        this.view.showError("Password minimal 8 karakter");
        return;
      }

      await register({ name, email, password });

      this.view.showSuccess("Register berhasil, silakan login");

      setTimeout(() => {
        this.view.redirect();
      }, 1500);
    } catch (err) {
      this.view.showError(err.message);
    }
  }
}