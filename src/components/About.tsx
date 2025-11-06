import React from 'react';

interface AboutProps {
  isDarkMode: boolean;
}

const About: React.FC<AboutProps> = ({ isDarkMode }) => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">About</h2>
      
      <div className={`space-y-4 text-sm leading-relaxed ${
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        <p>
          Hello, World! I am Vansh Bhardwaj — a Computer Science undergraduate passionate about creating 
          innovative software solutions with cutting-edge AI/ML technologies and scalable system architectures.
        </p>
        
        <p>
          Currently pursuing B.Tech in Computer Science (Data Science) at Bennett University, I have hands-on 
          experience in full-stack development, machine learning, and cloud technologies. I've worked as a 
          Software Development Intern at NEC Corporation and ML Research Intern at Personifwy Corporation.
        </p>
        
        <p>
          My notable projects include <a href="https://earnest-lily-d8de35.netlify.app" className="text-blue-500 hover:underline font-medium">Career Quest</a>, 
          a microservices-based goal management platform, and an{' '}
          <a href="#" className="text-blue-500 hover:underline font-medium">AI Mock Interview SaaS</a> platform 
          with advanced question generation and scoring capabilities.
        </p>
        
        <p>
          I've achieved recognition in competitive programming and hackathons, including Smart India Hackathon 
          (Top 52/400) and Flipkart Grid 2 qualifier. I'm also working on ML research with a paper currently 
          under peer review at a top-tier AI conference, focusing on scalable ML systems.
        </p>
        
        <p className="text-blue-600 font-medium">
          Let's connect and collaborate!
        </p>
      </div>
    </section>
  );
};

export default About;