const tasksControllerFactory = function () {

    return {}
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