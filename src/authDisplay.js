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

const appendChildren = (parent, children) => {
  children.forEach((child) => {
    parent.appendChild(child)
  })
}

const createRegistrationStartingPoint = (parentElement, registerNewUser) => {
  registerUser = registerNewUser

  const createAccount = document.createElement('button')
  createAccount.id = 'createAccount'
  createAccount.textContent = 'Create new Account'
  createAccount.addEventListener('click', () =>
    createNewUserForm(parentElement)
  )

  parentElement.appendChild(createAccount)
}

const createNewUserForm = (parentElement) => {
  const emailField = createEmailField('new-user-email')
  const passwordField = createPasswordField('new-user-password')
  const submitButton = createSubmitButton('new-user-submit')

  const newUserForm = document.createElement('form')
  newUserForm.addEventListener('submit', (ev) => {
    registerUser(ev)
    parentElement.remove()
  })
  appendChildren(newUserForm, [emailField, passwordField, submitButton])

  parentElement.appendChild(newUserForm)
}

const createLoginForm = (parentElement, loginUser) => {
  const emailField = createEmailField('login-email')
  const passwordField = createPasswordField('login-password')
  const submitButton = createSubmitButton('login-submit')

  const newUserForm = document.createElement('form')
  newUserForm.addEventListener('submit', (ev) => {
    loginUser(ev)
    parentElement.remove()
  })
  appendChildren(newUserForm, [emailField, passwordField, submitButton])

  parentElement.appendChild(newUserForm)
}

export { createLoginForm, createRegistrationStartingPoint }
