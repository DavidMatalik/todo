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

const appContainer = document.querySelector('#app-container')
appContainer.classList.toggle('hide')

const renderTodoApp = (user) => {
  appContainer.classList.add('show-flex')
  appContainer.classList.toggle('hide')
  todoController.init(user)
}

manageAuthentication(renderTodoApp)
