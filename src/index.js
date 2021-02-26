import { todoController } from './todoController'
import firebase from 'firebase/app'
import 'firebase/database'

const config = {
  // For databases not in the us-central1 location, databaseURL will be of the
  // form https://[databaseName].[region].firebasedatabase.app.
  // For example, https://your-database-123.europe-west1.firebasedatabase.app

  apiKey: 'AIzaSyBFiU9bK31rlA038QilosuxULEXJpM3kyM',
  authDomain: 'my-todo-9c6e1.firebaseapp.com',
  databaseURL:
    'https://my-todo-9c6e1-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'my-todo-9c6e1',
  storageBucket: 'my-todo-9c6e1.appspot.com',
  messagingSenderId: '56681932314',
  appId: '1:56681932314:web:948208b84164067d82d3a3',
}
firebase.initializeApp(config)

// Get a reference to the database service
const dbRefObj = firebase.database().ref()
dbRefObj.set({ testKey: 'testAttribute' })
