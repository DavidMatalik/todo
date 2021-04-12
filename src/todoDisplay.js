/* Class TodoDisplay generates an object which renders the
current state of objects */
class TodoDisplay {
  constructor() {
    this.bodyElement = document.querySelector('body')
    this.contextContainer = document.getElementById('context-container')
    this.contextInput = document.getElementById('context-input')
    this.contextButton = document.getElementById('context-add-button')
    this.taskContainer = document.getElementById('task-container')
    this.taskList = document.getElementById('tasks')
    this.taskInput = document.getElementById('task-input')
    this.taskButton = document.getElementById('task-add-button')
    this.taskHeading = document.getElementById('heading-task-container')
    this.activeContext = null

    // Logic of these handlers is implemented in Class Todocontroller
    this.onClickAddContext = null
    this.onClickDeleteItem = null
    this.onClickChangeContext = null
    this.onDclickEditContext = null
    this.onEnterSaveInput = null
    this.onClickOutsideSave = null
    this.onClickAddTask = null
    this.onMsDwnCopyTask = null
    this.onMsUpAnalyzePosition = null
  }

  /* Only addContext and addTask can be assigned to Elements
  Because for all other handlers the elements needed get generated
  after UI interactions */
  initListeners() {
    this.contextButton.addEventListener('click', this.onClickAddContext)
    this.taskButton.addEventListener('click', this.onClickAddTask)
  }

  renderAllContexts(contexts, activeContext) {
    // Render context elements
    contexts.forEach(this.appendNewContext.bind(this))
    // Highlight active context element
    this.activeContext = document.querySelector(
      `[data-itemid="${activeContext.id}"]`
    )
    this.highlightActiveContext(this.activeContext)
  }

  appendNewContext(context) {
    const delBtn = this.createDelBtn()
    const innerContent = this.createInnerContent(context.text, delBtn)
    const className = 'context'
    const contextElement = this.createItemElement(
      context.id,
      innerContent,
      className
    )
    contextElement.addEventListener('click', this.onClickChangeContext)
    this.contextContainer.appendChild(contextElement)
  }

  highlightActiveContext(element) {
    this.activeContext.style.border = 'none'
    this.activeContext = element
    element.style.border = '1px solid black'
  }

  renderTasks(tasks) {
    this.taskList.innerHTML = ''
    tasks.forEach(this.appendNewTask.bind(this))
  }

  appendNewTask(task) {
    const delBtn = this.createDelBtn()
    const innerContent = this.createInnerContent(task.text, delBtn)
    const className = 'task'
    const taskElement = this.createItemElement(task.id, innerContent, className)
    taskElement.classList.add('task') // Better extra Method
    taskElement.addEventListener('mousedown', this.onMsDwnCopyTask)
    this.taskList.appendChild(taskElement)
  }

  /* Helper functions to create Task or Context:
  createItemElement, createDelBtn, createInnerContent */

  createItemElement(id, innerContent, className) {
    const para = document.createElement('p')
    para.dataset.itemid = id
    para.classList.add(className)
    para.addEventListener('dblclick', this.onDclickEditItem)
    para.appendChild(innerContent)
    return para
  }

  createDelBtn() {
    const deleteButton = document.createElement('i')
    deleteButton.classList.add('fa')
    deleteButton.classList.add('fa-trash-o')
    deleteButton.addEventListener('click', this.onClickDeleteItem)
    return deleteButton
  }

  createInnerContent(text, delBtn) {
    // Here you could create an extra method to separate span
    const innerContent = document.createElement('div')
    const span = document.createElement('span')
    span.innerHTML = text
    innerContent.appendChild(span)
    innerContent.appendChild(delBtn)
    return innerContent
  }

  /* Edit functions: prepareItemEdit, createInputBox,
  saveItemElements, createEditableElement, updateItemAfterEdit */

  prepareItemEdit(para) {
    this.saveItemElements(para)
    const maxLength = this.defineMaxLength()
    const inputBox = this.createInputBox(para, maxLength)
    this.createEditableElement(inputBox)
    // Implement click Listener for whole page to exit edit
    // except current element
    this.bodyElement.addEventListener('click', this.onClickOutsideSave)
    inputBox.addEventListener('click', (event) => event.stopPropagation())
    this.addContextListeners()
  }

  saveItemElements(para) {
    this.itemElements = para.firstChild
  }

  defineMaxLength() {
    const itemType = this.itemElements.parentNode.className
    if (itemType === 'task') return 25
    if (itemType === 'context') return 8
  }

  createInputBox(para, length) {
    const inputBox = document.createElement('input')
    const inputBoxValue = para.firstChild.textContent
    inputBox.type = 'text'
    inputBox.id = 'edit-item-field'
    inputBox.maxLength = length
    inputBox.value = inputBoxValue
    inputBox.addEventListener('keyup', this.onEnterSaveInput)
    return inputBox
  }

