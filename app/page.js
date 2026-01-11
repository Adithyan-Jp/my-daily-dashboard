// ═══════════════════════════════════════════════════════════════════════════════
// PART 1 OF 5: Imports, State, and Configuration
// ═══════════════════════════════════════════════════════════════════════════════
// Ultimate Life Dashboard - No Authentication Required
// INSTRUCTIONS: Copy each part in order (1→2→3→4→5) into your React component file

"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';

export default function UltimateLifeDashboard() {
  // ============ THEME & UI STATE ============
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dashboard-theme') || 'dark';
    }
    return 'dark';
  });
  const [accentColor, setAccentColor] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dashboard-accent') || '#667eea';
    }
    return '#667eea';
  });
  const [isMobile, setIsMobile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // ============ TIME & DATE STATE ============
  const [time, setTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  // ============ TASKS STATE ============
  const [tasks, setTasks] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-tasks');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [newTask, setNewTask] = useState('');
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskFilter, setTaskFilter] = useState('all'); // all, active, completed

  // ============ FOCUS TIMER STATE ============
  const [focusTime, setFocusTime] = useState(25);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [pomodoroCount, setPomodoroCount] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('dashboard-pomodoro-count')) || 0;
    }
    return 0;
  });
  const [timerMode, setTimerMode] = useState('focus'); // focus, shortBreak, longBreak

  // ============ WATER INTAKE STATE ============
  const [waterIntake, setWaterIntake] = useState(() => {
    if (typeof window !== 'undefined') {
      const today = new Date().toDateString();
      const saved = localStorage.getItem('dashboard-water-date');
      if (saved === today) {
        return parseInt(localStorage.getItem('dashboard-water-intake')) || 0;
      }
    }
    return 0;
  });
  const [waterGoal, setWaterGoal] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('dashboard-water-goal')) || 8;
    }
    return 8;
  });

  // ============ MEALS STATE ============
  const [meals, setMeals] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-meals');
      const parsed = saved ? JSON.parse(saved) : [];
      const today = new Date().toDateString();
      return parsed.filter(m => m.date === today);
    }
    return [];
  });
  const [showMealInput, setShowMealInput] = useState(false);
  const [newMeal, setNewMeal] = useState({ type: 'breakfast', name: '', time: '', calories: '' });

  // ============ SHOPPING LIST STATE ============
  const [shoppingList, setShoppingList] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-shopping');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [showShoppingInput, setShowShoppingInput] = useState(false);
  const [newShoppingItem, setNewShoppingItem] = useState({ item: '', quantity: '', category: 'grocery' });

  // ============ MOOD STATE ============
  const [mood, setMood] = useState(() => {
    if (typeof window !== 'undefined') {
      const today = new Date().toDateString();
      const saved = localStorage.getItem('dashboard-mood-date');
      if (saved === today) {
        return parseInt(localStorage.getItem('dashboard-mood-value')) || null;
      }
    }
    return null;
  });
  const [moodNote, setMoodNote] = useState('');
  const [moodHistory, setMoodHistory] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-mood-history');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // ============ HABITS STATE ============
  const [habits, setHabits] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-habits');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [showHabitInput, setShowHabitInput] = useState(false);
  const [newHabit, setNewHabit] = useState('');

  // ============ QUICK NOTES STATE ============
  const [quickNotes, setQuickNotes] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dashboard-notes') || '';
    }
    return '';
  });

  // ============ WEATHER STATE ============
  const [weather, setWeather] = useState(null);

  // ============ EXPENSES STATE ============
  const [expenses, setExpenses] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-expenses');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [showExpenseInput, setShowExpenseInput] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: 'other' });

  // ============ GRATITUDE STATE ============
  const [gratitudeEntries, setGratitudeEntries] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-gratitude');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [showGratitudeInput, setShowGratitudeInput] = useState(false);
  const [newGratitude, setNewGratitude] = useState('');

  // ============ MEDICINE TRACKER STATE ============
  const [medicines, setMedicines] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-medicines');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [showMedicineInput, setShowMedicineInput] = useState(false);
  const [newMedicine, setNewMedicine] = useState({ name: '', dosage: '', time: '', frequency: 'daily' });

  // ============ FITNESS TRACKER STATE ============
  const [workouts, setWorkouts] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-workouts');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [showWorkoutInput, setShowWorkoutInput] = useState(false);
  const [newWorkout, setNewWorkout] = useState({ type: '', duration: '', calories: '' });

  // ============ QUICK LINKS STATE ============
  const [quickLinks, setQuickLinks] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-links');
      return saved ? JSON.parse(saved) : [
        { id: 1, title: 'Gmail', url: 'https://mail.google.com', icon: '📧' },
        { id: 2, title: 'Calendar', url: 'https://calendar.google.com', icon: '📅' },
        { id: 3, title: 'GitHub', url: 'https://github.com', icon: '💻' },
      ];
    }
    return [];
  });
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '', icon: '🔗' });

  // ============ NOTIFICATIONS STATE ============
  const [notifications, setNotifications] = useState([]);

  // ============ ACTIVE VIEW STATE ============
  const [activeView, setActiveView] = useState('dashboard'); // dashboard, analytics, settings

  // ============ CONSTANTS ============
  const moods = [
    { emoji: '😄', label: 'Excellent', value: 5 },
    { emoji: '🙂', label: 'Good', value: 4 },
    { emoji: '😐', label: 'Okay', value: 3 },
    { emoji: '😔', label: 'Low', value: 2 },
    { emoji: '😢', label: 'Bad', value: 1 }
  ];

  const mealTypes = [
    { value: 'breakfast', label: '🌅 Breakfast', icon: '🥞' },
    { value: 'lunch', label: '☀️ Lunch', icon: '🍱' },
    { value: 'snack', label: '🍪 Snack', icon: '🍎' },
    { value: 'dinner', label: '🌙 Dinner', icon: '🍽️' }
  ];

  const shoppingCategories = [
    { value: 'grocery', label: '🛒 Grocery' },
    { value: 'household', label: '🏠 Household' },
    { value: 'personal', label: '👤 Personal' },
    { value: 'electronics', label: '💻 Electronics' },
    { value: 'clothing', label: '👕 Clothing' },
    { value: 'other', label: '📦 Other' }
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

  const themePresets = [
    { name: 'Purple Dream', colors: ['#667eea', '#764ba2'] },
    { name: 'Ocean Blue', colors: ['#2E3192', '#1BFFFF'] },
    { name: 'Sunset Orange', colors: ['#FF512F', '#DD2476'] },
    { name: 'Forest Green', colors: ['#134E5E', '#71B280'] },
    { name: 'Pink Paradise', colors: ['#FF6B9D', '#C06C84'] },
    { name: 'Midnight', colors: ['#232526', '#414345'] },
    { name: 'Royal Purple', colors: ['#9D50BB', '#6E48AA'] },
    { name: 'Emerald', colors: ['#11998e', '#38ef7d'] }
  ];

  const workoutTypes = [
    { value: 'running', label: '🏃 Running' },
    { value: 'cycling', label: '🚴 Cycling' },
    { value: 'gym', label: '💪 Gym' },
    { value: 'yoga', label: '🧘 Yoga' },
    { value: 'swimming', label: '🏊 Swimming' },
    { value: 'walking', label: '🚶 Walking' },
    { value: 'sports', label: '⚽ Sports' },
    { value: 'other', label: '🏋️ Other' }
  ];

// ═══════════════════════════════════════════════════════════════════════════════
// END OF PART 1
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// PART 2 OF 5: Effects, LocalStorage, and Core Functions
// ═══════════════════════════════════════════════════════════════════════════════

  // ============ MOBILE DETECTION ============
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ============ TIME & GREETING ============
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = time.getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, [time]);

  // ============ WEATHER FETCH ============
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=8.5241&longitude=76.9366&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto'
        );
        const data = await response.json();
        setWeather(data.current);
      } catch (err) {
        console.error('Weather error:', err);
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 300000);
    return () => clearInterval(interval);
  }, []);

  // ============ LOCALSTORAGE SYNC ============
  useEffect(() => {
    localStorage.setItem('dashboard-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('dashboard-shopping', JSON.stringify(shoppingList));
  }, [shoppingList]);

  useEffect(() => {
    localStorage.setItem('dashboard-meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('dashboard-habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('dashboard-expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('dashboard-gratitude', JSON.stringify(gratitudeEntries));
  }, [gratitudeEntries]);

  useEffect(() => {
    localStorage.setItem('dashboard-medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('dashboard-workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('dashboard-links', JSON.stringify(quickLinks));
  }, [quickLinks]);

  useEffect(() => {
    localStorage.setItem('dashboard-mood-history', JSON.stringify(moodHistory));
  }, [moodHistory]);

  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem('dashboard-water-date', today);
    localStorage.setItem('dashboard-water-intake', waterIntake.toString());
  }, [waterIntake]);

  useEffect(() => {
    localStorage.setItem('dashboard-water-goal', waterGoal.toString());
  }, [waterGoal]);

  useEffect(() => {
    localStorage.setItem('dashboard-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('dashboard-accent', accentColor);
  }, [accentColor]);

  useEffect(() => {
    localStorage.setItem('dashboard-pomodoro-count', pomodoroCount.toString());
  }, [pomodoroCount]);

  // ============ AUTO-SAVE NOTES ============
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('dashboard-notes', quickNotes);
    }, 1000);
    return () => clearTimeout(timer);
  }, [quickNotes]);

  // ============ FOCUS TIMER ============
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        if (timerSeconds === 0) {
          if (timerMinutes === 0) {
            setIsTimerRunning(false);
            if (timerMode === 'focus') {
              setPomodoroCount(prev => prev + 1);
              addNotification('Focus session complete! Time for a break. 🎉', 'success');
            } else {
              addNotification('Break complete! Ready for another session? 💪', 'success');
            }
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
  }, [isTimerRunning, timerMinutes, timerSeconds, timerMode]);

  // ============ NOTIFICATIONS ============
  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  // ============ TASK FUNCTIONS ============
  const addTask = useCallback(() => {
    if (!newTask.trim()) return;
    const task = {
      id: Date.now(),
      text: newTask,
      completed: false,
      priority: taskPriority,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [task, ...prev]);
    setNewTask('');
    setShowTaskInput(false);
    addNotification('Task added! 📝', 'success');
  }, [newTask, taskPriority, addNotification]);

  const toggleTask = useCallback((id) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
    const task = tasks.find(t => t.id === id);
    if (!task.completed) {
      addNotification('Task completed! 🎉', 'success');
    }
  }, [tasks, addNotification]);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    addNotification('Task deleted', 'info');
  }, [addNotification]);

  // ============ WATER FUNCTIONS ============
  const addWaterGlass = useCallback(() => {
    const newCount = waterIntake + 1;
    setWaterIntake(newCount);
    if (newCount === waterGoal) {
      addNotification('Daily water goal achieved! 💧🎉', 'success');
    } else {
      addNotification(`Water logged! ${newCount}/${waterGoal} glasses 💧`, 'info');
    }
  }, [waterIntake, waterGoal, addNotification]);

  const removeWaterGlass = useCallback(() => {
    if (waterIntake > 0) {
      setWaterIntake(waterIntake - 1);
    }
  }, [waterIntake]);

  // ============ MEAL FUNCTIONS ============
  const addMeal = useCallback(() => {
    if (!newMeal.name.trim()) return;
    const meal = {
      id: Date.now(),
      type: newMeal.type,
      name: newMeal.name,
      time: newMeal.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      calories: newMeal.calories,
      date: new Date().toDateString(),
      createdAt: new Date().toISOString()
    };
    setMeals(prev => [...prev, meal]);
    setNewMeal({ type: 'breakfast', name: '', time: '', calories: '' });
    setShowMealInput(false);
    addNotification('Meal added! 🍽️', 'success');
  }, [newMeal, addNotification]);

  const deleteMeal = useCallback((id) => {
    setMeals(prev => prev.filter(meal => meal.id !== id));
    addNotification('Meal deleted', 'info');
  }, [addNotification]);

  // ============ SHOPPING FUNCTIONS ============
  const addShoppingItem = useCallback(() => {
    if (!newShoppingItem.item.trim()) return;
    const item = {
      id: Date.now(),
      item: newShoppingItem.item,
      quantity: newShoppingItem.quantity || '1',
      category: newShoppingItem.category,
      purchased: false,
      createdAt: new Date().toISOString()
    };
    setShoppingList(prev => [item, ...prev]);
    setNewShoppingItem({ item: '', quantity: '', category: 'grocery' });
    setShowShoppingInput(false);
    addNotification('Item added to shopping list! 🛒', 'success');
  }, [newShoppingItem, addNotification]);

  const toggleShoppingItem = useCallback((id) => {
    setShoppingList(prev => prev.map(i => 
      i.id === id ? { ...i, purchased: !i.purchased } : i
    ));
  }, []);

  const deleteShoppingItem = useCallback((id) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearPurchased = useCallback(() => {
    setShoppingList(prev => prev.filter(item => !item.purchased));
    addNotification('Purchased items cleared! ✨', 'success');
  }, [addNotification]);

  // ============ HABIT FUNCTIONS ============
  const addHabit = useCallback(() => {
    if (!newHabit.trim()) return;
    const habit = {
      id: Date.now(),
      name: newHabit,
      streak: 0,
      lastChecked: null,
      createdAt: new Date().toISOString()
    };
    setHabits(prev => [...prev, habit]);
    setNewHabit('');
    setShowHabitInput(false);
    addNotification('Habit added! 🎯', 'success');
  }, [newHabit, addNotification]);

  const toggleHabit = useCallback((id) => {
    const today = new Date().toDateString();
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const wasCheckedToday = h.lastChecked === today;
        return {
          ...h,
          lastChecked: !wasCheckedToday ? today : null,
          streak: !wasCheckedToday ? h.streak + 1 : Math.max(0, h.streak - 1)
        };
      }
      return h;
    }));
    const habit = habits.find(h => h.id === id);
    if (habit && habit.lastChecked !== today) {
      addNotification(`Streak: ${habit.streak + 1} days! 🔥`, 'success');
    }
  }, [habits, addNotification]);

  const deleteHabit = useCallback((id) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  }, []);

