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

class ActiveContext {
    //array contextList
    //object activeContext
}

class TodoDisplay {

}

class TodoController {
    constructor(todoDisplay, Task, Context) {
        this.todoDisplay = todoDisplay;
        this.Task = Task;
        this.Context = Context;

        this.init();
    }
    
    //under construction
    // createNewTask(text) {
    //     const task = new this.Task(text);   
    // }

    init() {
        this.loadContext();
    }

    loadContext() {
        this.activeContext = new this.Context('inbox');
        console.log(this.activeContext);
    }
}

const todoControlloer = new TodoController("", Task, Context);
// todoControlloer.createNewTask('taskA')