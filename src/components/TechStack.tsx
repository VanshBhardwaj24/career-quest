import React from 'react';

interface TechStackProps {
  isDarkMode: boolean;
}

const TechStack: React.FC<TechStackProps> = ({ isDarkMode }) => {
  const technologies = [
    { name: 'JavaScript', color: '#F7DF1E', symbol: 'JS' },
    { name: 'TypeScript', color: '#3178C6', symbol: 'TS' },
    { name: 'Python', color: '#3776AB', symbol: '🐍' },
    { name: 'SQL', color: '#336791', symbol: 'SQL' },
    { name: 'Java', color: '#ED8B00', symbol: '☕' },
    { name: 'Node.js', color: '#339933', symbol: 'JS' },
    { name: 'React', color: '#61DAFB', symbol: '⚛️' },
    { name: 'Next.js', color: '#000000', symbol: 'N' },
    { name: 'Spring Boot', color: '#6DB33F', symbol: 'SB' },
    { name: 'Tailwind CSS', color: '#06B6D4', symbol: '🎨' },
    { name: 'TensorFlow', color: '#FF6F00', symbol: 'TF' },
    { name: 'PyTorch', color: '#EE4C2C', symbol: 'PT' },
    { name: 'LangChain', color: '#1C3A3A', symbol: 'LC' },
    { name: 'PostgreSQL', color: '#336791', symbol: '🐘' },
    { name: 'MySQL', color: '#4479A1', symbol: 'SQL' },
    { name: 'Redis', color: '#DC382D', symbol: 'R' },
    { name: 'Docker', color: '#2496ED', symbol: '🐳' },
    { name: 'AWS', color: '#232F3E', symbol: '☁️' },
    { name: 'Google Cloud', color: '#4285F4', symbol: 'GCP' },
    { name: 'Git', color: '#F05032', symbol: '📝' },
    { name: 'VS Code', color: '#007ACC', symbol: '💻' },
    { name: 'Jupyter', color: '#F37626', symbol: 'J' },
    { name: 'Three.js', color: '#000000', symbol: '3D' }
  ];

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Stack</h2>
      
      <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-4">
        {technologies.map((tech, index) => (
          <div
            key={index}
            className={`group relative p-3 rounded-xl border transition-all duration-200 hover:scale-105 cursor-pointer ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
                : 'bg-white border-gray-200 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-center">
              {tech.symbol.length <= 2 ? (
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: tech.color }}
                >
                  {tech.symbol}
                </div>
              ) : (
                <div className="text-2xl">
                  {tech.symbol}
                </div>
              )}
            </div>
            
            {/* Tooltip */}
            <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 ${
              isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-800 text-white'
            }`}>
              {tech.name}
              <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent ${
                isDarkMode ? 'border-t-gray-900' : 'border-t-gray-800'
              }`}></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechStack;