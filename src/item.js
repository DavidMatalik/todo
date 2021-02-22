// Is used by Task and Context to inherit properties and methods
class Item {
  constructor(text) {
    this.text = text
    this.id = Item.countInstances()
  }

  static countInstances() {
    Item.count = (Item.count || 0) + 1
    return Item.count
  }
}

export { Item }
