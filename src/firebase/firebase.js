import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getStorage } from "firebase/storage"; // Import Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyCaai3UqjrZI_H3EhiM4VW8MmBroCxm8fQ",
  authDomain: "lordjagannathtoursandtra-671aa.firebaseapp.com",
  databaseURL: "https://lordjagannathtoursandtra-671aa-default-rtdb.firebaseio.com",
  projectId: "lordjagannathtoursandtra-671aa",
  storageBucket: "lordjagannathtoursandtra-671aa.appspot.com", // Storage Bucket
  messagingSenderId: "93338680645",
  appId: "1:93338680645:web:15416231c57da8edb6d22c",
  measurementId: "G-ZZ2YVQV6WE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth(app);

// Initialize Firestore Database
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app); // Firebase Storage initialization

export { app, auth, db, storage };
