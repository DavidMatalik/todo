const listsControllerFactory = function () {
    
    return {}
}



export {listsControllerFactory}

/*const tasksControllerFactory = function (tasksView, tasksModel) {

    function onClickAddTask() {
        tasksView.setNewTaskText();
        tasksModel.addTask(tasksView.newTaskText);
        tasksView.renderExistingTasks(tasksModel.data);       
    }
    function onClickDeleteTask(event) {
        const taskToDeleteID = event.target.dataset.taskid;
        //Delete Task from Model
        tasksModel.deleteTask(taskToDeleteID);
        tasksView.renderExistingTasks(tasksModel.data);
        
    }
    function initialize() {
        tasksView.onClickAddTask = onClickAddTask;
        tasksView.onClickDeleteTask = onClickDeleteTask;
        tasksView.initialize();
    }
    return { initialize }
}

export {tasksControllerFactory}*/