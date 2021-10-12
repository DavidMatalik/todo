import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'

let parentElement = null
let renderApplication = null

const createEmailField = (naming) => {
  const emailField = document.createElement('input')
  emailField.id = `${naming}`
  emailField.type = 'email'
  return emailField
}

const createPasswordField = (naming) => {
  const passwordField = document.createElement('input')
  passwordField.id = `${naming}`
  passwordField.type = 'password'
  return passwordField
}

const createSubmitButton = (naming) => {
  const submitButton = document.createElement('input')
  submitButton.id = `${naming}`
  submitButton.type = 'submit'
  return submitButton
}

const appendChildren = (parent, children) => {
  children.forEach((child) => {
    parent.appendChild(child)
  })
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

const createNewUserForm = () => {
  const emailField = createEmailField('new-user-email')
  const passwordField = createPasswordField('new-user-password')
  const submitButton = createSubmitButton('new-user-submit')

  const newUserForm = document.createElement('form')
  newUserForm.addEventListener('submit', registerNewUser)
  appendChildren(newUserForm, [emailField, passwordField, submitButton])

  parentElement.appendChild(newUserForm)
}

const createRegistrationStartingPoint = (specifiedElement, renderApp) => {
  parentElement = specifiedElement
  renderApplication = renderApp

  const createAccount = document.createElement('button')
  createAccount.id = 'createAccount'
  createAccount.textContent = 'Create new Account'
  createAccount.addEventListener('click', createNewUserForm)

  parentElement.appendChild(createAccount)
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

const createLoginForm = (specifiedElement, renderApp) => {
  parentElement = specifiedElement
  renderApplication = renderApp

  const emailField = createEmailField('login-email')
  const passwordField = createPasswordField('login-password')
  const submitButton = createSubmitButton('login-submit')

  const newUserForm = document.createElement('form')
  newUserForm.addEventListener('submit', loginUser)
  appendChildren(newUserForm, [emailField, passwordField, submitButton])

  parentElement.appendChild(newUserForm)
}

export { createRegistrationStartingPoint, createLoginForm }
