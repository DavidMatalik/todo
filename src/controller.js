const tasksControllerFactory = function (tasksView, tasksModel) {

    function onClickAddTask() {
        tasksView.setNewItemText();
        tasksModel.addTask(tasksView.newItemText);
        tasksView.renderExistingItems(tasksModel.data);       
    }
    function onClickDeleteTask(event) {
        const taskToDeleteID = event.target.dataset.itemid;
        tasksModel.deleteTask(taskToDeleteID);
        tasksView.renderExistingItems(tasksModel.data);
        
    }
    function initialize() {
        tasksView.onClickAddItem = onClickAddTask;
        tasksView.onClickDeleteItem = onClickDeleteTask;
        tasksView.initialize();
    }
    return { initialize }
}

export {tasksControllerFactory}

//Old initial constructor code rewritten above into factory function
/*const TasksController = function (tasksView, tasksModel) {
    this.tasksView = tasksView;
    this.tasksModel = tasksModel;
}

TasksController.prototype.onClickAddTask = function () {
    console.log('in onClickAddTask');
    this.tasksView.renderExistingTasks(this.tasksModel.data);
    this.tasksView.renderNewTask();
    this.tasksModel.addTask(this.tasksView.newTaskText);
}

TasksController.prototype.initialize = function () {
    this.tasksView.onClickAddTask = this.onClickAddTask.bind(this);
    this.tasksView.initialize();
};*/