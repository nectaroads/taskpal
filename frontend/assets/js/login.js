import { sendRequest, showLoadingOverlay, hideLoadingOverlay, showNotification, autoLogin } from './script.js';

let loading = false;
let inputUsername = '';
let inputPassword = '';

const loginInput = document.getElementById('input_username');
const passwordInput = document.getElementById('input_password');
const loginBtn = document.getElementById('button_login');

loginInput.value = '';
passwordInput.value = '';

function validateUser() {
  let validate = true;
  if (inputUsername.length < 5) validate = false;
  if (inputPassword.length < 8) validate = false;
  if (validate) {
    loginBtn.classList.remove('disabled');
  } else {
    loginBtn.classList.add('disabled');
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
    if (inputPassword == '') return;
    if (inputPassword.length < 8) {
      inputPassword = '';
      event.target.value = '';
      showNotification('A sua senha é curta demais! Precisa ter ao menos 8 caracteres');
    }
    validateUser();
  });
}

if (loginBtn) {
  loginBtn.addEventListener('click', async event => {
    if (loading) return;
    loading = true;
    showLoadingOverlay();
    try {
      const json = { key: 'login', value: { username: inputUsername, password: inputPassword } };
      await sendRequest(json);
    } finally {
      loading = false;
      hideLoadingOverlay();
    }
  });
}

autoLogin();
