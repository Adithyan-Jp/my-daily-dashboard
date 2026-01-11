"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Access our DB connection

export default function PersonalDashboard() {
  // --- State Management ---
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [quote, setQuote] = useState('');
  const [weather, setWeather] = useState(null);
  const [goals, setGoals] = useState([]);
  const [waterIntake, setWaterIntake] = useState(0);
  const [mood, setMood] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [showExpenseInput, setShowExpenseInput] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '' });

  const motivationalQuotes = [
    "The secret of getting ahead is getting started.",
    "Small progress is still progress.",
    "Don't watch the clock; do what it does. Keep going.",
    "Dream bigger. Do bigger."
  ];

  const moods = [
    { emoji: '😄', label: 'Great', value: 5 },
    { emoji: '🙂', label: 'Good', value: 4 },
    { emoji: '😐', label: 'Okay', value: 3 },
    { emoji: '😔', label: 'Low', value: 2 },
    { emoji: '😢', label: 'Bad', value: 1 }
  ];

  // 1. INITIAL LOAD & CLOUD FETCH
  useEffect(() => {
    const fetchCloudData = async () => {
      // Fetch data from the 'user_data' table for ID 1
      const { data, error } = await supabase
        .from('user_data')
        .select('content')
        .eq('id', 1)
        .single();

      if (data && data.content) {
        const saved = data.content;
        setTasks(saved.tasks || []);
        setWaterIntake(saved.waterIntake || 0);
        setExpenses(saved.expenses || []);
        setGoals(saved.goals || []);
        setMood(saved.mood || null);
      }
      setMounted(true); // Only show UI after data is loaded
    };

    fetchCloudData();

    const timer = setInterval(() => setTime(new Date()), 1000);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    
    fetch('https://api.open-meteo.com/v1/forecast?latitude=8.5241&longitude=76.9366&current=temperature_2m,relative_humidity_2m&timezone=auto')
      .then(res => res.json())
      .then(data => setWeather(data.current))
      .catch(err => console.error('Weather error:', err));

    return () => clearInterval(timer);
  }, []);

  // 2. AUTO-SAVE TO CLOUD
  useEffect(() => {
    if (mounted) {
      const saveToCloud = async () => {
        const dashboardState = { tasks, waterIntake, expenses, goals, mood };
        const { error } = await supabase
          .from('user_data')
          .upsert({ id: 1, content: dashboardState });
        
        if (error) console.error("Cloud Save Error:", error);
      };

      // Wait 1000ms (1s) after last change before hitting the database
      const timeout = setTimeout(saveToCloud, 1000);
      return () => clearTimeout(timeout);
    }
  }, [tasks, waterIntake, expenses, goals, mood, mounted]);

  // --- Actions ---
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
      setShowTaskInput(false);
    }
  };

  const addExpense = () => {
    if (newExpense.description && newExpense.amount) {
      setExpenses([...expenses, { ...newExpense, id: Date.now(), date: new Date().toLocaleDateString() }]);
      setNewExpense({ description: '', amount: '' });
      setShowExpenseInput(false);
    }
  };

  if (!mounted) return null; // Wait for initial fetch to finish

  const CardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(12px)',
    borderRadius: '24px',
    padding: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'white'
  };

  const todayTotal = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{...CardStyle, marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h1 style={{fontSize: '2.5rem', margin: 0}}>{greeting}!</h1>
            <p style={{opacity: 0.8}}>{time.toLocaleDateString(undefined, {weekday: 'long', month: 'long', day: 'numeric'})}</p>
          </div>
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: '3rem', fontWeight: 'bold'}}>{time.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</div>
            {weather && <p>🌡️ {Math.round(weather.temperature_2m)}°C | 💧 {weather.relative_humidity_2m}%</p>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* MOOD */}
          <div style={CardStyle}>
            <h3>How's the vibe?</h3>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1rem'}}>
              {moods.map(m => (
                <button key={m.value} onClick={() => setMood(m.value)} style={{
                  background: mood === m.value ? 'rgba(255,255,255,0.3)' : 'transparent',
                  border: 'none', fontSize: '1.5rem', cursor: 'pointer', borderRadius: '10px', padding: '5px'
                }}>{m.emoji}</button>
              ))}
            </div>
          </div>

          {/* WATER */}
          <div style={CardStyle}>
            <h3>Water Intake 💧</h3>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem'}}>
              <button onClick={() => setWaterIntake(Math.max(0, waterIntake - 1))} style={{background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '10px', borderRadius: '50%', cursor: 'pointer'}}>-</button>
              <span style={{fontSize: '1.5rem', fontWeight: 'bold'}}>{waterIntake} / 8 Glasses</span>
              <button onClick={() => setWaterIntake(waterIntake + 1)} style={{background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '10px', borderRadius: '50%', cursor: 'pointer'}}>+</button>
            </div>
          </div>

          {/* TASKS */}
          <div style={CardStyle}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <h3>Priorities 🎯</h3>
              <button onClick={() => setShowTaskInput(!showTaskInput)} style={{background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem'}}>+</button>
            </div>
            {showTaskInput && (
              <div style={{display: 'flex', gap: '5px', marginTop: '10px'}}>
                <input value={newTask} onChange={(e) => setNewTask(e.target.value)} style={{background: 'rgba(255,255,255,0.1)', border: 'none', padding: '8px', borderRadius: '8px', color: 'white', flex: 1}} />
                <button onClick={addTask} style={{background: '#2ecc71', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer'}}>Add</button>
              </div>
            )}
            <ul style={{listStyle: 'none', padding: 0, marginTop: '1rem'}}>
              {tasks.map(t => (
                <li key={t.id} style={{display: 'flex', gap: '10px', marginBottom: '8px', opacity: t.completed ? 0.5 : 1}}>
                  <input type="checkbox" checked={t.completed} onChange={() => {
                    setTasks(tasks.map(task => task.id === t.id ? {...task, completed: !task.completed} : task))
                  }} />
                  <span>{t.text}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* EXPENSES */}
          <div style={CardStyle}>
            <h3>Daily Expenses 💰</h3>
            <p style={{fontSize: '0.9rem', opacity: 0.8}}>Total Today: ₹{todayTotal}</p>
            <button onClick={() => setShowExpenseInput(!showExpenseInput)} style={{width: '100%', padding: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '8px', marginTop: '10px', cursor: 'pointer'}}>+ Add Expense</button>
            {showExpenseInput && (
              <div style={{marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px'}}>
                <input placeholder="Desc" value={newExpense.description} onChange={(e) => setNewExpense({...newExpense, description: e.target.value})} style={{background: 'rgba(255,255,255,0.1)', border: 'none', padding: '5px', color: 'white'}} />
                <input placeholder="Amount" type="number" value={newExpense.amount} onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})} style={{background: 'rgba(255,255,255,0.1)', border: 'none', padding: '5px', color: 'white'}} />
                <button onClick={addExpense} style={{background: '#e74c3c', border: 'none', color: 'white', padding: '5px', cursor: 'pointer'}}>Save</button>
              </div>
            )}
          </div>
        </div>

        <div style={{textAlign: 'center', marginTop: '3rem', opacity: 0.6, fontStyle: 'italic', color: 'white'}}>
          "{quote}"
        </div>
      </div>
    </div>
  );
}
