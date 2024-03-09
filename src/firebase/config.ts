// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCtvIFznOkXBJAur6QizYB2rC1yENuJ7I",
  authDomain: "scrap-90ace.firebaseapp.com",
  projectId: "scrap-90ace",
  storageBucket: "scrap-90ace.appspot.com",
  messagingSenderId: "226872761248",
  appId: "1:226872761248:web:e16b38b96d970c144222c5"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
export { auth, db, provider, storage };
