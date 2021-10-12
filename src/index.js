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

document.querySelector('#container').style.display = 'none'
const body = document.querySelector('body')

createRegistrationStartingPoint(body)
