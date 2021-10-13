import { app } from './firebaseApp'
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore/lite'

// Create firestore object
const db = getFirestore(app)

// Class Task Creates unlimited task objects
class Task {
  constructor(data, contextId, user) {
    // When tasks are created from db objects
    if (typeof data === 'object') {
      this.text = data.text
      this.id = data.id
      // When tasks are created from user inputs
    } else if (typeof data === 'string') {
      this.user = user
      const newTaskRef = doc(
        collection(db, `${this.user.uid}/${contextId}/tasks`)
      )
      this.text = data
      this.id = newTaskRef.id
      setDoc(newTaskRef, {
        id: newTaskRef.id,
        text: data,
      })
    }

    this.favorite = false
  }
}

export { Task }
