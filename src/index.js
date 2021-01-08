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

    removeTask(task) {
        const isSameId = taskToCompare => taskToCompare.id === task.id;
        const foundIndex = this.taskList.findIndex(isSameId);
        this.taskList.splice(foundIndex, 1);
    }
}

class ContextList {
    //ContextList object in todoController erstellen oder?
    //Was soll beim erstellen der ContextList passieren? 
    //inboxContext standardmäßig --> Dafür benötigen wir Context Klasse
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

const contextList = new ContextList(Context);
console.log(contextList);

class TodoDisplay {

}

class TodoController {
    constructor(todoDisplay, Task, Context) {
        this.todoDisplay = todoDisplay;
        this.Task = Task;
        this.Context = Context;

        this.init();
    }

    init() {
        this.loadContext();
    }

    loadContext() {
        this.activeContext = new this.Context('inbox');
    }
    
    createNewTask(text) {
        const task = new this.Task(text);   
        this.activeContext.appendTask(task);
    }    
}

// const todoController = new TodoController("", Task, Context);
// todoController.createNewTask('taskA');
// todoController.createNewTask('taskB')
// todoController.activeContext.removeTask({text: "taskA", id: 2, favorite: false});
// console.log(todoController.activeContext);
