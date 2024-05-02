// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, Auth} from "firebase/auth";
import withFirebaseAuth from 'react-with-firebase-auth';
import { env } from "process";

const firebaseConfig = {
    apiKey: env.REACT_APP_API_KEY,
    authDomain: env.REACT_APP_AUTH_DOMAIN,
    projectID: env.REACT_APP_PROJECT_ID,
    storageBucket: env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: env.REACT_APP_MESSAGING_SENDER_ID,
    appId: env.REACT_APP_APP_ID,
    measurementId: env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

const providers = {
    googleProvider: new GoogleAuthProvider(),
  };
  
  const createComponentWithAuth = withFirebaseAuth({
    providers,
    firebaseAppAuth: auth,
  });
  
  const signInWithGoogle = () => {
    signInWithPopup(auth, providers.googleProvider);
  };
  
  const signOutFirebase = () => {
    signOut(auth);
  };
  
  export {
    db,
    auth,
    createComponentWithAuth,
    signInWithGoogle,
    signOutFirebase as signOut,
  };