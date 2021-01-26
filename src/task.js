import { Item } from './item'

// Creates unlimited task objects
class Task extends Item {
  constructor (text) {
    super(text)
    this.favorite = false
  }
}

export { Task }
