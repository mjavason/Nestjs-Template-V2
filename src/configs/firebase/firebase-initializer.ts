import { firebaseConfig } from '@configs/firebase/firebase-config';
import * as admin from 'firebase-admin';

export function initializeFirebase() {
  return admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
  });
}
