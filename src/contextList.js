import { Context } from './context'

/* Class ContextList Creates a single object with 
all existing contexts(or "lists") */
class ContextList {
  constructor(Context) {
    this.Context = Context
    this.list = []
    this.init()
  }

  /* When a new ContextList is created it has automatically
  a default context (or "list") called "inbox". A contextList object
  has CRUD abilities on its contexts */
  init() {
    const defaultContext = new Context('inbox')
    this.addNewContext(defaultContext)
    this.setActiveContext(defaultContext)
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
