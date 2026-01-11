'use client';
import { useState } from 'react';

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  const addTask = (e) => {
    e.preventDefault();
    if (!input) return;
    setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
    setInput('');
  };

  return (
    <div className="bg-black/20 rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-3">Today's Priorities</h2>
      <form onSubmit={addTask} className="flex gap-2 mb-4">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What's the goal?"
          className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 w-full outline-none focus:bg-white/20 transition"
        />
        <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold hover:bg-opacity-90 transition">+</button>
      </form>
      <ul className="space-y-2">
        {tasks.map(task => (
          <li key={task.id} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
            <input type="checkbox" className="w-5 h-5 accent-pink-500" />
            <span className="text-white/90">{task.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
