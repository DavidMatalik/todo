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

class Task extends Item {
    constructor(text) {
        super(text);
        this.favorite = false;
    }
    //Bei Erstellung muss es gleich richtiger ContextListe zugeordnet werden 
    // --> Über TodoController
}

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

class ContextList {
    constructor(Context){
        this.Context = Context;
        this.list = [];
        this.init();
    }

    init() {
        const defaultContext = new Context('inbox');
        this.appendContext(defaultContext);
        this.setActiveContext(defaultContext);
    }

    appendContext(context) {
        this.list.push(context);
    }

    setActiveContext(context) {
        this.activeContext = context;
    }

    getActiveContext() {
        return this.activeContext;
    }
}

class TodoDisplay {

}

class TodoController {
    constructor(todoDisplay, Task, Context,ContextList) {
        this.todoDisplay = todoDisplay;
        this.Task = Task;
        this.Context = Context;
        this.contextList = new ContextList(this.Context);

        this.init();
    }

    init() {
        this.loadContext();
    }

    loadContext() {
        this.activeContext = this.contextList.getActiveContext();
        //render activeContext in todoDisplay
    }
    
    createNewTask(text) {
        const task = new this.Task(text);  
        this.contextList.getActiveContext().appendTask(task);
    }
    
    removeTask(task) {
        this.contextList.getActiveContext().deleteTask(task);
        //remove this task from current View
    }
}

const todoController = new TodoController("", Task, Context, ContextList);

todoController.createNewTask('taskA');
todoController.createNewTask('taskB')
todoController.removeTask({text: "taskA", id: 1, favorite: false});
console.log(todoController);
