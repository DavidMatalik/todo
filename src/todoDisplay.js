//Creates the right view of the current state of objects
class TodoDisplay {
    constructor() {
        this.bodyElement = document.querySelector('body');
        this.contextContainer = document.getElementById('context-container');
        this.contextInput = document.getElementById('context-input');
        this.contextButton = document.getElementById('context-add');
        this.taskContainer = document.getElementById('task-container');
        this.taskList = document.getElementById('tasks');
        this.taskInput = document.getElementById('task-input');
        this.taskButton = document.getElementById('task-add');
        this.activeContext = null;

        this.onClickAddContext = null;
        this.onClickDeleteContext = null;
        this.onClickChangeContext = null;
        this.onDclickEditContext = null;
        this.onEnterSaveInput = null;

        this.onClickAddTask = null;
        this.onMsDwnCopyTask = null;
        this.onMsUpAnalyzePosition = null;
    }

    initListeners() {
        this.contextButton.addEventListener('click', this.onClickAddContext);
        this.taskButton.addEventListener('click', this.onClickAddTask);
    }

    renderAllContexts(contexts, activeContext) {
        // Render context elements
        contexts.forEach(this.appendNewContext.bind(this));
        // Highlight active context element
        this.activeContext = document.querySelector(`[data-itemid="${activeContext.id}"]`);
        this.highlightActiveContext(this.activeContext);
    }

    appendNewContext(context) {
        const delBtn = this.createDelBtn();
        const innerContent = this.createInnerContent(context.text, delBtn);
        const className = 'context';
        const contextElement = this.createItemElement(context.id, innerContent, className);
        contextElement.addEventListener('click', this.onClickChangeContext);
        this.contextContainer.appendChild(contextElement);
    }

    highlightActiveContext(element){
        this.activeContext.style.border = 'none';
        this.activeContext = element;
        element.style.border = '1px solid black';
    }

    renderTasks(tasks) {
        this.taskList.innerHTML = '';
        tasks.forEach(this.appendNewTask.bind(this));
    }

    appendNewTask(task) {
        const delBtn = this.createDelBtn();
        const innerContent = this.createInnerContent(task.text, delBtn);
        const className = 'task';
        const taskElement = this.createItemElement(task.id, innerContent, className);
        taskElement.classList.add('task'); //Better extra Method
        taskElement.addEventListener('mousedown', this.onMsDwnCopyTask);
        this.taskList.appendChild(taskElement);
    }

    /* Helper functions to create Task or Context: 
    createItemElement, createDelBtn, createInnerContent*/

    createItemElement(id, innerContent, className) {
        const para = document.createElement('p');
        para.dataset.itemid = id;
        para.classList.add(className);
        para.addEventListener('dblclick', this.onDclickEditContext);
        para.appendChild(innerContent);
        return para;
    }

    createDelBtn(){
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'del';
        deleteButton.addEventListener('click', this.onClickDeleteContext);
        return deleteButton;
    }

    createInnerContent(text, delBtn) {
        //Here you could create an extra method to separate span 
        const innerContent = document.createElement('div');
        const span = document.createElement('span');
        span.innerHTML = text;
        innerContent.appendChild(span);
        innerContent.appendChild(delBtn);
        return innerContent;
    }

    /*Edit Context functions: prepareContextEdit, createInputBox, 
    saveContextElements, createEditableElement, updateContextAfterEdit  */
    
    prepareContextEdit(textElement){
        const inputBox = this.createInputBox(textElement);
        this.saveContextElements(textElement);
        this.createEditableElement(inputBox);
    }

    createInputBox(textElement) {
        const inputBox = document.createElement('input');
        const placeHolder = textElement.firstChild.textContent;
        inputBox.type = 'text';
        inputBox.placeholder = placeHolder;
        inputBox.addEventListener('keyup', this.onEnterSaveInput);
        return inputBox;
    }

    saveContextElements(textElement) {
        this.contextElements = textElement.parentNode;
    }

    createEditableElement(inputBox){
        const para = this.contextElements.parentNode;
        para.firstChild.remove();
        para.appendChild(inputBox);
    }

    updateContextAfterEdit(para, text) {
        this.contextElements.firstChild.innerHTML = text;
        //Remove inputBox
        para.firstChild.remove();
        //Append updated Text and Delete Button
        para.appendChild(this.contextElements);
    }

    /* Move task to other context functions: attachTasktoMouse, onMsOverHighlight, onMsOutNormal
    createTaskCopy, moveTaskWithMouse, removeTaskCopy, undoTaskMoveActions */

    attachTaskToMouse(elementWithHandler) {
        const taskElementCopy = this.createTaskCopy(elementWithHandler);

        //Append mousemovement listener for moving the task with mouse
        this.bodyElement.addEventListener('mousemove', 
        this.moveTaskWithMouse.bind(null, this, taskElementCopy));

        // Append mouseup listener to whole page
        this.bodyElement.addEventListener('mouseup', this.onMsUpAnalyzePosition);

        //Add mousehover event Listener to every context element
        const contexts = document.querySelectorAll('.context');
        const _this = this;
        contexts.forEach(function(element) {
            element.addEventListener('mouseover', _this.onMsOverHighlight)
            element.addEventListener('mouseout', _this.onMsOutNormal)
            element.addEventListener('mouseup', _this.onMsUpAnalyzePosition);
        });
    }

    onMsOverHighlight(){
        this.style.backgroundColor = 'green';
    }


    onMsOutNormal(){
        this.style.backgroundColor = 'aqua';
    }

    createTaskCopy(elementWithHandler) {
        this.temporarySavedTaskElement = elementWithHandler;
        const taskElementCopy = this.temporarySavedTaskElement.cloneNode(true);
        taskElementCopy.style.backgroundColor = 'red';
        taskElementCopy.id = 'task-copy';
        this.bodyElement.appendChild(taskElementCopy);
        return taskElementCopy;
    }

    moveTaskWithMouse(_this, taskElementCopy, event) {
        //Put copy at specified position
        const mousePositionHorizontal = event.x;
        const mousePositionVertical = event.y;
        taskElementCopy.style.position = 'absolute';
        taskElementCopy.style.top = `${mousePositionVertical}px`;
        taskElementCopy.style.left = `${mousePositionHorizontal + 10}px`;
    }

    removeTaskCopy() {
        const taskElementCopy = document.getElementById('task-copy');
        taskElementCopy.remove();
    }

    undoTaskMoveActions() {
        this.removeTaskCopy();
        this.bodyElement.removeEventListener('mouseup', this.onMsUpAnalyzePosition);
        
        const contexts = document.querySelectorAll('.context');
        const _this = this;
        contexts.forEach(function(element) {
            element.removeEventListener('mouseover', _this.onMsOverHighlight);
            element.removeEventListener('mouseout', _this.onMsOutNormal);
            element.removeEventListener('mouseup', _this.onMsUpAnalyzePosition);
            element.style.backgroundColor = 'aqua';
        });
    }

    //Simple Helper functions

    getItemId(element) {
        return element.dataset.itemid;
    }

    getContextElement(event) {
        return event.target.parentNode;
    }

    getContextInputValue(){
        return this.contextInput.value;
    }

    removeElement(element) {
        element.remove();
    }

    getElementToDelete(event) {
        return event.target.parentNode.parentNode;
    }

    getTaskInputValue(){
        return this.taskInput.value;
    }

    getUserInput(event) {
        return event.target.value;
    }
}

export {TodoDisplay}