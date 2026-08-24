import {
  loadState,
  saveState,
  importStateData,
  addTask,
  toggleTask,
  deleteTask,
  addProblem,
  deleteProblem,
  addLog,
  deleteLog,
  setTaskFilter,
  setTaskSearch,
  setTaskSort,
  toggleTheme
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

  // 1. Theme Switcher
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      update(toggleTheme(appState));
    });
  }

  // 2. Task Form Submission
  const taskForm = document.getElementById('task-form');
  if (taskForm) {
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('task-title');
      const categoryInput = document.getElementById('task-category');
      const priorityInput = document.getElementById('task-priority');

      if (!titleInput.value.trim()) return;

      update(addTask(appState, {
        title: titleInput.value,
        category: categoryInput.value,
        priority: priorityInput.value
      }));
      taskForm.reset();
    });
  }

  // 3. Task Filters, Search & Sort
  const taskFilter = document.getElementById('task-filter');
  if (taskFilter) {
    taskFilter.value = appState.taskFilter;
    taskFilter.addEventListener('change', (e) => {
      update(setTaskFilter(appState, e.target.value));
    });
  }

  const taskSearch = document.getElementById('task-search');
  if (taskSearch) {
    taskSearch.value = appState.taskSearch;
    taskSearch.addEventListener('input', (e) => {
      update(setTaskSearch(appState, e.target.value));
    });
  }

  const taskSort = document.getElementById('task-sort');
  if (taskSort) {
    taskSort.value = appState.taskSort;
    taskSort.addEventListener('change', (e) => {
      update(setTaskSort(appState, e.target.value));
    });
  }

  // 4. Problem Log Form
  const problemForm = document.getElementById('problem-form');
  if (problemForm) {
    problemForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('problem-title');
      const platformInput = document.getElementById('problem-platform');
      const difficultyInput = document.getElementById('problem-difficulty');
      const notesInput = document.getElementById('problem-notes');

      if (!titleInput.value.trim()) return;

      update(addProblem(appState, {
        title: titleInput.value,
        platform: platformInput.value,
        difficulty: difficultyInput.value,
        notes: notesInput.value
      }));
      problemForm.reset();
    });
  }

  // 5. Deep Work Log Form
  const logForm = document.getElementById('log-form');
  if (logForm) {
    logForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const topicInput = document.getElementById('log-topic');
      const durationInput = document.getElementById('log-duration');
      const summaryInput = document.getElementById('log-summary');

      if (!topicInput.value.trim()) return;

      update(addLog(appState, {
        topic: topicInput.value,
        duration: durationInput.value,
        summary: summaryInput.value
      }));
      logForm.reset();
    });
  }

  // 6. Action Delegation (Toggle / Delete)
  document.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    const id = e.target.dataset.id;
    if (!action || !id) return;

    if (action === 'toggle-task') update(toggleTask(appState, id));
    if (action === 'delete-task') update(deleteTask(appState, id));
    if (action === 'delete-problem') update(deleteProblem(appState, id));
    if (action === 'delete-log') update(deleteLog(appState, id));
  });

  // 7. JSON Export
  const exportBtn = document.getElementById('btn-export-data');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `dashboard_state_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }

  // 8. JSON Import
  const fileInput = document.getElementById('import-file-input');
  const importTriggerBtn = document.getElementById('btn-import-trigger');
  if (fileInput && importTriggerBtn) {
    importTriggerBtn.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedState = importStateData(appState, event.target.result);
          update(importedState);
        } catch (err) {
          alert('Invalid JSON file schema. Import cancelled.');
        }
      };
      reader.readAsText(file);
      fileInput.value = '';
    });
  }
});