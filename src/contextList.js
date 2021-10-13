import { Context } from './context'
import { app } from './firebaseApp'
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  deleteDoc,
} from 'firebase/firestore/lite'

// Create firestore object
const db = getFirestore(app)

/* Class ContextList Creates a single object with 
all existing contexts(or "lists") */
class ContextList {
  constructor(Context) {
    this.Context = Context
    this.list = []
  }

  async init(user) {
    this.user = user

    const contexts = await this.getContextsFromDB()
    await this.loadActiveContext(contexts)

    const normalContexts = this.removeActiveContext(contexts)

    normalContexts.forEach((context) => {
      const newContext = new Context(context)
      this.addNewContext(newContext)
    })
  }

  async getContextsFromDB() {
    const contextsCol = collection(db, this.user.uid)
    const contextsSnapshot = await getDocs(contextsCol)
    const contexts = contextsSnapshot.docs.map((doc) => doc.data())
    return contexts
  }

  async loadActiveContext(contexts) {
    const activeDbContext = contexts.find((context) => {
      return 'default' in context
    })

    const activeContext = new Context(activeDbContext)
    await activeContext.init(this.user)

    this.addNewContext(activeContext)
    this.setActiveContext(activeContext)
  }

  removeActiveContext(contexts) {
    return contexts.reduce((reducedContexts, context) => {
      if (!('default' in context)) {
        reducedContexts.push(context)
      }
      return reducedContexts
    }, [])
  }

  addNewContext(context) {
    this.list.push(context)
  }

  deleteContext(contextId) {
    const contextListIndex = this.getIndexOfContext(contextId)
    this.list.splice(contextListIndex, 1)

    deleteDoc(doc(db, `${this.user.uid}/${contextId}`))
    this.deleteContextSubcollection(contextId)
  }

  /* Not recommended to delete subcollections on the client side.
  Instead create a function on the server side and call it from here */
  async deleteContextSubcollection(contextId) {
    const contextTasksCol = collection(
      db,
      `${this.user.uid}/${contextId}/tasks`
    )
    const tasksSnapshot = await getDocs(contextTasksCol)
    tasksSnapshot.docs.forEach((task) => {
      deleteDoc(doc(db, `${this.user.uid}/${contextId}/tasks/${task.id}`))
    })
  }

  getContext(givenId) {
    return this.list.find((context) => {
      return context.id === givenId
    })
  }

  /*  Index of context is sometimes needed in todoController 
  to e.g. update information with reference to the right context */
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

  async setActiveContext(context) {
    this.activeContext = context
  }

  getActiveContext() {
    return this.activeContext
  }

  getAllContexts() {
    return this.list
  }
}

export { ContextList }
