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
        console.log(contextId);
        //Warum kommt bei folgener Zeile -1 raus und nicht passender Index?
        const contextIndexInList = this.getIndexOfContext(contextId);
        console.log(contextIndexInList);
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

    /* editContext

    Describe Problem: If user doublecklicks on context
    it should be editable. If user presses enter changes should be saved
    
    Plan: 
    - Add onDclickEditContext on every context in TodoDisplay 
    in appendNewContext
    - Write logic of onDclickEditContext in TodoController
        Call editContext in TodoDisplay
    - Write editContext logic in TodoDisplay: 
        Create inputbox 
        Put context text into inputbox
        Create onEnterSaveInput listener for inputbox
    -   Write logic of onEnterSaveInput in TodoController
        Call updateContext in Context
        Call updateContext in TodoDisplay
    Code and plan further: 
    */

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
    }

    initListeners() {
        this.contextButton.addEventListener('click', this.onClickAddContext);
    }

    renderAllContexts(contexts) {
        contexts.forEach(this.appendNewContext.bind(this));
    }

    appendNewContext(context) {
        const delBtn = this.createDelBtn();
        const innerContent = this.createInnerContent(context.text, delBtn);
        const contextElement = this.createContextElement(context.id, innerContent);
        // contextElement.addEventListener('dblclick', this.onDclickEditContext)
        this.contextContainer.appendChild(contextElement);
    }

    createContextElement(id, innerContent) {
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
        const innerContent = document.createElement('div');
        const span = document.createElement('span');
        span.innerHTML = text;
        innerContent.appendChild(span);
        innerContent.appendChild(delBtn);
        return innerContent;
    }
    
    prepareContextEdit(span){
        //Implement helper methods for code below
        const inputBox = document.createElement('input');
        const placeHolder = span.firstChild.textContent;
        //Name paraElements better maybe currentInnerContent?
        this.paraElements = span.parentNode;
        const para = this.paraElements.parentNode;
        inputBox.type = 'text';
        inputBox.placeholder = placeHolder;
        inputBox.addEventListener('keyup', this.onEnterSaveInput)
        para.firstChild.remove();
        para.appendChild(inputBox);
    }

    removeContext(element) {
        element.remove();
    }

    updateContextAfterEdit(para, text) {
        this.paraElements.firstChild.innerHTML = text;
        //Remove inputBox
        para.firstChild.remove();
        //Append updated Text and Delete Button
        para.appendChild(this.paraElements);
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
}

const todoController = new TodoController(TodoDisplay, Task, Context, ContextList);
todoController.createNewTask('taskA');
todoController.createNewTask('taskB');
todoController.createNewContext('contextB');
todoController.createNewContext('contextC');

