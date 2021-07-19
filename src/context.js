import { Item } from './item'

/* Class Context Creates unlimited context (or "list") objects 
with the ability to add delete and read tasks */
class Context extends Item {
  constructor(text) {
    super(text)
    this.taskList = []
    this.active = true
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
