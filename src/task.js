// Class Task Creates unlimited task objects
class Task {
  constructor(task) {
    this.text = task.text
    this.favorite = false
    this.id = task.id
  }
}

export { Task }