  createEditableElement(inputBox) {
    const para = this.itemElements.parentNode
    para.id = 'edit-item'
    para.firstChild.remove()
    para.appendChild(inputBox)
    // Put cursor directly into text to edit it
    inputBox.focus()
  }

  updateDomAfterEdit(para, text) {
    this.itemElements.firstChild.innerHTML = text
    // Remove inputBox
    para.firstChild.remove()
    // Append updated Text and Delete Button
    para.appendChild(this.itemElements)
    // Remove edit id for new use
    para.removeAttribute('id')
    // Remove event listener from body
    this.bodyElement.removeEventListener('click', this.onClickOutsideSave)
    // Append event listeners to contexts
    this.addContextListeners()
  }

  /* Move task to other context functions: attachTasktoMouse, onMsOverHighlight, onMsOutNormal
  createTaskCopy, moveTaskWithMouse, removeTaskCopy, undoTaskMoveActions */

  attachTaskToMouse(elementWithHandler) {
    const taskElementCopy = this.createTaskCopy(elementWithHandler)

    // Append mousemovement listener for moving the task with mouse
    this.bodyElement.addEventListener(
      'mousemove',
      this.moveTaskWithMouse.bind(null, this, taskElementCopy)
    )

    // Append mouseup listener to whole page
    this.bodyElement.addEventListener('mouseup', this.onMsUpAnalyzePosition)

    // Add mousehover event Listener to every context element
    const contexts = document.querySelectorAll('.context')
    const _this = this
    contexts.forEach(function (element) {
      element.addEventListener('mouseover', _this.onMsOverHighlight)
      element.addEventListener('mouseout', _this.onMsOutNormal)
      element.addEventListener('mouseup', _this.onMsUpAnalyzePosition)
    })
    this.changeUserSelect('none')
  }

  onMsOverHighlight() {
    this.style.opacity = '0.7'
  }

  onMsOutNormal() {
    this.style.opacity = '1'
  }

  createTaskCopy(elementWithHandler) {
    this.temporarySavedTaskElement = elementWithHandler
    const taskElementCopy = this.temporarySavedTaskElement.cloneNode(true)
    taskElementCopy.id = 'task-copy'
    taskElementCopy.style.width = '25vw'
    taskElementCopy.style.display = 'none'
    this.bodyElement.appendChild(taskElementCopy)
    return taskElementCopy
  }

  moveTaskWithMouse(_this, taskElementCopy, event) {
    // Put copy at specified position
    const mousePositionHorizontal = event.x
    const mousePositionVertical = event.y
    taskElementCopy.style.position = 'absolute'
    taskElementCopy.style.top = `${mousePositionVertical}px`
    taskElementCopy.style.left = `${mousePositionHorizontal + 10}px`
    taskElementCopy.style.display = 'block'
  }

  removeTaskCopy() {
    const taskElementCopy = document.getElementById('task-copy')
    taskElementCopy.remove()
  }

  undoTaskMoveActions() {
    this.removeTaskCopy()
    this.bodyElement.removeEventListener('mouseup', this.onMsUpAnalyzePosition)

    const contexts = document.querySelectorAll('.context')
    const _this = this
    contexts.forEach(function (element) {
      element.removeEventListener('mouseover', _this.onMsOverHighlight)
      element.removeEventListener('mouseout', _this.onMsOutNormal)
      element.removeEventListener('mouseup', _this.onMsUpAnalyzePosition)
      element.style.opacity = '1'
    })
    this.changeUserSelect('auto')
  }

  setContextHeading(newHeading) {
    this.taskHeading.innerText = newHeading
  }

  changeUserSelect(mode) {
    document.querySelectorAll('*').forEach((node) => {
      node.style.userSelect = mode
    })
  }

  // Simple Helper functions

  getItemId(element) {
    return element.dataset.itemid
  }

  getEditItem() {
    const itemElement = document.getElementById('edit-item')
    return itemElement
  }

  getContextInputValue() {
    return this.contextInput.value
  }

  resetContextInput() {
    this.contextInput.value = ''
  }

  removeElement(element) {
    element.remove()
  }

  removeTasks() {
    console.log('in here')
    this.taskList.innerHTML = ''
  }

  getElementToDelete(event) {
    return event.target.parentNode.parentNode
  }

  getTaskInputValue() {
    return this.taskInput.value
  }

  resetTaskInput() {
    this.taskInput.value = ''
  }

  getEditInput() {
    const inputField = document.getElementById('edit-item-field')
    return inputField.value
  }

  getClassName(element) {
    return element.classList
  }

  removeContextListeners() {
    document.querySelectorAll('.context').forEach((context) => {
      context.removeEventListener('click', this.onClickChangeContext)
    })
  }

  addContextListeners() {
    document.querySelectorAll('.context').forEach((context) => {
      context.addEventListener('click', this.onClickChangeContext)
    })
  }
}

export { TodoDisplay }
