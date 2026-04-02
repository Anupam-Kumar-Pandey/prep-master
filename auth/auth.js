import { signupUser, loginUser, resetPassword } from "../firebase/auth.js";
import { db } from "../firebase/firebase-init.js";
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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
      password: password.value,
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
        planExpiry: null,
        createdAt: serverTimestamp(),
      });

      // 🔄 Event-based Google Sheets sync (non-blocking)
      // fetch(
      //   "https://script.google.com/macros/s/AKfycbxeOys91U2GaNA_m0V7RYVLrdJKoCmxF-YyEbkeny1Gizxd1-Nn2NlaUXNimy3Bly4m/exec",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       uid: user.uid,
      //       createdAt: new Date().toLocaleString(),
      //       studentName: data.studentName,
      //       studentClass: data.studentClass,
      //       parentName: data.parentName,
      //       parentPhone: data.parentPhone,
      //       parentWhatsapp: data.parentWhatsapp,
      //       email: data.email,
      //       school: data.school,
      //       city: data.city,
      //       plan: "none",
      //       planExpiry: "",
      //       status: "Inactive",
      //     }),
      //   },
      // ).catch((err) => {
      //   console.error("Sheets sync failed:", err);
      // });

      fetch(
        "https://script.google.com/macros/s/AKfycbw3pfJrEhrpsedz2-wiy5AZOQs4qW5TORkZjSkNbacX9m9o_shrzfewIAG3ITjvoNuk/exec",
        {
          method: "POST",
          mode: "no-cors", // 🔥 THIS IS THE FIX
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.uid,
            createdAt: new Date().toLocaleString(),
            studentName: data.studentName,
            studentClass: data.studentClass,
            parentName: data.parentName,
            parentPhone: data.parentPhone,
            parentWhatsapp: data.parentWhatsapp,
            email: data.email,
            school: data.school,
            city: data.city,
            plan: "none",
            planExpiry: "",
            status: "Inactive",
          }),
        },
      ).catch(() => {
        // silently ignore – signup must never fail
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
