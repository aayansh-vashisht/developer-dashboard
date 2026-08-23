export function renderDashboard(state) {
  renderMetrics(state);
  renderTasks(state);
  renderProblems(state);
  renderLogs(state);
}

function renderMetrics(state) {
  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(t => t.completed).length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const problemsSolved = state.problems.length;
  const totalHours = state.logs.reduce((acc, curr) => acc + curr.duration, 0);

  document.getElementById('metric-total-tasks').textContent = totalTasks;
  document.getElementById('metric-completion-rate').textContent = `${completionRate}%`;
  document.getElementById('metric-problems-solved').textContent = problemsSolved;
  document.getElementById('metric-study-hours').textContent = `${totalHours.toFixed(1)}h`;
}

function renderTasks(state) {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';

  const filteredTasks = state.tasks.filter(t => {
    if (state.taskFilter === 'pending') return !t.completed;
    if (state.taskFilter === 'completed') return t.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `<li class="task-item" style="color: var(--text-secondary); font-size: 0.875rem;">No tasks found.</li>`;
    return;
  }

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.innerHTML = `
      <div class="task-meta">
        <input type="checkbox" data-action="toggle-task" data-id="${task.id}" ${task.completed ? 'checked' : ''} aria-label="Mark task complete">
        <span class="task-text">${escapeHtml(task.title)}</span>
        <span class="tag tag-${task.priority}">${task.priority}</span>
        <span class="tag">${task.category}</span>
      </div>
      <button class="btn btn-danger" data-action="delete-task" data-id="${task.id}">Delete</button>
    `;
    taskList.appendChild(li);
  });
}

function renderProblems(state) {
  const tbody = document.getElementById('problems-tbody');
  tbody.innerHTML = '';

  if (state.problems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="color: var(--text-secondary); text-align: center;">No problems recorded yet.</td></tr>`;
    return;
  }

  state.problems.forEach(prob => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${escapeHtml(prob.title)}</strong></td>
      <td>${prob.platform}</td>
      <td><span class="tag tag-${prob.difficulty}">${prob.difficulty}</span></td>
      <td>${escapeHtml(prob.notes)}</td>
      <td><button class="btn btn-danger" data-action="delete-problem" data-id="${prob.id}">Remove</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderLogs(state) {
  const container = document.getElementById('log-entries');
  container.innerHTML = '';

  if (state.logs.length === 0) {
    container.innerHTML = `<p style="color: var(--text-secondary); font-size: 0.875rem;">No study sessions logged yet.</p>`;
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
        <span>${log.date} &bull; <strong>${log.duration} hrs</strong></span>
        <button class="btn btn-danger" data-action="delete-log" data-id="${log.id}">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
