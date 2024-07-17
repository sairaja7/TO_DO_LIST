document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('task-form').addEventListener('submit', addTask);
document.getElementById('task-list').addEventListener('click', handleTaskActions);

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToDOM(task));
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask(e) {
    e.preventDefault();

    const taskInput = document.getElementById('task-input');
    const taskTime = document.getElementById('task-time');

    const task = {
        id: Date.now().toString(),
        text: taskInput.value,
        time: taskTime.value,
        completed: false
    };

    addTaskToDOM(task);

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    saveTasks(tasks);

    taskInput.value = '';
    taskTime.value = '';
}

function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.className = task.completed ? 'completed' : '';

    li.innerHTML = `
        <span>${task.text} (${new Date(task.time).toLocaleString()})</span>
        <div>
            <button class="complete">Complete</button>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        </div>
    `;

    document.getElementById('task-list').appendChild(li);
}

function handleTaskActions(e) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const li = e.target.closest('li');
    const taskId = li.dataset.id;
    const task = tasks.find(t => t.id === taskId);

    if (e.target.classList.contains('complete')) {
        task.completed = !task.completed;
        li.classList.toggle('completed');
    } else if (e.target.classList.contains('edit')) {
        const newText = prompt('Edit your task', task.text);
        const newTime = prompt('Edit the time', task.time);
        if (newText !== null && newTime !== null) {
            task.text = newText;
            task.time = newTime;
            li.querySelector('span').textContent = `${newText} (${new Date(newTime).toLocaleString()})`;
        }
    } else if (e.target.classList.contains('delete')) {
        tasks.splice(tasks.indexOf(task), 1);
        li.remove();
    }

    saveTasks(tasks);
}
