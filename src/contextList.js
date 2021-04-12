// import { Context } from './context'
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

// Creates a single object where all contexts with their tasks are listed
class ContextList {
  constructor(Context) {
    this.Context = Context
    this.list = []
    // How to change initFirstTime to init everyTime?
    // 1. Problem:
    // Load contexts and tasks from db

    // 2. Plan
    // Put the init method not into constructor but as separate method
    // to be called from todoController? After data is ready from server?
    // Set as default the first context as activeContext
    // If there are no contexts don't set an activeContext
  }

  init(contextsFromDb) {
    // Eigentlich hätte ich gerne das dbOjekt in dem
    // Format mit dem ich bisher auch in App gearbeitet habe
    // Also ein Array. Ist das überhaupt möglich mit den
    // eindeutigen Identifieren an übergeordnetster STelle?
    // Ich sollte mir mal aufzeichnen wie es im Moment ist in der App
    // Und ob es doch sinnvoller ist die DB structure nochmal umzudenken
    // Oder die App entsprechend der DB structure anzupassen
    console.log(Object.entries(contextsFromDb))

    // If User is newly created run initFirstTime(), else:
    this.setActiveContext(activeContext)
  }

  // Connect with db
  initFirstTime() {
    const defaultContext = new Context('inbox')
    this.addNewContext(defaultContext)
    this.setActiveContext(defaultContext)
  }

  addNewContext(context) {
    this.list.push(context)
    dbRefObj.push(context)
  }

  deleteContext(contextId) {
    const contextListIndex = this.getIndexOfContext(contextId)
    this.list.splice(contextListIndex, 1)
  }

  getContext(contextId) {
    const contextIndexInList = this.getIndexOfContext(contextId)
    return this.list[contextIndexInList]
  }

  getIndexOfContext(contextId) {
    contextId = parseInt(contextId)
    const contextListIndex = this.list.findIndex(function (currentContext) {
      if (currentContext.id === contextId) {
        return true
      }
      return false
    })
    return contextListIndex
  }

  setActiveContext(context) {
    this.activeContext = context
  }

  getActiveContext() {
    return this.activeContext
  }

  getDbPromise() {
    return dbRefObj.get()
  }

  getAllContexts(snapshot) {
    // This function gets an array from DB containing context objects
    // So it returns the saved contextlist of a user
    // Which should be rendered
    // Issue because of async loading. Solve it somehow with async/await?
    // But the the statement does not work with async/await? How to rewrite that stuff???
    if (snapshot.exists()) {
      return snapshot.val()
    } else {
      console.log('No data available')
    }
    // return this.list
  }
}

export { ContextList }
