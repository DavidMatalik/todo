const itemsViewMixin = function (itemName) {
    let onClickAddItem = null;
    let onClickDeleteItem = null;

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
        deleteButton.classList.add(`delete-${itemName}-button`);
        deleteButton.addEventListener('click', this.onClickDeleteItem);

        p.innerHTML = itemObject.text;
        p.appendChild(deleteButton);
        p.classList.add(`${itemName}`);

        this.htmlElement.appendChild(p);
    };
    return {
        initialize, setNewItemText, renderExistingItems, onClickAddItem, onClickDeleteItem
    }
}

const itemsControllerMixin = function (itemsView, itemsModel) {
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

const itemsModelMixin = function (data) {
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

export {itemsViewMixin, itemsControllerMixin, itemsModelMixin}