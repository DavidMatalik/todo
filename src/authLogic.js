import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { createLoginForm, createRegistrationStartingPoint } from './authDisplay'

let parentElement = null
let renderApplication = null

const manageAuthentication = (specifiedElement, renderApp) => {
  parentElement = specifiedElement
  renderApplication = renderApp

  createRegistrationStartingPoint(parentElement, registerNewUser)
  createLoginForm(parentElement, loginUser)
}

const registerNewUser = (ev) => {
  ev.preventDefault()
  const form = ev.target
  const emailValue = form.querySelector('#new-user-email').value
  const passwordValue = form.querySelector('#new-user-password').value

  const auth = getAuth()
  createUserWithEmailAndPassword(auth, emailValue, passwordValue).then(
    (userCredential) => {
      const user = userCredential.user
      console.log(user)
      renderApplication()
    }
  )
}

const loginUser = (ev) => {
  ev.preventDefault()
  const form = ev.target
  const emailValue = form.querySelector('#login-email').value
  const passwordValue = form.querySelector('#login-password').value

  const auth = getAuth()
  signInWithEmailAndPassword(auth, emailValue, passwordValue).then(() =>
    renderApplication()
  )
}

export { manageAuthentication }
