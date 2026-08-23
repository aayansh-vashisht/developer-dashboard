const STORAGE_KEY = 'dev_dashboard_state_v1';

const defaultState = {
  tasks: [],
  problems: [],
  logs: [],
  taskFilter: 'all'
};

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw);
    return {
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      problems: Array.isArray(parsed.problems) ? parsed.problems : [],
      logs: Array.isArray(parsed.logs) ? parsed.logs : [],
      taskFilter: typeof parsed.taskFilter === 'string' ? parsed.taskFilter : 'all'
    };
  } catch (error) {
    console.warn('Malformed or unreadable localStorage payload. Falling back to default schema.', error);
    return { ...defaultState };
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to serialize and persist state to localStorage.', error);
  }
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
    loggedAt: new Date().toISOString()
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
    date: new Date().toLocaleDateString()
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
