// ==============================
// Mobile Menu (Hamburger + X)
// ==============================
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");

// Force closed state on load (fix auto-open bug)
if (mobileMenu) mobileMenu.classList.remove("open");
if (burger) burger.classList.remove("open");

function toggleMobileMenu() {
  mobileMenu.classList.toggle("open");
  burger.classList.toggle("open");
}

if (burger && mobileMenu) {
  burger.addEventListener("click", () => {
    toggleMobileMenu();
  });
}

// Close menu when clicking a mobile link
document.querySelectorAll(".mobile__link").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    burger.classList.remove("open");
  });
});

// ==============================
// FAQ accordion
// ==============================
document.querySelectorAll(".faqItem").forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("open");
  });
});

// ==============================
// Footer year
// ==============================
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ==============================
// UPI Payment Deep Links
// ==============================
const payMonthlyBtn = document.getElementById("payMonthlyBtn");
const payYearlyBtn = document.getElementById("payYearlyBtn");

const UPI_ID = "anupamkp123@okhdfcbank";
const PAYEE_NAME = "PrepMaster Youth Test Series";

function makeUpiLink(upiId, amount) {
  const params = new URLSearchParams({
    pa: upiId,
    pn: PAYEE_NAME,
    am: String(amount),
    cu: "INR",
  });
  return `upi://pay?${params.toString()}`;
}

function openUpiPayment(amount) {
  const upiLink = makeUpiLink(UPI_ID, amount);
  window.location.href = upiLink;
}

if (payMonthlyBtn) {
  payMonthlyBtn.addEventListener("click", () => {
    openUpiPayment(250);
  });
}

if (payYearlyBtn) {
  payYearlyBtn.addEventListener("click", () => {
    openUpiPayment(2400);
  });
}

/* ===============================
   AUTH BASED NAVBAR
================================ */

import { onUserChange, logoutUser } from "./firebase/auth.js";

const navAuth = document.getElementById("navAuth");
const mobileAuth = document.getElementById("mobileAuth");

function renderLoggedOut() {
  if (navAuth) {
    navAuth.innerHTML = `
      <a class="btn btn--ghost" href="./auth/auth.html">Login</a>
      <a class="btn btn--primary btnGlow" href="./auth/auth.html">Sign Up</a>
    `;
  }

  if (mobileAuth) {
    mobileAuth.innerHTML = `
      <a class="btn btn--ghost w-full" href="./auth/auth.html">Login</a>
      <a class="btn btn--primary w-full btnGlow" href="./auth/auth.html">Sign Up</a>
    `;
  }
}

function renderLoggedIn(user) {
  if (navAuth) {
    navAuth.innerHTML = `
      <a class="btn btn--ghost" href="./dashboard.html">Dashboard</a>
      <button class="btn btn--primary btnGlow" id="logoutBtn">Logout</button>
    `;
  }

  if (mobileAuth) {
    mobileAuth.innerHTML = `
      <a class="btn btn--ghost w-full" href="./dashboard.html">Dashboard</a>
      <button class="btn btn--primary w-full btnGlow" id="logoutBtnMobile">Logout</button>
    `;
  }

  // Logout handlers
  document.getElementById("logoutBtn")?.addEventListener("click", handleLogout);
  document
    .getElementById("logoutBtnMobile")
    ?.addEventListener("click", handleLogout);
}

async function handleLogout() {
  await logout();
  window.location.reload();
}

// Firebase auth listener
onUserChange((user) => {
  if (user) {
    renderLoggedIn(user);
  } else {
    renderLoggedOut();
  }
});

// Nav bar login signup logic . login signup button remove after login and dashboard logout button show

import { watchAuthState } from "./firebase/auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "./firebase/firebase-init.js";

const navLogin = document.getElementById("navLogin");
const navSignup = document.getElementById("navSignup");
const navDashboard = document.getElementById("navDashboard");
const navLogout = document.getElementById("navLogout");

const mLogin = document.getElementById("mLogin");
const mSignup = document.getElementById("mSignup");
const mDashboard = document.getElementById("mDashboard");
const mLogout = document.getElementById("mLogout");

watchAuthState((user) => {
  if (user) {
    // Logged IN
    navLogin && (navLogin.style.display = "none");
    navSignup && (navSignup.style.display = "none");
    mLogin && (mLogin.style.display = "none");
    mSignup && (mSignup.style.display = "none");

    navDashboard && (navDashboard.style.display = "inline-flex");
    navLogout && (navLogout.style.display = "inline-flex");
    mDashboard && (mDashboard.style.display = "block");
    mLogout && (mLogout.style.display = "block");
  } else {
    // Logged OUT
    navLogin && (navLogin.style.display = "inline-flex");
    navSignup && (navSignup.style.display = "inline-flex");
    mLogin && (mLogin.style.display = "block");
    mSignup && (mSignup.style.display = "block");

    navDashboard && (navDashboard.style.display = "none");
    navLogout && (navLogout.style.display = "none");
    mDashboard && (mDashboard.style.display = "none");
    mLogout && (mLogout.style.display = "none");
  }
});

// Logout handlers
navLogout &&
  navLogout.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "./index.html";
  });

mLogout &&
  mLogout.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "./index.html";
  });
