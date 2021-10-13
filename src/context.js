import { app } from './firebaseApp'
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
} from 'firebase/firestore/lite'

// Create firestore object
const db = getFirestore(app)

/* Class Context Creates unlimited context (or "context") objects
with the ability to add delete and read tasks */
class Context {
  constructor(data, user) {
    if (typeof data === 'object') {
      this.text = data.text
      this.id = data.id
      this.active = true
      this.taskList = []
    } else if (typeof data === 'string') {
      this.user = user
      const newContextRef = doc(collection(db, this.user.uid))
      this.text = data
      this.id = newContextRef.id
      setDoc(newContextRef, {
        id: newContextRef.id,
        text: data,
      })
    }
  }

  async init(user) {
    this.user = user
    this.taskList = await this.getTasksfromDB(this.id)
  }

  async getTasksfromDB(contextId) {
    const contextTasksCol = collection(
      db,
      `${this.user.uid}/${contextId}/tasks`
    )
    const tasksSnapshot = await getDocs(contextTasksCol)
    const tasks = tasksSnapshot.docs.map((doc) => doc.data())
    return tasks
  }

  async appendTask(task, contextId) {
    this.taskList.push(task)

    const docRef = doc(db, `${this.user.uid}/${contextId}/tasks/${task.id}`)
    setDoc(docRef, {
      id: task.id,
      text: task.text,
    })
  }

  deleteTask(taskId, contextId) {
    const taskListIndex = this.getIndexOfTask(taskId)
    this.taskList.splice(taskListIndex, 1)

    deleteDoc(doc(db, `${this.user.uid}/${contextId}/tasks/${taskId}`))
  }

  getTask(taskId) {
    return this.taskList.find((task) => task.id === taskId)
  }

  /*  Index of task is sometimes needed in todoController 
  to e.g. update information with reference to the right task */
  getIndexOfTask(taskId) {
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
