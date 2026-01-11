import React, { useState, useEffect } from 'react';
import { Sun, Moon, Cloud, CloudRain, Plus, Check, X, Target, Calendar, Clock, Zap, TrendingUp, Droplets, Wind, Flame, Sparkles } from 'lucide-react';

export default function PersonalDashboard() {
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
  const [loading, setLoading] = useState(true);

  const motivationalQuotes = [
    "The secret of getting ahead is getting started.",
    "Your limitation—it's only your imagination.",
    "Great things never come from comfort zones.",
    "Don't watch the clock; do what it does. Keep going.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Dream bigger. Do bigger.",
    "Success doesn't just find you. You have to go out and get it.",
    "Push yourself, because no one else is going to do it for you."
  ];

  // Load all data from storage on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [tasksData, notesData, habitsData, eventsData] = await Promise.all([
        window.storage.get('tasks').catch(() => null),
        window.storage.get('quickNotes').catch(() => null),
        window.storage.get('habits').catch(() => null),
        window.storage.get('events').catch(() => null)
      ]);

      if (tasksData?.value) setTasks(JSON.parse(tasksData.value));
      if (notesData?.value) setQuickNotes(notesData.value);
      if (habitsData?.value) setHabits(JSON.parse(habitsData.value));
      if (eventsData?.value) setEvents(JSON.parse(eventsData.value));
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  // Save tasks whenever they change
  useEffect(() => {
    if (!loading && tasks.length >= 0) {
      saveTasks();
    }
  }, [tasks]);

  // Save notes whenever they change (with debounce)
  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => {
        saveNotes();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [quickNotes]);

  // Save habits whenever they change
  useEffect(() => {
    if (!loading && habits.length >= 0) {
      saveHabits();
    }
  }, [habits]);

  // Save events whenever they change
  useEffect(() => {
    if (!loading && events.length >= 0) {
      saveEvents();
    }
  }, [events]);

  const saveTasks = async () => {
    try {
      await window.storage.set('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const saveNotes = async () => {
    try {
      await window.storage.set('quickNotes', quickNotes);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const saveHabits = async () => {
    try {
      await window.storage.set('habits', JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  };

  const saveEvents = async () => {
    try {
      await window.storage.set('events', JSON.stringify(events));
    } catch (error) {
      console.error('Error saving events:', error);
    }
  };

  // Fetch weather
  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=8.5241&longitude=76.9366&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=auto');
      const data = await response.json();
      setWeather(data.current);
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  const getWeatherIcon = (code) => {
    if (code === 0) return <Sun className="text-yellow-300" size={32} />;
    if (code <= 3) return <Cloud className="text-gray-300" size={32} />;
    if (code <= 67) return <CloudRain className="text-blue-300" size={32} />;
    return <Cloud className="text-gray-300" size={32} />;
  };

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

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
      setShowTaskInput(false);
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([...habits, { 
        id: Date.now(), 
        name: newHabit, 
        streak: 0,
        lastChecked: null,
        checkedToday: false
      }]);
      setNewHabit('');
      setShowHabitInput(false);
    }
  };

  const toggleHabit = (id) => {
    const today = new Date().toDateString();
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const wasCheckedToday = habit.lastChecked === today;
        return {
          ...habit,
          checkedToday: !wasCheckedToday,
          lastChecked: !wasCheckedToday ? today : null,
          streak: !wasCheckedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1)
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const addEvent = () => {
    if (newEvent.title.trim() && newEvent.time) {
      setEvents([...events, { 
        id: Date.now(), 
        title: newEvent.title, 
        time: newEvent.time,
        date: new Date().toDateString()
      }]);
      setNewEvent({ title: '', time: '' });
      setShowEventInput(false);
    }
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-2xl">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 mb-6 shadow-2xl border border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                {greeting}!
              </h1>
              <p className="text-white/80 text-lg md:text-xl">
                {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-6">
              {weather && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    {getWeatherIcon(weather.weather_code)}
                    <div>
                      <div className="text-3xl font-bold text-white">
                        {Math.round(weather.temperature_2m)}°C
                      </div>
                      <div className="text-white/70 text-sm flex items-center gap-2">
                        <Droplets size={14} /> {weather.relative_humidity_2m}%
                        <Wind size={14} /> {Math.round(weather.wind_speed_10m)} km/h
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="text-center">
                <div className="text-5xl md:text-7xl font-bold text-white">
                  {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-white/60 text-sm mt-2">
                  {time.toLocaleTimeString('en-US', { second: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Target className="text-white" size={28} />
                  <h2 className="text-2xl font-bold text-white">Today's Priorities</h2>
                </div>
                <button
                  onClick={() => setShowTaskInput(!showTaskInput)}
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all duration-300 hover:scale-110"
                >
                  <Plus size={24} />
                </button>
              </div>

              {totalTasks > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between text-white/80 text-sm mb-2">
                    <span>{completedTasks} of {totalTasks} completed</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              {showTaskInput && (
                <div className="mb-4 flex gap-2">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    placeholder="What needs to be done?"
                    className="flex-1 bg-white/20 text-white placeholder-white/50 border border-white/30 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/50"
                    autoFocus
                  />
                  <button
                    onClick={addTask}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-2xl px-6 transition-all duration-300"
                  >
                    Add
                  </button>
                </div>
              )}

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {tasks.length === 0 ? (
                  <div className="text-center text-white/60 py-12">
                    <Target size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No tasks yet. Add one to get started!</p>
                  </div>
                ) : (
                  tasks.map(task => (
                    <div
                      key={task.id}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3 hover:bg-white/20 transition-all duration-300 border border-white/10"
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                          task.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-white/50 hover:border-white'
                        }`}
                      >
                        {task.completed && <Check size={16} className="text-white" />}
                      </button>
                      <span
                        className={`flex-1 text-white transition-all duration-300 ${
                          task.completed ? 'line-through opacity-50' : ''
                        }`}
                      >
                        {task.text}
                      </span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-white/50 hover:text-red-400 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Habits Tracker */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Flame className="text-orange-300" size={28} />
                  <h2 className="text-2xl font-bold text-white">Daily Habits</h2>
                </div>
                <button
                  onClick={() => setShowHabitInput(!showHabitInput)}
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all duration-300 hover:scale-110"
                >
                  <Plus size={24} />
                </button>
              </div>

              {showHabitInput && (
                <div className="mb-4 flex gap-2">
                  <input
                    type="text"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addHabit()}
                    placeholder="New habit (e.g., Exercise, Read, Meditate)"
                    className="flex-1 bg-white/20 text-white placeholder-white/50 border border-white/30 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/50"
                    autoFocus
                  />
                  <button
                    onClick={addHabit}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl px-6 transition-all duration-300"
                  >
                    Add
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {habits.length === 0 ? (
                  <div className="col-span-full text-center text-white/60 py-8">
                    <Flame size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Start building good habits!</p>
                  </div>
                ) : (
                  habits.map(habit => (
                    <div
                      key={habit.id}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/20 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <button
                          onClick={() => toggleHabit(habit.id)}
                          className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                            habit.lastChecked === new Date().toDateString()
                              ? 'bg-orange-500 border-orange-500'
                              : 'border-white/50 hover:border-white'
                          }`}
                        >
                          {habit.lastChecked === new Date().toDateString() && <Check size={16} className="text-white" />}
                        </button>
                        <button
                          onClick={() => deleteHabit(habit.id)}
                          className="text-white/50 hover:text-red-400 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="text-white font-medium mb-1">{habit.name}</div>
                      <div className="flex items-center gap-1 text-orange-300 text-sm">
                        <Flame size={14} />
                        <span>{habit.streak} day streak</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Focus Timer */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="text-yellow-300" size={24} />
                <h3 className="text-xl font-bold text-white">Focus Timer</h3>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-4">
                  {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
                </div>
                <div className="flex gap-2 mb-4">
                  {[15, 25, 45].map(min => (
                    <button
                      key={min}
                      onClick={() => setFocusTime(min)}
                      className={`flex-1 py-2 rounded-xl transition-all ${
                        focusTime === min
                          ? 'bg-white/30 text-white'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      {min}m
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={isTimerRunning ? () => setIsTimerRunning(false) : startFocusTimer}
                    className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-xl py-3 font-semibold transition-all duration-300"
                  >
                    {isTimerRunning ? 'Pause' : 'Start'}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="bg-white/20 hover:bg-white/30 text-white rounded-xl px-4 transition-all duration-300"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Today's Events */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-pink-300" size={24} />
                  <h3 className="text-xl font-bold text-white">Today's Events</h3>
                </div>
                <button
                  onClick={() => setShowEventInput(!showEventInput)}
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all duration-300"
                >
                  <Plus size={20} />
                </button>
              </div>

              {showEventInput && (
                <div className="mb-4 space-y-2">
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="Event title"
                    className="w-full bg-white/20 text-white placeholder-white/50 border border-white/30 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="w-full bg-white/20 text-white border border-white/30 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button
                    onClick={addEvent}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-xl py-2 transition-all duration-300"
                  >
                    Add Event
                  </button>
                </div>
              )}

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {todayEvents.length === 0 ? (
                  <div className="text-center text-white/60 py-6">
                    <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No events today</p>
                  </div>
                ) : (
                  todayEvents.map(event => (
                    <div
                      key={event.id}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between hover:bg-white/20 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Clock size={16} className="text-pink-300" />
                        <div>
                          <div className="text-white font-medium">{event.title}</div>
                          <div className="text-white/70 text-sm">{event.time}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="text-white/50 hover:text-red-400 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Motivational Quote */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-blue-300" size={24} />
                <h3 className="text-xl font-bold text-white">Daily Inspiration</h3>
              </div>
              <p className="text-white/90 text-lg italic leading-relaxed">"{quote}"</p>
            </div>

            {/* Quick Notes */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="text-green-300" size={24} />
                <h3 className="text-xl font-bold text-white">Quick Notes</h3>
              </div>
              <textarea
                value={quickNotes}
                onChange={(e) => setQuickNotes(e.target.value)}
                placeholder="Jot down quick thoughts..."
                className="w-full bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-white/50 min-h-32 resize-none"
              />
              <div className="text-white/50 text-xs mt-2">Auto-saves as you type</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/60 text-sm">
          <p>V2.0 - Your Personal Command Center 🚀</p>
        </div>
      </div>
    </div>
  );
}
