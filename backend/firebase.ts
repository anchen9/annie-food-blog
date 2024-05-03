import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";


const serviceAccount = require("./.firebase/service_account.json")
const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
});
const db = getFirestore();

export { db };