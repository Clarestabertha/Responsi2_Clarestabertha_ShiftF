import {initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig ={
    apiKey: "AIzaSyCRBH_LOgVS4GV8QeKrWGLfLmo3zEDlr8Q",
  authDomain: "responsi-93f41.firebaseapp.com",
  projectId: "responsi-93f41",
  storageBucket: "responsi-93f41.firebasestorage.app",
  messagingSenderId: "817791655763",
  appId: "1:817791655763:web:8f81a122e943285a8a8ba6"
};

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(firebase);

export {auth, googleProvider,db};