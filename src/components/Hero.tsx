import React from 'react';
import { CheckCircle, Volume2, Code, MapPin, Phone, Mail, Globe, User } from 'lucide-react';

interface HeroProps {
  isDarkMode: boolean;
}

const Hero: React.FC<HeroProps> = ({ isDarkMode }) => {
  return (
    <section className="text-center space-y-8">
      {/* Logo */}
      <div className="flex justify-center mb-12">
        <div className={`w-16 h-16 grid grid-cols-4 gap-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          <div className="bg-current"></div>
          <div className="bg-current"></div>
          <div className=""></div>
          <div className=""></div>
          <div className="bg-current"></div>
          <div className=""></div>
          <div className="bg-current"></div>
          <div className="bg-current"></div>
          <div className="bg-current"></div>
          <div className=""></div>
          <div className="bg-current"></div>
          <div className="bg-current"></div>
          <div className="bg-current"></div>
          <div className="bg-current"></div>
          <div className=""></div>
          <div className=""></div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8">
        <div className="relative">
          <img
            src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">
            🇻🇳
          </div>
        </div>
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
            <h1 className="text-2xl font-bold">Vansh Bhardwaj</h1>
            <CheckCircle className="w-5 h-5 text-blue-500" />
            <Volume2 className="w-4 h-4 text-gray-400" />
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Computer Science Undergraduate</p>
        </div>
      </div>

      {/* Contact Info */}
      <div className={`max-w-md mx-auto space-y-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <div className="flex items-center space-x-3">
          <Code className="w-4 h-4 text-gray-400" />
          <span>Software Development Intern @NEC Corporation</span>
        </div>
        <div className="flex items-center space-x-3">
          <User className="w-4 h-4 text-gray-400" />
          <span>ML Research Intern @Personifwy Corporation</span>
        </div>
        <div className="flex items-center space-x-3">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>New Delhi, India</span>
        </div>
        <div className="flex items-center space-x-3">
          <Phone className="w-4 h-4 text-gray-400" />
          <span>+91 83840-94377</span>
        </div>
        <div className="flex items-center space-x-3">
          <Mail className="w-4 h-4 text-gray-400" />
          <span>vanshb767@gmail.com</span>
        </div>
        <div className="flex items-center space-x-3">
          <Globe className="w-4 h-4 text-gray-400" />
          <span>vansh-bhardwaj-portfolio-web.vercel.app</span>
        </div>
        <div className="flex items-center space-x-3">
          <User className="w-4 h-4 text-gray-400" />
          <span>he/him</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;