import { hideLoadingOverlay, sendRequest, showLoadingOverlay, token } from './script.js';

let loading = false;

const logoutBtn = document.getElementById('button_logout');

if (logoutBtn) {
  logoutBtn.addEventListener('click', async event => {
    if (loading) return;
    loading = true;
    showLoadingOverlay();
    try {
      const json = { key: 'logout', value: { token: token } };
      await sendRequest(json);
    } finally {
      loading = false;
      hideLoadingOverlay();
    }
  });
}
