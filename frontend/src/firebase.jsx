import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDUaAql9lZzPqlAByZ_S8PnWyQbxdY-ons",
  authDomain: "skripsilogin-48590.firebaseapp.com",
  projectId: "skripsilogin-48590",
  storageBucket: "skripsilogin-48590.appspot.com",
  messagingSenderId: "448969138864",
  appId: "1:448969138864:web:670165f7d817757c359175",
  measurementId: "G-6KC0JEEED4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const signInWithGoogle = () => {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      console.log(result.user);
    })
    .catch((error) => {
      console.log(error);
    });
};

const signInWithGithub = () => {
  signInWithPopup(auth, githubProvider)
    .then((result) => {
      console.log(result.user);
    })
    .catch((error) => {
      console.log(error);
    });
};

const logOut = () => {
  signOut(auth)
    .then(() => {
      console.log("User signed out");
    })
    .catch((error) => {
      console.log(error);
    });
};




export { auth, signInWithGoogle, logOut, signInWithGithub };
