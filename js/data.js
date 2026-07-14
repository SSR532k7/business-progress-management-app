
// role options used across the app: "admin", "manager", "employee"
const USERS = [
  { username: "admin",    password: "admin123",    role: "admin"    },
  { username: "sales",  password: "sales123",    role: "employee" },
  { username: "finance",password: "finance123",  role: "employee" },
  { username: "manager",password: "manager123",  role: "manager"  }
];


const STORAGE_KEYS = {
  currentUser: "bpms_current_user",
  workflows: "bpms_workflows"
};

function getWorkflows() {
  let raw = localStorage.getItem(STORAGE_KEYS.workflows);
  if (raw === null) {
    return [];
  } else {
    return JSON.parse(raw);
  }
}

function saveWorkflows(workflows) {
  localStorage.setItem(STORAGE_KEYS.workflows, JSON.stringify(workflows));
}

function getCurrentUser() {
  let raw = localStorage.getItem(STORAGE_KEYS.currentUser);
  if (raw === null) {
    return null;
  } else {
    return JSON.parse(raw);
  }
}

function setCurrentUser(user) {
  localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
}
