import { getAuth, onAuthStateChanged , createUserWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAIxgdn-N8W1yOADEIhBL8vE3HYJ7fTr5E",
    authDomain: "tala-4763f.firebaseapp.com",
    projectId: "tala-4763f",
    storageBucket: "tala-4763f.appspot.com",
    messagingSenderId: "1089249953304",
    appId: "1:1089249953304:web:81a651f8684f71c59d656d",
    measurementId: "G-3KMY8R0X7E"
};

export const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);
