import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExperienceProps {
  isDarkMode: boolean;
}

const Experience: React.FC<ExperienceProps> = ({ isDarkMode }) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([0]);

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const experiences = [
    {
      company: "NEC Corporation",
      role: "Senior Frontend Developer",
      type: "Full-time",
      period: "Jun 2024 — Jul 2024, Jun 2025 — Aug 2025",
      icon: "🚀",
      color: "text-orange-500",
      responsibilities: [
        "Engineered Java microservices architecture with Spring Boot, implementing connection pooling and caching strategies that reduced API latency by 35%",
        "Automated Docker containerization and Jenkins CI/CD pipelines, learnt unit testing frameworks (JUnit, Mockito) and reducing build failures.",
        "Collaborated with cross-functional teams to deliver scalable enterprise solutions",
        "Implemented robust error handling and monitoring systems for production environments"
      ],
      technologies: ["Java", "Spring Boot", "Docker", "Jenkins", "JUnit", "Mockito", "Microservices", "CI/CD", "API Development"]
    },
    {
      company: "Personifwy Corporation",
      role: "ML Research Intern",
      type: "Remote",
      period: "May 2023 — Aug 2023",
      icon: "🤖",
      color: "text-purple-500",
      responsibilities: [
        "Implemented Tacotron-2 neural architecture with custom attention mechanisms, achieving 4.3 MOS score through mel-spectrogram optimization",
        "Engineered audio preprocessing pipeline using Librosa and FFmpeg, processing 75K+ samples with GPU acceleration (CUDA) for model training",
        "Developed custom loss functions and training strategies for improved speech synthesis quality",
        "Collaborated with research team to publish findings and optimize model performance"
      ],
      technologies: ["Python", "TensorFlow", "PyTorch", "Librosa", "FFmpeg", "CUDA", "Neural Networks", "Audio Processing", "Research"]
    },
    {
      company: "Bennett University",
      role: "Computer Science Student",
      type: "Full-time",
      period: "2022 — 2026",
      icon: "🎓",
      color: "text-blue-500",
      responsibilities: [
        "Pursuing B.Tech in Computer Science with specialization in Data Science",
        "Maintained strong academic performance while working on multiple technical projects",
        "Led Blockchain Week event with 100+ participants, organizing live demos and workshops",
        "Active participant in competitive programming and hackathons"
      ],
      technologies: ["Data Science", "Machine Learning", "Algorithms", "System Design", "Project Management", "Leadership"]
    }
  ];

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Experience</h2>
      
      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className={`border rounded-xl overflow-hidden transition-all duration-200 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => toggleExpanded(index)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <span className={`text-2xl ${exp.color}`}>{exp.icon}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{exp.company}</h3>
                    <p className="text-sm text-gray-500 mb-1">{exp.role}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {exp.type} • {exp.period}
                    </p>
                  </div>
                </div>
                {exp.responsibilities.length > 0 && (
                  <button className={`p-1 rounded transition-colors ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}>
                    {expandedItems.includes(index) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
            </div>
            
            {expandedItems.includes(index) && exp.responsibilities.length > 0 && (
              <div className={`px-4 pb-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="pt-4 space-y-3">
                  <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {exp.responsibilities.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {exp.technologies.length > 0 && (
                    <div className="pt-3">
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, techIndex) => (
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
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;