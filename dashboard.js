import { auth, db } from "./firebase/firebase-init.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* UI */
const studentNameEl = document.getElementById("studentName");
const studentMetaEl = document.getElementById("studentMeta");
const planStatusEl = document.getElementById("planStatus");
const lockNotice = document.getElementById("lockNotice");
const upgradeSection = document.getElementById("upgradeSection");
const weeksContainer = document.getElementById("weeksContainer");

let studentClass = null;
let currentSubject = "maths";
let isDashboardUnlocked = false;

/* AUTH */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "./login.html";
    return;
  }

  const snap = await getDoc(doc(db, "users", user.uid));
  if (!snap.exists()) return;

  const data = snap.data();
  const localSession = localStorage.getItem("sessionId");

  if (data.activeSession && data.activeSession !== localSession) {
    alert(
      "Your account was logged in on another device. You have been logged out.",
    );
    await signOut(auth);
    window.location.href = "./login.html";
    return;
  }

  studentNameEl.textContent = `Welcome back, ${data.studentName} 👋`;

  const subjects = Array.isArray(data.subjects)
    ? data.subjects.join(", ")
    : "Maths, Science";

  studentMetaEl.textContent = `Class ${data.studentClass} • ${subjects}`;

  // const active =
  //   data.plan !== "none" && data.planExpiry && data.planExpiry > Date.now();

  let active = false;

  if (data.plan !== "none" && data.planExpiry) {
    const expiryTime = data.planExpiry.toDate().getTime();
    active = expiryTime > Date.now();
  }

  if (active) {
    unlockDashboard(data);
  } else {
    lockDashboard();
  }
  studentClass = data.studentClass;
  console.log("STUDENT CLASS FROM USER:", studentClass, typeof studentClass);

  /* 🔥 ALWAYS load weeks */
  loadWeeks(currentSubject);
});

/* LOCK / UNLOCK */
function lockDashboard() {
  planStatusEl.textContent = "🔒 Plan inactive";
  lockNotice.style.display = "block";
  upgradeSection.style.display = "block";
  isDashboardUnlocked = false;
}

function unlockDashboard(data) {
  planStatusEl.textContent = `✅ ${data.plan} plan active`;
  lockNotice.style.display = "none";
  upgradeSection.style.display = "none";
  isDashboardUnlocked = true;
}

/* LOAD WEEKS */

async function loadWeeks(subject) {
  weeksContainer.innerHTML = "";

  const q = query(
    collection(db, "weeks"),
    where("class", "==", studentClass),
    where("subject", "==", subject),
    orderBy("weekNumber"),
  );

  const snap = await getDocs(q);

  snap.forEach((doc) => {
    const w = doc.data();

    const el = document.createElement("div");
    el.className = "week";

    el.innerHTML = `
      <div class="weekHeader">
        <div class="weekIndex">Week ${w.weekNumber}</div>
        <div class="weekContent">
          <h3>${w.title}</h3>
          <p>${w.description}</p>
        </div>
      </div>

      <div class="weekActions hidden">
        <a class="actionBtn" href="${w.practiceUrl}" target="_blank">📄 Practice Sheet</a>
        <a class="actionBtn" href="${w.lectureUrl}" target="_blank">🎥 Lecture</a>
        <a class="actionBtn primary" href="${w.testUrl}">📝 Attempt Test</a>
      </div>
    `;

    el.addEventListener("click", () => {
      if (!isDashboardUnlocked) return;
      el.querySelector(".weekActions").classList.toggle("hidden");
    });

    weeksContainer.appendChild(el);
  });
}

// ==========================
// SUBJECT SWITCH (FIXED)
// ==========================

const subjectTabs = document.getElementById("subjectTabs");

subjectTabs.addEventListener("click", (e) => {
  const btn = e.target.closest(".tabBtn");
  if (!btn) return;

  // update active UI
  subjectTabs
    .querySelectorAll(".tabBtn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  // update subject
  currentSubject = btn.dataset.subject;
  console.log("Switched subject to:", currentSubject);

  // reload weeks (always reload, even if locked)
  loadWeeks(currentSubject);
});

/* LOGOUT */
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "./index.html";
});
