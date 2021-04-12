// Class Item Is used by Task and Context to inherit properties and methods
class Item {
  constructor(text) {
    this.text = text
    /* Give every new Item a unique id. Though it might be easier and better practice
    to give unique id with Date.now() */
    this.id = Item.countInstances()
  }

  static countInstances() {
    Item.count = (Item.count || 0) + 1
    return Item.count
  }
}

export { Item }
