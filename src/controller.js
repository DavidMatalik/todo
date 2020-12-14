//Code specifically for tasks
const tasksControllerFactory = function () {

    return {}
}

//Code specifically for lists
const listsControllerFactory = function () {

    return {
        
    }
}

//Controller-Mixin to create items for tasks, lists, undertasks
const itemsCreationController = function (itemsView, itemsModel) {
    function onClickAddItem() {
        itemsView.setNewItemText();
        itemsModel.addItem(itemsView.newItemText);
        itemsView.renderExistingItems(itemsModel.data);       
    }
    function onClickDeleteItem(event) {
        const itemToDeleteID = event.target.dataset.itemid;
        itemsModel.deleteItem(itemToDeleteID);
        itemsView.renderExistingItems(itemsModel.data);
    }
    function initialize() {
        itemsView.onClickAddItem = onClickAddItem;
        itemsView.onClickDeleteItem = onClickDeleteItem;
        itemsView.initialize();
    }
    return {initialize}
}

//Controller-Mixin to validate user input for tasks, lists, undertasks
const itemValidationController = function () {

    return {
        
    }
}

export  {
            itemsCreationController, itemValidationController,
            listsControllerFactory,  tasksControllerFactory  
}