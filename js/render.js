import { calculateStreak } from './state.js';

export function renderDashboard(state) {
  applyTheme(state.theme);
  renderMetrics(state);
  renderTasks(state);
  renderProblems(state);
  renderLogs(state);
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const themeText = document.getElementById('theme-text');
  const themeIcon = document.getElementById('theme-icon');
  if (themeText && themeIcon) {
    themeText.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

function renderMetrics(state) {
  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(t => t.completed).length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const problemsSolved = state.problems.length;
  const totalHours = state.logs.reduce((acc, curr) => acc + (Number(curr.duration) || 0), 0);
  const streak = calculateStreak(state);

  document.getElementById('metric-total-tasks').textContent = totalTasks;
  document.getElementById('metric-completion-rate').textContent = `${completionRate}%`;
  document.getElementById('metric-problems-solved').textContent = problemsSolved;
  document.getElementById('metric-study-hours').textContent = `${totalHours.toFixed(1)}h`;
  document.getElementById('metric-streak-count').textContent = streak;

  const progressBar = document.getElementById('progress-bar-fill');
  const progressLabel = document.getElementById('progress-percentage-label');
  if (progressBar && progressLabel) {
    progressBar.style.width = `${completionRate}%`;
    progressBar.parentElement.setAttribute('aria-valuenow', completionRate);
    progressLabel.textContent = `${completionRate}% (${completedTasks}/${totalTasks} Tasks)`;
  }
}

function renderTasks(state) {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';

  let filtered = state.tasks.filter(t => {
    if (state.taskFilter === 'pending') return !t.completed;
    if (state.taskFilter === 'completed') return t.completed;
    return true;
  });

  if (state.taskSearch) {
    filtered = filtered.filter(t =>
      (t.title && t.title.toLowerCase().includes(state.taskSearch)) ||
      (t.category && t.category.toLowerCase().includes(state.taskSearch))
    );
  }

  filtered.sort((a, b) => {
    if (state.taskSort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (state.taskSort === 'priority') {
      const weights = { High: 3, Medium: 2, Low: 1 };
      return (weights[b.priority] || 0) - (weights[a.priority] || 0);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (filtered.length === 0) {
    taskList.innerHTML = `<li class="task-item" style="color: var(--text-secondary); font-size: 0.875rem;">No tasks matching current filter or search criteria.</li>`;
    return;
  }

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.innerHTML = `
      <div class="task-meta">
        <input type="checkbox" data-action="toggle-task" data-id="${task.id}" ${task.completed ? 'checked' : ''} aria-label="Toggle completion for ${escapeHtml(task.title)}">
        <span class="task-text">${escapeHtml(task.title)}</span>
        <span class="tag tag-${task.priority}">${escapeHtml(task.priority)}</span>
        <span class="tag">${escapeHtml(task.category)}</span>
      </div>
      <button class="btn btn-danger" data-action="delete-task" data-id="${task.id}" type="button" aria-label="Delete ${escapeHtml(task.title)}">Delete</button>
    `;
    taskList.appendChild(li);
  });
}

function renderProblems(state) {
  const tbody = document.getElementById('problems-tbody');
  tbody.innerHTML = '';

  if (state.problems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="color: var(--text-secondary); text-align: center;">No algorithmic problems logged yet.</td></tr>`;
    return;
  }

  state.problems.forEach(prob => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${escapeHtml(prob.title)}</strong></td>
      <td>${escapeHtml(prob.platform)}</td>
      <td><span class="tag tag-${prob.difficulty}">${escapeHtml(prob.difficulty)}</span></td>
      <td>${escapeHtml(prob.notes)}</td>
      <td><button class="btn btn-danger" data-action="delete-problem" data-id="${prob.id}" type="button" aria-label="Remove problem ${escapeHtml(prob.title)}">Remove</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderLogs(state) {
  const container = document.getElementById('log-entries');
  container.innerHTML = '';

  if (state.logs.length === 0) {
    container.innerHTML = `<p style="color: var(--text-secondary); font-size: 0.875rem;">No study sessions recorded yet.</p>`;
    return;
  }

  state.logs.forEach(log => {
    const card = document.createElement('article');
    card.className = 'log-card';
    card.innerHTML = `
      <div>
        <h3 class="log-title">${escapeHtml(log.topic)}</h3>
        <p class="log-summary">${escapeHtml(log.summary)}</p>
      </div>
      <div class="log-footer">
        <span>${escapeHtml(log.date)} &bull; <strong>${Number(log.duration).toFixed(1)} hrs</strong></span>
        <button class="btn btn-danger" data-action="delete-log" data-id="${log.id}" type="button" aria-label="Delete log ${escapeHtml(log.topic)}">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}