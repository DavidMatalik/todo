//Code specifically for tasks
const tasksModelFactory = function () {

    return {}
}

//Code specifically for lists
const listsModelFactory = function () {

    return {}
}

//Model-Mixin to create items for tasks, lists, undertasks
const itemsCreationModel = function (data) {
    let creationCounter = 0;
    const addItem = function (itemText) {
            const newItemObject = {
                id :  this.creationCounter,
                text: itemText
            }
            data.push(newItemObject);
            this.creationCounter++;
    }
    const deleteItem = function (itemObjectID) {
        itemObjectID = parseInt(itemObjectID);
        const indexItemToDelete = data.findIndex(function(currentItem) {
            if (currentItem.id === itemObjectID){
                return true;
            }
        })
        data.splice(indexItemToDelete, 1);
    }
    return {data, addItem, deleteItem, creationCounter}
}

//Model-Mixin to validate user input for tasks, lists, undertasks
const itemValidationModel = function () {

    return {
        
    }
}

export  {
            itemsCreationModel, itemValidationModel,
            tasksModelFactory, listsModelFactory
        
        }