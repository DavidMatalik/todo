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

export {itemsViewMixin}