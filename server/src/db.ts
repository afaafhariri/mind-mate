import * as fireBaseAdmin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "../mind-mate-firebase-admin-sdk.json";

const serviceAccountObj = serviceAccount as fireBaseAdmin.ServiceAccount;

if (!fireBaseAdmin.apps.length) {
  fireBaseAdmin.initializeApp({
    credential: fireBaseAdmin.credential.cert(serviceAccountObj),
  });
}

export const db = getFirestore();