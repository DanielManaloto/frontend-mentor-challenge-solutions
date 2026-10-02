import { useState, useEffect } from "react";

export default function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Complete online JavaScript course", completed: true },
    { id: 2, text: "Jog around the park 3x", completed: false },
    { id: 3, text: "10 minutes meditation", completed: false },
    { id: 4, text: "Read for 1 hour", completed: false },
    { id: 5, text: "Pick up groceries", completed: false },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("all");

  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia("(min-width: 640px)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 640px)");
    const handleChange = (e) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  function addTodo(e) {
    if (e.key !== "Enter") return;
    const text = inputValue.trim();
    if (!text) return;
    setTodos((prev) => [{ id: Date.now(), text, completed: false }, ...prev]);
    setInputValue("");
  }

  function toggleTodo(id) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }

  function handleDragStart(e, id) {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(id));
  }

  function handleDragOver(e, id) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (id !== draggedId) setDragOverId(id);
  }

  function handleDrop(e, targetId) {
    e.preventDefault();
    if (draggedId === null || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }
    setTodos((prev) => {
      const updated = [...prev];
      const fromIndex = updated.findIndex((t) => t.id === draggedId);
      const toIndex = updated.findIndex((t) => t.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
    setDraggedId(null);
    setDragOverId(null);
  }

  function handleDragEnd() {
    setDraggedId(null);
    setDragOverId(null);
  }

  const visibleTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const itemsLeft = todos.filter((t) => !t.completed).length;

  const filterButtons = (
    <>
      <button
        id="show-all-btn"
        onClick={() => setFilter("all")}
        className={`generic-btn ${filter === "all" ? "text-brand-blue" : ""}`}
      >
        All
      </button>
      <button
        id="show-active-btn"
        onClick={() => setFilter("active")}
        className={`generic-btn ${filter === "active" ? "text-brand-blue" : ""}`}
      >
        Active
      </button>
      <button
        id="show-completed-btn"
        onClick={() => setFilter("completed")}
        className={`generic-btn ${filter === "completed" ? "text-brand-blue" : ""}`}
      >
        Completed
      </button>
    </>
  );

  return (
    <>
      <header className="w-full flex items-center justify-between max-[375px]:mt-12 max-[375px]:mb-0 mt-18 mb-8">
        <h2 className="text-black dark:text-white max-[375px]:text-2xl text-4xl font-bold tracking-[0.3em]">
          TODO
        </h2>
        <button
          type="button"
          id="theme-btn"
          aria-label="Toggle dark mode"
          onClick={() => setIsDark((d) => !d)}
          className="data-hs-theme-switch w-6 h-6 bg-no-repeat bg-contain bg-center border-none cursor-pointer bg-[url('/images/icon-moon.svg')] dark:bg-[url('/images/icon-sun.svg')]"
        ></button>
      </header>

      <main className="w-full flex flex-col gap-5 text-lg">
        <div className="input-cntr flex flex-row items-center gap-5 w-full p-5 rounded-lg bg-surface-light dark:bg-surface-dark transition-colors duration-300">
          <input type="checkbox" className="todo-checkbox" disabled />
          <input
            type="text"
            name="add_todo"
            id="add-todo"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={addTodo}
            placeholder="Add Todo"
            className="bg-transparent border-none outline-none w-full text-base text-ink-light dark:text-ink-dark placeholder:text-muted"
          />
        </div>

        <div className="todo-cntr w-full rounded-lg overflow-hidden font-bold bg-surface-light dark:bg-surface-dark text-ink-light dark:text-ink-dark transition-colors duration-300">
          <ul className="todo-list">
            {visibleTodos.map((todo) => (
              <li
                key={todo.id}
                draggable
                onDragStart={(e) => handleDragStart(e, todo.id)}
                onDragOver={(e) => handleDragOver(e, todo.id)}
                onDrop={(e) => handleDrop(e, todo.id)}
                onDragEnd={handleDragEnd}
                className={`todo-item group flex items-center cursor-grab active:cursor-grabbing transition-[opacity,box-shadow] ${
                  draggedId === todo.id ? "opacity-40" : ""
                } ${
                  dragOverId === todo.id && draggedId !== todo.id
                    ? "shadow-[inset_0_2px_0_0_var(--color-brand-blue)]"
                    : ""
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="todo-checkbox peer"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />

                  <span className="todo-text peer-checked:text-gray-400 peer-checked:line-through">
                    {todo.text}
                  </span>
                </label>

                <button
                  type="button"
                  aria-label="Delete todo"
                  onClick={() => deleteTodo(todo.id)}
                  className="
                    ml-auto
                    w-3 h-3
                    shrink-0
                    bg-no-repeat
                    bg-contain
                    bg-center
                    border-none
                    cursor-pointer
                    bg-[url('/images/icon-cross.svg')]
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                  "
                />
              </li>
            ))}
          </ul>

          <div className="todo-components flex justify-between items-center p-5 font-bold text-sm text-muted">
            <p className="whitespace-nowrap">{itemsLeft} items left</p>
            {isDesktop && (
              <div className="todo-list-buttons flex justify-center gap-4 rounded-lg font-bold text-muted transition-colors duration-300">
                {filterButtons}
              </div>
            )}
            <button
              id="clear-completed-btn"
              onClick={clearCompleted}
              className="border-none bg-transparent whitespace-nowrap font-bold cursor-pointer text-muted hover:text-ink-light dark:hover:text-ink-dark transition-colors"
            >
              Clear Completed
            </button>
          </div>
        </div>

        {!isDesktop && (
          <div className="todo-list-buttons w-full flex justify-center gap-4 max-sm:p-5 rounded-lg font-bold bg-surface-light dark:bg-surface-dark text-muted transition-colors duration-300">
            {filterButtons}
          </div>
        )}

        <p className="text-center text-sm font-bold text-muted">
          Drag and drop to reorder list
        </p>
      </main>
    </>
  );
}