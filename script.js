// Simple todo with localStorage
const form = document.getElementById('todoForm');
const input = document.getElementById('todoInput');
const list = document.getElementById('todoList');
const count = document.getElementById('count');
const clearDoneBtn = document.getElementById('clearDone');
const clearAllBtn = document.getElementById('clearAll');

let todos = JSON.parse(localStorage.getItem('pastelTodos') || '[]');

function render() {
    list.innerHTML = '';
    todos.forEach((t, i) => {
        const li = document.createElement('li');
        li.className = 'todo-item' + (t.done ? ' done' : '');
        li.innerHTML = `
      <div class="todo-left">
        <div class="checkbox ${t.done ? 'checked' : ''}" data-index="${i}">${t.done ? '✓' : ''}</div>
        <div class="todo-text">${escapeHtml(t.text)}</div>
      </div>
      <div class="small-btns">
        <button class="ghost remove" data-index="${i}">Delete</button>
      </div>
    `;
        list.appendChild(li);
    });
    count.textContent = `${todos.length} task${todos.length !== 1 ? 's' : ''}`;
    attachListeners();
    localStorage.setItem('pastelTodos', JSON.stringify(todos));
}

function attachListeners() {
    document.querySelectorAll('.checkbox').forEach(el => {
        el.onclick = () => {
            const i = Number(el.dataset.index);
            todos[i].done = !todos[i].done;
            render();
        };
    });
    document.querySelectorAll('.remove').forEach(el => {
        el.onclick = () => {
            const i = Number(el.dataset.index);
            todos.splice(i, 1);
            render();
        };
    });
}

// simple escape to avoid HTML injection
function escapeHtml(text) {
    return text.replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;
    todos.unshift({ text: val, done: false });
    input.value = '';
    render();
});

clearDoneBtn.addEventListener('click', () => {
    todos = todos.filter(t => !t.done);
    render();
});

clearAllBtn.addEventListener('click', () => {
    todos = [];
    render();
});

render();

