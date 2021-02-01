import { todoController } from './todoController'
import firebase from 'firebase/app'
import 'firebase/database'

const config = {
  // For databases not in the us-central1 location, databaseURL will be of the
  // form https://[databaseName].[region].firebasedatabase.app.
  // For example, https://your-database-123.europe-west1.firebasedatabase.app

  apiKey: 'AIzaSyCGGMhr7m0KCFIM0ZgJOASzE1d2CF3KXJ8',
  authDomain: 'todo-extended.firebaseapp.com',
  databaseURL: 'https://todo-extended-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'todo-extended',
  storageBucket: 'todo-extended.appspot.com'
}
firebase.initializeApp(config)

// Get a reference to the database service
const dbRefObj = firebase.database().ref()
dbRefObj.set({ testKey: 'testAttribute' })
