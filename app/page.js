"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function PersonalDashboard() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [focusTime, setFocusTime] = useState(25);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [quote, setQuote] = useState('');
  const [quickNotes, setQuickNotes] = useState('');
  const [weather, setWeather] = useState(null);
  const [habits, setHabits] = useState([]);
  const [showHabitInput, setShowHabitInput] = useState(false);
  const [newHabit, setNewHabit] = useState('');
  const [events, setEvents] = useState([]);
  const [showEventInput, setShowEventInput] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', time: '' });
  const [goals, setGoals] = useState([]);
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', target: '', current: 0 });
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal] = useState(8);
  const [mood, setMood] = useState(null);
  const [quickLinks, setQuickLinks] = useState([]);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [expenses, setExpenses] = useState([]);
  const [showExpenseInput, setShowExpenseInput] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '' });

  // Load data from Supabase
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Get or create a user session
      const storedUserId = localStorage.getItem('dashboard_user_id');
      let currentUserId = storedUserId;

      if (!currentUserId) {
        currentUserId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('dashboard_user_id', currentUserId);
      }

      setUserId(currentUserId);

      // Load all data
      await Promise.all([
        loadTasks(currentUserId),
        loadHabits(currentUserId),
        loadEvents(currentUserId),
        loadGoals(currentUserId),
        loadQuickLinks(currentUserId),
        loadExpenses(currentUserId),
        loadNotes(currentUserId),
        loadMood(currentUserId)
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error loading user data:', error);
      setLoading(false);
    }
  };

  const loadTasks = async (uid) => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });
    if (!error && data) setTasks(data);
  };

  const loadHabits = async (uid) => {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', uid);
    if (!error && data) setHabits(data);
  };

  const loadEvents = async (uid) => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', uid)
      .order('time', { ascending: true });
    if (!error && data) setEvents(data);
  };

  const loadGoals = async (uid) => {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', uid);
    if (!error && data) setGoals(data);
  };

  const loadQuickLinks = async (uid) => {
    const { data, error } = await supabase
      .from('quick_links')
      .select('*')
      .eq('user_id', uid);
    if (!error && data) setQuickLinks(data);
  };

  const loadExpenses = async (uid) => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });
    if (!error && data) setExpenses(data);
  };

  const loadNotes = async (uid) => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', uid)
      .single();
    if (!error && data) setQuickNotes(data.content || '');
  };

  const loadMood = async (uid) => {
    const today = new Date().toDateString();
    const { data, error } = await supabase
      .from('moods')
      .select('*')
      .eq('user_id', uid)
      .eq('date', today)
      .single();
    if (!error && data) setMood(data.value);
  };

  const motivationalQuotes = [
    "The secret of getting ahead is getting started.",
    "Your limitation—it's only your imagination.",
    "Great things never come from comfort zones.",
    "Don't watch the clock; do what it does. Keep going.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Dream bigger. Do bigger.",
    "Success doesn't just find you. You have to go out and get it.",
    "Push yourself, because no one else is going to do it for you.",
    "Stop doubting yourself. Work hard and make it happen.",
    "Small progress is still progress."
  ];

  const moods = [
    { emoji: '😄', label: 'Great', value: 5 },
    { emoji: '🙂', label: 'Good', value: 4 },
    { emoji: '😐', label: 'Okay', value: 3 },
    { emoji: '😔', label: 'Low', value: 2 },
    { emoji: '😢', label: 'Bad', value: 1 }
  ];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = time.getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  }, []);

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=8.5241&longitude=76.9366&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto')
      .then(res => res.json())
      .then(data => setWeather(data.current))
      .catch(err => console.error('Weather error:', err));
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        if (timerSeconds === 0) {
          if (timerMinutes === 0) {
            setIsTimerRunning(false);
            alert('Focus session complete! Take a break.');
          } else {
            setTimerMinutes(timerMinutes - 1);
            setTimerSeconds(59);
          }
        } else {
          setTimerSeconds(timerSeconds - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerMinutes, timerSeconds]);

  const addTask = async () => {
    if (newTask.trim() && userId) {
      const task = { 
        user_id: userId,
        text: newTask, 
        completed: false,
        created_at: new Date().toISOString()
      };
      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select()
        .single();
      
      if (!error && data) {
        setTasks([data, ...tasks]);
        setNewTask('');
        setShowTaskInput(false);
      }
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !task.completed })
      .eq('id', id);
    
    if (!error) {
      setTasks(tasks.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    }
  };

  const deleteTask = async (id) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const addHabit = async () => {
    if (newHabit.trim() && userId) {
      const habit = {
        user_id: userId,
        name: newHabit,
        streak: 0,
        last_checked: null
      };
      const { data, error } = await supabase
        .from('habits')
        .insert([habit])
        .select()
        .single();
      
      if (!error && data) {
        setHabits([...habits, data]);
        setNewHabit('');
        setShowHabitInput(false);
      }
    }
  };

  const toggleHabit = async (id) => {
    const habit = habits.find(h => h.id === id);
    const today = new Date().toDateString();
    const wasCheckedToday = habit.last_checked === today;
    
    const updatedHabit = {
      last_checked: !wasCheckedToday ? today : null,
      streak: !wasCheckedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1)
    };

    const { error } = await supabase
      .from('habits')
      .update(updatedHabit)
      .eq('id', id);
    
    if (!error) {
      setHabits(habits.map(h => 
        h.id === id ? { ...h, ...updatedHabit } : h
      ));
    }
  };

  const deleteHabit = async (id) => {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setHabits(habits.filter(habit => habit.id !== id));
    }
  };

  const addEvent = async () => {
    if (newEvent.title.trim() && newEvent.time && userId) {
      const event = {
        user_id: userId,
        title: newEvent.title,
        time: newEvent.time,
        date: new Date().toDateString()
      };
      const { data, error } = await supabase
        .from('events')
        .insert([event])
        .select()
        .single();
      
      if (!error && data) {
        setEvents([...events, data]);
        setNewEvent({ title: '', time: '' });
        setShowEventInput(false);
      }
    }
  };

  const deleteEvent = async (id) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setEvents(events.filter(event => event.id !== id));
    }
  };

  const addGoal = async () => {
    if (newGoal.title.trim() && newGoal.target && userId) {
      const goal = {
        user_id: userId,
        title: newGoal.title,
        target: parseInt(newGoal.target),
        current: 0
      };
      const { data, error } = await supabase
        .from('goals')
        .insert([goal])
        .select()
        .single();
      
      if (!error && data) {
        setGoals([...goals, data]);
        setNewGoal({ title: '', target: '', current: 0 });
        setShowGoalInput(false);
      }
    }
  };

  const updateGoalProgress = async (id, increment) => {
    const goal = goals.find(g => g.id === id);
    const newCurrent = Math.max(0, Math.min(goal.target, goal.current + increment));
    
    const { error } = await supabase
      .from('goals')
      .update({ current: newCurrent })
      .eq('id', id);
    
    if (!error) {
      setGoals(goals.map(g => 
        g.id === id ? { ...g, current: newCurrent } : g
      ));
    }
  };

  const deleteGoal = async (id) => {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setGoals(goals.filter(goal => goal.id !== id));
    }
  };

  const addQuickLink = async () => {
    if (newLink.title.trim() && newLink.url.trim() && userId) {
      let url = newLink.url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      const link = {
        user_id: userId,
        title: newLink.title,
        url
      };
      const { data, error } = await supabase
        .from('quick_links')
        .insert([link])
        .select()
        .single();
      
      if (!error && data) {
        setQuickLinks([...quickLinks, data]);
        setNewLink({ title: '', url: '' });
        setShowLinkInput(false);
      }
    }
  };

  const deleteQuickLink = async (id) => {
    const { error } = await supabase
      .from('quick_links')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setQuickLinks(quickLinks.filter(link => link.id !== id));
    }
  };

  const addExpense = async () => {
    if (newExpense.description.trim() && newExpense.amount && userId) {
      const expense = {
        user_id: userId,
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        date: new Date().toLocaleDateString(),
        created_at: new Date().toISOString()
      };
      const { data, error } = await supabase
        .from('expenses')
        .insert([expense])
        .select()
        .single();
      
      if (!error && data) {
        setExpenses([data, ...expenses]);
        setNewExpense({ description: '', amount: '' });
        setShowExpenseInput(false);
      }
    }
  };

  const deleteExpense = async (id) => {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setExpenses(expenses.filter(expense => expense.id !== id));
    }
  };

  // Save notes with debouncing
  useEffect(() => {
    if (!userId) return;
    const timer = setTimeout(async () => {
      await supabase
        .from('notes')
        .upsert({ 
          user_id: userId, 
          content: quickNotes,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
    }, 1000);
    return () => clearTimeout(timer);
  }, [quickNotes, userId]);

  // Save mood
  const saveMood = async (value) => {
    if (!userId) return;
    setMood(value);
    const today = new Date().toDateString();
    await supabase
      .from('moods')
      .upsert({
        user_id: userId,
        value,
        date: today,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,date' });
  };

  const startFocusTimer = () => {
    setTimerMinutes(focusTime);
    setTimerSeconds(0);
    setIsTimerRunning(true);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerMinutes(focusTime);
    setTimerSeconds(0);
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const todayEvents = events.filter(e => e.date === new Date().toDateString());
  const todayExpenses = expenses.filter(e => e.date === new Date().toLocaleDateString());
  const todayTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  const CardStyle = {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    padding: '1.5rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  };
// PART 2 - CONTINUES FROM PART 1
  // This is the return statement with all the JSX

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          color: 'white',
          fontSize: '1.5rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <div>Loading your dashboard...</div>
          </div>
        </div>
      ) : (
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{...CardStyle, marginBottom: '2rem'}}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', margin: '0 0 0.5rem 0' }}>
                {greeting}!
              </h1>
              <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
                {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              {weather && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '2rem' }}>☁️</div>
                    <div>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>
                        {Math.round(weather.temperature_2m)}°C
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                        💧 {weather.relative_humidity_2m}% 💨 {Math.round(weather.wind_speed_10m)} km/h
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', fontWeight: 'bold', color: 'white' }}>
                  {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '0.5rem' }}>
                  {time.toLocaleTimeString('en-US', { second: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mood Tracker */}
        <div style={{...CardStyle, marginBottom: '2rem'}}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.75rem' }}>😊</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>How are you feeling today?</h2>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {moods.map(m => (
              <button
                key={m.value}
                onClick={() => saveMood(m.value)}
                style={{
                  background: mood === m.value ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  transform: mood === m.value ? 'scale(1.1)' : 'scale(1)'
                }}
              >
                <div style={{ fontSize: '2.5rem' }}>{m.emoji}</div>
                <div style={{ color: 'white', fontSize: '0.875rem', marginTop: '0.5rem' }}>{m.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {/* Tasks - Takes 2 columns on larger screens */}
          <div style={{...CardStyle, gridColumn: window.innerWidth > 1200 ? 'span 2' : 'span 1'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.75rem' }}>🎯</span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Today's Priorities</h2>
              </div>
              <button
                onClick={() => setShowTaskInput(!showTaskInput)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
            </div>

            {totalTasks > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  <span>{completedTasks} of {totalTasks} completed</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '999px', height: '12px', overflow: 'hidden' }}>
                  <div style={{
                    background: 'linear-gradient(90deg, #10b981, #059669)',
                    height: '100%',
                    borderRadius: '999px',
                    width: `${progressPercentage}%`,
                    transition: 'width 0.5s'
                  }} />
                </div>
              </div>
            )}

            {showTaskInput && (
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  placeholder="What needs to be done?"
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '16px',
                    padding: '0.75rem 1rem',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                  autoFocus
                />
                <button
                  onClick={addTask}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '0.75rem 1.5rem',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Add
                </button>
              </div>
            )}

            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {tasks.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', padding: '3rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                  <p style={{ fontSize: '1.125rem' }}>No tasks yet. Add one to get started!</p>
                </div>
              ) : (
                tasks.map(task => (
                  <div
                    key={task.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '0.75rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '8px',
                        border: task.completed ? '2px solid #10b981' : '2px solid rgba(255, 255, 255, 0.5)',
                        background: task.completed ? '#10b981' : 'transparent',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {task.completed && '✓'}
                    </button>
                    <span style={{
                      flex: 1,
                      color: 'white',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      opacity: task.completed ? 0.6 : 1
                    }}>
                      {task.text}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.6)',
                        cursor: 'pointer',
                        fontSize: '1.5rem'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Focus Timer */}
          <div style={CardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>⚡</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Focus Timer</h3>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
                {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {[15, 25, 45].map(min => (
                  <button
                    key={min}
                    onClick={() => setFocusTime(min)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: '12px',
                      border: 'none',
                      background: focusTime === min ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    {min}m
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={isTimerRunning ? () => setIsTimerRunning(false) : startFocusTimer}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(90deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  {isTimerRunning ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={resetTimer}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    cursor: 'pointer'
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div style={CardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>✨</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Daily Inspiration</h3>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: '1.125rem', fontStyle: 'italic', lineHeight: '1.6', margin: 0 }}>
              "{quote}"
            </p>
          </div>

          {/* Quick Notes */}
          <div style={{...CardStyle, gridColumn: window.innerWidth > 1200 ? 'span 2' : 'span 1'}}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📝</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Quick Notes</h3>
            </div>
            <textarea
              value={quickNotes}
              onChange={(e) => setQuickNotes(e.target.value)}
              placeholder="Jot down quick thoughts..."
              style={{
                width: '100%',
                minHeight: '150px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '1rem',
                fontSize: '1rem',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '2rem', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
          <p>V4.0 - Cloud-Powered Life Command Center 🚀☁️</p>
        </div>
      </div>
      )}
    </div>
  );
}

// END OF COMPONENT - Close the file here
  
