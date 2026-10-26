import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { fetchTodos, addTodo, toggleTodo, deleteTodo } from './api';
import type { Todo } from './types';

function TodoForm({ onAdd }: { onAdd: (text: string) => void }) {
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim() === '') return;
    onAdd(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Новая задача..."
      />
      <button type="submit">Добавить</button>
    </form>
  );
}

function TodoItem({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Todo;
  onToggle: (id: string, is_complete: boolean) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.is_complete}
        onChange={() => onToggle(todo.id, !todo.is_complete)}
      />
      <span style={{ textDecoration: todo.is_complete ? 'line-through' : 'none' }}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>Удалить</button>
    </li>
  );
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchTodos();
        setTodos(data);
      } catch (err) {
        setError('Не удалось загрузить задачи');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAdd = async (text: string) => {
    try {
      const newTodo = await addTodo(text);
      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      setError('Не удалось добавить');
    }
  };

  const handleToggle = async (id: string, is_complete: boolean) => {
    try {
      await toggleTodo(id, is_complete);
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, is_complete } : t)));
    } catch (err) {
      setError('Не удалось обновить');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError('Не удалось удалить');
    }
  };

  if (loading) return <div>Загрузка…</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div>
      <h1>Мои задачи</h1>
      <TodoForm onAdd={handleAdd} />
      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}