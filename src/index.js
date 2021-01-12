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

    //editItem
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
        contextId = parseInt(contextId);
        const contextListIndex = this.list.findIndex(function(currentContext) {
            if (currentContext.id === contextId){
                return true;
            }
        })
    this.list.splice(contextListIndex, 1);
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
    }

    initListeners() {
        this.contextButton.addEventListener('click', this.onClickAddContext);
    }

    renderAllContexts(contexts) {
        contexts.forEach(this.appendNewContext.bind(this));
    }

    appendNewContext(context) {
        const para = document.createElement('p');
        para.innerHTML = context.text;
        para.classList.add('context');
        this.addDeleteButton(para, context);
        this.contextContainer.appendChild(para);
    }

    addDeleteButton(paragraph, context){
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'del';
        deleteButton.dataset.itemid = context.id;
        // deleteButton.classList.add(`delete-${itemName}-button`);
        deleteButton.addEventListener('click', this.onClickDeleteContext);
        paragraph.appendChild(deleteButton);
    }
    
    renderTasks(tasks) {
        //Display tasks of inbox context
    }

    removeContext(element) {
        element.remove();
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
        // Writing conlickDeleteContext so, that following arguments are passed:  
        // this which equals TodoController object
        // event of event Listener which isn't seen here 
        // but can be accessed as last parameter in onClickDeleteContext
        this.todoDisplay.onClickDeleteContext = this.onClickDeleteContext.bind(null, this);
        this.todoDisplay.initListeners();
        this.loadStartPage();
    }

    onClickAddContext() {
        const userInput = this.todoDisplay.contextInput.value;
        this.createNewContext(userInput);
    }

    loadStartPage() {
        this.activeContext = this.contextList.getActiveContext();
        this.todoDisplay.renderAllContexts(this.contextList.getAllContexts());
    }
    
    createNewTask(text) {
        const task = new this.Task(text);  
        this.contextList.getActiveContext().appendTask(task);
    }

    createNewContext(text) {
        const context = new this.Context(text);  
        this.contextList.addNewContext(context);
        this.todoDisplay.appendNewContext(context);
    }

    onClickDeleteContext(_this, event) {
        const elementToDelete = event.target.parentNode;
        const itemToDeleteID = event.target.dataset.itemid;
        _this.contextList.deleteContext(itemToDeleteID);
        _this.todoDisplay.removeContext(elementToDelete)
    }
    
    
    removeTask(task) {
        this.contextList.getActiveContext().deleteTask(task);
        //remove this task from current View
    }
}

const todoController = new TodoController(TodoDisplay, Task, Context, ContextList);
todoController.createNewTask('taskA');
todoController.createNewTask('taskB');
todoController.createNewContext('contextB');
todoController.createNewContext('contextC');



