import { app } from './firebaseApp'
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
} from 'firebase/firestore/lite'

// Create firestore object
const db = getFirestore(app)

/* Class Context Creates unlimited context (or "context") objects
with the ability to add delete and read tasks */
class Context {
  constructor(data) {
    if (typeof data === 'object') {
      this.text = data.text
      this.id = data.id
      this.active = true
      this.taskList = []
    } else if (typeof data === 'string') {
      const newContextRef = doc(collection(db, 'lists'))
      this.text = data
      this.id = newContextRef.id
      setDoc(newContextRef, {
        id: newContextRef.id,
        text: data,
        active: true,
      })
    }
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
