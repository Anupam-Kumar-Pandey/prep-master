import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAlRhQ0cFXrg1gjRGSf7AAoD2tQ6WRWoSU",
  authDomain: "my-prep-master-app.firebaseapp.com",
  projectId: "my-prep-master-app",
  storageBucket: "my-prep-master-app.appspot.com",
  messagingSenderId: "125473406291",
  appId: "1:125473406291:web:80df8a64a2ddc21f82f5a6",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
