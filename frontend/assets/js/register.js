import { sendRequest, showLoadingOverlay, hideLoadingOverlay, showNotification } from './script.js';

let disabled = true;
let loading = false;
let inputUsername = '';
let inputPassword = '';
let inputPasswordConfirm = '';

const loginInput = document.getElementById('input_username');
const passwordInput = document.getElementById('input_password');
const passwordConfirmInput = document.getElementById('input_password_confirm');
const registerBtn = document.getElementById('button_register');

loginInput.value = '';
passwordInput.value = '';
passwordConfirmInput.value = '';
passwordConfirmInput.disabled = true

function validateUser() {
  let validate = true;
  if (inputUsername.length < 5) validate = false;
  if (inputPassword.length < 8) validate = false;
  if (inputPasswordConfirm != inputPassword) validate = false;
  if (validate) {
    registerBtn.classList.remove('disabled');
    disabled = false;
  } else {
    registerBtn.classList.add('disabled');
    disabled = true;
  }
}

if (loginInput) {
  loginInput.addEventListener('input', event => {
    inputUsername = event.target.value;
  });
  loginInput.addEventListener('change', event => {
    if (inputUsername == '') return;
    if (inputUsername.length < 5) {
      inputUsername = '';
      event.target.value = '';
      showNotification('O seu usuário é curto demais! Precisa ter ao menos 5 caracteres');
    }
    validateUser();
  });
}

if (passwordInput) {
  passwordInput.addEventListener('input', event => {
    inputPassword = event.target.value;
  });
  passwordInput.addEventListener('change', event => {
    let passed = true;
    if (inputPassword == '') passed = false;
    if (inputPassword.length < 8) {
      inputPassword = '';
      event.target.value = '';
      showNotification('A sua senha é curta demais! Precisa ter ao menos 8 caracteres');
      passed = false;
    }
    if (!passed) passwordConfirmInput.disabled = true;
    else passwordConfirmInput.disabled = false;
    validateUser();
  });
}

if (passwordConfirmInput) {
  passwordConfirmInput.addEventListener('input', event => {
    inputPasswordConfirm = event.target.value;
  });
  passwordConfirmInput.addEventListener('change', event => {
    if (inputPasswordConfirm == '') return;
    if (inputPasswordConfirm != inputPassword || inputPasswordConfirm < 8) {
      inputPasswordConfirm = '';
      event.target.value = '';
      showNotification('Ambas as senhas devem ser iguais');
    }
    validateUser();
  });
}

if (registerBtn) {
  registerBtn.addEventListener('click', async event => {
    if (loading || disabled) return;
    loading = true;
    showLoadingOverlay();
    try {
      const json = { key: 'register', value: { username: inputUsername, password: inputPassword } };
      await sendRequest(json);
    } finally {
      loading = false;
      hideLoadingOverlay();
    }
  });
}
