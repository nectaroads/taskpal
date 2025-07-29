import { sendRequest, showLoadingOverlay, hideLoadingOverlay, showNotification } from './script.js';

let loading = false;

let inputUsername = '';
let inputPassword = '';
let inputPasswordConfirm = '';

const usernameInput = document.getElementById('input_username');
const passwordInput = document.getElementById('input_password');
const passwordConfirmInput = document.getElementById('input_password_confirm');
const usernameBtn = document.getElementById('button_username');
const passwordBtn = document.getElementById('button_password');

usernameInput.value = '';
passwordInput.value = '';
passwordConfirmInput.value = '';
usernameBtn.classList.add('disabled');
passwordBtn.classList.add('disabled');

if (usernameInput) {
  usernameInput.addEventListener('input', event => {
    inputUsername = event.target.value;
  });
  usernameInput.addEventListener('change', event => {
    if (inputUsername == '') return;
    if (inputUsername.length < 5) {
      inputUsername = '';
      event.target.value = '';
      usernameBtn.classList.add('disabled');
      showNotification('O seu usuário é curto demais! Precisa ter ao menos 5 caracteres');
    } else {
      usernameBtn.classList.remove('disabled');
    }
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
      inputPasswordConfirm = '';
      passwordInput.value = '';
      passwordConfirmInput.value = '';
      passwordConfirmInput.disabled = true;
      showNotification('A sua senha é curta demais! Precisa ter ao menos 8 caracteres');
    } else {
      passwordConfirmInput.disabled = false;
    }
  });
}

if (passwordConfirmInput) {
  passwordConfirmInput.addEventListener('input', event => {
    inputPasswordConfirm = event.target.value;
  });
  passwordConfirmInput.addEventListener('change', event => {
    if (inputPassword == '') return;
    if (inputPassword != inputPasswordConfirm) {
      inputPassword = '';
      passwordInput.value = '';
      passwordConfirmInput.value = '';
      passwordBtn.classList.add('disabled');
      showNotification('A sua senha é curta demais! Precisa ter ao menos 8 caracteres');
    } else {
      passwordBtn.classList.remove('disabled');
    }
  });
}

if (usernameBtn) {
  usernameBtn.addEventListener('click', async event => {
    if (loading) return;
    loading = true;
    showLoadingOverlay();
    try {
      const json = { key: 'changeUsername', value: { username: inputUsername } };
      await sendRequest(json);
    } finally {
      loading = false;
      hideLoadingOverlay();
    }
  });
}

if (passwordBtn) {
  passwordBtn.addEventListener('click', async event => {
    if (loading) return;
    loading = true;
    showLoadingOverlay();
    try {
      const json = { key: 'changePassword', value: { password: inputPassword } };
      await sendRequest(json);
    } finally {
      loading = false;
      hideLoadingOverlay();
    }
  });
}
