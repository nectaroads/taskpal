import { sendRequest, showLoadingOverlay, hideLoadingOverlay, showNotification } from './script.js';

let loading = false;

let inputNewProject = '';

const newProjectInput = document.getElementById('input_new_project');
const newProjectBtn = document.getElementById('button_new_project');

newProjectInput.value = '';

if (newProjectInput) {
  newProjectInput.addEventListener('input', event => {
    inputNewProject = event.target.value;
  });
  newProjectInput.addEventListener('change', event => {
    if (inputNewProject == '') return;
    if (inputNewProject.length < 5) {
      inputNewProject = '';
      event.target.value = '';
      newProjectBtn.classList.add('disabled');
      showNotification('O seu código de convite é curto demais! Precisa ter pelo menos 5 caracteres');
    } else {
      newProjectBtn.classList.remove('disabled');
    }
  });
}

if (newProjectBtn) {
  newProjectBtn.addEventListener('click', async event => {
    if (loading) return;
    loading = true;
    showLoadingOverlay();
    try {
      const json = { key: 'join', value: { invite: inputNewProject } };
      await sendRequest(json);
    } finally {
      loading = false;
      hideLoadingOverlay();
    }
  });
}

async function loadMyProjects() {
  try {
    showLoadingOverlay();
    const json = { key: 'projectList', value: {} };
    await sendRequest(json);
  } finally {
    loading = false;
    hideLoadingOverlay();
  }
}

loadMyProjects();
