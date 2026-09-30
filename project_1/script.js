const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('addbtn');
const todoList = document.getElementById('todolist');
const totalCount = document.getElementById('totalcount');
const completedCount = document.getElementById('completedcount');
const STORAGE_KEY = 'todos';

function loadTodos() {
    try {
        const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        return Array.isArray(savedTodos) ? savedTodos : [];
    } catch {
        return [];
    }
}

let todos = loadTodos();

function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function updateStats() {
    totalCount.textContent = todos.length;
    completedCount.textContent = todos.filter((todo) => todo.completed).length;
}

function renderTodos() {
    todoList.replaceChildren();

    todos.forEach((todo) => {
        const item = document.createElement('li');
        item.className = 'todo-item';

        const text = document.createElement('span');
        text.className = 'todo-text';
        text.textContent = todo.text;
        if (todo.completed) text.classList.add('completed');

        const buttons = document.createElement('div');
        buttons.className = 'todo-buttons';

        const completeButton = document.createElement('button');
        completeButton.type = 'button';
        completeButton.className = 'complete-btn';
        completeButton.textContent = todo.completed ? 'Undo' : 'Done';
        completeButton.addEventListener('click', () => toggleComplete(todo.id));

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTodo(todo.id));

        buttons.append(completeButton, deleteButton);
        item.append(text, buttons);
        todoList.appendChild(item);
    });

    updateStats();
}

function addTodo() {
    const text = todoInput.value.trim();
    if (!text) {
        todoInput.focus();
        return;
    }

    todos.push({ id: `${Date.now()}-${Math.random()}`, text, completed: false });
    saveTodos();
    renderTodos();
    todoInput.value = '';
    todoInput.focus();
}

function toggleComplete(id) {
    const todo = todos.find((item) => item.id === id);
    if (!todo) return;

    todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos();
    renderTodos();
}

addButton.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') addTodo();
});

renderTodos();