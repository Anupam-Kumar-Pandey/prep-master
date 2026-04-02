import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { auth } from "./firebase-init.js";

import {
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "./firebase-init.js";

export function watchAuthState(callback) {
  onAuthStateChanged(auth, callback);
}

/* SIGN UP */
export async function signupUser({ name, email, password }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  return cred.user;
}

/* LOGIN */
// export function loginUser(email, password) {
//   return signInWithEmailAndPassword(auth, email, password);
// }

export async function loginUser(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);

  const sessionId = crypto.randomUUID();

  await updateDoc(doc(db, "users", cred.user.uid), {
    activeSession: sessionId,
  });

  localStorage.setItem("sessionId", sessionId);

  return cred.user;
}

/* RESET PASSWORD */
export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

/* LOGOUT */
export function logoutUser() {
  return signOut(auth);
}

/* AUTH LISTENER */
export function onUserChange(cb) {
  onAuthStateChanged(auth, cb);
}
