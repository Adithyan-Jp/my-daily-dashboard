"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function PersonalDashboard() {
  // User & Auth State
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Theme State
  const [theme, setTheme] = useState('dark');
  const [accentColor, setAccentColor] = useState('#667eea');

  // Core State
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

  // Analytics State
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);
  const [expenseHistory, setExpenseHistory] = useState([]);

  // Settings & Modals
  const [showSettings, setShowSettings] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [notifications, setNotifications] = useState([]);

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

  const themePresets = [
    { name: 'Purple Dream', colors: ['#667eea', '#764ba2', '#f093fb'] },
    { name: 'Ocean Blue', colors: ['#2E3192', '#1BFFFF', '#00D4FF'] },
    { name: 'Sunset Orange', colors: ['#FF512F', '#DD2476', '#F09819'] },
    { name: 'Forest Green', colors: ['#134E5E', '#71B280', '#38ef7d'] },
    { name: 'Pink Paradise', colors: ['#FF6B9D', '#C06C84', '#F67280'] },
    { name: 'Midnight', colors: ['#232526', '#414345', '#667eea'] }
  ];

  // Load user authentication status
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      setUserId(session.user.id);
      setUserEmail(session.user.email);
      setIsAuthenticated(true);
      await loadUserData(session.user.id);
    } else {
      const storedUserId = localStorage.getItem('dashboard_user_id');
      let currentUserId = storedUserId;

      if (!currentUserId) {
        currentUserId = 'anon_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('dashboard_user_id', currentUserId);
      }

      setUserId(currentUserId);
      setIsAuthenticated(false);
      await loadUserData(currentUserId);
    }
    
    setLoading(false);
  };

  const handleSignUp = async () => {
    setAuthError('');
    const { data, error } = await supabase.auth.signUp({
      email: authEmail,
      password: authPassword,
    });

    if (error) {
      setAuthError(error.message);
    } else {
      setShowAuthModal(false);
      setAuthEmail('');
      setAuthPassword('');
      addNotification('Account created! Please check your email to verify.', 'success');
      checkAuth();
    }
  };

  const handleLogin = async () => {
    setAuthError('');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });

    if (error) {
      setAuthError(error.message);
    } else {
      setShowAuthModal(false);
      setAuthEmail('');
      setAuthPassword('');
      addNotification('Welcome back!', 'success');
      checkAuth();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserEmail('');
    addNotification('Logged out successfully', 'info');
    checkAuth();
  };

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const loadUserData = async (uid) => {
    try {
      await Promise.all([
        loadTasks(uid),
        loadHabits(uid),
        loadEvents(uid),
        loadGoals(uid),
        loadQuickLinks(uid),
        loadExpenses(uid),
        loadNotes(uid),
        loadMood(uid),
        loadMoodHistory(uid),
        loadExpenseHistory(uid),
        loadUserPreferences(uid)
      ]);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadUserPreferences = async (uid) => {
    const { data } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', uid)
      .single();
    
    if (data) {
      setTheme(data.theme || 'dark');
      setAccentColor(data.accent_color || '#667eea');
    }
  };

  const saveUserPreferences = async () => {
    if (!userId) return;
    await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        theme,
        accent_color: accentColor,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    addNotification('Preferences saved!', 'success');
  };

  const loadMoodHistory = async (uid) => {
    const { data } = await supabase
      .from('moods')
      .select('*')
      .eq('user_id', uid)
      .order('date', { ascending: true })
      .limit(30);
    if (data) setMoodHistory(data);
  };

  const loadExpenseHistory = async (uid) => {
    const { data } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: true })
      .limit(30);
    if (data) setExpenseHistory(data);
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

  // PART 1 ENDS HERE
// PART 2 STARTS HERE - Paste this RIGHT AFTER Part 1

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
            addNotification('Focus session complete! Take a break.', 'success');
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
        addNotification('Task added!', 'success');
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
      if (!task.completed) {
        addNotification('Task completed! 🎉', 'success');
      }
    }
  };

  const deleteTask = async (id) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setTasks(tasks.filter(task => task.id !== id));
      addNotification('Task deleted', 'info');
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
        addNotification('Habit added!', 'success');
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
      if (!wasCheckedToday) {
        addNotification(`Streak: ${updatedHabit.streak} days! 🔥`, 'success');
      }
    }
  };

  const deleteHabit = async (id) => {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setHabits(habits.filter(habit => habit.id !== id));
      addNotification('Habit deleted', 'info');
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
        addNotification('Event added!', 'success');
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
      addNotification('Event deleted', 'info');
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
        addNotification('Goal added!', 'success');
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
      if (newCurrent === goal.target) {
        addNotification('Goal achieved! 🎯', 'success');
      }
    }
  };

  const deleteGoal = async (id) => {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setGoals(goals.filter(goal => goal.id !== id));
      addNotification('Goal deleted', 'info');
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
        addNotification('Link added!', 'success');
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
      addNotification('Link deleted', 'info');
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
        setExpenseHistory([...expenseHistory, data]);
        setNewExpense({ description: '', amount: '' });
        setShowExpenseInput(false);
        addNotification('Expense added!', 'success');
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
      addNotification('Expense deleted', 'info');
    }
  };

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

  const saveMood = async (value) => {
    if (!userId) return;
    setMood(value);
    const today = new Date().toDateString();
    const { data } = await supabase
      .from('moods')
      .upsert({
        user_id: userId,
        value,
        date: today,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,date' })
      .select()
      .single();
    
    if (data) {
      setMoodHistory([...moodHistory.filter(m => m.date !== today), data]);
      addNotification('Mood recorded!', 'success');
    }
  };

  const exportData = () => {
    const exportObj = {
      tasks,
      habits,
      events,
      goals,
      quickLinks,
      expenses,
      notes: quickNotes,
      moodHistory,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportObj, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addNotification('Data exported successfully!', 'success');
  };

  const startFocusTimer = () => {
    setTimerMinutes(focusTime);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    addNotification(`Focus session started: ${focusTime} minutes`, 'info');
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerMinutes(focusTime);
    setTimerSeconds(0);
  };

  const applyThemePreset = (preset) => {
    setAccentColor(preset.colors[0]);
    addNotification(`Theme changed to ${preset.name}!`, 'success');
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const todayEvents = events.filter(e => e.date === new Date().toDateString());
  const todayExpenses = expenses.filter(e => e.date === new Date().toLocaleDateString());
  const todayTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  const avgMood = moodHistory.length > 0 
    ? (moodHistory.reduce((sum, m) => sum + m.value, 0) / moodHistory.length).toFixed(1)
    : 0;
  
  const totalExpenseAmount = expenseHistory.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const habitCompletionRate = habits.length > 0
    ? ((habits.filter(h => h.last_checked === new Date().toDateString()).length / habits.length) * 100).toFixed(0)
    : 0;

  // PART 2 ENDS HERE
// PART 3 STARTS HERE - Paste this RIGHT AFTER Part 2

  const getThemeColors = () => {
    if (theme === 'light') {
      return {
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        cardBg: 'rgba(255, 255, 255, 0.9)',
        textPrimary: '#1a202c',
        textSecondary: '#4a5568',
        border: 'rgba(0, 0, 0, 0.1)',
        accent: accentColor
      };
    } else {
      return {
        background: `linear-gradient(135deg, ${accentColor} 0%, #764ba2 50%, #f093fb 100%)`,
        cardBg: 'rgba(255, 255, 255, 0.15)',
        textPrimary: 'white',
        textSecondary: 'rgba(255, 255, 255, 0.9)',
        border: 'rgba(255, 255, 255, 0.2)',
        accent: accentColor
      };
    }
  };

  const colors = getThemeColors();

  const CardStyle = {
    background: colors.cardBg,
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    padding: '1.5rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${colors.border}`
  };

  const ModalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
  };

  const ModalContentStyle = {
    ...CardStyle,
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  const ButtonStyle = {
    background: colors.accent,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '0.75rem 1.5rem',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s'
  };

  const InputStyle = {
    background: theme === 'light' ? 'white' : 'rgba(255, 255, 255, 0.2)',
    color: colors.textPrimary,
    border: `1px solid ${colors.border}`,
    borderRadius: '12px',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    outline: 'none',
    width: '100%'
  };

  const NotificationContainer = () => (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      {notifications.map(notif => (
        <div
          key={notif.id}
          style={{
            ...CardStyle,
            padding: '1rem 1.5rem',
            background: notif.type === 'success' ? '#10b981' : notif.type === 'error' ? '#ef4444' : colors.accent,
            color: 'white',
            minWidth: '250px',
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          {notif.message}
        </div>
      ))}
    </div>
  );

  const AuthModal = () => (
    <div style={ModalStyle} onClick={() => setShowAuthModal(false)}>
      <div style={ModalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: colors.textPrimary, margin: 0 }}>
            {authMode === 'login' ? 'Login' : 'Sign Up'}
          </h2>
          <button
            onClick={() => setShowAuthModal(false)}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: colors.textPrimary }}
          >
            ×
          </button>
        </div>

        {authError && (
          <div style={{ background: '#ef4444', color: 'white', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
            {authError}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="email"
            placeholder="Email"
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            style={InputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (authMode === 'login' ? handleLogin() : handleSignUp())}
            style={InputStyle}
          />
          <button
            onClick={authMode === 'login' ? handleLogin : handleSignUp}
            style={ButtonStyle}
          >
            {authMode === 'login' ? 'Login' : 'Sign Up'}
          </button>
          <button
            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
            style={{ ...ButtonStyle, background: 'transparent', border: `1px solid ${colors.border}`, color: colors.textPrimary }}
          >
            {authMode === 'login' ? 'Need an account? Sign up' : 'Have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );

  const SettingsModal = () => (
    <div style={ModalStyle} onClick={() => setShowSettings(false)}>
      <div style={ModalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: colors.textPrimary, margin: 0 }}>⚙️ Settings</h2>
          <button
            onClick={() => setShowSettings(false)}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: colors.textPrimary }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ color: colors.textPrimary, fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
              Theme
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setTheme('dark')}
                style={{
                  ...ButtonStyle,
                  flex: 1,
                  background: theme === 'dark' ? colors.accent : 'transparent',
                  border: `1px solid ${colors.border}`,
                  color: theme === 'dark' ? 'white' : colors.textPrimary
                }}
              >
                🌙 Dark
              </button>
              <button
                onClick={() => setTheme('light')}
                style={{
                  ...ButtonStyle,
                  flex: 1,
                  background: theme === 'light' ? colors.accent : 'transparent',
                  border: `1px solid ${colors.border}`,
                  color: theme === 'light' ? 'white' : colors.textPrimary
                }}
              >
                ☀️ Light
              </button>
            </div>
          </div>

          <div>
            <label style={{ color: colors.textPrimary, fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
              Color Themes
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {themePresets.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => applyThemePreset(preset)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: `2px solid ${accentColor === preset.colors[0] ? colors.accent : colors.border}`,
                    background: `linear-gradient(135deg, ${preset.colors.join(', ')})`,
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ color: colors.textPrimary, fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
              Custom Accent Color
            </label>
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              style={{ width: '100%', height: '50px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}
            />
          </div>

          <button onClick={saveUserPreferences} style={ButtonStyle}>
            💾 Save Preferences
          </button>
        </div>
      </div>
    </div>
  );

  const AnalyticsModal = () => (
    <div style={ModalStyle} onClick={() => setShowAnalytics(false)}>
      <div style={ModalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: colors.textPrimary, margin: 0 }}>📊 Analytics</h2>
          <button
            onClick={() => setShowAnalytics(false)}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: colors.textPrimary }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div style={{ ...CardStyle, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>😊</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.textPrimary }}>{avgMood}</div>
              <div style={{ fontSize: '0.875rem', color: colors.textSecondary }}>Avg Mood</div>
            </div>
            <div style={{ ...CardStyle, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.textPrimary }}>₹{totalExpenseAmount.toFixed(0)}</div>
              <div style={{ fontSize: '0.875rem', color: colors.textSecondary }}>Total Expenses</div>
            </div>
            <div style={{ ...CardStyle, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.textPrimary }}>{completedTasks}/{totalTasks}</div>
              <div style={{ fontSize: '0.875rem', color: colors.textSecondary }}>Tasks Done</div>
            </div>
            <div style={{ ...CardStyle, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔥</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.textPrimary }}>{habitCompletionRate}%</div>
              <div style={{ fontSize: '0.875rem', color: colors.textSecondary }}>Habits Today</div>
            </div>
          </div>

          <div>
            <h3 style={{ color: colors.textPrimary, marginBottom: '1rem' }}>Mood Trend (Last 7 days)</h3>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', height: '100px' }}>
              {moodHistory.slice(-7).map((m, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    height: `${(m.value / 5) * 100}%`,
                    background: colors.accent,
                    borderRadius: '8px 8px 0 0',
                    minHeight: '20px'
                  }} />
                  <div style={{ fontSize: '0.75rem', color: colors.textSecondary, marginTop: '0.25rem' }}>
                    {new Date(m.date).getDate()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ color: colors.textPrimary, marginBottom: '1rem' }}>Recent Expenses</h3>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {expenseHistory.slice(-5).reverse().map(exp => (
                <div key={exp.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '0.75rem',
                  borderBottom: `1px solid ${colors.border}`,
                  color: colors.textPrimary
                }}>
                  <span>{exp.description}</span>
                  <span style={{ fontWeight: 'bold' }}>₹{exp.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ExportModal = () => (
    <div style={ModalStyle} onClick={() => setShowExportModal(false)}>
      <div style={ModalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: colors.textPrimary, margin: 0 }}>📤 Export Data</h2>
          <button
            onClick={() => setShowExportModal(false)}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: colors.textPrimary }}
          >
            ×
          </button>
        </div>

        <div style={{ color: colors.textSecondary, marginBottom: '1.5rem' }}>
          Download all your dashboard data as a JSON file. You can use this as a backup or to import into another system.
        </div>

        <button onClick={() => { exportData(); setShowExportModal(false); }} style={ButtonStyle}>
          📥 Download Backup
        </button>
      </div>
    </div>
  );

  // PART 3 ENDS HERE
// PART 4 STARTS HERE - FINAL PART - Paste this RIGHT AFTER Part 3

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      transition: 'all 0.3s'
    }}>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      <NotificationContainer />
      {showAuthModal && <AuthModal />}
      {showSettings && <SettingsModal />}
      {showAnalytics && <AnalyticsModal />}
      {showExportModal && <ExportModal />}

      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          color: colors.textPrimary,
          fontSize: '1.5rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <div>Loading your dashboard...</div>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          {/* Top Navigation Bar */}
          <div style={{ ...CardStyle, marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.textPrimary, margin: 0 }}>
                🚀 Dashboard
              </h1>
              {isAuthenticated && (
                <span style={{ fontSize: '0.875rem', color: colors.textSecondary }}>
                  {userEmail}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button onClick={() => setShowAnalytics(true)} style={{ ...ButtonStyle, padding: '0.5rem 1rem' }}>
                📊
              </button>
              <button onClick={() => setShowSettings(true)} style={{ ...ButtonStyle, padding: '0.5rem 1rem' }}>
                ⚙️
              </button>
              <button onClick={() => setShowExportModal(true)} style={{ ...ButtonStyle, padding: '0.5rem 1rem' }}>
                📤
              </button>
              {isAuthenticated ? (
                <button onClick={handleLogout} style={{ ...ButtonStyle, padding: '0.5rem 1rem' }}>
                  🚪 Logout
                </button>
              ) : (
                <button onClick={() => setShowAuthModal(true)} style={{ ...ButtonStyle, padding: '0.5rem 1rem' }}>
                  🔐 Login
                </button>
              )}
            </div>
          </div>

          {/* Header */}
          <div style={{...CardStyle, marginBottom: '2rem'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: colors.textPrimary, margin: '0 0 0.5rem 0' }}>
                  {greeting}!
                </h1>
                <p style={{ fontSize: '1.25rem', color: colors.textSecondary, margin: 0 }}>
                  {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                {weather && (
                  <div style={{
                    background: colors.cardBg,
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '1rem',
                    border: `1px solid ${colors.border}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '2rem' }}>☁️</div>
                      <div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.textPrimary }}>
                          {Math.round(weather.temperature_2m)}°C
                        </div>
                        <div style={{ fontSize: '0.875rem', color: colors.textSecondary }}>
                          💧 {weather.relative_humidity_2m}% 💨 {Math.round(weather.wind_speed_10m)} km/h
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', fontWeight: 'bold', color: colors.textPrimary }}>
                    {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: colors.textSecondary, marginTop: '0.5rem' }}>
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
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.textPrimary, margin: 0 }}>How are you feeling today?</h2>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {moods.map(m => (
                <button
                  key={m.value}
                  onClick={() => saveMood(m.value)}
                  style={{
                    background: mood === m.value ? colors.accent : colors.cardBg,
                    border: `2px solid ${mood === m.value ? colors.accent : colors.border}`,
                    borderRadius: '16px',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    transform: mood === m.value ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  <div style={{ fontSize: '2.5rem' }}>{m.emoji}</div>
                  <div style={{ color: colors.textPrimary, fontSize: '0.875rem', marginTop: '0.5rem' }}>{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {/* Tasks */}
            <div style={{...CardStyle, gridColumn: window.innerWidth > 1200 ? 'span 2' : 'span 1'}}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.75rem' }}>🎯</span>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.textPrimary, margin: 0 }}>Today's Priorities</h2>
                </div>
                <button
                  onClick={() => setShowTaskInput(!showTaskInput)}
                  style={{
                    background: colors.cardBg,
                    color: colors.textPrimary,
                    border: `1px solid ${colors.border}`,
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.textSecondary, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <span>{completedTasks} of {totalTasks} completed</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <div style={{ width: '100%', background: colors.border, borderRadius: '999px', height: '12px', overflow: 'hidden' }}>
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
                    style={InputStyle}
                    autoFocus
                  />
                  <button onClick={addTask} style={ButtonStyle}>
                    Add
                  </button>
                </div>
              )}

              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {tasks.length === 0 ? (
                  <div style={{ textAlign: 'center', color: colors.textSecondary, padding: '3rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                    <p style={{ fontSize: '1.125rem' }}>No tasks yet. Add one to get started!</p>
                  </div>
                ) : (
                  tasks.map(task => (
                    <div
                      key={task.id}
                      style={{
                        background: colors.cardBg,
                        borderRadius: '16px',
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '0.75rem',
                        border: `1px solid ${colors.border}`
                      }}
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '8px',
                          border: task.completed ? '2px solid #10b981' : `2px solid ${colors.border}`,
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
                        color: colors.textPrimary,
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
                          color: colors.textSecondary,
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
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.textPrimary, margin: 0 }}>Focus Timer</h3>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: colors.textPrimary, marginBottom: '1rem' }}>
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
                        background: focusTime === min ? colors.accent : colors.cardBg,
                        color: focusTime === min ? 'white' : colors.textPrimary,
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
                      ...ButtonStyle,
                      flex: 1,
                      background: 'linear-gradient(90deg, #10b981, #059669)'
                    }}
                  >
                    {isTimerRunning ? 'Pause' : 'Start'}
                  </button>
                  <button onClick={resetTimer} style={{ ...ButtonStyle, flex: 1, background: colors.cardBg, color: colors.textPrimary, border: `1px solid ${colors.border}` }}>
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div style={CardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>✨</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.textPrimary, margin: 0 }}>Daily Inspiration</h3>
              </div>
              <p style={{ color: colors.textPrimary, fontSize: '1.125rem', fontStyle: 'italic', lineHeight: '1.6', margin: 0 }}>
                "{quote}"
              </p>
            </div>

            {/* Quick Notes */}
            <div style={{...CardStyle, gridColumn: window.innerWidth > 1200 ? 'span 2' : 'span 1'}}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📝</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.textPrimary, margin: 0 }}>Quick Notes</h3>
              </div>
              <textarea
                value={quickNotes}
                onChange={(e) => setQuickNotes(e.target.value)}
                placeholder="Jot down quick thoughts..."
                style={{
                  ...InputStyle,
                  minHeight: '150px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: '2rem', color: colors.textSecondary, fontSize: '0.875rem' }}>
            <p>V5.0 - Enhanced Cloud Dashboard with Analytics & Themes 🚀✨</p>
          </div>
        </div>
      )}
    </div>
  );
}

// PART 4 ENDS - Close the file here with this closing brace
