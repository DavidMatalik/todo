import { Item } from './item'

// Class Task Creates unlimited task objects
class Task extends Item {
  constructor(text) {
    super(text)
    this.favorite = false
  }
}

export { Task }
