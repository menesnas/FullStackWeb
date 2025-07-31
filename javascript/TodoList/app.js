let todos = [];

// localden todoları yükleme kısmı
function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
        renderTodos();
    }
}
// local storage'e kaydetme 
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    
    if (text === '') {
        alert('Lütfen bir görev yazın!');
        return;
    }
    todos.push({
        id: Date.now(),
        text: text,
        completed: false
    });
    input.value = '';
    saveTodos();
    renderTodos();
}

function clearInput() {
    document.getElementById('todoInput').value = '';
}

function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
} // Todo'nun yapılıp yapılmadığını değiştirir 

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}
function clearAll() {
    if (todos.length === 0) {
        alert('Silinecek görev yok!');
        return;
    }
    
    todos = [];
    saveTodos();
    renderTodos();
    showSuccessMessage();
}

function showSuccessMessage() {
    const message = document.getElementById('successMessage');
    message.style.display = 'block';
    
    setTimeout(() => {
        message.style.display = 'none';
    }, 2000);
}

function renderTodos() {
    const container = document.getElementById('todoContainer');
    if (todos.length === 0) {
        container.innerHTML = '<p>Henüz görev yok.</p>';
        return;
    }
    
    container.innerHTML = todos.map(todo => `
        <div class="todo-item ${todo.completed ? 'completed' : ''}">
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo(${todo.id})">
            <span class="todo-text">${todo.text}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">✕</button>
        </div>
    `).join('');
}


document.addEventListener('DOMContentLoaded', function() {
    loadTodos();
    // enter tuşu ile ekleme 
    document.getElementById('todoInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
});            