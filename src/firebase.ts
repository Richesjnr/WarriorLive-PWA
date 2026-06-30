import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "bustling-thunder-74dh4",
  appId: "1:313512069853:web:26df1f5d4f5c4cfc162934",
  apiKey: "AIzaSyAMnmFVNJ_DOVutPxO_yUMXwihZ4VuSINA",
  authDomain: "bustling-thunder-74dh4.firebaseapp.com",
  storageBucket: "bustling-thunder-74dh4.firebasestorage.app",
  messagingSenderId: "313512069853"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-warriorlivepwa-940806bc-c4c0-4734-872c-4d73cce5d532");
