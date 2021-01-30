import { Item } from './item'

// Creates unlimited context objects with the ability to add and delete tasks
class Context extends Item {
  constructor (text) {
    super(text)
    this.taskList = []
    this.active = true
  }

  appendTask (task) {
    this.taskList.push(task)
  }

  deleteTask (taskId) {
    console.log(this.taskList)
    const taskListIndex = this.getIndexOfTask(taskId)
    this.taskList.splice(taskListIndex, 1)
    console.log(this.taskList)
  }

  getTask (taskId) {
    const taskIndexInList = this.getIndexOfTask(taskId)
    return this.taskList[taskIndexInList]
  }

  getIndexOfTask (taskId) {
    taskId = parseInt(taskId)
    const taskListIndex = this.taskList.findIndex(function (currentTask) {
      if (currentTask.id === taskId) {
        return true
      }
      return false
    })
    return taskListIndex
  }

  update (text) {
    this.text = text
  }
}

export { Context }
