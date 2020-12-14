const tasksModelFactory = function (data) {
    let creationCounter = 0;
    const addTask = function (taskText) {
            const newTaskObject = {
                id :  this.creationCounter,
                text: taskText
            }
            data.push(newTaskObject);
            this.creationCounter++;
    }
    const deleteTask = function (taskObjectID) {
        taskObjectID = parseInt(taskObjectID);
        const indexTaskToDelete = data.findIndex(function(currentTask) {
            if (currentTask.id === taskObjectID){
                return true;
            }
        })
        data.splice(indexTaskToDelete, 1);
    }
    return { data, addTask, deleteTask, creationCounter }
}

export {tasksModelFactory}

//Old initial constructor code rewritten above into factory function
/*const TasksModel = function (data) {
    this.data = data;
    this.addTask = function (newTask) {
        this.data.push(newTask);
    }
}*/