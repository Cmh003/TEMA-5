import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCZRpmrES5jglVnWF2fapfjqK6Fu0ZN5Lw",
  authDomain: "yoopo-bf6bf.firebaseapp.com",
  projectId: "yoopo-bf6bf",
  storageBucket: "yoopo-bf6bf.firebasestorage.app",
  messagingSenderId: "628703041045",
  appId: "1:628703041045:web:f943f6151ab2719fde601c",
  measurementId: "G-7H60F3WVYZ",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);