// ═══════════════════════════════════════════════════════════════════════════════
// END OF PART 2
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// PART 3 OF 5: Additional Functions and Computed Values
// ═══════════════════════════════════════════════════════════════════════════════

  // ============ MOOD FUNCTIONS ============
  const saveMood = useCallback((value) => {
    setMood(value);
    const today = new Date().toDateString();
    localStorage.setItem('dashboard-mood-date', today);
    localStorage.setItem('dashboard-mood-value', value.toString());
    
    // Save to history
    setMoodHistory(prev => {
      const filtered = prev.filter(m => m.date !== today);
      return [...filtered, { date: today, value, note: moodNote }].slice(-30);
    });
    
    addNotification('Mood recorded! 😊', 'success');
  }, [moodNote, addNotification]);

  // ============ EXPENSE FUNCTIONS ============
  const addExpense = useCallback(() => {
    if (!newExpense.description.trim() || !newExpense.amount) return;
    const expense = {
      id: Date.now(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: new Date().toLocaleDateString(),
      createdAt: new Date().toISOString()
    };
    setExpenses(prev => [expense, ...prev]);
    setNewExpense({ description: '', amount: '', category: 'other' });
    setShowExpenseInput(false);
    addNotification('Expense added! 💰', 'success');
  }, [newExpense, addNotification]);

  const deleteExpense = useCallback((id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
    addNotification('Expense deleted', 'info');
  }, [addNotification]);

  // ============ GRATITUDE FUNCTIONS ============
  const addGratitude = useCallback(() => {
    if (!newGratitude.trim()) return;
    const entry = {
      id: Date.now(),
      content: newGratitude,
      createdAt: new Date().toISOString()
    };
    setGratitudeEntries(prev => [entry, ...prev]);
    setNewGratitude('');
    setShowGratitudeInput(false);
    addNotification('Gratitude recorded! 🙏', 'success');
  }, [newGratitude, addNotification]);

  const deleteGratitude = useCallback((id) => {
    setGratitudeEntries(prev => prev.filter(entry => entry.id !== id));
  }, []);

  // ============ MEDICINE FUNCTIONS ============
  const addMedicine = useCallback(() => {
    if (!newMedicine.name.trim()) return;
    const medicine = {
      id: Date.now(),
      name: newMedicine.name,
      dosage: newMedicine.dosage,
      time: newMedicine.time,
      frequency: newMedicine.frequency,
      createdAt: new Date().toISOString()
    };
    setMedicines(prev => [...prev, medicine]);
    setNewMedicine({ name: '', dosage: '', time: '', frequency: 'daily' });
    setShowMedicineInput(false);
    addNotification('Medicine added! 💊', 'success');
  }, [newMedicine, addNotification]);

  const deleteMedicine = useCallback((id) => {
    setMedicines(prev => prev.filter(med => med.id !== id));
  }, []);

  // ============ WORKOUT FUNCTIONS ============
  const addWorkout = useCallback(() => {
    if (!newWorkout.type) return;
    const workout = {
      id: Date.now(),
      type: newWorkout.type,
      duration: newWorkout.duration,
      calories: newWorkout.calories,
      date: new Date().toLocaleDateString(),
      createdAt: new Date().toISOString()
    };
    setWorkouts(prev => [workout, ...prev]);
    setNewWorkout({ type: '', duration: '', calories: '' });
    setShowWorkoutInput(false);
    addNotification('Workout logged! 💪', 'success');
  }, [newWorkout, addNotification]);

  const deleteWorkout = useCallback((id) => {
    setWorkouts(prev => prev.filter(workout => workout.id !== id));
  }, []);

  // ============ QUICK LINK FUNCTIONS ============
  const addQuickLink = useCallback(() => {
    if (!newLink.title.trim() || !newLink.url.trim()) return;
    const link = {
      id: Date.now(),
      title: newLink.title,
      url: newLink.url,
      icon: newLink.icon || '🔗',
      createdAt: new Date().toISOString()
    };
    setQuickLinks(prev => [...prev, link]);
    setNewLink({ title: '', url: '', icon: '🔗' });
    setShowLinkInput(false);
    addNotification('Quick link added! 🔗', 'success');
  }, [newLink, addNotification]);

  const deleteQuickLink = useCallback((id) => {
    setQuickLinks(prev => prev.filter(link => link.id !== id));
  }, []);

  // ============ FOCUS TIMER FUNCTIONS ============
  const startFocusTimer = useCallback(() => {
    const duration = timerMode === 'focus' ? focusTime : timerMode === 'shortBreak' ? 5 : 15;
    setTimerMinutes(duration);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    addNotification(`${timerMode === 'focus' ? 'Focus' : 'Break'} session started! ⏱️`, 'info');
  }, [focusTime, timerMode, addNotification]);

  const resetTimer = useCallback(() => {
    setIsTimerRunning(false);
    const duration = timerMode === 'focus' ? focusTime : timerMode === 'shortBreak' ? 5 : 15;
    setTimerMinutes(duration);
    setTimerSeconds(0);
  }, [focusTime, timerMode]);

  const switchTimerMode = useCallback((mode) => {
    setTimerMode(mode);
    setIsTimerRunning(false);
    const duration = mode === 'focus' ? focusTime : mode === 'shortBreak' ? 5 : 15;
    setTimerMinutes(duration);
    setTimerSeconds(0);
  }, [focusTime]);

  // ============ THEME FUNCTIONS ============
  const applyThemePreset = useCallback((preset) => {
    setAccentColor(preset.colors[0]);
    addNotification(`Theme changed to ${preset.name}! 🎨`, 'success');
  }, [addNotification]);

  // ============ EXPORT DATA ============
  const exportData = useCallback(() => {
    const exportObj = {
      tasks,
      habits,
      meals,
      shoppingList,
      expenses,
      workouts,
      gratitudeEntries,
      medicines,
      quickLinks,
      notes: quickNotes,
      moodHistory,
      waterGoal,
      theme,
      accentColor,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportObj, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `life-dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addNotification('Data exported successfully! 📥', 'success');
  }, [tasks, habits, meals, shoppingList, expenses, workouts, gratitudeEntries, medicines, quickLinks, quickNotes, moodHistory, waterGoal, theme, accentColor, addNotification]);

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

  const weeklyTotal = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return expenses
      .filter(e => new Date(e.createdAt) >= weekAgo)
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);
  }, [expenses]);

  const monthlyTotal = useMemo(() => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return expenses
      .filter(e => new Date(e.createdAt) >= monthAgo)
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);
  }, [expenses]);

  const todayCalories = useMemo(() => 
    meals.reduce((sum, m) => sum + (parseInt(m.calories) || 0), 0),
    [meals]
  );

  const weeklyWorkouts = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workouts.filter(w => new Date(w.createdAt) >= weekAgo).length;
  }, [workouts]);

  const habitCompletionRate = useMemo(() => {
    const today = new Date().toDateString();
    const completed = habits.filter(h => h.lastChecked === today).length;
    return habits.length > 0 ? ((completed / habits.length) * 100).toFixed(0) : 0;
  }, [habits]);

  const filteredTasks = useMemo(() => {
    if (taskFilter === 'active') return tasks.filter(t => !t.completed);
    if (taskFilter === 'completed') return tasks.filter(t => t.completed);
    return tasks;
  }, [tasks, taskFilter]);

  const avgMood = useMemo(() => 
    moodHistory.length > 0 
      ? (moodHistory.reduce((sum, m) => sum + m.value, 0) / moodHistory.length).toFixed(1)
      : 0,
    [moodHistory]
  );

// ═══════════════════════════════════════════════════════════════════════════════
// END OF PART 3
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// PART 4 OF 5: Theme System and UI Components
// ═══════════════════════════════════════════════════════════════════════════════

  // ============ THEME SYSTEM ============
  const getThemeColors = useMemo(() => {
    if (theme === 'light') {
      return {
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        textPrimary: '#1a202c',
        textSecondary: '#4a5568',
        border: 'rgba(0, 0, 0, 0.08)',
        accent: accentColor,
        shadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      };
    } else {
      return {
        background: `linear-gradient(135deg, ${accentColor} 0%, #764ba2 50%, #667eea 100%)`,
        cardBg: 'rgba(255, 255, 255, 0.12)',
        textPrimary: 'white',
        textSecondary: 'rgba(255, 255, 255, 0.85)',
        border: 'rgba(255, 255, 255, 0.15)',
        accent: accentColor,
        shadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
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
    transition: 'all 0.3s ease'
  };

  const ButtonStyle = {
    background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}dd)`,
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    padding: '0.875rem 1.5rem',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    boxShadow: `0 2px 8px ${colors.accent}40`,
    minHeight: '44px',
  };

  const InputStyle = {
    background: theme === 'light' ? 'white' : 'rgba(255, 255, 255, 0.15)',
    color: colors.textPrimary,
    border: `2px solid ${colors.border}`,
    borderRadius: '16px',
    padding: '1rem 1.25rem',
    fontSize: '1rem',
    outline: 'none',
    width: '100%',
    transition: 'all 0.2s ease',
    minHeight: '44px',
  };

  const SelectStyle = {
    ...InputStyle,
    cursor: 'pointer'
  };

  // ============ NOTIFICATION COMPONENT ============
  const NotificationContainer = () => (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      maxWidth: '400px',
      pointerEvents: 'none'
    }}>
      {notifications.map(notif => (
        <div
          key={notif.id}
          style={{
            ...CardStyle,
            padding: '1rem 1.25rem',
            background: notif.type === 'success' 
              ? 'linear-gradient(135deg, #10b981, #059669)' 
              : notif.type === 'error' 
              ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
              : `linear-gradient(135deg, ${colors.accent}, ${colors.accent}dd)`,
            color: 'white',
            animation: 'slideInRight 0.3s ease-out',
            pointerEvents: 'auto'
          }}
        >
          {notif.message}
        </div>
      ))}
    </div>
  );

  // ============ STATS CARD COMPONENT ============
  const StatCard = ({ icon, label, value, color }) => (
    <div style={{
      ...CardStyle,
      textAlign: 'center',
      padding: '1.5rem',
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div style={{ fontSize: '2rem', fontWeight: '700', color: color || colors.textPrimary, marginBottom: '0.25rem' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.875rem', color: colors.textSecondary }}>
        {label}
      </div>
    </div>
  );

  // ============ MAIN RENDER ============
  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      padding: isMobile ? '1rem' : '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      paddingBottom: isMobile ? '80px' : '2rem',
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        input:focus, textarea:focus, select:focus { outline: 2px solid ${colors.accent}; outline-offset: 2px; }
        button:active { transform: scale(0.98); }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${colors.border}; }
        ::-webkit-scrollbar-thumb { background: ${colors.accent}; border-radius: 4px; }
      `}</style>

      <NotificationContainer />

      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          ...CardStyle,
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <h1 style={{
              fontSize: isMobile ? '1.5rem' : '2rem',
              fontWeight: '700',
              color: colors.textPrimary,
              margin: '0 0 0.25rem 0',
            }}>
              🚀 Ultimate Life Dashboard
            </h1>
            <p style={{
              fontSize: '0.875rem',
              color: colors.textSecondary,
              margin: 0,
            }}>
              Your personal productivity companion
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveView('dashboard')}
              style={{
                ...ButtonStyle,
                background: activeView === 'dashboard' ? `linear-gradient(135deg, ${colors.accent}, ${colors.accent}dd)` : 'transparent',
                border: `2px solid ${colors.border}`,
                color: activeView === 'dashboard' ? 'white' : colors.textPrimary,
                padding: '0.75rem 1.25rem',
                fontSize: '0.9375rem',
                boxShadow: activeView === 'dashboard' ? `0 2px 8px ${colors.accent}40` : 'none',
              }}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveView('analytics')}
              style={{
                ...ButtonStyle,
                background: activeView === 'analytics' ? `linear-gradient(135deg, ${colors.accent}, ${colors.accent}dd)` : 'transparent',
                border: `2px solid ${colors.border}`,
                color: activeView === 'analytics' ? 'white' : colors.textPrimary,
                padding: '0.75rem 1.25rem',
                fontSize: '0.9375rem',
                boxShadow: activeView === 'analytics' ? `0 2px 8px ${colors.accent}40` : 'none',
              }}
            >
              📈 Analytics
            </button>
            <button
              onClick={() => setShowSettings(true)}
              style={{
                ...ButtonStyle,
                background: 'transparent',
                border: `2px solid ${colors.border}`,
                color: colors.textPrimary,
                padding: '0.75rem 1.25rem',
                fontSize: '1.25rem',
                boxShadow: 'none',
              }}
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }} onClick={() => setShowSettings(false)}>
            <div style={{
              ...CardStyle,
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: colors.textPrimary, margin: 0 }}>
                  ⚙️ Settings
                </h2>
                <button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: colors.textPrimary }}>×</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ color: colors.textPrimary, fontWeight: '600', display: 'block', marginBottom: '0.75rem' }}>Theme Mode</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => setTheme('dark')} style={{ ...ButtonStyle, flex: 1, background: theme === 'dark' ? `linear-gradient(135deg, ${colors.accent}, ${colors.accent}dd)` : 'transparent', border: `2px solid ${theme === 'dark' ? colors.accent : colors.border}`, color: theme === 'dark' ? 'white' : colors.textPrimary }}>🌙 Dark</button>
                    <button onClick={() => setTheme('light')} style={{ ...ButtonStyle, flex: 1, background: theme === 'light' ? `linear-gradient(135deg, ${colors.accent}, ${colors.accent}dd)` : 'transparent', border: `2px solid ${theme === 'light' ? colors.accent : colors.border}`, color: theme === 'light' ? 'white' : colors.textPrimary }}>☀️ Light</button>
                  </div>
                </div>

                <div>
                  <label style={{ color: colors.textPrimary, fontWeight: '600', display: 'block', marginBottom: '0.75rem' }}>Water Goal (glasses/day)</label>
                  <input type="number" value={waterGoal} onChange={(e) => setWaterGoal(parseInt(e.target.value) || 8)} min="1" max="20" style={InputStyle} />
                </div>

                <div>
                  <label style={{ color: colors.textPrimary, fontWeight: '600', display: 'block', marginBottom: '0.75rem' }}>Focus Time (minutes)</label>
                  <input type="number" value={focusTime} onChange={(e) => setFocusTime(parseInt(e.target.value) || 25)} min="1" max="60" style={InputStyle} />
                </div>

                <div>
                  <label style={{ color: colors.textPrimary, fontWeight: '600', display: 'block', marginBottom: '0.75rem' }}>Color Themes</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem' }}>
                    {themePresets.map(preset => (
                      <button key={preset.name} onClick={() => applyThemePreset(preset)} style={{ padding: '1rem', borderRadius: '14px', border: `2px solid ${accentColor === preset.colors[0] ? colors.accent : colors.border}`, background: `linear-gradient(135deg, ${preset.colors.join(', ')})`, color: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem' }}>{preset.name}</button>
                    ))}
                  </div>
                </div>

                <button onClick={exportData} style={{ ...ButtonStyle, width: '100%' }}>💾 Export All Data</button>
              </div>
            </div>
          </div>
        )}

