import React from 'react';
import { ExternalLink, Github, Youtube } from 'lucide-react';

interface SocialLinksProps {
  isDarkMode: boolean;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ isDarkMode }) => {
  const socialLinks = [
    {
      name: 'LinkedIn',
      handle: 'Vansh-Bhardwaj-Student',
      icon: '💼',
      color: 'bg-blue-600'
    },
    {
      name: 'GitHub',
      handle: 'VanshBhardwaj24',
      icon: <Github className="w-6 h-6 text-white" />,
      color: 'bg-gray-900'
    },
    {
      name: 'Portfolio',
      handle: 'vansh-bhardwaj-portfolio-web.vercel.app',
      icon: '🌐',
      color: 'bg-green-600'
    },
    {
      name: 'Email',
      handle: 'vanshb767@gmail.com',
      icon: '📧',
      color: 'bg-red-600'
    },
    {
      name: 'Google Cloud',
      handle: 'Certified',
      icon: '☁️',
      color: 'bg-blue-500'
    },
    {
      name: 'Research',
      handle: 'ML Paper Under Review',
      icon: '📄',
      color: 'bg-purple-600'
    }
  ];

  return (
    <section className="space-y-6">
      <div className="text-center">
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>he/him</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {socialLinks.map((link, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-lg cursor-pointer group ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
                : 'bg-white border-gray-200 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${link.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                  {typeof link.icon === 'string' ? link.icon : link.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{link.name}</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {link.handle}
                  </p>
                </div>
              </div>
              <ExternalLink className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SocialLinks;