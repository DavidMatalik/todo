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

  deleteTask (task) {
    const isSameId = taskToCompare => taskToCompare.id === task.id
    const foundIndex = this.taskList.findIndex(isSameId)
    this.taskList.splice(foundIndex, 1)
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
    })
    return taskListIndex
  }

  update (text) {
    this.text = text
  }
}

export { Context }
