import Clock from './components/Clock';
import TodoList from './components/TodoList';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-6 text-white">
      {/* Glassmorphism Container */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 w-full max-w-2xl shadow-2xl">
        
        <header className="text-center mb-8">
          <Clock />
          <h1 className="text-xl font-light tracking-widest uppercase mt-2 opacity-80">Personal Command Center</h1>
        </header>

        <section className="space-y-6">
          <TodoList />
        </section>

      </div>
      
      <footer className="mt-8 text-sm opacity-60">
        V1.0 - Built by [Your Name]
      </footer>
    </main>
  );
}
