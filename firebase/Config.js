import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCNBX5NhV5iLyWN4H2WS20-FdfxtNQKcaA",
  authDomain: "todoapp-d531f.firebaseapp.com",
  projectId: "todoapp-d531f",
  storageBucket: "todoapp-d531f.appspot.com",
  messagingSenderId: "503352354167",
  appId: "1:503352354167:web:c3064bb2cc46458f53ad72",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { app, db, auth, storage };