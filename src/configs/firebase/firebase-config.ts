import configuration from '@configs/configuration';

export const firebaseConfig = {
  projectId: configuration().FIREBASE_PROJECT_ID,
  clientEmail: configuration().FIREBASE_CLIENT_EMAIL,
  privateKey: configuration().FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};
