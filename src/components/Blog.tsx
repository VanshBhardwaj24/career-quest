import React from 'react';

interface BlogProps {
  isDarkMode: boolean;
}

const Blog: React.FC<BlogProps> = ({ isDarkMode }) => {
  const blogPosts = [
    {
      title: "ML Research Paper Under Peer Review",
      date: "15.12.2024",
      image: "https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg",
      isNew: true
    },
    {
      title: "Smart India Hackathon - Top 52/400 Teams",
      date: "10.11.2024", 
      image: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg",
      isNew: true
    },
    {
      title: "Blockchain Week Lead - 100+ Participants",
      date: "25.09.2024",
      image: "https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg",
      isNew: false
    },
    {
      title: "Google Cloud LLMs Certification",
      date: "15.08.2024",
      image: "https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg",
      isNew: false
    }
  ];

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Blog</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogPosts.map((post, index) => (
          <article
            key={index}
            className={`group cursor-pointer overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
                : 'bg-white border-gray-200 hover:shadow-md'
            }`}
          >
            <div className="relative">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {post.isNew && (
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                  New
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
            
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-500 transition-colors">
                {post.title}
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {post.date}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Blog;