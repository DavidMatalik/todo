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
  renderLogout,
} from './authDisplay'
import { FirebaseError } from 'firebase/app'

const db = getFirestore(app)
const auth = getAuth()
const appElement = document.querySelector('#app-container')

let parentElement = null
let renderApplication = null

const logoutUser = () => {
  auth.signOut().then(() => {
    console.log('user logged out')
    // Write logic that start of App is rendered
    // At the moment: Hide/Delete app element and render auth form
  })
}

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

  createUserWithEmailAndPassword(auth, emailValue, passwordValue).then(
    (userCredential) => {
      parentElement.remove()

      const user = userCredential.user
      createUserDefaultLists(user)
        .then(() => {
          renderApplication(user)
          renderLogout(logoutUser, appElement)
        })
        .catch((error) => {
          handleRegistrationError(error)
        })
    }
  )
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

  signInWithEmailAndPassword(auth, emailValue, passwordValue)
    .then((userCredential) => {
      parentElement.remove()

      const user = userCredential.user
      renderApplication(user)
      renderLogout(logoutUser, appElement)
    })
    .catch((error) => {
      handleLoginError(error)
    })
}

const handleLoginError = (error) => {
  if (error instanceof FirebaseError) {
    if (error.message === 'Firebase: Error (auth/user-not-found).') {
      renderAuthenticationError(
        'There is no user registered with this email address'
      )
    }
    if (error.message === 'Firebase: Error (auth/wrong-password).') {
      renderAuthenticationError(
        'This is not the correct password for this user'
      )
    }
  }
}

export { manageAuthentication }
