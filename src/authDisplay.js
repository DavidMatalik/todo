let registerUser = null

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

const createRegistrationStartingPoint = (parentElement, registerNewUser) => {
  registerUser = registerNewUser

  const createAccount = document.createElement('button')
  createAccount.id = 'createAccount'
  createAccount.textContent = 'Create new Account'
  createAccount.addEventListener('click', () =>
    createNewUserForm(createAccount)
  )

  const errorMessage = document.createElement('div')
  errorMessage.id = 'authentication-error'
  errorMessage.classList.add('hide')

  appendChildren(parentElement, [createAccount, errorMessage])
}

const createNewUserForm = (previousElement) => {
  const emailField = createEmailField('new-user-email')
  const passwordField = createPasswordField('new-user-password')
  const submitButton = createSubmitButton('new-user-submit')

  const newUserForm = document.createElement('form')
  newUserForm.id = 'authentication-form'
  newUserForm.addEventListener('submit', (ev) => {
    registerUser(ev)
  })
  appendChildren(newUserForm, [emailField, passwordField, submitButton])

  previousElement.after(newUserForm)
}

const createLoginForm = (parentElement, loginUser) => {
  const emailField = createEmailField('login-email')
  const passwordField = createPasswordField('login-password')
  const submitButton = createSubmitButton('login-submit')

  const newUserForm = document.createElement('form')
  newUserForm.addEventListener('submit', (ev) => {
    loginUser(ev)
  })
  appendChildren(newUserForm, [emailField, passwordField, submitButton])

  parentElement.appendChild(newUserForm)
}

const renderAuthenticationError = (errorText) => {
  const errorElement = document.querySelector('#authentication-error')
  errorElement.textContent = errorText
  errorElement.classList.remove('hide')
}

const renderLogout = (logoutUser, appElement) => {
  const logoutButton = document.createElement('button')
  logoutButton.id = 'logout-button'
  logoutButton.textContent = 'Logout'
  logoutButton.addEventListener('click', logoutUser)

  const body = document.querySelector('#container')
  body.insertBefore(logoutButton, appElement)
}

const removeAuthentication = (authContainer) => {
  authContainer.innerHTML = ''
}

const renderStartScreen = (appElement) => {
  appElement.classList.add('hide')
  document.querySelector('#logout-button').remove()
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
  renderLogout,
  renderStartScreen,
}
