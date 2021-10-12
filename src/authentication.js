let parentElement = null

const createEmailField = () => {
  const emailField = document.createElement('input')
  emailField.id = 'email-input'
  emailField.type = 'email'
  return emailField
}

const createPasswordField = () => {
  const passwordField = document.createElement('input')
  passwordField.id = 'password-input'
  passwordField.type = 'password'
  return passwordField
}

const createSubmitButton = () => {
  const submitButton = document.createElement('input')
  submitButton.id = 'new-user-submit'
  submitButton.type = 'submit'
  return submitButton
}

const appendChildren = (parent, children) => {
  children.forEach((child) => {
    parent.appendChild(child)
  })
}

const createNewUserForm = () => {
  const emailField = createEmailField()
  const passwordField = createPasswordField()
  const submitButton = createSubmitButton()

  const newUserForm = document.createElement('form')
  newUserForm.addEventListener('submit', () => console.log('submitted'))
  appendChildren(newUserForm, [emailField, passwordField, submitButton])

  parentElement.appendChild(newUserForm)
}

const createRegistrationStartingPoint = (specifiedElement) => {
  parentElement = specifiedElement

  const createAccount = document.createElement('button')
  createAccount.id = 'createAccount'
  createAccount.textContent = 'Create new Account'
  createAccount.addEventListener('click', createNewUserForm)

  parentElement.appendChild(createAccount)
}

export default createRegistrationStartingPoint
