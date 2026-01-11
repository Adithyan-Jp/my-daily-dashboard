// PART 1: Imports, State, and Authentication
// Ultimate Personal Life Dashboard with Supabase
// Copy this entire file and paste it into your React component

"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// ============ SUPABASE CONFIGURATION ============
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function UltimateLifeDashboard() {
  // ============ USER & AUTH STATE ============
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // ============ THEME & UI STATE ============
  const [theme, setTheme] = useState('dark');
  const [accentColor, setAccentColor] = useState('#667eea');
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // ============ CORE APP STATE ============
  const [time, setTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  
  // Tasks
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [taskPriority, setTaskPriority] = useState('medium');
  
  // Focus Timer (Pomodoro)
  const [focusTime, setFocusTime] = useState(25);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  
  // Content & Weather
  const [quote, setQuote] = useState('');
  const [quickNotes, setQuickNotes] = useState('');
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  
  // Habits
  const [habits, setHabits] = useState([]);
  const [showHabitInput, setShowHabitInput] = useState(false);
  const [newHabit, setNewHabit] = useState('');
  
  // Events/Calendar
  const [events, setEvents] = useState([]);
  const [showEventInput, setShowEventInput] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', time: '', description: '' });
  
  // Goals
  const [goals, setGoals] = useState([]);
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', target: '', current: 0, unit: 'times' });
  
  // Water Intake Tracker
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal, setWaterGoal] = useState(8);
  const [waterHistory, setWaterHistory] = useState([]);
  
  // Meal Planner
  const [meals, setMeals] = useState([]);
  const [showMealInput, setShowMealInput] = useState(false);
  const [newMeal, setNewMeal] = useState({ type: 'breakfast', name: '', time: '' });
  
  // Shopping List
  const [shoppingList, setShoppingList] = useState([]);
  const [showShoppingInput, setShowShoppingInput] = useState(false);
  const [newShoppingItem, setNewShoppingItem] = useState({ item: '', quantity: '', category: 'grocery' });
  
  // Mood Tracker
  const [mood, setMood] = useState(null);
  const [moodNote, setMoodNote] = useState('');
  
  // Quick Links
  const [quickLinks, setQuickLinks] = useState([]);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '', icon: '🔗' });
  
  // Expenses
  const [expenses, setExpenses] = useState([]);
  const [showExpenseInput, setShowExpenseInput] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: 'other' });
  
  // Reminders
  const [reminders, setReminders] = useState([]);
  const [showReminderInput, setShowReminderInput] = useState(false);
  const [newReminder, setNewReminder] = useState({ title: '', time: '', recurring: false });
  
  // Quick Actions
  const [quickActions, setQuickActions] = useState([]);
  
  // Gratitude Journal
  const [gratitudeEntries, setGratitudeEntries] = useState([]);
  const [showGratitudeInput, setShowGratitudeInput] = useState(false);
  const [newGratitude, setNewGratitude] = useState('');
  
  // Medicine Tracker
  const [medicines, setMedicines] = useState([]);
  const [showMedicineInput, setShowMedicineInput] = useState(false);
  const [newMedicine, setNewMedicine] = useState({ name: '', dosage: '', time: '', frequency: 'daily' });

  // ============ ANALYTICS STATE ============
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);
  const [expenseHistory, setExpenseHistory] = useState([]);
  const [habitStats, setHabitStats] = useState({});

  // ============ UI STATE ============
  const [showSettings, setShowSettings] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');

  // ============ CONSTANTS ============
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
    "Small progress is still progress.",
    "Believe you can and you're halfway there.",
    "Every day is a fresh start."
  ];

  const moods = [
    { emoji: '😄', label: 'Excellent', value: 5 },
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
    { name: 'Midnight', colors: ['#232526', '#414345', '#667eea'] },
    { name: 'Royal Purple', colors: ['#9D50BB', '#6E48AA', '#4A00E0'] },
    { name: 'Emerald', colors: ['#11998e', '#38ef7d', '#16a085'] }
  ];

  const expenseCategories = [
    { value: 'food', label: '🍔 Food', color: '#ef4444' },
    { value: 'transport', label: '🚗 Transport', color: '#f59e0b' },
    { value: 'shopping', label: '🛍️ Shopping', color: '#ec4899' },
    { value: 'bills', label: '📄 Bills', color: '#8b5cf6' },
    { value: 'health', label: '🏥 Health', color: '#10b981' },
    { value: 'entertainment', label: '🎬 Entertainment', color: '#3b82f6' },
    { value: 'other', label: '📦 Other', color: '#6b7280' }
  ];

  const shoppingCategories = [
    { value: 'grocery', label: '🛒 Grocery' },
    { value: 'household', label: '🏠 Household' },
    { value: 'personal', label: '👤 Personal' },
    { value: 'electronics', label: '💻 Electronics' },
    { value: 'clothing', label: '👕 Clothing' },
    { value: 'other', label: '📦 Other' }
  ];

  const mealTypes = [
    { value: 'breakfast', label: '🌅 Breakfast', icon: '🥞' },
    { value: 'lunch', label: '☀️ Lunch', icon: '🍱' },
    { value: 'snack', label: '🍪 Snack', icon: '🍎' },
    { value: 'dinner', label: '🌙 Dinner', icon: '🍽️' }
  ];

  // ============ MOBILE DETECTION ============
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ============ AUTHENTICATION ============
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
      setIsAuthenticated(false);
      setShowAuthModal(true);
    }
    
    setLoading(false);
  };

  const handleSignUp = async () => {
    setAuthError('');
    setAuthLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email: authEmail,
      password: authPassword,
    });

    setAuthLoading(false);

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
    setAuthLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });

    setAuthLoading(false);

    if (error) {
      setAuthError(error.message);
    } else {
      setShowAuthModal(false);
      setAuthEmail('');
      setAuthPassword('');
      addNotification('Welcome back! 🎉', 'success');
      checkAuth();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserEmail('');
    addNotification('Logged out successfully', 'info');
    setShowAuthModal(true);
  };

  // ============ NOTIFICATIONS ============
  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  // ============ DATA LOADING ============
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
        loadUserPreferences(uid),
        loadWaterIntake(uid),
        loadMeals(uid),
        loadShoppingList(uid),
        loadReminders(uid),
        loadGratitudeEntries(uid),
        loadMedicines(uid)
      ]);
    } catch (error) {
      console.error('Error loading user data:', error);
      addNotification('Failed to load some data', 'error');
    }
  };

