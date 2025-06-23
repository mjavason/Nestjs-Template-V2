import * as admin from 'firebase-admin';
import { firebaseConfig } from './firebase-config';

export function initializeFirebase() {
  return admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
  });
}
