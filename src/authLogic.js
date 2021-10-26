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
  removeAuthentication,
  renderLogout,
  clearApplicationData,
  renderStartScreen,
} from './authDisplay'
import { FirebaseError } from 'firebase/app'

const db = getFirestore(app)
const auth = getAuth()

const appElement = document.querySelector('#app-container')
const authContainer = document.querySelector('#auth-container')

let renderApplication = null

const manageAuthentication = (renderApp) => {
  renderApplication = renderApp
}

auth.onAuthStateChanged((user) => {
  // If no user is logged in
  if (!user) {
    createLoginForm(authContainer, loginUserAndLoadApp)
    createRegistrationStartingPoint(authContainer, registerNewUserAndLoadApp)
  } else {
    // User signed in for first time
    if (user.metadata.creationTime === user.metadata.lastSignInTime) {
      createUserDefaultLists(user).then(() => renderLoginContent(user))
      // User was already signed in
    } else {
      renderLoginContent(user)
    }
  }
})

const registerNewUserAndLoadApp = (ev) => {
  ev.preventDefault()
  const form = ev.target
  const emailValue = form.querySelector('#new-user-email').value
  const passwordValue = form.querySelector('#new-user-password').value

  createUserWithEmailAndPassword(
    auth,
    emailValue,
    passwordValue
  ).catch((error) => handleRegistrationError(error))
}

const createUserDefaultLists = (user) => {
  const newContextRef = doc(collection(db, user.uid))

  return setDoc(newContextRef, {
    default: true,
    id: newContextRef.id,
    text: 'inbox',
  })
}

const renderLoginContent = (user) => {
  removeAuthentication(authContainer)
  renderApplication(user)
  renderLogout(logoutUser, appElement)
}

const logoutUser = () => {
  auth.signOut().then(() => {
    clearApplicationData()
    renderStartScreen(appElement)
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

const loginUserAndLoadApp = (ev) => {
  ev.preventDefault()
  const form = ev.target
  const emailValue = form.querySelector('#login-email').value
  const passwordValue = form.querySelector('#login-password').value

  signInWithEmailAndPassword(auth, emailValue, passwordValue).catch((error) => {
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
