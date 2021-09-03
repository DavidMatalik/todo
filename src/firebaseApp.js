import 'regenerator-runtime/runtime'
import { initializeApp } from 'firebase/app'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC5jHZOj29zfVlqObi43XGY5ct_hCawntc',
  authDomain: 'another-todo-f42eb.firebaseapp.com',
  projectId: 'another-todo-f42eb',
  storageBucket: 'another-todo-f42eb.appspot.com',
  messagingSenderId: '315443812435',
  appId: '1:315443812435:web:53762d9ba7f6af2c138ea6',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
