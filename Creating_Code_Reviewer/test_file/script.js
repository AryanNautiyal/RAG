const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

let tasks = [];

function showWelcome() {
    const urlParams = new URLSearchParams(window.location.search);
    const rawName = urlParams.get("name") || "Guest";
    
    // Sanitize user input to prevent XSS
    const welcomeDiv = document.getElementById("welcome");
    welcomeDiv.textContent = "";
    
    const textNode = document.createTextNode(`Welcome, ${rawName}!`);
    welcomeDiv.appendChild(textNode);
}

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = "task";

        const span = document.createElement("span");
        span.textContent = task;

        const button = document.createElement("button");
        button.className = "delete-btn";
        button.textContent = "Delete";
        button.addEventListener("click", () => deleteTask(index));

        li.appendChild(span);
        li.appendChild(button);
        taskList.appendChild(li);
    });
}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    const task = input.value.trim();

    if (!task) return;

    tasks.push(task);
    input.value = "";
    saveTasks();
    renderTasks();
});

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function loadTasks() {
    try {
        const storedTasks = localStorage.getItem("tasks");
        tasks = storedTasks ? JSON.parse(storedTasks) : [];
        if (!Array.isArray(tasks)) {
            tasks = [];
        }
    } catch (err) {
        console.error("Failed to load tasks from localStorage:", err);
        tasks = [];
    }
    renderTasks();
}

function saveTasks() {
    try {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (err) {
        console.error("Failed to save tasks to localStorage:", err);
    }
}

showWelcome();
loadTasks();
