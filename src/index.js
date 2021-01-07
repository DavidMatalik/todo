class Item {
    constructor(text) {
        this.text = text;
        this.identifier = Item.countInstances();
    }
    
    static countInstances() {
        Item.count = (Item.count || 0) + 1;
        return Item.count;
    }

    //deleteItem
    //editItem
}

class Task extends Item {
    constructor(text) {
        super(text);
        this.favorite = false;
    }
}

class Context extends Item {
    //array taskList
}

class ActiveContext {
    //array contextList
    //object activeContext
}

class TodoDisplay {

}

class TodoController {
    constructor(activeContext, todoDisplay, task, context) {

    }
    //init
}
