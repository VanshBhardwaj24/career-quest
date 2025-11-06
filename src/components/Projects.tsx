import React from 'react';
import { ExternalLink, Github } from 'lucide-react';

interface ProjectsProps {
  isDarkMode: boolean;
}

const Projects: React.FC<ProjectsProps> = ({ isDarkMode }) => {
  const projects = [
    {
      title: "Career Quest",
      subtitle: "Goal Management App",
      description: "Built a microservices-based goal management platform with API Gateway + Service Registry. Implemented real-time updates using WebSocket + Redis Pub/Sub for collaborative tracking.",
      technologies: ["Spring Boot", "React.js", "Redis", "WebSocket", "Docker"],
      github: "https://github.com/vanshbhardwaj24/career-quest",
      live: "https://earnest-lily-d8de35.netlify.app",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
    },
    {
      title: "AI Mock Interview",
      subtitle: "SaaS Platform",
      description: "Developed an AI interviewer with question generation, scoring, and structured feedback. Integrated semantic retrieval with Pinecone for personalized Q&A.",
      technologies: ["LangChain", "Streamlit", "Pinecone", "FastAPI"],
      github: "https://github.com/yourgithub/ai-mock-interview",
      live: "https://interview.nicobytes.com/",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg"
    },
    {
      title: "3D Commerce",
      subtitle: "Interactive Storefront",
      description: "Built a 3D e-commerce landing page with product showcases, interactions, and smooth animations. Used Three.js + GSAP for immersive browsing experience.",
      technologies: ["Next.js", "Three.js", "GSAP", "Vercel"],
      github: "https://github.com/VanshBhardwaj24/3d-commerce",
      live: "https://3d-commerce.vercel.app",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
    },
    {
      title: "TeleMonetize",
      subtitle: "Telegram Monetization SaaS",
      description: "Comprehensive SaaS platform for Telegram channel monetization with analytics, subscriber management, and automated payment processing. Features real-time dashboard and multi-channel support.",
      technologies: ["Node.js", "React", "Telegram Bot API", "Stripe", "MongoDB"],
      github: "https://github.com/vanshbhardwaj24/telemonetize",
      live: "https://telemonetize.vercel.app",
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg"
    }
  ];

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Featured Projects</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div
            key={index}
            className={`group overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
                : 'bg-white border-gray-200 hover:shadow-md'
            }`}
          >
            <div className="relative">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-black bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all"
                >
                  <Github className="w-4 h-4 text-white" />
                </a>
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-black bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all"
                >
                  <ExternalLink className="w-4 h-4 text-white" />
                </a>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-bold text-lg group-hover:text-blue-500 transition-colors">
                  {project.title}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {project.subtitle}
                </p>
              </div>
              
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className={`px-2 py-1 rounded-md text-xs ${
                      isDarkMode 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;