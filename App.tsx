
import React from 'react';
import { HashRouter, Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import CourseTools from './pages/CourseTools';
import LorenzCurveTool from './pages/tools/LorenzCurveTool';
import PensionSimulator from './pages/tools/PensionSimulator';

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:rotate-12 transition-transform">
              FT
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">财税工具集</span>
          </Link>
          <div className="flex items-center gap-6">
            {!isHome && (
              <Link to="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                返回首页
              </Link>
            )}
            <div className="hidden md:flex items-center gap-4">
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/course/:courseId" element={<CourseTools />} />
            <Route path="/tools/lorenz-curve" element={<LorenzCurveTool />} />
            <Route path="/tools/pension-simulator" element={<PensionSimulator />} />
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center h-full pt-20">
                <h2 className="text-2xl font-bold text-slate-800">页面开发中...</h2>
                <Link to="/" className="mt-4 text-indigo-600 hover:underline">返回首页</Link>
              </div>
            } />
          </Routes>
        </main>
        <footer className="bg-white border-t border-slate-200 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} 财税教育科研实验室 - 专业教学辅助工具
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
