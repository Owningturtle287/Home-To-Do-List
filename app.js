import { seed } from './seed.js';
import { art, roomIcon, symbol } from './icons.js';
import { freshChecklist, measure, roomTasks } from './model.js';

const storageKey = 'roomstead.checklist.v1';
const main = document.querySelector('main');
const dialog = document.querySelector('#editor');
const toast = document.querySelector('#announcement');
const nav = [
  { id: 'rooms', label: 'Rooms', icon: 'grid' },
  { id: 'shopping', label: 'Shopping', icon: 'bag' },
  { id: 'progress', label: 'Progress', icon: 'chart' },
];
let rooms = loadChecklist();
let filter = 'all';
let editor = null;
let toastTimer;

function loadChecklist() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved);
  } catch {
    // A blocked or unreadable store still allows an in-memory session.
  }
  return freshChecklist(seed);
}

function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(rooms));
    return true;
  } catch {
    return false;
  }
}

function announce(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.toggle('visible', Boolean(message));
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3200);
}

function persist(message) {
  announce(save() ? message : 'Changes are available for this session. This browser could not save them.');
}

function escape(text) {
  return String(text).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `item-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function view() {
  const hash = location.hash.slice(1);
  if (hash.startsWith('room/')) {
    const room = rooms.find(item => item.id === hash.slice(5));
    if (room) return { page: 'room', room };
  }
  return { page: ['progress', 'shopping'].includes(hash) ? hash : 'rooms' };
}

function iconButton(action, icon, label, attrs = '') {
  return `<button type="button" class="icon-button" data-action="${action}" aria-label="${escape(label)}" title="${escape(label)}" ${attrs}>${symbol(icon, 19)}</button>`;
}

function button(action, icon, label, kind = 'primary', attrs = '') {
  return `<button type="button" class="button ${kind}" data-action="${action}" ${attrs}>${symbol(icon, 18)}${label}</button>`;
}

function progressBar(stats, label) {
  return `<div class="bar" role="progressbar" aria-label="${escape(label)}" aria-valuenow="${stats.percent}" aria-valuemin="0" aria-valuemax="100"><span style="width:${stats.percent}%"></span></div>`;
}

function navMarkup(page) {
  return nav.map(item => {
    const current = (page === 'room' ? 'rooms' : page) === item.id;
    return `<a href="#${item.id}" class="nav-link ${current ? 'active' : ''}" ${current ? 'aria-current="page"' : ''}>${symbol(item.icon)}<span>${item.label}</span></a>`;
  }).join('');
}

function render(focusId) {
  const { page, room } = view();
  for (const element of document.querySelectorAll('.desktop-nav, .mobile-nav')) {
    if (element.dataset.page !== page) {
      element.innerHTML = navMarkup(page);
      element.dataset.page = page;
    }
  }
  const mobileAction = document.querySelector('.mobile-action');
  if (mobileAction.dataset.page !== page) {
    mobileAction.innerHTML = page === 'rooms' ? iconButton('new-room', 'plus', 'Add room') : '';
    mobileAction.dataset.page = page;
  }
  const whole = measure(rooms.flatMap(roomTasks));
  const screens = {
    rooms: () => dashboard(whole),
    room: () => roomPage(room),
    shopping: shoppingPage,
    progress: () => progressPage(whole),
  };
  main.innerHTML = screens[page]();
  const title = room?.name ?? nav.find(item => item.id === page)?.label;
  document.title = `${title} · Roomstead`;
  if (focusId) document.getElementById(focusId)?.focus({ preventScroll: true });
}

function dashboard(whole) {
  const complete = rooms.filter(room => measure(roomTasks(room)).percent === 100).length;
  return `
    <section class="hero" aria-labelledby="home-title">
      <div class="hero-content">
        <div class="eyebrow hero-eyebrow">${symbol('spark', 15)} HOME PROJECT TRACKER</div>
        <h1 id="home-title">My Home Checklist</h1>
        <p>Plan and track projects, room by room.</p>
        <div class="hero-progress">
          <div class="hero-progress-heading"><span>WHOLE HOUSE PROGRESS</span><strong>${whole.percent}%</strong></div>
          ${progressBar(whole, 'Whole house progress')}
          <div class="hero-counts"><span>${whole.done} of ${whole.total} items checked</span><span>${complete} of ${rooms.length} rooms finished</span></div>
        </div>
      </div>
      <img class="hero-art" src="./assets/house.svg" alt="" width="500" height="340">
    </section>
    <section class="rooms-section" aria-labelledby="rooms-title">
      <div class="section-heading">
        <div><div class="eyebrow section-kicker">ROOM BY ROOM</div><h2 id="rooms-title">Your rooms <span class="count">${rooms.length}</span></h2></div>
        ${button('new-room', 'plus', 'Add room', 'primary', 'id="add-room"')}
      </div>
      ${rooms.length ? `<div class="room-grid">${rooms.map(roomCard).join('')}</div>`
        : empty('house', 'Add your first room', 'Create a room to start your home checklist.')}
    </section>`;
}

function roomCard(room) {
  const stats = measure(roomTasks(room));
  return `
    <a class="room-card" href="#room/${room.id}" id="room-${room.id}">
      <div class="card-top">${roomIcon(room.icon)}<span class="card-arrow">${symbol('right', 17)}</span></div>
      <h3>${escape(room.name)}</h3>
      <div class="card-stats"><span>${stats.total ? `${stats.done} of ${stats.total} checked` : 'No items yet'}</span><strong>${stats.percent}%</strong></div>
      ${progressBar(stats, `${room.name} progress`)}
    </a>`;
}

function filterBar() {
  return `<div class="filters" role="group" aria-label="Filter checklist">
    ${[['all', 'All items'], ['todo', 'To do'], ['done', 'Done']].map(([id, name]) =>
      `<button type="button" id="filter-${id}" data-action="filter" data-filter="${id}" aria-pressed="${filter === id}">${name}</button>`).join('')}
  </div>`;
}

function roomPage(room) {
  const stats = measure(roomTasks(room));
  return `
    <a class="back-link" href="#rooms">${symbol('left', 16)} All rooms</a>
    <div class="detail-hero">
      ${roomIcon(room.icon)}
      <div class="detail-title"><div class="eyebrow section-kicker">ROOM CHECKLIST</div><h1>${escape(room.name)}</h1></div>
      ${iconButton('edit-room', 'edit', 'Edit room', `id="edit-room" data-room="${room.id}"`)}
      <div class="detail-progress">
        <div class="card-stats"><span>${stats.done} of ${stats.total} items checked</span><strong>${stats.percent}% complete</strong></div>
        ${progressBar(stats, 'Room progress')}
      </div>
    </div>
    <section aria-labelledby="checklist-title">
      <div class="section-heading room-checklist-heading">
        <h2 id="checklist-title">Checklist</h2>
        ${button('new-section', 'plus', 'Add section', 'secondary', `id="add-section" data-room="${room.id}"`)}
      </div>
      ${room.sections.length ? filterBar() + room.sections.map(section => taskSection(room, section)).join('') :
        empty('list', 'No sections yet', 'Add a section to organize this room’s checklist.')}
    </section>`;
}

function visibleTasks(tasks) {
  if (filter === 'todo') return tasks.filter(task => !task.done);
  if (filter === 'done') return tasks.filter(task => task.done);
  return tasks;
}

function taskSection(room, section, shopping = false) {
  const tasks = visibleTasks(section.tasks);
  const stats = measure(section.tasks);
  const target = `data-room="${room.id}" data-section="${section.id}"`;
  const id = `${room.id}-${section.id}`;
  const text = shopping && section.name === 'To Buy' ? room.name : section.name;
  const edit = iconButton('edit-section', 'edit', `Edit ${section.name} section`, `id="edit-${id}" ${target}`);
  return `
    <section class="task-section" aria-labelledby="heading-${id}">
      <div class="task-section-head">
        <span class="section-icon ${section.shopping ? 'shopping-icon' : ''}">${symbol(section.shopping ? 'bag' : 'list', 18)}</span>
        <div class="task-section-name"><h3 id="heading-${id}">${escape(text)}</h3>${shopping && section.name !== 'To Buy' ? `<small>${escape(room.name)}</small>` : ''}</div>
        <span class="task-count">${stats.done}/${stats.total}</span>
        ${edit}
      </div>
      ${tasks.length ? `<ul class="task-list">${tasks.map(task => taskRow(room, section, task)).join('')}</ul>`
        : `<p class="no-tasks">${filter === 'all' ? 'No items yet.' : filter === 'done' ? 'No checked items yet.' : 'No items left to check.'}</p>`}
      <button type="button" class="add-task" id="add-${id}" data-action="new-task" ${target}>${symbol('plus', 18)} Add item</button>
    </section>`;
}

function taskRow(room, section, task) {
  const id = `task-${room.id}-${section.id}-${task.id}`;
  const target = `data-room="${room.id}" data-section="${section.id}" data-task="${task.id}"`;
  return `
    <li class="task ${task.done ? 'checked' : ''}">
      <label class="task-label">
        <input class="task-input" type="checkbox" id="${id}" ${target} ${task.done ? 'checked' : ''}>
        <span class="task-box">${symbol('check', 15)}</span><span class="task-text">${escape(task.name)}</span>
      </label>
      ${iconButton('edit-task', 'edit', `Edit item: ${task.name}`, `id="edit-${id}" ${target}`)}
    </li>`;
}

function shoppingPage() {
  const groups = rooms.flatMap(room => room.sections.filter(section => section.shopping).map(section => ({ room, section })));
  const stats = measure(groups.flatMap(({ section }) => section.tasks));
  return `
    <div class="page-heading"><div class="eyebrow section-kicker">ALL ROOMS</div><h1>Shopping list</h1><p>Check off purchases from every room in one place.</p></div>
    <div class="summary-band"><span class="summary-icon">${symbol('bag', 24)}</span>
      <div><strong>${stats.total - stats.done} to buy</strong><p>${stats.done} of ${stats.total} purchases checked</p></div>
    </div>
    ${groups.length ? filterBar() + groups.map(({ room, section }) => taskSection(room, section, true)).join('') :
      empty('stove', 'No shopping sections', 'Add a section in a room and include it in the shopping list.')}
  `;
}

function progressPage(whole) {
  const finished = rooms.filter(room => measure(roomTasks(room)).percent === 100).length;
  return `
    <div class="page-heading"><div class="eyebrow section-kicker">ALL ROOMS</div><h1>Progress</h1><p>See what’s finished and what’s left across the house.</p></div>
    <div class="summary-band progress-summary">
      <span class="summary-icon">${symbol('chart', 24)}</span>
      <div><strong>${whole.percent}% complete</strong><p>${whole.done} of ${whole.total} items checked · ${finished} of ${rooms.length} rooms finished</p></div>
      ${progressBar(whole, 'Whole house progress')}
    </div>
    <section aria-labelledby="progress-rooms">
      <div class="section-heading"><h2 id="progress-rooms">By room</h2></div>
      ${rooms.length ? `<div class="progress-list">${rooms.map(room => {
        const stats = measure(roomTasks(room));
        return `<a class="progress-row" href="#room/${room.id}">${roomIcon(room.icon)}
          <div><h3>${escape(room.name)}</h3><span>${stats.done} of ${stats.total} checked</span></div>
          ${progressBar(stats, `${room.name} progress`)}<strong>${stats.percent}%</strong>${symbol('right', 16)}</a>`;
      }).join('')}</div>` : empty('house', 'No rooms to track', 'Add a room from the Rooms tab to start tracking progress.')}
    </section>`;
}

function empty(icon, title, detail) {
  return `<div class="empty">${roomIcon(icon)}<h3>${title}</h3><p>${detail}</p></div>`;
}

function openEditor(action, trigger) {
  const { room: roomId, section: sectionId, task: taskId } = trigger.dataset;
  const room = rooms.find(item => item.id === roomId);
  const section = room?.sections.find(item => item.id === sectionId);
  const task = section?.tasks.find(item => item.id === taskId);
  const [mode, type] = action.split('-');
  editor = { mode, type, room, section, task, triggerId: trigger.id };
  const entry = { room, section, task }[type];
  const noun = type === 'task' ? 'item' : type;
  const title = `${mode === 'new' ? 'Add' : 'Edit'} ${noun}`;
  const location = type === 'room' ? 'YOUR HOME' : type === 'section' ? room.name : `${room.name} / ${section.name}`;
  dialog.innerHTML = `
    <div class="dialog-header"><div><div class="eyebrow section-kicker">${escape(location)}</div><h2 id="editor-title">${title}</h2></div>
      ${iconButton('close-dialog', 'close', 'Close')}</div>
    <form>
      <label class="input-label" for="entry-name">${type === 'task' ? 'Item' : 'Name'}</label>
      <input class="text-input" type="text" id="entry-name" name="name" required maxlength="${type === 'task' ? 240 : 60}" value="${escape(entry?.name ?? '')}" placeholder="${{ room: 'e.g. Garage', section: 'e.g. Painting', task: 'e.g. Paint the window trim' }[type]}" autofocus>
      ${type === 'room' ? `<fieldset class="icon-picker"><legend>Room icon</legend><div>${Object.entries(art).map(([id, option]) =>
        `<label title="${option.label}"><input type="radio" name="icon" value="${id}" aria-label="${option.label}" ${(entry?.icon ?? 'house') === id ? 'checked' : ''}>${roomIcon(id)}</label>`).join('')}</div></fieldset>` : ''}
      ${type === 'section' ? `<label class="shopping-option"><input type="checkbox" name="shopping" ${section?.shopping ? 'checked' : ''}> Include in the shopping list</label>` : ''}
      <div class="dialog-actions">
        ${mode === 'edit' ? button('confirm-delete', 'trash', 'Delete', 'danger-quiet') : ''}
        <button type="button" data-action="close-dialog" class="button secondary">Cancel</button>
        <button type="submit" class="button primary">${mode === 'new' ? title : 'Save changes'}</button>
      </div>
    </form>`;
  dialog.showModal();
}

function confirmDelete() {
  const { type, room, section, task } = editor;
  const entry = { room, section, task }[type];
  const noun = type === 'task' ? 'item' : type;
  const count = type === 'room' ? roomTasks(room).length : type === 'section' ? section.tasks.length : 0;
  const extra = count ? ` This also deletes ${count} checklist ${count === 1 ? 'item' : 'items'}.` : '';
  dialog.innerHTML = `
    <div class="dialog-header"><h2 id="editor-title">Delete ${noun}?</h2></div>
    <p class="delete-detail">“${escape(entry.name)}” will be removed.${extra}</p>
    <div class="dialog-actions">
      <button type="button" data-action="close-dialog" class="button secondary" autofocus>Cancel</button>
      ${button('delete-entry', 'trash', `Delete ${noun}`, 'danger')}
    </div>`;
  dialog.querySelector('[autofocus]').focus();
}

function removeEntry() {
  const { type, room, section, task } = editor;
  const noun = type === 'task' ? 'Item' : type === 'room' ? 'Room' : 'Section';
  if (type === 'room') {
    rooms = rooms.filter(item => item.id !== room.id);
  } else if (type === 'section') {
    room.sections = room.sections.filter(item => item.id !== section.id);
  } else {
    section.tasks = section.tasks.filter(item => item.id !== task.id);
  }
  dialog.close();
  persist(`${noun} deleted.`);
  if (type === 'room') location.hash = '#rooms';
  else {
    render(type === 'task' ? `add-${room.id}-${section.id}` : 'add-section');
    if (!main.contains(document.activeElement)) main.focus({ preventScroll: true });
  }
}

dialog.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.target);
  const name = data.get('name').trim();
  if (!name) {
    const field = dialog.querySelector('#entry-name');
    field.setCustomValidity('Enter a name.');
    field.reportValidity();
    return;
  }
  const { mode, type, room, section, task, triggerId } = editor;
  const entry = { room, section, task }[type];
  if (mode === 'edit') entry.name = name;
  if (type === 'room') {
    const icon = data.get('icon') ?? 'house';
    if (mode === 'new') rooms.push({ id: newId(), name, icon, sections: [{ id: 'to-do', name: 'To Do', shopping: false, tasks: [] }] });
    else room.icon = icon;
  } else if (type === 'section') {
    const shopping = data.has('shopping');
    if (mode === 'new') room.sections.push({ id: newId(), name, shopping, tasks: [] });
    else section.shopping = shopping;
  } else if (mode === 'new') {
    section.tasks.push({ id: newId(), name, done: false });
    if (filter === 'done') filter = 'all';
  }
  dialog.close();
  persist(mode === 'new' ? `${{ room: 'Room', section: 'Section', task: 'Item' }[type]} added.` : 'Changes saved.');
  render(triggerId);
});

dialog.addEventListener('input', event => {
  if (event.target.id === 'entry-name') event.target.setCustomValidity('');
});

dialog.addEventListener('close', () => { editor = null; });

document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-action]');
  if (!trigger) return;
  const { action } = trigger.dataset;
  if (action === 'filter') {
    filter = trigger.dataset.filter;
    render(trigger.id);
  } else if (action === 'close-dialog') dialog.close();
  else if (action === 'confirm-delete') confirmDelete();
  else if (action === 'delete-entry') removeEntry();
  else openEditor(action, trigger);
});

document.addEventListener('change', event => {
  const checkbox = event.target.closest('.task-input');
  if (!checkbox) return;
  const { room: roomId, section: sectionId, task: taskId } = checkbox.dataset;
  const room = rooms.find(item => item.id === roomId);
  const section = room.sections.find(item => item.id === sectionId);
  section.tasks.find(item => item.id === taskId).done = checkbox.checked;
  persist(checkbox.checked ? 'Item checked.' : 'Item marked to do.');
  if (filter === 'all') render(checkbox.id);
  else render(`filter-${filter}`);
});

document.querySelector('.skip').addEventListener('click', event => {
  event.preventDefault();
  main.focus();
});

window.addEventListener('hashchange', () => {
  filter = 'all';
  render();
  window.scrollTo(0, 0);
  main.focus({ preventScroll: true });
});

window.addEventListener('storage', event => {
  if (event.key !== storageKey) return;
  if (dialog.open) dialog.close();
  rooms = loadChecklist();
  render();
});

render();
