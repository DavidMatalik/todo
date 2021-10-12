import 'regenerator-runtime/runtime.js'
import { TodoController } from './todoController'
import { Task } from './task'
import { Context } from './context'
import { ContextList } from './contextList'
import { TodoDisplay } from './todoDisplay'
import createRegistrationStartingPoint from './authentication'

const todoController = new TodoController(
  TodoDisplay,
  Task,
  Context,
  ContextList
)

const appContainer = document.querySelector('#container')
const formContainer = document.querySelector('body')

appContainer.style.display = 'none'

const renderTodoApp = () => {
  appContainer.style.display = 'flex'
  todoController.init()
}

createRegistrationStartingPoint(formContainer, renderTodoApp)
