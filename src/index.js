//Is used by Task and Context to inherit properties and methods
class Item {
    constructor(text) {
        this.text = text;
        this.id = Item.countInstances();
    }
    
    static countInstances() {
        Item.count = (Item.count || 0) + 1;
        return Item.count;
    }
}

//Creates unlimited task objects
class Task extends Item {
    constructor(text) {
        super(text);
        this.favorite = false;
    }
}

//Creates unlimited context objects with the ability to add and delete tasks
class Context extends Item {
    constructor(text) {
        super(text);
        this.taskList = [];
        this.active = true;
    }

    appendTask(task) {
        this.taskList.push(task);
    }

    deleteTask(task) {
        const isSameId = taskToCompare => taskToCompare.id === task.id;
        const foundIndex = this.taskList.findIndex(isSameId);
        this.taskList.splice(foundIndex, 1);
    }

    getTask(taskId) {
        const taskIndexInList = this.getIndexOfTask(taskId);
        return this.taskList[taskIndexInList];
    }

    getIndexOfTask(taskId) {
        taskId = parseInt(taskId);
        const taskListIndex = this.taskList.findIndex(function(currentTask) {
            if (currentTask.id === taskId){
                return true;
            }
        })
        return taskListIndex;
    }

    update(text) {
        this.text = text;
    }
}

//Creates a single object where all contexts with their tasks are listed
class ContextList {
    constructor(Context){
        this.Context = Context;
        this.list = [];
        this.init();
    }

    init() {
        const defaultContext = new Context('inbox');
        this.addNewContext(defaultContext);
        this.setActiveContext(defaultContext);
    }

    addNewContext(context) {
        this.list.push(context);
    }

    deleteContext(contextId) {
        const contextListIndex = this.getIndexOfContext(contextId);
        this.list.splice(contextListIndex, 1);
    }

    getContext(contextId) {
        const contextIndexInList = this.getIndexOfContext(contextId);
        return this.list[contextIndexInList];
    }

    getIndexOfContext(contextId) {
        contextId = parseInt(contextId);
        const contextListIndex = this.list.findIndex(function(currentContext) {
            if (currentContext.id === contextId){
                return true;
            }
        })
        return contextListIndex;
    }

    setActiveContext(context) {
        this.activeContext = context;
    }

    getActiveContext() {
        return this.activeContext;
    }

    getAllContexts() {
        return this.list;
    }
}

//Creates the right view of the current state of objects
class TodoDisplay {
    constructor() {
        this.bodyElement = document.querySelector('body');
        this.contextContainer = document.getElementById('context-container');
        this.contextInput = document.getElementById('context-input');
        this.contextButton = document.getElementById('context-add');
        this.taskContainer = document.getElementById('task-container');
        this.taskList = document.getElementById('tasks');
        this.taskInput = document.getElementById('task-input');
        this.taskButton = document.getElementById('task-add');
        this.activeContext = null;

        this.onClickAddContext = null;
        this.onClickDeleteContext = null;
        this.onClickChangeContext = null;
        this.onDclickEditContext = null;
        this.onEnterSaveInput = null;

        this.onClickAddTask = null;
        this.onMsDwnCopyTask = null;
        this.onMsUpAnalyzePosition = null;
    }

    initListeners() {
        this.contextButton.addEventListener('click', this.onClickAddContext);
        this.taskButton.addEventListener('click', this.onClickAddTask);
    }

    renderAllContexts(contexts, activeContext) {
        // Render context elements
        contexts.forEach(this.appendNewContext.bind(this));
        // Highlight active context element
        this.activeContext = document.querySelector(`[data-itemid="${activeContext.id}"]`);
        this.highlightActiveContext(this.activeContext);
    }
    appendNewContext(context) {
        const delBtn = this.createDelBtn();
        const innerContent = this.createInnerContent(context.text, delBtn);
        const className = 'context';
        const contextElement = this.createItemElement(context.id, innerContent, className);
        contextElement.addEventListener('click', this.onClickChangeContext);
        this.contextContainer.appendChild(contextElement);
    }

    renderTasks(tasks) {
        this.taskList.innerHTML = '';
        tasks.forEach(this.appendNewTask.bind(this));
    }

    appendNewTask(task) {
        const delBtn = this.createDelBtn();
        const innerContent = this.createInnerContent(task.text, delBtn);
        const className = 'task';
        const taskElement = this.createItemElement(task.id, innerContent, className);
        taskElement.classList.add('task'); //Better extra Method
        taskElement.addEventListener('mousedown', this.onMsDwnCopyTask);
        this.taskList.appendChild(taskElement);
    }

    highlightActiveContext(element){
        this.activeContext.style.border = 'none';
        this.activeContext = element;
        element.style.border = '1px solid black';
    }

