import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";


const serviceAccount = require("./firebase/service_account.json")
const app = initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore(app);
export { db };