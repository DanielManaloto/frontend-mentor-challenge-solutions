import "./style.css";

const toggleBtn = document.getElementById('theme-btn');

toggleBtn.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  
  if (document.documentElement.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});


if (localStorage.getItem('theme') === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

const todoContainer = document.querySelector(".todo-cntr");
const todoComponents = document.querySelector(".todo-components");
const todoButtons = document.querySelector(".todo-list-buttons");
const clearCompleteBtn = document.querySelector("#clear-completed-btn");

const mediaQuery = window.matchMedia("(min-width: 640px)");

function updateTodoLayout() {
    if (mediaQuery.matches) {
        todoComponents.append(todoButtons);
        todoComponents.append(clearCompleteBtn);
    } else {

        todoContainer.after(todoButtons);
    }
}

updateTodoLayout();

mediaQuery.addEventListener("change", updateTodoLayout);