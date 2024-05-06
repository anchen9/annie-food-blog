import { initializeApp, applicationDefault, cert, ServiceAccount} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./service_account.json"

const leServiceAcct: any = serviceAccount;
const app = initializeApp({
  credential: cert(leServiceAcct),
});
const db = getFirestore();
export { db };