// PART 1 ENDS HERE - Continue to Part 2
// PART 2: Data Loading and CRUD Functions
// Paste this RIGHT AFTER Part 1

  // ============ LOAD FUNCTIONS ============
  const loadUserPreferences = async (uid) => {
    const { data } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', uid)
      .single();
    
    if (data) {
      setTheme(data.theme || 'dark');
      setAccentColor(data.accent_color || '#667eea');
      setWaterGoal(data.water_goal || 8);
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
        water_goal: waterGoal,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    addNotification('Preferences saved!', 'success');
  };

  const loadTasks = async (uid) => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });
    if (data) setTasks(data);
  };

  const loadHabits = async (uid) => {
    const { data } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', uid);
    if (data) setHabits(data);
  };

  const loadEvents = async (uid) => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', uid)
      .order('time', { ascending: true });
    if (data) setEvents(data);
  };

  const loadGoals = async (uid) => {
    const { data } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', uid);
    if (data) setGoals(data);
  };

  const loadQuickLinks = async (uid) => {
    const { data } = await supabase
      .from('quick_links')
      .select('*')
      .eq('user_id', uid);
    if (data) setQuickLinks(data);
  };

  const loadExpenses = async (uid) => {
    const { data } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) setExpenses(data);
  };

  const loadNotes = async (uid) => {
    const { data } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', uid)
      .single();
    if (data) setQuickNotes(data.content || '');
  };

  const loadMood = async (uid) => {
    const today = new Date().toDateString();
    const { data } = await supabase
      .from('moods')
      .select('*')
      .eq('user_id', uid)
      .eq('date', today)
      .single();
    if (data) {
      setMood(data.value);
      setMoodNote(data.note || '');
    }
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
      .order('created_at', { ascending: true });
    if (data) setExpenseHistory(data);
  };

  const loadWaterIntake = async (uid) => {
    const today = new Date().toDateString();
    const { data } = await supabase
      .from('water_intake')
      .select('*')
      .eq('user_id', uid)
      .eq('date', today)
      .single();
    if (data) setWaterIntake(data.glasses || 0);
    
    // Load history
    const { data: history } = await supabase
      .from('water_intake')
      .select('*')
      .eq('user_id', uid)
      .order('date', { ascending: true })
      .limit(7);
    if (history) setWaterHistory(history);
  };

  const loadMeals = async (uid) => {
    const today = new Date().toDateString();
    const { data } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', uid)
      .eq('date', today)
      .order('time', { ascending: true });
    if (data) setMeals(data);
  };

  const loadShoppingList = async (uid) => {
    const { data } = await supabase
      .from('shopping_list')
      .select('*')
      .eq('user_id', uid)
      .eq('purchased', false)
      .order('created_at', { ascending: false });
    if (data) setShoppingList(data);
  };

  const loadReminders = async (uid) => {
    const { data } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', uid)
      .eq('completed', false)
      .order('time', { ascending: true });
    if (data) setReminders(data);
  };

  const loadGratitudeEntries = async (uid) => {
    const { data } = await supabase
      .from('gratitude')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(10);
    if (data) setGratitudeEntries(data);
  };

  const loadMedicines = async (uid) => {
    const { data } = await supabase
      .from('medicines')
      .select('*')
      .eq('user_id', uid);
    if (data) setMedicines(data);
  };

  // ============ TIME & EFFECTS ============
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
    const fetchWeather = async () => {
      setWeatherLoading(true);
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=8.5241&longitude=76.9366&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto'
        );
        const data = await response.json();
        setWeather(data.current);
      } catch (err) {
        console.error('Weather error:', err);
      } finally {
        setWeatherLoading(false);
      }
    };
    
    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  // ============ FOCUS TIMER ============
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        if (timerSeconds === 0) {
          if (timerMinutes === 0) {
            setIsTimerRunning(false);
            setPomodoroCount(prev => prev + 1);
            addNotification('Focus session complete! Take a break. 🎉', 'success');
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
  }, [isTimerRunning, timerMinutes, timerSeconds, addNotification]);

  const startFocusTimer = useCallback(() => {
    setTimerMinutes(focusTime);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    addNotification(`Focus session started: ${focusTime} minutes 🎯`, 'info');
  }, [focusTime, addNotification]);

  const resetTimer = useCallback(() => {
    setIsTimerRunning(false);
    setTimerMinutes(focusTime);
    setTimerSeconds(0);
  }, [focusTime]);

  // ============ TASK FUNCTIONS ============
  const addTask = useCallback(async () => {
    if (!newTask.trim() || !userId) return;
    
    const task = {
      user_id: userId,
      text: newTask,
      completed: false,
      priority: taskPriority,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();
    
    if (!error && data) {
      setTasks(prev => [data, ...prev]);
      setNewTask('');
      setShowTaskInput(false);
      addNotification('Task added! 📝', 'success');
    }
  }, [newTask, userId, taskPriority, addNotification]);

  const toggleTask = useCallback(async (id) => {
    const task = tasks.find(t => t.id === id);
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !task.completed })
      .eq('id', id);
    
    if (!error) {
      setTasks(prev => prev.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
      if (!task.completed) {
        addNotification('Task completed! 🎉', 'success');
      }
    }
  }, [tasks, addNotification]);

  const deleteTask = useCallback(async (id) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setTasks(prev => prev.filter(task => task.id !== id));
      addNotification('Task deleted', 'info');
    }
  }, [addNotification]);

  // ============ WATER INTAKE FUNCTIONS ============
  const addWaterGlass = useCallback(async () => {
    if (!userId) return;
    
    const newCount = waterIntake + 1;
    setWaterIntake(newCount);
    
    const today = new Date().toDateString();
    await supabase
      .from('water_intake')
      .upsert({
        user_id: userId,
        date: today,
        glasses: newCount,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,date' });
    
    if (newCount === waterGoal) {
      addNotification('Daily water goal achieved! 💧🎉', 'success');
    } else {
      addNotification(`Water logged! ${newCount}/${waterGoal} glasses 💧`, 'info');
    }
  }, [userId, waterIntake, waterGoal, addNotification]);

  const removeWaterGlass = useCallback(async () => {
    if (!userId || waterIntake <= 0) return;
    
    const newCount = waterIntake - 1;
    setWaterIntake(newCount);
    
    const today = new Date().toDateString();
    await supabase
      .from('water_intake')
      .upsert({
        user_id: userId,
        date: today,
        glasses: newCount,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,date' });
  }, [userId, waterIntake]);

  // ============ MEAL FUNCTIONS ============
  const addMeal = useCallback(async () => {
    if (!newMeal.name.trim() || !userId) return;
    
    const meal = {
      user_id: userId,
      type: newMeal.type,
      name: newMeal.name,
      time: newMeal.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toDateString(),
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('meals')
      .insert([meal])
      .select()
      .single();
    
    if (!error && data) {
      setMeals(prev => [...prev, data]);
      setNewMeal({ type: 'breakfast', name: '', time: '' });
      setShowMealInput(false);
      addNotification('Meal added! 🍽️', 'success');
    }
  }, [newMeal, userId, addNotification]);

  const deleteMeal = useCallback(async (id) => {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setMeals(prev => prev.filter(meal => meal.id !== id));
      addNotification('Meal deleted', 'info');
    }
  }, [addNotification]);

  // ============ SHOPPING LIST FUNCTIONS ============
  const addShoppingItem = useCallback(async () => {
    if (!newShoppingItem.item.trim() || !userId) return;
    
    const item = {
      user_id: userId,
      item: newShoppingItem.item,
      quantity: newShoppingItem.quantity || '1',
      category: newShoppingItem.category,
      purchased: false,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('shopping_list')
      .insert([item])
      .select()
      .single();
    
    if (!error && data) {
      setShoppingList(prev => [data, ...prev]);
      setNewShoppingItem({ item: '', quantity: '', category: 'grocery' });
      setShowShoppingInput(false);
      addNotification('Item added to shopping list! 🛒', 'success');
    }
  }, [newShoppingItem, userId, addNotification]);

  const toggleShoppingItem = useCallback(async (id) => {
    const item = shoppingList.find(i => i.id === id);
    const { error } = await supabase
      .from('shopping_list')
      .update({ purchased: !item.purchased })
      .eq('id', id);
    
    if (!error) {
      setShoppingList(prev => prev.map(i => 
        i.id === id ? { ...i, purchased: !i.purchased } : i
      ));
    }
  }, [shoppingList]);

  const deleteShoppingItem = useCallback(async (id) => {
    const { error } = await supabase
      .from('shopping_list')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setShoppingList(prev => prev.filter(item => item.id !== id));
      addNotification('Item removed', 'info');
    }
  }, [addNotification]);

  // ============ MEDICINE TRACKER FUNCTIONS ============
  const addMedicine = useCallback(async () => {
    if (!newMedicine.name.trim() || !userId) return;
    
    const medicine = {
      user_id: userId,
      name: newMedicine.name,
      dosage: newMedicine.dosage,
      time: newMedicine.time,
      frequency: newMedicine.frequency,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('medicines')
      .insert([medicine])
      .select()
      .single();
    
    if (!error && data) {
      setMedicines(prev => [...prev, data]);
      setNewMedicine({ name: '', dosage: '', time: '', frequency: 'daily' });
      setShowMedicineInput(false);
      addNotification('Medicine added! 💊', 'success');
    }
  }, [newMedicine, userId, addNotification]);

  const deleteMedicine = useCallback(async (id) => {
    const { error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setMedicines(prev => prev.filter(med => med.id !== id));
      addNotification('Medicine removed', 'info');
    }
  }, [addNotification]);

  // ============ GRATITUDE FUNCTIONS ============
  const addGratitude = useCallback(async () => {
    if (!newGratitude.trim() || !userId) return;
    
    const entry = {
      user_id: userId,
      content: newGratitude,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('gratitude')
      .insert([entry])
      .select()
      .single();
    
    if (!error && data) {
      setGratitudeEntries(prev => [data, ...prev]);
      setNewGratitude('');
      setShowGratitudeInput(false);
      addNotification('Gratitude recorded! 🙏', 'success');
    }
  }, [newGratitude, userId, addNotification]);

// PART 2 ENDS HERE - Continue to Part 3
// PART 3: Remaining Functions, Computed Values, and Styles
// Paste this RIGHT AFTER Part 2

  // ============ HABIT FUNCTIONS ============
  const addHabit = useCallback(async () => {
    if (!newHabit.trim() || !userId) return;
    
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
      setHabits(prev => [...prev, data]);
      setNewHabit('');
      setShowHabitInput(false);
      addNotification('Habit added! 🎯', 'success');
    }
  }, [newHabit, userId, addNotification]);

  const toggleHabit = useCallback(async (id) => {
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
      setHabits(prev => prev.map(h => 
        h.id === id ? { ...h, ...updatedHabit } : h
      ));
      if (!wasCheckedToday) {
        addNotification(`Streak: ${updatedHabit.streak} days! 🔥`, 'success');
      }
    }
  }, [habits, addNotification]);

  const deleteHabit = useCallback(async (id) => {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setHabits(prev => prev.filter(habit => habit.id !== id));
      addNotification('Habit deleted', 'info');
    }
  }, [addNotification]);

  // ============ MOOD FUNCTIONS ============
  const saveMood = useCallback(async (value) => {
    if (!userId) return;
    
    setMood(value);
    const today = new Date().toDateString();
    
    const { data } = await supabase
      .from('moods')
      .upsert({
        user_id: userId,
        value,
        note: moodNote,
        date: today,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,date' })
      .select()
      .single();
    
    if (data) {
      setMoodHistory(prev => {
        const filtered = prev.filter(m => m.date !== today);
        return [...filtered, data];
      });
      addNotification('Mood recorded! 😊', 'success');
    }
  }, [userId, moodNote, addNotification]);

  // ============ EXPENSE FUNCTIONS ============
  const addExpense = useCallback(async () => {
    if (!newExpense.description.trim() || !newExpense.amount || !userId) return;
    
    const expense = {
      user_id: userId,
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: new Date().toLocaleDateString(),
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('expenses')
      .insert([expense])
      .select()
      .single();
    
    if (!error && data) {
      setExpenses(prev => [data, ...prev]);
      setExpenseHistory(prev => [...prev, data]);
      setNewExpense({ description: '', amount: '', category: 'other' });
      setShowExpenseInput(false);
      addNotification('Expense added! 💰', 'success');
    }
  }, [newExpense, userId, addNotification]);

  const deleteExpense = useCallback(async (id) => {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      addNotification('Expense deleted', 'info');
    }
  }, [addNotification]);

  // ============ QUICK NOTES AUTO-SAVE ============
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

  // ============ EXPORT DATA ============
  const exportData = useCallback(() => {
    const exportObj = {
      tasks,
      habits,
      events,
      goals,
      quickLinks,
      expenses,
      meals,
      shoppingList,
      medicines,
      gratitudeEntries,
      notes: quickNotes,
      moodHistory,
      waterHistory,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportObj, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `life-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addNotification('Data exported successfully! 📥', 'success');
  }, [tasks, habits, events, goals, quickLinks, expenses, meals, shoppingList, medicines, gratitudeEntries, quickNotes, moodHistory, waterHistory, addNotification]);

  // ============ THEME FUNCTIONS ============
  const applyThemePreset = useCallback((preset) => {
    setAccentColor(preset.colors[0]);
    addNotification(`Theme changed to ${preset.name}! 🎨`, 'success');
  }, [addNotification]);

  // ============ COMPUTED VALUES ============
  const completedTasks = useMemo(() => tasks.filter(t => t.completed).length, [tasks]);
  const totalTasks = useMemo(() => tasks.length, [tasks]);
  const progressPercentage = useMemo(() => 
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    [completedTasks, totalTasks]
  );

  const waterPercentage = useMemo(() => 
    (waterIntake / waterGoal) * 100,
    [waterIntake, waterGoal]
  );

  const todayExpenses = useMemo(() => 
    expenses.filter(e => e.date === new Date().toLocaleDateString()),
    [expenses]
  );
  
  const todayTotal = useMemo(() => 
    todayExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0),
    [todayExpenses]
  );

  const avgMood = useMemo(() => 
    moodHistory.length > 0 
      ? (moodHistory.reduce((sum, m) => sum + m.value, 0) / moodHistory.length).toFixed(1)
      : 0,
    [moodHistory]
  );
  
  const totalExpenseAmount = useMemo(() => 
    expenseHistory.reduce((sum, e) => sum + parseFloat(e.amount), 0),
    [expenseHistory]
  );
  
  const habitCompletionRate = useMemo(() => 
    habits.length > 0
      ? ((habits.filter(h => h.last_checked === new Date().toDateString()).length / habits.length) * 100).toFixed(0)
      : 0,
    [habits]
  );

  const expensesByCategory = useMemo(() => {
    const categoryTotals = {};
    expenseHistory.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + parseFloat(exp.amount);
    });
    return categoryTotals;
  }, [expenseHistory]);

  // ============ THEME SYSTEM ============
  const getThemeColors = useMemo(() => {
    if (theme === 'light') {
      return {
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        cardBgHover: 'rgba(255, 255, 255, 1)',
        textPrimary: '#1a202c',
        textSecondary: '#4a5568',
        border: 'rgba(0, 0, 0, 0.08)',
        borderHover: 'rgba(0, 0, 0, 0.12)',
        accent: accentColor,
        shadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        shadowLg: '0 10px 40px rgba(0, 0, 0, 0.12)'
      };
    } else {
      return {
        background: `linear-gradient(135deg, ${accentColor} 0%, #764ba2 50%, #667eea 100%)`,
        cardBg: 'rgba(255, 255, 255, 0.12)',
        cardBgHover: 'rgba(255, 255, 255, 0.16)',
        textPrimary: 'white',
        textSecondary: 'rgba(255, 255, 255, 0.85)',
        border: 'rgba(255, 255, 255, 0.15)',
        borderHover: 'rgba(255, 255, 255, 0.25)',
        accent: accentColor,
        shadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        shadowLg: '0 10px 40px rgba(0, 0, 0, 0.3)'
      };
    }
  }, [theme, accentColor]);

  const colors = getThemeColors;

  // ============ STYLE OBJECTS ============
  const CardStyle = {
    background: colors.cardBg,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: isMobile ? '20px' : '24px',
    padding: isMobile ? '1.25rem' : '1.5rem',
    boxShadow: colors.shadow,
    border: `1px solid ${colors.border}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  const ModalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: isMobile ? 'flex-end' : 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: isMobile ? 0 : '1rem',
    animation: 'fadeIn 0.2s ease-out',
    overflowY: 'auto'
  };

  const ModalContentStyle = {
    ...CardStyle,
    maxWidth: isMobile ? '100%' : '600px',
    width: '100%',
    maxHeight: isMobile ? '90vh' : '90vh',
    overflowY: 'auto',
    borderRadius: isMobile ? '24px 24px 0 0' : '24px',
    animation: isMobile ? 'slideUp 0.3s ease-out' : 'scaleIn 0.3s ease-out',
    margin: isMobile ? 0 : 'auto'
  };

  const ButtonStyle = {
    background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}dd)`,
    color: 'white',
    border: 'none',
    borderRadius: isMobile ? '14px' : '16px',
    padding: isMobile ? '0.875rem 1.25rem' : '0.875rem 1.5rem',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: isMobile ? '0.9375rem' : '1rem',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: `0 2px 8px ${colors.accent}40`,
    minHeight: '44px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const InputStyle = {
    background: theme === 'light' ? 'white' : 'rgba(255, 255, 255, 0.15)',
    color: colors.textPrimary,
    border: `2px solid ${colors.border}`,
    borderRadius: isMobile ? '14px' : '16px',
    padding: isMobile ? '0.875rem 1rem' : '1rem 1.25rem',
    fontSize: isMobile ? '16px' : '1rem',
    outline: 'none',
    width: '100%',
    transition: 'all 0.2s ease',
    minHeight: '44px',
    WebkitAppearance: 'none'
  };

  const SelectStyle = {
    ...InputStyle,
    cursor: 'pointer'
  };

  // ============ NOTIFICATION COMPONENT ============
  const NotificationContainer = () => (
    <div style={{
      position: 'fixed',
      top: isMobile ? '0.75rem' : '1rem',
      right: isMobile ? '0.75rem' : '1rem',
      left: isMobile ? '0.75rem' : 'auto',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      maxWidth: isMobile ? 'auto' : '400px'
    }}>
      {notifications.map(notif => (
        <div
          key={notif.id}
          style={{
            ...CardStyle,
            padding: isMobile ? '0.875rem 1rem' : '1rem 1.25rem',
            background: notif.type === 'success' 
              ? 'linear-gradient(135deg, #10b981, #059669)' 
              : notif.type === 'error' 
              ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
              : `linear-gradient(135deg, ${colors.accent}, ${colors.accent}dd)`,
            color: 'white',
            minWidth: isMobile ? 'auto' : '280px',
            animation: 'slideInRight 0.3s ease-out',
            boxShadow: colors.shadowLg,
            fontSize: isMobile ? '0.875rem' : '0.9375rem',
            fontWeight: '500'
          }}
        >
          {notif.message}
        </div>
      ))}
    </div>
  );

  // ============ AUTH MODAL COMPONENT ============
  const AuthModal = () => (
    <div style={ModalStyle}>
      <div style={ModalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: isMobile ? '1.25rem' : '1.5rem' 
        }}>
          <h2 style={{ 
            color: colors.textPrimary, 
            margin: 0,
            fontSize: isMobile ? '1.5rem' : '1.75rem',
            fontWeight: '700'
          }}>
            {authMode === 'login' ? '🔐 Welcome Back' : '🚀 Create Account'}
          </h2>
        </div>

        {authError && (
          <div style={{ 
            background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
            color: 'white', 
            padding: isMobile ? '0.875rem' : '1rem', 
            borderRadius: '12px', 
            marginBottom: '1rem',
            fontSize: isMobile ? '0.875rem' : '0.9375rem',
            fontWeight: '500'
          }}>
            {authError}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '0.875rem' : '1rem' }}>
          <input
            type="email"
            placeholder="Email address"
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            style={InputStyle}
            autoComplete="email"
            disabled={authLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !authLoading) {
                authMode === 'login' ? handleLogin() : handleSignUp();
              }
            }}
            style={InputStyle}
            autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
            disabled={authLoading}
          />
          <button
            onClick={authMode === 'login' ? handleLogin : handleSignUp}
            style={{...ButtonStyle, opacity: authLoading ? 0.7 : 1}}
            disabled={authLoading}
          >
            {authLoading ? 'Loading...' : authMode === 'login' ? 'Login' : 'Sign Up'}
          </button>
          <button
            onClick={() => {
              setAuthMode(authMode === 'login' ? 'signup' : 'login');
              setAuthError('');
            }}
            style={{ 
              ...ButtonStyle, 
              background: 'transparent', 
              border: `2px solid ${colors.border}`, 
              color: colors.textPrimary,
              boxShadow: 'none'
            }}
            disabled={authLoading}
          >
            {authMode === 'login' ? 'Need an account? Sign up' : 'Have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );

// PART 3 ENDS HERE - Continue to Part 4
// PART 4: Settings Modal and Main Component Render - FINAL PART
// Paste this RIGHT AFTER Part 3

  // ============ SETTINGS MODAL ============
  const SettingsModal = () => (
    <div style={ModalStyle} onClick={() => setShowSettings(false)}>
      <div style={ModalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: colors.textPrimary, margin: 0, fontSize: isMobile ? '1.5rem' : '1.75rem', fontWeight: '700' }}>
            ⚙️ Settings
          </h2>
          <button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: colors.textPrimary, width: '44px', height: '44px' }}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ color: colors.textPrimary, fontWeight: '600', display: 'block', marginBottom: '0.75rem', fontSize: isMobile ? '0.9375rem' : '1rem' }}>Theme Mode</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setTheme('dark')} style={{ ...ButtonStyle, flex: 1, background: theme === 'dark' ? `linear-gradient(135deg, ${colors.accent}, ${colors.accent}dd)` : 'transparent', border: `2px solid ${theme === 'dark' ? colors.accent : colors.border}`, color: theme === 'dark' ? 'white' : colors.textPrimary }}>🌙 Dark</button>
              <button onClick={() => setTheme('light')} style={{ ...ButtonStyle, flex: 1, background: theme === 'light' ? `linear-gradient(135deg, ${colors.accent}, ${colors.accent}dd)` : 'transparent', border: `2px solid ${theme === 'light' ? colors.accent : colors.border}`, color: theme === 'light' ? 'white' : colors.textPrimary }}>☀️ Light</button>
            </div>
          </div>

          <div>
            <label style={{ color: colors.textPrimary, fontWeight: '600', display: 'block', marginBottom: '0.75rem' }}>Water Goal (glasses per day)</label>
            <input type="number" value={waterGoal} onChange={(e) => setWaterGoal(parseInt(e.target.value) || 8)} min="1" max="20" style={InputStyle} />
          </div>

          <div>
            <label style={{ color: colors.textPrimary, fontWeight: '600', display: 'block', marginBottom: '0.75rem' }}>Color Themes</label>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {themePresets.map(preset => (
                <button key={preset.name} onClick={() => applyThemePreset(preset)} style={{ padding: isMobile ? '0.875rem' : '1rem', borderRadius: '14px', border: `2px solid ${accentColor === preset.colors[0] ? colors.accent : colors.border}`, background: `linear-gradient(135deg, ${preset.colors.join(', ')})`, color: 'white', cursor: 'pointer', fontWeight: '600', fontSize: isMobile ? '0.8125rem' : '0.875rem', minHeight: '44px' }}>{preset.name}</button>
              ))}
            </div>
          </div>

          <button onClick={saveUserPreferences} style={ButtonStyle}>💾 Save Preferences</button>
        </div>
      </div>
    </div>
  );

  // ============ MAIN COMPONENT RENDER ============
  return (
    <div style={{ minHeight: '100vh', background: colors.background, padding: isMobile ? '1rem' : '2rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', transition: 'all 0.3s ease', paddingBottom: isMobile ? '80px' : '2rem' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        * { -webkit-tap-highlight-color: transparent; }
        input:focus, textarea:focus, button:focus { outline: 2px solid ${colors.accent}; outline-offset: 2px; }
        button:active { transform: scale(0.98); }
      `}</style>

      <NotificationContainer />
      {showAuthModal && <AuthModal />}
      {showSettings && <SettingsModal />}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: colors.textPrimary, fontSize: isMobile ? '1.25rem' : '1.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: isMobile ? '2.5rem' : '3rem', marginBottom: '1rem' }}>⏳</div>
            <div>Loading your dashboard...</div>
          </div>
        </div>
      ) : !isAuthenticated ? null : (
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          {/* Top Navigation */}
          <div style={{ ...CardStyle, marginBottom: isMobile ? '1.25rem' : '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: '700', color: colors.textPrimary, margin: 0 }}>🚀 Life Dashboard</h1>
              {isAuthenticated && <span style={{ fontSize: isMobile ? '0.8125rem' : '0.875rem', color: colors.textSecondary }}>{userEmail}</span>}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setShowSettings(true)} style={{ ...ButtonStyle, padding: '0.625rem 1rem', fontSize: '1.25rem' }}>⚙️</button>
              <button onClick={handleLogout} style={{ ...ButtonStyle, padding: '0.625rem 1rem', fontSize: isMobile ? '0.875rem' : '0.9375rem' }}>🚪</button>
            </div>
          </div>

          {/* Header */}
          <div style={{ ...CardStyle, marginBottom: isMobile ? '1.25rem' : '2rem' }}>
            <h1 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: '700', color: colors.textPrimary, margin: '0 0 0.5rem 0' }}>{greeting}!</h1>
            <p style={{ fontSize: isMobile ? '1rem' : '1.25rem', color: colors.textSecondary, margin: 0 }}>{time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            {weather && (
              <div style={{ marginTop: '1rem', fontSize: isMobile ? '0.875rem' : '1rem', color: colors.textSecondary }}>
                ☁️ {Math.round(weather.temperature_2m)}°C • 💧 {weather.relative_humidity_2m}% • 💨 {Math.round(weather.wind_speed_10m)} km/h
              </div>
            )}
          </div>

          {/* Water Intake Tracker */}
          <div style={{ ...CardStyle, marginBottom: isMobile ? '1.25rem' : '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: isMobile ? '1.5rem' : '1.75rem' }}>💧</span>
                <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: '700', color: colors.textPrimary, margin: 0 }}>Water Intake</h2>
              </div>
              <span style={{ fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: '700', color: colors.textPrimary }}>{waterIntake}/{waterGoal}</span>
            </div>
            <div style={{ width: '100%', background: colors.border, borderRadius: '999px', height: '16px', marginBottom: '1rem', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(90deg, #3b82f6, #06b6d4)', height: '100%', borderRadius: '999px', width: `${Math.min(waterPercentage, 100)}%`, transition: 'width 0.5s' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={addWaterGlass} style={{ ...ButtonStyle, flex: 1 }}>+ Add Glass</button>
              <button onClick={removeWaterGlass} style={{ ...ButtonStyle, flex: 1, background: 'transparent', border: `2px solid ${colors.border}`, color: colors.textPrimary, boxShadow: 'none' }}>− Remove</button>
            </div>
          </div>

          {/* Mood Tracker */}
          <div style={{ ...CardStyle, marginBottom: isMobile ? '1.25rem' : '2rem' }}>
            <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: '700', color: colors.textPrimary, marginBottom: '1rem' }}>😊 How are you feeling?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${moods.length}, 1fr)`, gap: isMobile ? '0.5rem' : '1rem', marginBottom: '1rem' }}>
              {moods.map(m => (
                <button key={m.value} onClick={() => saveMood(m.value)} style={{ background: mood === m.value ? `linear-gradient(135deg, ${colors.accent}, ${colors.accent}dd)` : colors.cardBg, border: `2px solid ${mood === m.value ? colors.accent : colors.border}`, borderRadius: isMobile ? '14px' : '16px', padding: isMobile ? '0.875rem 0.5rem' : '1rem', cursor: 'pointer', minHeight: '44px' }}>
                  <div style={{ fontSize: isMobile ? '2rem' : '2.5rem' }}>{m.emoji}</div>
                  <div style={{ color: mood === m.value ? 'white' : colors.textPrimary, fontSize: isMobile ? '0.75rem' : '0.875rem', marginTop: '0.5rem', fontWeight: '600' }}>{m.label}</div>
                </button>
              ))}
            </div>
            <textarea value={moodNote} onChange={(e) => setMoodNote(e.target.value)} placeholder="How are you feeling? (optional)" style={{ ...InputStyle, minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }} />
          </div>

          {/* Tasks */}
          <div style={{ ...CardStyle, marginBottom: isMobile ? '1.25rem' : '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: '700', color: colors.textPrimary, margin: 0 }}>🎯 Tasks</h2>
              <button onClick={() => setShowTaskInput(!showTaskInput)} style={{ background: colors.cardBg, color: colors.textPrimary, border: `2px solid ${colors.border}`, borderRadius: '50%', width: '44px', height: '44px', fontSize: '1.5rem', cursor: 'pointer' }}>+</button>
            </div>

            {totalTasks > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.textSecondary, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  <span>{completedTasks} of {totalTasks} completed</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div style={{ width: '100%', background: colors.border, borderRadius: '999px', height: '12px', overflow: 'hidden' }}>
                  <div style={{ background: 'linear-gradient(90deg, #10b981, #059669)', height: '100%', borderRadius: '999px', width: `${progressPercentage}%`, transition: 'width 0.5s' }} />
                </div>
              </div>
            )}

            {showTaskInput && (
              <div style={{ marginBottom: '1rem' }}>
                <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTask()} placeholder="What needs to be done?" style={{ ...InputStyle, marginBottom: '0.5rem' }} />
                <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)} style={SelectStyle}>
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority</option>
                </select>
                <button onClick={addTask} style={{ ...ButtonStyle, marginTop: '0.5rem', width: '100%' }}>Add Task</button>
              </div>
            )}

            {tasks.length === 0 ? (
              <div style={{ textAlign: 'center', color: colors.textSecondary, padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                <p>No tasks yet. Add one to get started!</p>
              </div>
            ) : (
              tasks.map(task => (
                <div key={task.id} style={{ background: colors.cardBg, borderRadius: '16px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', border: `2px solid ${colors.border}` }}>
                  <button onClick={() => toggleTask(task.id)} style={{ width: '32px', height: '32px', borderRadius: '10px', border: task.completed ? '2px solid #10b981' : `2px solid ${colors.border}`, background: task.completed ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent', color: 'white', cursor: 'pointer' }}>
                    {task.completed && '✓'}
                  </button>
                  <span style={{ flex: 1, color: colors.textPrimary, textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.6 : 1 }}>
                    {task.priority === 'high' && '🔴 '}
                    {task.priority === 'medium' && '🟡 '}
                    {task.priority === 'low' && '🟢 '}
                    {task.text}
                  </span>
                  <button onClick={() => deleteTask(task.id)} style={{ background: 'none', border: 'none', color: colors.textSecondary, cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
                </div>
              ))
            )}
          </div>

          {/* Shopping List */}
          <div style={{ ...CardStyle, marginBottom: isMobile ? '1.25rem' : '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: '700', color: colors.textPrimary, margin: 0 }}>🛒 Shopping List</h2>
              <button onClick={() => setShowShoppingInput(!showShoppingInput)} style={{ background: colors.cardBg, color: colors.textPrimary, border: `2px solid ${colors.border}`, borderRadius: '50%', width: '44px', height: '44px', fontSize: '1.5rem', cursor: 'pointer' }}>+</button>
            </div>

            {showShoppingInput && (
              <div style={{ marginBottom: '1rem' }}>
                <input type="text" value={newShoppingItem.item} onChange={(e) => setNewShoppingItem({...newShoppingItem, item: e.target.value})} placeholder="Item name" style={{ ...InputStyle, marginBottom: '0.5rem' }} />
                <input type="text" value={newShoppingItem.quantity} onChange={(e) => setNewShoppingItem({...newShoppingItem, quantity: e.target.value})} placeholder="Quantity (e.g., 2kg, 5 pcs)" style={{ ...InputStyle, marginBottom: '0.5rem' }} />
                <select value={newShoppingItem.category} onChange={(e) => setNewShoppingItem({...newShoppingItem, category: e.target.value})} style={{ ...SelectStyle, marginBottom: '0.5rem' }}>
                  {shoppingCategories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                </select>
                <button onClick={addShoppingItem} style={{ ...ButtonStyle, width: '100%' }}>Add Item</button>
              </div>
            )}

            {shoppingList.length === 0 ? (
              <div style={{ textAlign: 'center', color: colors.textSecondary, padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
                <p>Your shopping list is empty</p>
              </div>
            ) : (
              shoppingList.map(item => (
                <div key={item.id} style={{ background: colors.cardBg, borderRadius: '16px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', border: `2px solid ${colors.border}` }}>
                  <button onClick={() => toggleShoppingItem(item.id)} style={{ width: '32px', height: '32px', borderRadius: '10px', border: item.purchased ? '2px solid #10b981' : `2px solid ${colors.border}`, background: item.purchased ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent', color: 'white', cursor: 'pointer' }}>
                    {item.purchased && '✓'}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: colors.textPrimary, textDecoration: item.purchased ? 'line-through' : 'none', opacity: item.purchased ? 0.6 : 1, fontWeight: '600' }}>{item.item}</div>
                    <div style={{ fontSize: '0.875rem', color: colors.textSecondary }}>{item.quantity} • {shoppingCategories.find(c => c.value === item.category)?.label}</div>
                  </div>
                  <button onClick={() => deleteShoppingItem(item.id)} style={{ background: 'none', border: 'none', color: colors.textSecondary, cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
                </div>
              ))
            )}
          </div>

          {/* Meals Today */}
          <div style={{ ...CardStyle, marginBottom: isMobile ? '1.25rem' : '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: '700', color: colors.textPrimary, margin: 0 }}>🍽️ Meals Today</h2>
              <button onClick={() => setShowMealInput(!showMealInput)} style={{ background: colors.cardBg, color: colors.textPrimary, border: `2px solid ${colors.border}`, borderRadius: '50%', width: '44px', height: '44px', fontSize: '1.5rem', cursor: 'pointer' }}>+</button>
            </div>

            {showMealInput && (
              <div style={{ marginBottom: '1rem' }}>
                <select value={newMeal.type} onChange={(e) => setNewMeal({...newMeal, type: e.target.value})} style={{ ...SelectStyle, marginBottom: '0.5rem' }}>
                  {mealTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                </select>
                <input type="text" value={newMeal.name} onChange={(e) => setNewMeal({...newMeal, name: e.target.value})} placeholder="What did you eat?" style={{ ...InputStyle, marginBottom: '0.5rem' }} />
                <input type="time" value={newMeal.time} onChange={(e) => setNewMeal({...newMeal, time: e.target.value})} style={{ ...InputStyle, marginBottom: '0.5rem' }} />
                <button onClick={addMeal} style={{ ...ButtonStyle, width: '100%' }}>Add Meal</button>
              </div>
            )}

            {meals.length === 0 ? (
              <div style={{ textAlign: 'center', color: colors.textSecondary, padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍽️</div>
                <p>No meals logged today</p>
              </div>
            ) : (
              meals.map(meal => (
                <div key={meal.id} style={{ background: colors.cardBg, borderRadius: '16px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', border: `2px solid ${colors.border}` }}>
                  <div style={{ fontSize: '2rem' }}>{mealTypes.find(t => t.value === meal.type)?.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: colors.textPrimary, fontWeight: '600' }}>{meal.name}</div>
                    <div style={{ fontSize: '0.875rem', color: colors.textSecondary }}>{mealTypes.find(t => t.value === meal.type)?.label.split(' ')[1]} • {meal.time}</div>
                  </div>
                  <button onClick={() => deleteMeal(meal.id)} style={{ background: 'none', border: 'none', color: colors.textSecondary, cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
                </div>
              ))
            )}
          </div>

          {/* Quick Notes */}
          <div style={{ ...CardStyle }}>
            <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: '700', color: colors.textPrimary, marginBottom: '1rem' }}>📝 Quick Notes</h2>
            <textarea value={quickNotes} onChange={(e) => setQuickNotes(e.target.value)} placeholder="Jot down quick thoughts..." style={{ ...InputStyle, minHeight: '150px', resize: 'vertical', fontFamily: 'inherit' }} />
            <div style={{ fontSize: '0.75rem', color: colors.textSecondary, marginTop: '0.5rem' }}>Auto-saves as you type</div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: isMobile ? '1.5rem' : '2rem', color: colors.textSecondary, fontSize: isMobile ? '0.8125rem' : '0.875rem' }}>
            <p style={{ margin: 0 }}>Ultimate Life Dashboard v1.0 🚀✨</p>
            <p style={{ margin: '0.5rem 0 0 0' }}>Powered by Supabase</p>
          </div>
        </div>
      )}
    </div>
  );
}

// FINAL CLOSING BRACE - END OF COMPONENT
