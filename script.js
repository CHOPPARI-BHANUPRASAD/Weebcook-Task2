document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskTimeInput = document.getElementById('task-time-input');
    const addTaskButton = document.getElementById('add-task-button');
    const taskList = document.getElementById('task-list');

    const allTasksButton = document.getElementById('all-tasks-button');
    const pendingTasksButton = document.getElementById('pending-tasks-button');
    const completedTasksButton = document.getElementById('completed-tasks-button');

    const alarmSound = document.getElementById('alarm-sound');

    let tasks = [];

    // Add a new task
    addTaskButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        const taskTime = taskTimeInput.value;
        if (taskText && taskTime) {
            const task = {
                id: Date.now(),
                text: taskText,
                completed: false,
                time: new Date(taskTime).getTime()
            };
            tasks.push(task);
            renderTasks();
            taskInput.value = '';
            taskTimeInput.value = '';
            setTaskAlarm(task);
        }
    });

    // Handle task list interactions
    taskList.addEventListener('click', (e) => {
        const id = e.target.closest('.task-item').dataset.id;

        if (e.target.classList.contains('delete-btn')) {
            tasks = tasks.filter(task => task.id != id);
            renderTasks();
        } else if (e.target.classList.contains('edit-btn')) {
            const newText = prompt('Edit task:', tasks.find(task => task.id == id).text);
            if (newText) {
                tasks = tasks.map(task => task.id == id ? { ...task, text: newText } : task);
                renderTasks();
            }
        } else if (e.target.classList.contains('complete-btn')) {
            tasks = tasks.map(task => task.id == id ? { ...task, completed: true } : task);
            renderTasks(); // Re-render the tasks after marking as completed
        }
    });

    // Filter buttons
    allTasksButton.addEventListener('click', () => renderTasks('all'));
    pendingTasksButton.addEventListener('click', () => renderTasks('pending'));
    completedTasksButton.addEventListener('click', () => renderTasks('completed'));

    // Render tasks based on filter
    function renderTasks(filter = 'all') {
        taskList.innerHTML = tasks.filter(task => {
            if (filter === 'all') return true;
            if (filter === 'completed') return task.completed;
            if (filter === 'pending') return !task.completed;
        }).map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <span>${task.text}</span>
                <div class="task-actions">
                    <button class="complete-btn">Completed</button>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            </li>
        `).join('');
    }

    // Set an alarm for the task
    function setTaskAlarm(task) {
        const now = new Date().getTime();
        const timeDifference = task.time - now;

        if (timeDifference > 0) {
            setTimeout(() => {
                const taskStillPending = tasks.find(t => t.id === task.id && !t.completed);
                if (taskStillPending) {
                    alarmSound.play();
                    alert(`Task "${task.text}" is overdue!`);
                }
            }, timeDifference);
        }
    }
});
