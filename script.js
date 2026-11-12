// =====================================
// 1. SELECT HTML ELEMENTS
// =====================================

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const filterButtons = document.querySelector(".filter-buttons");
const clearCompletedBtn = document.getElementById("clear-completed");
const taskStats = document.getElementById("task-stats");
// =====================================
// 2. LOAD SAVED TASKS
// =====================================

let tasks = [];
let currentFilter = "all";

try {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));

    if (Array.isArray(savedTasks)) {
        tasks = savedTasks;
    }
} catch (error) {
    console.error("Could not load saved tasks:", error);
}

// =====================================
// 3. SAVE TASKS
// =====================================

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// =====================================
// 4. DISPLAY TASKS
// =====================================

function displayTasks() {

    taskList.innerHTML = "";

    // Apply selected filter
    let filteredTasks = tasks.filter((task) => {

        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    // Empty message
    if (filteredTasks.length === 0) {

        const emptyMessage = document.createElement("li");

        if (currentFilter === "active") {
            emptyMessage.textContent = "No active tasks!";
        } else if (currentFilter === "completed") {
            emptyMessage.textContent = "No completed tasks!";
        } else {
            emptyMessage.textContent = "No tasks yet. Add your first task!";
        }

        taskList.appendChild(emptyMessage);
    }

    // Display filtered tasks
    filteredTasks.forEach((task) => {

        const li = document.createElement("li");

        const taskText = document.createElement("span");
        taskText.classList.add("task-text");
        taskText.textContent = task.text;

        if (task.completed) {
            taskText.classList.add("completed");
        }

        li.appendChild(taskText);

        // Action buttons
        const actions = document.createElement("div");
        actions.classList.add("task-actions");

        // Complete button
        const completeBtn = document.createElement("button");
        completeBtn.classList.add("complete-btn");
        completeBtn.dataset.action = "complete";
        completeBtn.dataset.id = task.id;
        completeBtn.textContent = task.completed ? "Undo" : "Complete";

        // Edit button
        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-btn");
        editBtn.dataset.action = "edit";
        editBtn.dataset.id = task.id;
        editBtn.textContent = "Edit";

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.dataset.action = "delete";
        deleteBtn.dataset.id = task.id;
        deleteBtn.textContent = "Delete";

        actions.appendChild(completeBtn);
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(actions);

        taskList.appendChild(li);
    });

    // Update remaining task count
    const remainingTasks = tasks.filter(
        (task) => !task.completed
    ).length;

    taskCount.textContent = `${remainingTasks} tasks remaining`;

    const completedTasks = tasks.filter(
        (task) => task.completed
    ).length;

    taskStats.textContent =
        `Total: ${tasks.length} | Completed: ${completedTasks} | Active: ${remainingTasks}`;
}

// =====================================
// 5. CREATE TASK
// =====================================

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const taskValue = taskInput.value.trim();

    if (taskValue === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskValue,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    displayTasks();
});

// =====================================
// 6. UPDATE AND DELETE TASKS
// =====================================

taskList.addEventListener("click", function(event) {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const taskId = Number(button.dataset.id);
    const action = button.dataset.action;

    const task = tasks.find((task) => task.id === taskId);

    if (!task) return;

    // COMPLETE TASK
    if (action === "complete") {
        task.completed = !task.completed;
    }

    // EDIT TASK
    else if (action === "edit") {

        const updatedText = prompt("Edit your task:", task.text);

        if (updatedText === null) return;

        if (updatedText.trim() === "") {
            alert("Task cannot be empty!");
            return;
        }

        task.text = updatedText.trim();
    }

    // DELETE TASK
    else if (action === "delete") {

        const confirmDelete = confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmDelete) return;

        tasks = tasks.filter((task) => task.id !== taskId);
    }

    saveTasks();

    displayTasks();
});

// =====================================
// 7. FILTER TASKS
// =====================================

filterButtons.addEventListener("click", function(event) {

    const button = event.target.closest(".filter-btn");

    if (!button) return;

    currentFilter = button.dataset.filter;

    // Update active button
    document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    displayTasks();
});

// =====================================
// CLEAR COMPLETED TASKS
// =====================================

clearCompletedBtn.addEventListener("click", function() {

    const completedTasks = tasks.filter(
        (task) => task.completed
    );

    if (completedTasks.length === 0) {
        alert("There are no completed tasks to clear!");
        return;
    }

    const confirmClear = confirm(
        "Are you sure you want to remove all completed tasks?"
    );

    if (!confirmClear) return;

    tasks = tasks.filter((task) => !task.completed);

    saveTasks();

    displayTasks();
});

// =====================================
// 8. INITIAL DISPLAY
// =====================================

displayTasks();