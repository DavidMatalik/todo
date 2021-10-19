import { app } from './firebaseApp'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore/lite'
import {
  createLoginForm,
  createRegistrationStartingPoint,
  renderAuthenticationError,
} from './authDisplay'
import { FirebaseError } from 'firebase/app'

const db = getFirestore(app)
let parentElement = null
let renderApplication = null

const manageAuthentication = (specifiedElement, renderApp) => {
  parentElement = specifiedElement
  renderApplication = renderApp

  createLoginForm(parentElement, loginUserAndLoadApp)
  createRegistrationStartingPoint(parentElement, registerNewUserAndLoadApp)
}

const registerNewUserAndLoadApp = (ev) => {
  ev.preventDefault()
  const form = ev.target
  const emailValue = form.querySelector('#new-user-email').value
  const passwordValue = form.querySelector('#new-user-password').value

  const auth = getAuth()
  createUserWithEmailAndPassword(auth, emailValue, passwordValue)
    .then((userCredential) => {
      parentElement.remove()

      const user = userCredential.user
      createUserDefaultLists(user).then(() => renderApplication(user))
    })
    .catch((error) => {
      handleRegistrationError(error)
    })
}

const handleRegistrationError = (error) => {
  if (error instanceof FirebaseError) {
    if (error.message === 'Firebase: Error (auth/invalid-email).') {
      renderAuthenticationError('Please enter a valid email address')
    }
    if (error.message === 'Firebase: Error (auth/weak-password).') {
      renderAuthenticationError(
        'Please use a Password with at least 6 characters'
      )
    }
  }
}

const createUserDefaultLists = (user) => {
  const newContextRef = doc(collection(db, user.uid))

  return setDoc(newContextRef, {
    default: true,
    id: newContextRef.id,
    text: 'inbox',
  })
}

const loginUserAndLoadApp = (ev) => {
  ev.preventDefault()
  const form = ev.target
  const emailValue = form.querySelector('#login-email').value
  const passwordValue = form.querySelector('#login-password').value

  const auth = getAuth()
  signInWithEmailAndPassword(auth, emailValue, passwordValue).then(
    (userCredential) => {
      const user = userCredential.user
      renderApplication(user)
    }
  )
}

export { manageAuthentication }
