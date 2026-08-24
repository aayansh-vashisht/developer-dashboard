const STORAGE_KEY = 'dev_dashboard_state_v2';

const defaultState = {
  tasks: [],
  problems: [],
  logs: [],
  theme: 'dark',
  taskFilter: 'all',
  taskSearch: '',
  taskSort: 'newest'
};

function getLocalDateString(dateObj = new Date()) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw);
    return {
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      problems: Array.isArray(parsed.problems) ? parsed.problems : [],
      logs: Array.isArray(parsed.logs) ? parsed.logs : [],
      theme: parsed.theme === 'light' ? 'light' : 'dark',
      taskFilter: typeof parsed.taskFilter === 'string' ? parsed.taskFilter : 'all',
      taskSearch: typeof parsed.taskSearch === 'string' ? parsed.taskSearch : '',
      taskSort: typeof parsed.taskSort === 'string' ? parsed.taskSort : 'newest'
    };
  } catch (error) {
    console.warn('Malformed or unreadable localStorage payload. Falling back to default schema[cite: 2].', error);
    return { ...defaultState };
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to serialize and persist state to localStorage[cite: 2].', error);
  }
}

export function importStateData(currentState, importedJsonString) {
  const parsed = JSON.parse(importedJsonString);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Import failed: Root JSON payload must be an object.');
  }

  const sanitizedTasks = Array.isArray(parsed.tasks) ? parsed.tasks.filter(isValidTask) : currentState.tasks;
  const sanitizedProblems = Array.isArray(parsed.problems) ? parsed.problems.filter(isValidProblem) : currentState.problems;
  const sanitizedLogs = Array.isArray(parsed.logs) ? parsed.logs.filter(isValidLog) : currentState.logs;

  return {
    ...currentState,
    tasks: sanitizedTasks,
    problems: sanitizedProblems,
    logs: sanitizedLogs
  };
}

function isValidTask(t) {
  return t && typeof t.id === 'string' && typeof t.title === 'string';
}

function isValidProblem(p) {
  return p && typeof p.id === 'string' && typeof p.title === 'string';
}

function isValidLog(l) {
  return l && typeof l.id === 'string' && typeof l.topic === 'string' && typeof l.duration === 'number';
}

export function addTask(state, { title, category, priority }) {
  const newTask = {
    id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    title: title.trim(),
    category,
    priority,
    completed: false,
    createdAt: new Date().toISOString()
  };
  return { ...state, tasks: [newTask, ...state.tasks] };
}

export function toggleTask(state, id) {
  return {
    ...state,
    tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
  };
}

export function deleteTask(state, id) {
  return {
    ...state,
    tasks: state.tasks.filter(t => t.id !== id)
  };
}

export function addProblem(state, { title, platform, difficulty, notes }) {
  const newProblem = {
    id: 'prob_' + Date.now(),
    title: title.trim(),
    platform,
    difficulty,
    notes: notes ? notes.trim() : 'N/A',
    loggedAt: new Date().toISOString(),
    rawDate: getLocalDateString()
  };
  return { ...state, problems: [newProblem, ...state.problems] };
}

export function deleteProblem(state, id) {
  return {
    ...state,
    problems: state.problems.filter(p => p.id !== id)
  };
}

export function addLog(state, { topic, duration, summary }) {
  const newLog = {
    id: 'log_' + Date.now(),
    topic: topic.trim(),
    duration: parseFloat(duration) || 0,
    summary: summary.trim(),
    date: new Date().toLocaleDateString(),
    rawDate: getLocalDateString()
  };
  return { ...state, logs: [newLog, ...state.logs] };
}

export function deleteLog(state, id) {
  return {
    ...state,
    logs: state.logs.filter(l => l.id !== id)
  };
}

export function setTaskFilter(state, filterValue) {
  return { ...state, taskFilter: filterValue };
}

export function setTaskSearch(state, query) {
  return { ...state, taskSearch: query.trim().toLowerCase() };
}

export function setTaskSort(state, sortValue) {
  return { ...state, taskSort: sortValue };
}

export function toggleTheme(state) {
  return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
}

export function calculateStreak(state) {
  const activityDates = new Set();

  state.logs.forEach(l => {
    if (l.rawDate) activityDates.add(l.rawDate);
  });
  state.problems.forEach(p => {
    if (p.rawDate) activityDates.add(p.rawDate);
  });

  if (activityDates.size === 0) return 0;

  const todayStr = getLocalDateString(new Date());
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterdayDate);

  let checkDate = new Date();
  if (activityDates.has(todayStr)) {
    checkDate = new Date();
  } else if (activityDates.has(yesterdayStr)) {
    checkDate = yesterdayDate;
  } else {
    return 0;
  }

  let streak = 0;
  while (true) {
    const formatted = getLocalDateString(checkDate);
    if (activityDates.has(formatted)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}