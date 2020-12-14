//editTask

//moveTask (inside a taskList and to another taskList)

const tasksViewFactory = function (htmlElement, addButton, inputField) {
    
    return {
        htmlElement, addButton, inputField
    }
}

export {tasksViewFactory}

//Old initial constructor Code rewritten above into Factory function
/*const TasksView = function (htmlElement, addButton, inputField) {
    this.htmlElement = htmlElement;
    this.addButton = addButton;
    this.inputField = inputField;
    this.newTaskText = null;
    this.onClickAddTask = null;
}
TasksView.prototype.initialize = function () {
    this.addButton.addEventListener('click', this.onClickAddTask);
};
TasksView.prototype.renderExistingTasks = function (viewModel) {
    this.htmlElement.innerHTML = '';
    viewModel.forEach(this.renderOneTask.bind(this));
}
TasksView.prototype.renderNewTask = function () {
    this.newTaskText = this.inputField.value;
    this.inputField.value = '';
    this.renderOneTask(this.newTaskText);
}
TasksView.prototype.renderOneTask = function (task) {
    const p = document.createElement("p");  
    p.innerHTML = task;
    this.htmlElement.appendChild(p);
}*/