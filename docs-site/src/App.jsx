import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { IndexPage } from './pages/Index';
import { DocsPage } from './pages/Docs';
import { Logo } from './components/ui/Logo';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-green-500/20">
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Logo className="w-24 h-auto" animated={false} />
              <span className="font-semibold text-gray-400 text-sm ml-2">Docs</span>
            </Link>
            <div className="flex gap-6 items-center">
              <Link to="/" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Home</Link>
              <Link to="/docs" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Documentation</Link>
              <a href="https://touchline-football.vercel.app/" className="px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-900 transition-colors text-sm font-semibold shadow-sm" target="_blank" rel="noopener noreferrer">
                Open App
              </a>
            </div>
          </div>
        </nav>
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/docs" element={<DocsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
