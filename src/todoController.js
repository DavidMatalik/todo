import { Task } from './task'
import { Context } from './context'
import { ContextList } from './contextList'
import { TodoDisplay } from './todoDisplay'

// Handles all the todo App logic
class TodoController {
  constructor (TodoDisplay, Task, Context, ContextList) {
    this.Task = Task
    this.Context = Context
    this.contextList = new ContextList(this.Context)
    this.todoDisplay = new TodoDisplay()

    this.init()
  }

  init () {
    this.setDefaultTasks()
    const _this = this
    this.todoDisplay.onClickAddContext = this.onClickAddContext.bind(this)
    this.todoDisplay.onClickAddTask = this.onClickAddTask.bind(this)
    // https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function/54731362#54731362
    // Writing conlickDeleteContext so, that following arguments are passed:
    // this which equals TodoController object
    // event of event Listener which isn't seen here
    // but can be accessed as last parameter in onClickDeleteContext
    this.todoDisplay.onClickDeleteItem = this.onClickDeleteItem.bind(null, this)
    this.todoDisplay.onClickChangeContext = function () {
      _this.onClickChangeContext(this, _this)
    }
    this.todoDisplay.onDclickEditItem = this.onDclickEditItem.bind(null, this)
    this.todoDisplay.onEnterSaveInput = this.onEnterSaveInput.bind(null, this)
    this.todoDisplay.onMsDwnCopyTask = function () {
      _this.onMsDwnCopyTask(this, _this)
    }
    this.todoDisplay.onMsUpAnalyzePosition = function (event) {
      _this.onMsUpAnalyzePosition(event, this, _this)
    }
    this.todoDisplay.initListeners()
    this.loadStartPage()
  }

  setDefaultTasks () {
    this.activeContext = this.contextList.getActiveContext()
    this.createNewTask('Double click me to edit my name')
    this.createNewTask('Create a new list')
    this.createNewTask('Click and hold me to move me to the new list')
  }

  loadStartPage () {
    const contexts = this.contextList.getAllContexts()
    const tasks = this.activeContext.taskList
    this.todoDisplay.renderTasks(tasks)
    this.todoDisplay.renderAllContexts(contexts, this.activeContext)
    this.todoDisplay.setContextHeading(this.activeContext.text)
  }

  onClickAddContext () {
    const userInput = this.todoDisplay.getContextInputValue() || 'Give me a name'
    this.createNewContext(userInput)
    this.todoDisplay.resetContextInput()
  }

  onClickAddTask () {
    const userInput = this.todoDisplay.getTaskInputValue() || 'Give me a name'
    this.createNewTask(userInput)
    this.todoDisplay.resetTaskInput()
  }

  createNewTask (text) {
    const task = new this.Task(text)
    this.contextList.getActiveContext().appendTask(task)
    this.todoDisplay.appendNewTask(task)
  }

  createNewContext (text) {
    const context = new this.Context(text)
    context.onClickChangeContext = this.onClickChangeContext
    this.contextList.addNewContext(context)
    this.todoDisplay.appendNewContext(context)
  }

  onClickDeleteItem (_this, event) {
    const elementToDelete = _this.todoDisplay.getElementToDelete(event)
    const itemToDeleteId = _this.todoDisplay.getItemId(elementToDelete)
    const className = _this.todoDisplay.getClassName(elementToDelete)

    if (className.contains('context')) {
      _this.contextList.deleteContext(itemToDeleteId)
    } else if (className.contains('task')) {
      console.log('ClassName contains task')
      _this.contextList.activeContext.deleteTask(itemToDeleteId)
    }

    _this.todoDisplay.removeElement(elementToDelete)
    // Prevent bubbling of event up to onClickChangeContext Listener
    event.stopPropagation()
  }

  onClickChangeContext (elementWithHandler, _this) {
    const clickedContextElementId = _this.todoDisplay.getItemId(elementWithHandler)
    const clickedContext = _this.contextList.getContext(clickedContextElementId)
    // Change active Context
    this.contextList.setActiveContext(clickedContext)
    // Display Tasks of active Context
    const tasks = clickedContext.taskList
    this.todoDisplay.renderTasks(tasks)
    // Highlight active Context
    this.todoDisplay.highlightActiveContext(elementWithHandler)
    this.todoDisplay.setContextHeading(clickedContext.text)
  }

  onDclickEditItem (_this, event) {
    _this.todoDisplay.prepareItemEdit(event.target)
  }

  onEnterSaveInput (_this, event) {
    if (event.key === 'Enter') {
      const input = _this.todoDisplay.getUserInput(event)
      const itemElement = _this.todoDisplay.getItemElement(event)
      const itemId = _this.todoDisplay.getItemId(itemElement)
      const className = _this.todoDisplay.getClassName(itemElement)

      if (className.contains('context')) {
        const contextIndex = _this.contextList.getIndexOfContext(itemId)
        _this.contextList.list[contextIndex].update(input)
      } else if (className.contains('task')) {
        const taskIndex = _this.contextList.activeContext.getIndexOfTask(itemId)
        // For Line below should be implemented a setter method in Context
        _this.contextList.activeContext.taskList[taskIndex].text = input
      }
      _this.todoDisplay.updateItemAfterEdit(itemElement, input)
    }
  }

  // Soll das wirklich hier rein? Nicht besser direkt in todoDisplay,
  // nur eine Methode von todoDisplay aufgerufen wird?!!
  onMsDwnCopyTask (elementWithHandler, _this) {
    _this.todoDisplay.attachTaskToMouse(elementWithHandler)
  }

  onMsUpAnalyzePosition (event, elementWithHandler, _this) {
    if (elementWithHandler.classList.contains('context')) {
      const activeContext = _this.contextList.getActiveContext()
      const taskToMoveElement = _this.todoDisplay.temporarySavedTaskElement
      const taskToMoveId = _this.todoDisplay.getItemId(taskToMoveElement)
      const taskToMove = _this.contextList.activeContext.getTask(taskToMoveId)
      const chosenContextElementId = _this.todoDisplay.getItemId(elementWithHandler)
      const chosenContext = _this.contextList.getContext(chosenContextElementId)

      chosenContext.appendTask(taskToMove)
      activeContext.deleteTask(taskToMove)
      _this.todoDisplay.removeElement(taskToMoveElement)
      // Prevents executing the mouseup event which is also attached to body
      event.stopPropagation()
    }

    _this.todoDisplay.undoTaskMoveActions()
  }

  removeTask (task) {
    this.contextList.getActiveContext().deleteTask(task)
    // remove this task from current View
  }
}

const todoController = new TodoController(TodoDisplay, Task, Context, ContextList)

export { todoController }