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
    const contexts = await this.getContextsFromDB()
    await this.loadActiveContext(contexts)

    const normalContexts = this.removeActiveContext(contexts)

    normalContexts.forEach((context) => {
      this.addNewContext(context)
    })
  }

  async getContextsFromDB() {
    const contextsCol = collection(db, 'lists')
    const contextsSnapshot = await getDocs(contextsCol)
    const contexts = contextsSnapshot.docs.map((doc) => doc.data())
    return contexts
  }

  async loadActiveContext(contexts) {
    const activeDbContext = contexts.find((context, i) => {
      return context.active === true
    })

    const activeContext = new Context(activeDbContext)
    await activeContext.init()

    this.addNewContext(activeContext)
    this.setActiveContext(activeContext)
  }

  removeActiveContext(contexts) {
    return contexts.reduce((acc, context) => {
      if (context.active === false) {
        acc.push(context)
      }
      return acc
    }, [])
  }

  addNewContext(context) {
    this.list.push(context)
  }

  deleteContext(contextId) {
    const contextListIndex = this.getIndexOfContext(contextId)
    this.list.splice(contextListIndex, 1)
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
