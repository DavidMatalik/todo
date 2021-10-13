import 'regenerator-runtime/runtime.js'
import { TodoController } from './todoController'
import { Task } from './task'
import { Context } from './context'
import { ContextList } from './contextList'
import { TodoDisplay } from './todoDisplay'
import { manageAuthentication } from './authLogic'

const todoController = new TodoController(
  TodoDisplay,
  Task,
  Context,
  ContextList
)

const appContainer = document.querySelector('#container')
const formContainer = document.querySelector('body')

appContainer.style.display = 'none'

const renderTodoApp = (user) => {
  appContainer.style.display = 'flex'
  todoController.init(user)
}

manageAuthentication(formContainer, renderTodoApp)
