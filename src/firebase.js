import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, increment, set, get } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const usageCountRef = ref(database, 'usageCount');

export const incrementUsageCount = async () => {
  try {
    const currentCount = await get(usageCountRef);
    await set(usageCountRef, increment(1));
    return currentCount.val() + 1;
  } catch (error) {
    console.error('Error incrementing usage count:', error);
    return null;
  }
};

export const subscribeToUsageCount = (callback) => {
  onValue(usageCountRef, (snapshot) => {
    callback(snapshot.val() || 0);
  });
};