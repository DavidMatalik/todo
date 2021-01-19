import {Task} from './task';
import {Context} from './context';
import {ContextList} from './contextList';
import {TodoDisplay} from './todoDisplay';

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
        this.todoDisplay.onClickChangeContext = function() {
            _this.onClickChangeContext(this, _this);}
        this.todoDisplay.onDclickEditContext = this.onDclickEditContext.bind(null, this);
        this.todoDisplay.onEnterSaveInput = this.onEnterSaveInput.bind(null, this);
        this.todoDisplay.onMsDwnCopyTask  = function() {
            _this.onMsDwnCopyTask(this, _this)}
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
        _this.todoDisplay.removeElement(elementToDelete)
    }

    onClickChangeContext(elementWithHandler, _this){
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
    onMsDwnCopyTask(elementWithHandler, _this) {
        _this.todoDisplay.attachTaskToMouse(elementWithHandler);
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

export {todoController}