    createItemElement(id, innerContent, className) {
        const para = document.createElement('p');
        para.dataset.itemid = id;
        para.classList.add(className);
        para.addEventListener('dblclick', this.onDclickEditContext);
        para.appendChild(innerContent);
        return para;
    }

    createDelBtn(){
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'del';
        deleteButton.addEventListener('click', this.onClickDeleteContext);
        return deleteButton;
    }

    createInnerContent(text, delBtn) {
        //Here you could create an extra method to separate span 
        const innerContent = document.createElement('div');
        const span = document.createElement('span');
        span.innerHTML = text;
        innerContent.appendChild(span);
        innerContent.appendChild(delBtn);
        return innerContent;
    }
    
    prepareContextEdit(textElement){
        const inputBox = this.createInputBox(textElement);
        this.saveContextElements(textElement);
        this.createEditableElement(inputBox);
    }

    createInputBox(textElement) {
        const inputBox = document.createElement('input');
        const placeHolder = textElement.firstChild.textContent;
        inputBox.type = 'text';
        inputBox.placeholder = placeHolder;
        inputBox.addEventListener('keyup', this.onEnterSaveInput);
        return inputBox;
    }

    saveContextElements(textElement) {
        this.contextElements = textElement.parentNode;
    }

    createEditableElement(inputBox){
        const para = this.contextElements.parentNode;
        para.firstChild.remove();
        para.appendChild(inputBox);
    }

    removeContext(element) {
        element.remove();
    }

    updateContextAfterEdit(para, text) {
        this.contextElements.firstChild.innerHTML = text;
        //Remove inputBox
        para.firstChild.remove();
        //Append updated Text and Delete Button
        para.appendChild(this.contextElements);
    }

    attachTaskToMouse(event, elementWithHandler) {
        const taskElementCopy = this.createTaskCopy(elementWithHandler);

        //Append mousemovement listener for moving the task with mouse
        this.bodyElement.addEventListener('mousemove', 
        this.moveTaskWithMouse.bind(null, this, taskElementCopy));

        // Append mouseup listener to whole page
        this.bodyElement.addEventListener('mouseup', this.onMsUpAnalyzePosition);

        //Add mousehover event Listener to every context element
        const contexts = document.querySelectorAll('.context');
        const _this = this;
        contexts.forEach(function(element) {
            element.addEventListener('mouseover', _this.onMsOverHighlight)
            element.addEventListener('mouseout', _this.onMsOutNormal)
            element.addEventListener('mouseup', _this.onMsUpAnalyzePosition);
        });
    }

    onMsOverHighlight(){
        this.style.backgroundColor = 'green';
    }


    onMsOutNormal(){
        this.style.backgroundColor = 'aqua';
    }

    createTaskCopy(elementWithHandler) {
        this.temporarySavedTaskElement = elementWithHandler;
        const taskElementCopy = this.temporarySavedTaskElement.cloneNode(true);
        taskElementCopy.style.backgroundColor = 'red';
        taskElementCopy.id = 'task-copy';
        this.bodyElement.appendChild(taskElementCopy);
        return taskElementCopy;
    }

    moveTaskWithMouse(_this, taskElementCopy, event) {
        //Put copy at specified position
        const mousePositionHorizontal = event.x;
        const mousePositionVertical = event.y;
        taskElementCopy.style.position = 'absolute';
        taskElementCopy.style.top = `${mousePositionVertical}px`;
        taskElementCopy.style.left = `${mousePositionHorizontal + 10}px`;
    }

    removeTaskCopy() {
        const taskElementCopy = document.getElementById('task-copy');
        taskElementCopy.remove();
    }

    getElementToDelete(event) {
        return event.target.parentNode.parentNode;
    }

    removeTask(element) {
        element.remove();
    }

    getItemId(element) {
        return element.dataset.itemid;
    }

    getContextInputValue(){
        return this.contextInput.value;
    }

    getTaskInputValue(){
        return this.taskInput.value;
    }

    getContextElement(event) {
        return event.target.parentNode;
    }

    getUserInput(event) {
        return event.target.value;
    }

    undoTaskMoveActions() {
        this.removeTaskCopy();
        this.bodyElement.removeEventListener('mouseup', this.onMsUpAnalyzePosition);
        
        const contexts = document.querySelectorAll('.context');
        const _this = this;
        contexts.forEach(function(element) {
            element.removeEventListener('mouseover', _this.onMsOverHighlight);
            element.removeEventListener('mouseout', _this.onMsOutNormal);
            element.removeEventListener('mouseup', _this.onMsUpAnalyzePosition);
            element.style.backgroundColor = 'aqua';
        });
    }
}

//Handles all the todo App logic
class TodoController {
    constructor(TodoDisplay, Task, Context,ContextList) {
        this.Task = Task;
        this.Context = Context;
        this.contextList = new ContextList(this.Context);
        this.todoDisplay = new TodoDisplay();

        this.init();
    }

