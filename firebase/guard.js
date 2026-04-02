import { onUserChange } from "./auth.js";

export function protectPage() {
  onUserChange((user) => {
    if (!user) {
      window.location.href = "./login.html";
    }
  });
}
