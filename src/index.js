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
        this.contextContainer = document.getElementById('context-container');
        this.contextInput = document.getElementById('context-input');
        this.contextButton = document.getElementById('context-add');
        this.taskContainer = document.getElementById('task-container');
        this.taskInput = document.getElementById('task-input');
        this.taskButton = document.getElementById('task-add');

        this.onClickAddContext = null;
        this.onClickDeleteContext = null;
        this.onDclickEditContext = null;
        this.onEnterSaveInput = null;

        this.onClickAddTask = null;
    }

    initListeners() {
        this.contextButton.addEventListener('click', this.onClickAddContext);
        this.taskButton.addEventListener('click', this.onClickAddTask);
    }

    renderAllContexts(contexts) {
        contexts.forEach(this.appendNewContext.bind(this));
    }

    appendNewContext(context) {
        const delBtn = this.createDelBtn();
        const innerContent = this.createInnerContent(context.text, delBtn);
        const contextElement = this.createItemElement(context.id, innerContent);
        this.contextContainer.appendChild(contextElement);
    }

    appendNewTask(task) {
        const delBtn = this.createDelBtn();
        const innerContent = this.createInnerContent(task.text, delBtn);
        const taskElement = this.createItemElement(task.id, innerContent);
        this.taskContainer.appendChild(taskElement);
    }

    createItemElement(id, innerContent) {
        const para = document.createElement('p');
        para.classList.add('context');
        para.dataset.itemid = id;
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

    getElementToDelete(event) {
        return event.target.parentNode.parentNode;
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

    renderTasks(tasks) {
        //Display tasks of inbox context
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
        this.todoDisplay.onClickAddContext = this.onClickAddContext.bind(this);
        this.todoDisplay.onClickAddTask = this.onClickAddTask.bind(this);
        // Writing conlickDeleteContext so, that following arguments are passed:  
        // this which equals TodoController object
        // event of event Listener which isn't seen here 
        // but can be accessed as last parameter in onClickDeleteContext
        this.todoDisplay.onClickDeleteContext = this.onClickDeleteContext.bind(null, this);
        this.todoDisplay.onDclickEditContext = this.onDclickEditContext.bind(null, this);
        this.todoDisplay.onEnterSaveInput = this.onEnterSaveInput.bind(null, this);
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
        this.todoDisplay.renderAllContexts(this.contextList.getAllContexts());
    }
    
    createNewTask(text) {
        const task = new this.Task(text);  
        this.contextList.getActiveContext().appendTask(task);
        this.todoDisplay.appendNewTask(task);
    }

    createNewContext(text) {
        const context = new this.Context(text);  
        this.contextList.addNewContext(context);
        this.todoDisplay.appendNewContext(context);
    }

    onClickDeleteContext(_this, event) {
        const elementToDelete = _this.todoDisplay.getElementToDelete(event);
        const itemToDeleteId = _this.todoDisplay.getItemId(elementToDelete);
        _this.contextList.deleteContext(itemToDeleteId);
        _this.todoDisplay.removeContext(elementToDelete)
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
    
    removeTask(task) {
        this.contextList.getActiveContext().deleteTask(task);
        //remove this task from current View
    }

    /* Move a Task
    1. Describe Problem: A task can be easily moved from one context to another context. When User
       clicks on a task and holds the click he should be able to move it around the page. When user
       let go of click and task is somewhere on the page nothing should happen. When user let go of
       click and taks is on a different context the task should go into this context. And it should
       dissappear from the current context.
    2. Plan how to solve Problem: 
        - Implement click hold event on a task#
            On mouse down event on a task:
                Create a transparent copy of the clicked on task
                Create a mouseup listener for the whole page
            The transparent copy should follow the mouse movement
        - Implement let go of click event
            What if task lays over two context elements?
            Check on which context Elements the task lays over
            Check on which context the biggest part lays
            Remove transparent copy
            Remove task from current view 
            Remove task from current context
            Add task to chosen context     */
}

const todoController = new TodoController(TodoDisplay, Task, Context, ContextList);
todoController.createNewContext('contextB');
todoController.createNewContext('contextC');