    init() {
        const _this = this; 
        this.todoDisplay.onClickAddContext = this.onClickAddContext.bind(this);
        this.todoDisplay.onClickAddTask = this.onClickAddTask.bind(this);
        // Writing conlickDeleteContext so, that following arguments are passed:  
        // this which equals TodoController object
        // event of event Listener which isn't seen here 
        // but can be accessed as last parameter in onClickDeleteContext
        this.todoDisplay.onClickDeleteContext = this.onClickDeleteContext.bind(null, this);
        this.todoDisplay.onClickChangeContext = function(event) {
            _this.onClickChangeContext(event, this, _this);}
        this.todoDisplay.onDclickEditContext = this.onDclickEditContext.bind(null, this);
        this.todoDisplay.onEnterSaveInput = this.onEnterSaveInput.bind(null, this);
        this.todoDisplay.onMsDwnCopyTask  = function(event) {
            _this.onMsDwnCopyTask(event, this, _this)}
        this.todoDisplay.onMsUpAnalyzePosition = function(event) {
            _this.onMsUpAnalyzePosition(event, this, _this)}
        this.todoDisplay.initListeners();
        this.loadStartPage();
    }

    onClickAddContext() {
        const userInput = this.todoDisplay.getContextInputValue();
        this.createNewContext(userInput);
    }

    onClickAddTask() {
        const userInput = this.todoDisplay.getTaskInputValue();
        this.createNewTask(userInput);
    }

    loadStartPage() {
        this.activeContext = this.contextList.getActiveContext();
        const contexts = this.contextList.getAllContexts();
        this.todoDisplay.renderAllContexts(contexts, this.activeContext);
    }
    
    createNewTask(text) {
        const task = new this.Task(text);  
        this.contextList.getActiveContext().appendTask(task);
        this.todoDisplay.appendNewTask(task);
    }

    createNewContext(text) {
        const context = new this.Context(text);  
        context.onClickChangeContext = this.onClickChangeContext;
        this.contextList.addNewContext(context);
        this.todoDisplay.appendNewContext(context);
    }

    onClickDeleteContext(_this, event) {
        const elementToDelete = _this.todoDisplay.getElementToDelete(event);
        const itemToDeleteId = _this.todoDisplay.getItemId(elementToDelete);
        _this.contextList.deleteContext(itemToDeleteId);
        _this.todoDisplay.removeContext(elementToDelete)
    }

    onClickChangeContext(event, elementWithHandler, _this){
        const clickedContextElementId = _this.todoDisplay.getItemId(elementWithHandler);
        const clickedContext = _this.contextList.getContext(clickedContextElementId);
        //Change active Context
        this.contextList.setActiveContext(clickedContext);
        //Display Tasks of active Context
        const tasks = clickedContext.taskList; 
        this.todoDisplay.renderTasks(tasks);
        //Highlight active Context
        this.todoDisplay.highlightActiveContext(elementWithHandler);
    }

    onDclickEditContext(_this, event) {
        _this.todoDisplay.prepareContextEdit(event.target);
    }

    onEnterSaveInput(_this, event) {
        if (event.key === 'Enter'){
            const input = _this.todoDisplay.getUserInput(event);
            const contextElement = _this.todoDisplay.getContextElement(event);
            const contextId = _this.todoDisplay.getItemId(contextElement);
            const contextIndex = _this.contextList.getIndexOfContext(contextId);
            _this.contextList.list[contextIndex].update(input);
            _this.todoDisplay.updateContextAfterEdit(contextElement, input);
        }
    }

    //Soll das wirklich hier rein? Nicht besser direkt in todoDisplay,
    // nur eine Methode von todoDisplay aufgerufen wird?!!
    onMsDwnCopyTask(event, elementWithHandler, _this) {
        _this.todoDisplay.attachTaskToMouse(event, elementWithHandler);
    } 

    onMsUpAnalyzePosition(event, elementWithHandler, _this, ) {
        if(elementWithHandler.classList.contains('context')){
            const activeContext = _this.contextList.getActiveContext();
            const taskToMoveElement = _this.todoDisplay.temporarySavedTaskElement
            const taskToMoveId = _this.todoDisplay.getItemId(taskToMoveElement);
            const taskToMove = _this.contextList.activeContext.getTask(taskToMoveId);
            const chosenContextElementId = _this.todoDisplay.getItemId(elementWithHandler);
            const chosenContext = _this.contextList.getContext(chosenContextElementId);
            
            chosenContext.appendTask(taskToMove);
            activeContext.deleteTask(taskToMove);
            _this.todoDisplay.removeTask(taskToMoveElement);
            //Prevents executing the mouseup event which is also attached to body
            event.stopPropagation();
        }

        _this.todoDisplay.undoTaskMoveActions();
    }

    removeTask(task) {
        this.contextList.getActiveContext().deleteTask(task);
        //remove this task from current View
    }
}

const todoController = new TodoController(TodoDisplay, Task, Context, ContextList);

