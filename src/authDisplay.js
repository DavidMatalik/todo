let registerUser = null
const accountContainer = document.querySelector('#account-container')
const authContainer = document.querySelector('#auth-container')
const startscreenContainer = document.querySelector('#startscreen-container')

const createEmailField = (naming) => {
  const emailField = document.createElement('input')
  emailField.id = `${naming}`
  emailField.type = 'email'
  emailField.placeholder = 'Email: '
  return emailField
}

const createPasswordField = (naming) => {
  const passwordField = document.createElement('input')
  passwordField.id = `${naming}`
  passwordField.type = 'password'
  passwordField.placeholder = 'Password: '
  return passwordField
}

const createSubmitButton = (id, value) => {
  const submitButton = document.createElement('input')
  submitButton.id = id
  submitButton.type = 'submit'
  submitButton.value = value
  return submitButton
}

const createRegistrationStartingPoint = (registerNewUser) => {
  registerUser = registerNewUser
  let formCreated = false

  const createAccount = document.createElement('button')
  createAccount.id = 'create-account'
  createAccount.textContent = 'Sign up'
  createAccount.addEventListener('click', () => {
    if (!formCreated) {
      createNewUserForm(createAccount)
      formCreated = true
    }
  })

  const errorMessage = document.createElement('div')
  errorMessage.id = 'auth-error'
  errorMessage.classList.add('hide')

  appendChildren(authContainer, [createAccount, errorMessage])
}

const createNewUserForm = (previousElement) => {
  const emailField = createEmailField('new-user-email')
  const passwordField = createPasswordField('new-user-password')
  const submitButton = createSubmitButton('new-user-submit', 'Register')

  const newUserForm = document.createElement('form')
  newUserForm.classList.add('auth-form')
  newUserForm.addEventListener('submit', (ev) => {
    registerUser(ev)
  })
  appendChildren(newUserForm, [emailField, passwordField, submitButton])

  previousElement.after(newUserForm)
}

const createLoginForm = (loginUser) => {
  const emailField = createEmailField('login-email')
  const passwordField = createPasswordField('login-password')
  const submitButton = createSubmitButton('login-submit', 'Login')

  const newUserForm = document.createElement('form')
  newUserForm.classList.add('auth-form')
  newUserForm.addEventListener('submit', (ev) => {
    loginUser(ev)
  })
  appendChildren(newUserForm, [emailField, passwordField, submitButton])

  authContainer.appendChild(newUserForm)
}

const renderAuthenticationError = (errorText) => {
  const errorElement = document.querySelector('#auth-error')
  errorElement.textContent = errorText
  errorElement.classList.remove('hide')
}

const renderLogout = (logoutUser, appElement) => {
  const logoutButton = document.createElement('button')
  logoutButton.id = 'logout-button'
  logoutButton.textContent = 'Logout'
  logoutButton.addEventListener('click', logoutUser)

  accountContainer.appendChild(logoutButton)
}

const renderUserInformation = (email) => {
  const userEmail = document.createElement('div')
  userEmail.innerText = email
  userEmail.id = 'account-email'

  accountContainer.appendChild(userEmail)
  accountContainer.classList.add('show-flex')
  accountContainer.classList.remove('hide')
}

const removeAuthentication = () => {
  authContainer.innerHTML = ''
  startscreenContainer.classList.add('hide')
}

const clearApplicationData = () => {
  const contexts = document.querySelector('#contexts')
  contexts.innerHTML = ''

  const tasks = document.querySelector('#tasks')
  tasks.innerHTML = ''
}

const renderStartScreen = (appElement) => {
  appElement.classList.add('hide')
  accountContainer.innerHTML = ''
  accountContainer.classList.add('hide')
  accountContainer.classList.add('show-flex')
  startscreenContainer.classList.remove('hide')
}

const appendChildren = (parent, children) => {
  children.forEach((child) => {
    parent.appendChild(child)
  })
}

export {
  createLoginForm,
  createRegistrationStartingPoint,
  renderAuthenticationError,
  removeAuthentication,
  renderUserInformation,
  renderLogout,
  clearApplicationData,
  renderStartScreen,
}
