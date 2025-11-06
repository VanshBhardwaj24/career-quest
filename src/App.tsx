import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SocialLinks from './components/SocialLinks';
import About from './components/About';
import TechStack from './components/TechStack';
import Blog from './components/Blog';
import Projects from './components/Projects';
import Experience from './components/Experience';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-16">
        <Hero isDarkMode={isDarkMode} />
        <SocialLinks isDarkMode={isDarkMode} />
        <About isDarkMode={isDarkMode} />
        <TechStack isDarkMode={isDarkMode} />
        <Projects isDarkMode={isDarkMode} />
        <Blog isDarkMode={isDarkMode} />
        <Experience isDarkMode={isDarkMode} />
      </main>
    </div>
  );
}

export default App;