// ═══════════════════════════════════════════════════════════════════════════════
// END OF PART 4
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// PART 5 OF 5: Dashboard Views and Content (FINAL PART)
// ═══════════════════════════════════════════════════════════════════════════════

        {/* Analytics View */}
        {activeView === 'analytics' && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <StatCard icon="✅" label="Tasks Completed" value={`${completedTasks}/${totalTasks}`} color="#10b981" />
            <StatCard icon="🔥" label="Habit Streak" value={`${habitCompletionRate}%`} color="#f59e0b" />
            <StatCard icon="💧" label="Water Today" value={`${waterIntake}/${waterGoal}`} color="#3b82f6" />
            <StatCard icon="💰" label="Today's Spending" value={`${todayTotal.toFixed(2)}`} color="#ef4444" />
            <StatCard icon="🍽️" label="Calories Today" value={todayCalories} color="#ec4899" />
            <StatCard icon="💪" label="Workouts This Week" value={weeklyWorkouts} color="#8b5cf6" />
            <StatCard icon="😊" label="Average Mood" value={avgMood || 'N/A'} color="#10b981" />
            <StatCard icon="⏱️" label="Pomodoros Done" value={pomodoroCount} color="#f59e0b" />
            
            <div style={{ ...CardStyle, gridColumn: isMobile ? 'auto' : 'span 2' }}>
              <h3 style={{ color: colors.textPrimary, marginBottom: '1rem' }}>📊 Expense Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.textSecondary }}>
                  <span>Today</span>
                  <span style={{ fontWeight: '600', color: colors.textPrimary }}>${todayTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.textSecondary }}>
                  <span>This Week</span>
                  <span style={{ fontWeight: '600', color: colors.textPrimary }}>${weeklyTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.textSecondary }}>
                  <span>This Month</span>
                  <span style={{ fontWeight: '600', color: colors.textPrimary }}>${monthlyTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <>
            {/* Greeting Card */}
            <div style={{ ...CardStyle, marginBottom: '2rem' }}>
              <h1 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: '700', color: colors.textPrimary, margin: '0 0 0.5rem 0' }}>
                {greeting}!
              </h1>
              <p style={{ fontSize: isMobile ? '1rem' : '1.25rem', color: colors.textSecondary, margin: 0 }}>
                {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              {weather && (
                <div style={{ marginTop: '1rem', fontSize: '0.9375rem', color: colors.textSecondary }}>
                  ☁️ {Math.round(weather.temperature_2m)}°C • 💧 {weather.relative_humidity_2m}% • 💨 {Math.round(weather.wind_speed_10m)} km/h
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              <StatCard icon="✅" label="Tasks Done" value={`${completedTasks}/${totalTasks}`} />
              <StatCard icon="💧" label="Water" value={`${waterIntake}/${waterGoal}`} />
              <StatCard icon="🔥" label="Habits" value={`${habitCompletionRate}%`} />
              <StatCard icon="⏱️" label="Pomodoros" value={pomodoroCount} />
            </div>

            {/* Focus Timer */}
            <div style={{ ...CardStyle, marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.textPrimary, marginBottom: '1rem' }}>⏱️ Focus Timer</h2>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
                <button onClick={() => switchTimerMode('focus')} style={{ ...ButtonStyle, flex: 1, background: timerMode === 'focus' ? `linear-gradient(135deg, ${colors.accent}, ${colors.accent}dd)` : 'transparent', border: `2px solid ${colors.border}`, color: timerMode === 'focus' ? 'white' : colors.textPrimary, boxShadow: timerMode === 'focus' ? `0 2px 8px ${colors.accent}40` : 'none' }}>Focus</button>
                <button onClick={() => switchTimerMode('shortBreak')} style={{ ...ButtonStyle, flex: 1, background: timerMode === 'shortBreak' ? `linear-gradient(135deg, ${colors.accent}, ${colors.accent}dd)` : 'transparent', border: `2px solid ${colors.border}`, color: timerMode === 'shortBreak' ? 'white' : colors.textPrimary, boxShadow: timerMode === 'shortBreak' ? `0 2px 8px ${colors.accent}40` : 'none' }}>Short Break</button>
                <button onClick={() => switchTimerMode('longBreak')} style={{ ...ButtonStyle, flex: 1, background: timerMode === 'longBreak' ? `linear-gradient(135deg, ${colors.accent}, ${colors.accent}dd)` : 'transparent', border: `2px solid ${colors.border}`, color: timerMode === 'longBreak' ? 'white' : colors.textPrimary, boxShadow: timerMode === 'longBreak' ? `0 2px 8px ${colors.accent}40` : 'none' }}>Long Break</button>
              </div>
              
              <div style={{ textAlign: 'center', fontSize: isMobile ? '3rem' : '4rem', fontWeight: '700', color: colors.textPrimary, margin: '2rem 0' }}>
                {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={isTimerRunning ? () => setIsTimerRunning(false) : startFocusTimer} style={{ ...ButtonStyle, flex: 1 }}>
                  {isTimerRunning ? '⏸️ Pause' : '▶️ Start'}
                </button>
                <button onClick={resetTimer} style={{ ...ButtonStyle, flex: 1, background: 'transparent', border: `2px solid ${colors.border}`, color: colors.textPrimary, boxShadow: 'none' }}>
                  🔄 Reset
                </button>
              </div>
            </div>

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '2rem' }}>
              
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Tasks */}
                <div style={CardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.textPrimary, margin: 0 }}>🎯 Tasks</h2>
                    <button onClick={() => setShowTaskInput(!showTaskInput)} style={{ background: colors.cardBg, color: colors.textPrimary, border: `2px solid ${colors.border}`, borderRadius: '50%', width: '44px', height: '44px', fontSize: '1.5rem', cursor: 'pointer' }}>+</button>
                  </div>

                  {totalTasks > 0 && (
                    <>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        {['all', 'active', 'completed'].map(filter => (
                          <button key={filter} onClick={() => setTaskFilter(filter)} style={{ ...ButtonStyle, flex: 1, fontSize: '0.875rem', padding: '0.625rem', background: taskFilter === filter ? `linear-gradient(135deg, ${colors.accent}, ${colors.accent}dd)` : 'transparent', border: `2px solid ${colors.border}`, color: taskFilter === filter ? 'white' : colors.textPrimary, boxShadow: taskFilter === filter ? `0 2px 8px ${colors.accent}40` : 'none' }}>
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                          </button>
                        ))}
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.textSecondary, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                          <span>{completedTasks} of {totalTasks} completed</span>
                          <span>{Math.round(progressPercentage)}%</span>
                        </div>
                        <div style={{ width: '100%', background: colors.border, borderRadius: '999px', height: '12px', overflow: 'hidden' }}>
                          <div style={{ background: 'linear-gradient(90deg, #10b981, #059669)', height: '100%', borderRadius: '999px', width: `${progressPercentage}%`, transition: 'width 0.5s' }} />
                        </div>
                      </div>
                    </>
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

                  {filteredTasks.length === 0 ? (
                    <div style={{ textAlign: 'center', color: colors.textSecondary, padding: '2rem' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                      <p>No tasks yet. Add one to get started!</p>
                    </div>
                  ) : (
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {filteredTasks.map(task => (
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
                      ))}
                    </div>
                  )}
                </div>

                {/* Water Intake */}
                <div style={CardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.textPrimary, margin: 0 }}>💧 Water Intake</h2>
                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.textPrimary }}>{waterIntake}/{waterGoal}</span>
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
                <div style={CardStyle}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.textPrimary, marginBottom: '1rem' }}>😊 How are you feeling?</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${moods.length}, 1fr)`, gap: '0.75rem', marginBottom: '1rem' }}>
                    {moods.map(m => (
                      <button key={m.value} onClick={() => saveMood(m.value)} style={{ background: mood === m.value ? `linear-gradient(135deg, ${colors.accent}, ${colors.accent}dd)` : colors.cardBg, border: `2px solid ${mood === m.value ? colors.accent : colors.border}`, borderRadius: '16px', padding: '1rem 0.5rem', cursor: 'pointer' }}>
                        <div style={{ fontSize: '2rem' }}>{m.emoji}</div>
                        <div style={{ color: mood === m.value ? 'white' : colors.textPrimary, fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: '600' }}>{m.label}</div>
                      </button>
                    ))}
                  </div>
                  <textarea value={moodNote} onChange={(e) => setMoodNote(e.target.value)} placeholder="How are you feeling? (optional)" style={{ ...InputStyle, minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }} />
                </div>
              </div>

              {/* Right Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Quick Links */}
                <div style={CardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.textPrimary, margin: 0 }}>🔗 Quick Links</h2>
                    <button onClick={() => setShowLinkInput(!showLinkInput)} style={{ background: colors.cardBg, color: colors.textPrimary, border: `2px solid ${colors.border}`, borderRadius: '50%', width: '44px', height: '44px', fontSize: '1.5rem', cursor: 'pointer' }}>+</button>
                  </div>
                  
                  {showLinkInput && (
                    <div style={{ marginBottom: '1rem' }}>
                      <input type="text" value={newLink.icon} onChange={(e) => setNewLink({...newLink, icon: e.target.value})} placeholder="Emoji (e.g., 📧)" style={{ ...InputStyle, marginBottom: '0.5rem' }} />
                      <input type="text" value={newLink.title} onChange={(e) => setNewLink({...newLink, title: e.target.value})} placeholder="Title" style={{ ...InputStyle, marginBottom: '0.5rem' }} />
                      <input type="url" value={newLink.url} onChange={(e) => setNewLink({...newLink, url: e.target.value})} placeholder="https://example.com" style={{ ...InputStyle, marginBottom: '0.5rem' }} />
                      <button onClick={addQuickLink} style={{ ...ButtonStyle, width: '100%' }}>Add Link</button>
                    </div>
                  )}
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.75rem' }}>
                    {quickLinks.map(link => (
                      <div key={link.id} style={{ position: 'relative' }}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ ...CardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', textDecoration: 'none', minHeight: '100px', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{link.icon}</div>
                          <div style={{ color: colors.textPrimary, fontSize: '0.875rem', fontWeight: '600', textAlign: 'center' }}>{link.title}</div>
                        </a>
                        <button onClick={() => deleteQuickLink(link.id)} style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>×</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Habits */}
                <div style={CardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.textPrimary, margin: 0 }}>🔥 Daily Habits</h2>
                    <button onClick={() => setShowHabitInput(!showHabitInput)} style={{ background: colors.cardBg, color: colors.textPrimary, border: `2px solid ${colors.border}`, borderRadius: '50%', width: '44px', height: '44px', fontSize: '1.5rem', cursor: 'pointer' }}>+</button>
                  </div>

                  {showHabitInput && (
                    <div style={{ marginBottom: '1rem' }}>
                      <input type="text" value={newHabit} onChange={(e) => setNewHabit(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addHabit()} placeholder="New habit name" style={InputStyle} />
                      <button onClick={addHabit} style={{ ...ButtonStyle, marginTop: '0.5rem', width: '100%' }}>Add Habit</button>
                    </div>
                  )}

                  {habits.length === 0 ? (
                    <div style={{ textAlign: 'center', color: colors.textSecondary, padding: '2rem' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔥</div>
                      <p>No habits yet. Add one to start tracking!</p>
                    </div>
                  ) : (
                    habits.map(habit => {
                      const today = new Date().toDateString();
                      const isCheckedToday = habit.lastChecked === today;
                      return (
                        <div key={habit.id} style={{ background: colors.cardBg, borderRadius: '16px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', border: `2px solid ${colors.border}` }}>
                          <button onClick={() => toggleHabit(habit.id)} style={{ width: '32px', height: '32px', borderRadius: '10px', border: isCheckedToday ? '2px solid #10b981' : `2px solid ${colors.border}`, background: isCheckedToday ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent', color: 'white', cursor: 'pointer' }}>
                            {isCheckedToday && '✓'}
                          </button>
                          <div style={{ flex: 1 }}>
                            <div style={{ color: colors.textPrimary, fontWeight: '600' }}>{habit.name}</div>
                            <div style={{ fontSize: '0.75rem', color: colors.textSecondary }}>🔥 {habit.streak} day streak</div>
                          </div>
                          <button onClick={() => deleteHabit(habit.id)} style={{ background: 'none', border: 'none', color: colors.textSecondary, cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Quick Notes */}
                <div style={CardStyle}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.textPrimary, marginBottom: '1rem' }}>📝 Quick Notes</h2>
                  <textarea value={quickNotes} onChange={(e) => setQuickNotes(e.target.value)} placeholder="Jot down quick thoughts..." style={{ ...InputStyle, minHeight: '150px', resize: 'vertical', fontFamily: 'inherit' }} />
                  <div style={{ fontSize: '0.75rem', color: colors.textSecondary, marginTop: '0.5rem' }}>Auto-saves as you type</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '2rem', color: colors.textSecondary, fontSize: '0.875rem' }}>
          <p style={{ margin: 0 }}>Ultimate Life Dashboard v3.0 🚀✨</p>
          <p style={{ margin: '0.5rem 0 0 0' }}>Made with ❤️ by Claude</p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ✅ END OF PART 5 - COMPONENT COMPLETE!
// ═══════════════════════════════════════════════════════════════════════════════
// All 5 parts are now complete. Your dashboard is ready to use!
