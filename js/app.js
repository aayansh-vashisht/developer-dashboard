import {
  loadState,
  saveState,
  addTask,
  toggleTask,
  deleteTask,
  addProblem,
  deleteProblem,
  addLog,
  deleteLog,
  setTaskFilter
} from './state.js';

import { renderDashboard } from './render.js';

let appState = loadState();

function update(newState) {
  appState = newState;
  saveState(appState);
  renderDashboard(appState);
}

document.addEventListener('DOMContentLoaded', () => {
  renderDashboard(appState);

  // Form: Add Task
  const taskForm = document.getElementById('task-form');
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title').value;
    const category = document.getElementById('task-category').value;
    const priority = document.getElementById('task-priority').value;

    update(addTask(appState, { title, category, priority }));
    taskForm.reset();
  });

  // Filter: Task status
  const taskFilter = document.getElementById('task-filter');
  taskFilter.value = appState.taskFilter;
  taskFilter.addEventListener('change', (e) => {
    update(setTaskFilter(appState, e.target.value));
  });

  // Form: Log Problem
  const problemForm = document.getElementById('problem-form');
  problemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('problem-title').value;
    const platform = document.getElementById('problem-platform').value;
    const difficulty = document.getElementById('problem-difficulty').value;
    const notes = document.getElementById('problem-notes').value;

    update(addProblem(appState, { title, platform, difficulty, notes }));
    problemForm.reset();
  });

  // Form: Learning Log
  const logForm = document.getElementById('log-form');
  logForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const topic = document.getElementById('log-topic').value;
    const duration = document.getElementById('log-duration').value;
    const summary = document.getElementById('log-summary').value;

    update(addLog(appState, { topic, duration, summary }));
    logForm.reset();
  });

  // Event Delegation: Task, Problem, and Log Actions
  document.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    const id = e.target.dataset.id;
    if (!action || !id) return;

    if (action === 'toggle-task') update(toggleTask(appState, id));
    if (action === 'delete-task') update(deleteTask(appState, id));
    if (action === 'delete-problem') update(deleteProblem(appState, id));
    if (action === 'delete-log') update(deleteLog(appState, id));
  });

  // Export State JSON
  document.getElementById('btn-export-data').addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dashboard_state_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });
});
