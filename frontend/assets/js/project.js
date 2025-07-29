import { hideLoadingOverlay, sendRequest, showLoadingOverlay } from './script.js';

const project = JSON.parse(localStorage.getItem('taskpal_project'));

const clockBtn = document.getElementById('button_clock');
let clockBtnTrigger = false;

let loading = false;

const today = new Date().toISOString().split('T')[0];
const hasClockToday = project.clocks.some(clock => {
  const clockDate = clock.date.split('T')[0];
  return clockDate === today;
});

if (clockBtn) {
  if (!hasClockToday) {
    clockBtn.classList.remove('disabled');
    clockBtnTrigger = true;
  }
  clockBtn.addEventListener('click', async event => {
    if (loading) return;
    if (!clockBtnTrigger) return;
    loading = true;
    showLoadingOverlay();
    try {
      const json = { key: 'addClock', value: { invite: project.invite } };
      await sendRequest(json);
    } finally {
      loading = false;
      hideLoadingOverlay();
    }
  });
}
