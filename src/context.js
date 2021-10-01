import { app } from './firebaseApp'
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite'

// Create firestore object
const db = getFirestore(app)

/* Class Context Creates unlimited context (or "context") objects
with the ability to add delete and read tasks */
class Context {
  constructor(context) {
    this.text = context.text
    this.active = true
    this.id = context.id
    this.taskList = []
  }

  async init() {
    this.taskList = await this.getTasksfromDB(this.id)
  }

  async getTasksfromDB(contextId) {
    const contextTasksCol = collection(db, `lists/${contextId}/tasks`)
    const tasksSnapshot = await getDocs(contextTasksCol)
    const tasks = tasksSnapshot.docs.map((doc) => doc.data())
    return tasks
  }

  appendTask(task) {
    this.taskList.push(task)
  }

  deleteTask(taskId) {
    const taskListIndex = this.getIndexOfTask(taskId)
    this.taskList.splice(taskListIndex, 1)
  }

  getTask(taskId) {
    const taskIndexInList = this.getIndexOfTask(taskId)
    return this.taskList[taskIndexInList]
  }

  /*  Index of task is sometimes needed in todoController 
  to e.g. update information with reference to the right task */
  getIndexOfTask(taskId) {
    taskId = parseInt(taskId)
    const taskListIndex = this.taskList.findIndex(function (currentTask) {
      if (currentTask.id === taskId) {
        return true
      }
      return false
    })
    return taskListIndex
  }

  update(text) {
    this.text = text
  }
}

export { Context }
