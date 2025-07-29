import { sendRequest, showLoadingOverlay, hideLoadingOverlay, showNotification } from './script.js';

let loading = false;

let inputName = '';
let inputInvite = '';

const nameInput = document.getElementById('input_name');
const inviteInput = document.getElementById('input_invite');
const confirmBtn = document.getElementById('button_confirm');

nameInput.value = '';
inviteInput.value = '';

function validateButton() {
  let should = true;
  if (inputName.length < 5) should = false;
  if (inputInvite.length < 5) should = false;
  if (should) confirmBtn.classList.remove('disabled');
  else confirmBtn.classList.add('disabled');
}

if (nameInput) {
  nameInput.addEventListener('input', event => {
    inputName = event.target.value;
  });
  nameInput.addEventListener('change', event => {
    if (inputName == '') return;
    if (inputName.length < 5) {
      inputName = '';
      event.target.value = '';
      showNotification('O nome de seu projeto é curto demais! Precisa ter pelo menos 5 caracteres');
    }
    validateButton();
  });
}

if (inviteInput) {
  inviteInput.addEventListener('input', event => {
    inputInvite = event.target.value;
  });
  inviteInput.addEventListener('change', event => {
    if (inputInvite == '') return;
    if (inputInvite.length < 5) {
      inputInvite = '';
      event.target.value = '';
      showNotification('O seu código de convite é curto demais! Precisa ter pelo menos 5 caracteres');
    }
    validateButton();
  });
}

if (confirmBtn) {
  confirmBtn.addEventListener('click', async event => {
    if (loading) return;
    loading = true;
    showLoadingOverlay();
    try {
      const json = { key: 'createProject', value: { name: inputName, invite: inputInvite } };
      await sendRequest(json);
    } finally {
      loading = false;
      hideLoadingOverlay();
    }
  });
}
