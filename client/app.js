/**
 * app.js
 * Frontend logic with full CRUD support
 */

const API_BASE = "http://localhost:5000/api";

// DOM references
const authSection = document.getElementById("auth-section");
const taskSection = document.getElementById("task-section");

const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const taskForm = document.getElementById("task-form");

const registerMessage = document.getElementById("register-message");
const loginMessage = document.getElementById("login-message");

const taskList = document.getElementById("task-list");
const logoutBtn = document.getElementById("logout-btn");

// Task form inputs
const taskTitleInput = document.getElementById("task-title");
const taskDescriptionInput = document.getElementById("task-description");
const taskStatusInput = document.getElementById("task-status");

// Track whether we are editing or creating
let editingTaskId = null;

// Utilities
const getToken = () => localStorage.getItem("token");

const setAuthState = (loggedIn) => {
  authSection.style.display = loggedIn ? "none" : "block";
  taskSection.style.display = loggedIn ? "block" : "none";
};

/* ===================== AUTH ===================== */

// Register
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  registerMessage.textContent = "";

  try {
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    registerMessage.textContent = "Registration successful. Please log in.";
    registerForm.reset();
  } catch (err) {
    registerMessage.textContent = err.message;
  }
});

// Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginMessage.textContent = "";

  try {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    localStorage.setItem("token", data.token);
    setAuthState(true);
    loadTasks();
    loginForm.reset();
  } catch (err) {
    loginMessage.textContent = err.message;
  }
});

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  taskList.innerHTML = "";
  setAuthState(false);
});

/* ===================== TASKS ===================== */

// Create or Update task
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const title = taskTitleInput.value;
    const description = taskDescriptionInput.value;
    const status = taskStatusInput.value;

    const url = editingTaskId
      ? `${API_BASE}/tasks/${editingTaskId}`
      : `${API_BASE}/tasks`;

    const method = editingTaskId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ title, description, status }),
    });

    if (!res.ok) throw new Error("Failed to save task");

    // Reset form state
    editingTaskId = null;
    taskForm.reset();

    loadTasks();
  } catch (err) {
    alert(err.message);
  }
});

// Load tasks
const loadTasks = async () => {
  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (!res.ok) throw new Error("Failed to load tasks");

    const tasks = await res.json();
    taskList.innerHTML = "";

    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.textContent = `${task.title} — ${task.status}`;

      // Edit button
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.onclick = () => {
        editingTaskId = task.id;
        taskTitleInput.value = task.title;
        taskDescriptionInput.value = task.description;
        taskStatusInput.value = task.status;
      };

      // Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = async () => {
        const res = await fetch(`${API_BASE}/tasks/${task.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        });

        if (!res.ok) {
          alert("Failed to delete task");
          return;
        }

        loadTasks();
      };

      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  } catch (err) {
    alert(err.message);
  }
};

// Initial state
if (getToken()) {
  setAuthState(true);
  loadTasks();
} else {
  setAuthState(false);
}
