const tasksModelFactory = function () {

    return {}
}

export {tasksModelFactory}

//Old initial constructor code rewritten above into factory function
/*const TasksModel = function (data) {
    this.data = data;
    this.addTask = function (newTask) {
        this.data.push(newTask);
    }
}*/