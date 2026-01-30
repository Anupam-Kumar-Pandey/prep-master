import { signupUser, loginUser, resetPassword } from "../firebase/auth.js";
import { db } from "../firebase/firebase-init.js";
import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* SIGNUP */
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      studentName: studentName.value,
      studentClass: studentClass.value,
      school: school.value,
      city: city.value,

      parentName: parentName.value,
      parentPhone: parentPhone.value, // Calls
      parentWhatsapp: parentWhatsapp.value, // WhatsApp updates

      email: email.value,
    };

    try {
      const user = await signupUser({
        name: data.studentName,
        email: data.email,
        password: password.value,
      });

      await setDoc(doc(db, "users", user.uid), {
        ...data,
        role: "student",
        plan: "none",
        createdAt: Date.now(),
      });

      alert("Account created successfully");
      window.location.href = "../login.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

/* LOGIN */
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await loginUser(email.value, password.value);
      window.location.href = "../dashboard.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

/* RESET PASSWORD */
const resetBtn = document.getElementById("reset");
if (resetBtn) {
  resetBtn.addEventListener("click", async () => {
    const mail = prompt("Enter your registered email");
    if (mail) {
      await resetPassword(mail);
      alert("Password reset email sent");
    }
  });
}
