import { print } from './io.js';

const server = 'http://192.168.0.121:24575/taskpal';
const delay = 0.5;

export let token = localStorage.getItem('taskpal_token') || localStorage.getItem('taskpal_intance') || null;

//const audio = new Audio('assets/sounds/xphit.mp3');

const notificationHandler = {
  href: value => {
    window.location.href = value;
  }
};

const joinHandler = {
  success: value => {
    showNotification('Você se juntou a um novo projeto!');
    window.location.href = 'projects.html';
  }
};

const projectListHandler = {
  success: value => {
    let str = '';
    console.log('Projects:', value.projects);
    const listProjects = document.getElementById('list_projects');
    for (const project of value.projects) {
      const today = new Date().toISOString().split('T')[0];
      const hasClockToday = project.clocks.some(clock => {
        const clockDate = clock.date.split('T')[0];
        return clockDate === today;
      });
      const role = project.role;
      //str += `${hasClockToday ? '' : `<div class= "d-flex justify-content-between align-items-center mb-3">`}`;
      str += `<div id="button_${project.id}" class="button justify-content-center ${hasClockToday? "green" : role > 1? "black" : "blue"} mb-3 w-100">${project.name}</div>`;
      //str += `${hasClockToday ? '' : `<div class="button square justify-content-center gray"><h3>🕑</h3></div> </div>`}`;
    }
    listProjects.insertAdjacentHTML('afterbegin', str);
    for (const project of value.projects) {
      const button = document.getElementById(`button_${project.id}`);
      if (!button) return;
      button.addEventListener('click', async event => {
        localStorage.setItem('taskpal_project', JSON.stringify(project));
        window.location.href = 'project.html';
      });
    }
  }
};

const addClockHandler = {
  success: value => {
    showNotification('Ponto batido com sucesso!', 'href', 'projects.html');
  }
};

const createProjectHandler = {
  success: value => {
    showNotification('Projeto criado com sucesso!', 'href', 'projects.html');
  }
};

const changeHandler = {
  success: value => {
    showNotification('Dado alterado com sucesso!', 'href', 'home.html');
  },
  invalidUsername: value => {
    showNotification('Essa conta já existe...');
  },
  invalidPassword: value => {
    showNotification('Essa senha é curta demais! Mínimo de 8 caracteres.');
  }
};

const registerHandler = {
  success: value => {
    token = value.token;
    localStorage.setItem('taskpal_token', token);
    window.location.href = 'home.html';
  },
  invalid: value => {
    showNotification('Essa conta já existe...');
  },
  invalidInstance: value => {
    showNotification('Essa conta já está online.');
  },
  invalidUsernameLength: value => {
    showNotification('Essa conta é curta demais! Mínimo de 5 caracteres.');
  },
  invalidPasswordLength: value => {
    showNotification('Essa senha é curta demais! Mínimo de 8 caracteres.');
  }
};

const logoutHandler = {};

const loginHandler = {
  success: value => {
    token = value.token;
    localStorage.setItem('taskpal_token', token);
    window.location.href = 'home.html';
  },
  invalidUsername: value => {
    showNotification('Essa conta não existe');
  },
  invalidPassword: value => {
    showNotification('Essa senha está incorreta');
  },
  fail: value => {
    token = null;
    localStorage.removeItem('taskpal_token');
    localStorage.removeItem('taskpal_intance');
  }
};

const responseHandler = {
  login: value => {
    print(`[Request] Request type: ${value.type}`);
    if (loginHandler[value.type]) loginHandler[value.type](value);
  },
  logout: value => {
    print(`[Request] Request type: ${value.type}`);
    if (logoutHandler[value.type]) logoutHandler[value.type](value);
    token = null;
    localStorage.removeItem('taskpal_token');
    localStorage.removeItem('taskpal_intance');
    window.location.href = 'index.html';
  },
  register: value => {
    print(`[Request] Request type: ${value.type}`);
    if (registerHandler[value.type]) registerHandler[value.type](value);
  },
  change: value => {
    print(`[Request] Request type: ${value.type}`);
    if (changeHandler[value.type]) changeHandler[value.type](value);
  },
  createProject: value => {
    print(`[Request] Request type: ${value.type}`);
    if (createProjectHandler[value.type]) createProjectHandler[value.type](value);
  },
  projectList: value => {
    print(`[Request] Request type: ${value.type}`);
    if (projectListHandler[value.type]) projectListHandler[value.type](value);
  },
  join: value => {
    print(`[Request] Request type: ${value.type}`);
    if (joinHandler[value.type]) joinHandler[value.type](value);
  },
  addClock: value => {
    print(`[Request] Request type: ${value.type}`);
    if (addClockHandler[value.type]) addClockHandler[value.type](value);
  }
};

export async function autoLogin() {
  if (token) {
    showLoadingOverlay();
    try {
      const json = { key: 'token', value: { token: token } };
      await sendRequest(json);
    } finally {
      hideLoadingOverlay();
    }
  }
}

export async function sendRequest(json) {
  if (!json.value.token) json.value.token = token || null;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      $.ajax({
        url: server,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(json),
        success: function (res) {
          if (res) {
            print(`[Request] Request response: ${res.key}`);
            if (responseHandler[res.key]) {
              responseHandler[res.key](res.value);
            }
            resolve(res);
          } else {
            resolve(null);
          }
        },
        error: function (xhr, status, err) {
          let res = null;
          if (xhr && xhr.responseText) res = JSON.parse(xhr.responseText);
          if (res) {
            print(`[Request] Request response: ${res.key}`);
            if (responseHandler[res.key]) {
              responseHandler[res.key](res.value);
            }
            resolve(null);
          } else {
            reject(err);
          }
        }
      });
    }, 1000 * delay);
  });
}

export function showLoadingOverlay() {
  let overlay = document.createElement('div');
  overlay.id = 'loading-overlay';
  overlay.innerHTML = `<div class="spinner"></div>`;
  document.body.appendChild(overlay);
}

export function hideLoadingOverlay() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.remove();
}

export function showNotification(message, func = null, param = null) {
  const existing = document.getElementById('notification-overlay');
  if (existing) existing.remove();
  //audio.play();
  const overlay = document.createElement('div');
  overlay.id = 'notification-overlay';
  overlay.innerHTML = `<div class="notification-bubble"><span>${message}</span></div>`;
  overlay.addEventListener('click', () => {
    if (notificationHandler[func]) notificationHandler[func](param);
    overlay.remove();
  });
  document.body.appendChild(overlay);
}
