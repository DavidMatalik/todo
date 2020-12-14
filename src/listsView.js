const listsViewFactory = function (htmlElement, addButton, inputField) {
    
    return {htmlElement, addButton, inputField}
}

export {listsViewFactory}

/*const createItems = function (itemName, htmlElement, addButton, inputField) {
    let newItemText = null;
    let onClickAddItem = null;
    function initialize() {
        this.addButton.addEventListener('click', this.onClickAddItem);
    };
    function setNewItemText () {
        this.newItemText = this.inputField.value;
    }
    function renderExistingItems(viewModel) {
        this.inputField.value = '';
        this.htmlElement.innerHTML = '';
        viewModel.forEach(renderOneItem, this);
    };
    function renderOneItem(itemObject) {
        const itemID = itemObject.id;
        const p = document.createElement('p');
        const deleteButton = document.createElement('button')

        deleteButton.innerHTML = 'del';
        deleteButton.dataset.itemid = itemID;
        deleteButton.classList.add(`delete${itemName}Button`);
        deleteButton.addEventListener('click', this.onClickDeleteItem);

        p.innerHTML = itemObject.text;
        p.appendChild(deleteButton);
        p.classList.add(`${itemName}`);

        this.htmlElement.appendChild(p);
    };
    return {
        htmlElement, addButton, inputField, newItemText, onClickAddItem, onClickDeleteItem,
        initialize, renderExistingItems, setNewItemText
    }
}*/

/*const tasksViewFactory = function (htmlElement, addButton, inputField) {
    let newTaskText = null;
    let onClickAddTask = null;
    function initialize() {
        this.addButton.addEventListener('click', this.onClickAddTask);
    };
    function setNewTaskText () {
        this.newTaskText = this.inputField.value;
    }
    function renderExistingTasks(viewModel) {
        this.inputField.value = '';
        this.htmlElement.innerHTML = '';
        viewModel.forEach(renderOneTask, this);
    };
    function renderOneTask(taskObject) {
        const taskID = taskObject.id;
        const p = document.createElement('p');
        const deleteButton = document.createElement('button')

        deleteButton.innerHTML = 'del';
        deleteButton.dataset.taskid = taskID;
        deleteButton.classList.add('deleteTaskButton');
        deleteButton.addEventListener('click', this.onClickDeleteTask);

        p.innerHTML = taskObject.text;
        p.appendChild(deleteButton);
        p.classList.add('task');

        this.htmlElement.appendChild(p);
    };
    return {
        htmlElement, addButton, inputField, newTaskText, onClickAddTask, onClickDeleteTask,
        initialize, renderExistingTasks, setNewTaskText
    }
}

export {tasksViewFactory}*/