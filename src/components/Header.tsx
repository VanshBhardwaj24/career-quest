import React from 'react';
import { Search, Github, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <header className={`sticky top-0 z-50 backdrop-blur-sm border-b transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'
    }`}>
      <div className="max-w-6xl mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 grid grid-cols-3 gap-0.5 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                <div className="bg-current"></div>
                <div className="bg-current"></div>
                <div className=""></div>
                <div className="bg-current"></div>
                <div className=""></div>
                <div className="bg-current"></div>
                <div className="bg-current"></div>
                <div className="bg-current"></div>
                <div className=""></div>
              </div>
              <span className="font-bold text-lg">Daifolio</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#about" className={`text-sm hover:text-blue-500 transition-colors ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Blog</a>
              <a href="#stack" className={`text-sm hover:text-blue-500 transition-colors ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Components</a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}>
              <Search className="w-4 h-4" />
            </button>
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ctrl K</span>
            <button className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}>
              <Github className="w-4 h-4" />
            </button>
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;