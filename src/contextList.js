import { Context } from './context'
import { app } from './firebaseApp'
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite'

// Create firestore object
const db = getFirestore(app)

/* Class ContextList Creates a single object with 
all existing contexts(or "lists") */
class ContextList {
  constructor(Context) {
    this.Context = Context
    this.list = []
  }

  async init() {
    const contexts = await this.getContextFromDB()
    const activeDbContext = contexts.find((context) => context.active === true)
    const activeContext = new Context(activeDbContext)
    await activeContext.init()

    this.addNewContext(activeContext)
    this.setActiveContext(activeContext)
  }

  async getContextFromDB() {
    const contextsCol = collection(db, 'lists')
    const contextsSnapshot = await getDocs(contextsCol)
    const contexts = contextsSnapshot.docs.map((doc) => doc.data())
    return contexts
  }

  addNewContext(context) {
    this.list.push(context)
  }

  deleteContext(contextId) {
    const contextListIndex = this.getIndexOfContext(contextId)
    this.list.splice(contextListIndex, 1)
  }

  getContext(contextId) {
    const contextIndexInList = this.getIndexOfContext(contextId)
    return this.list[contextIndexInList]
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

  setActiveContext(context) {
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
