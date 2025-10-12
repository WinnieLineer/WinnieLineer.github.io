import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../lib/api'; // Import from our new API engine

export const PostsPage = () => {
  // Fetch posts using react-query
  const { data: posts, isLoading, error } = useQuery({ 
    queryKey: ['posts'], 
    queryFn: getPosts 
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading posts from GitHub...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading posts. Check the console for details.</div>;
  }

  return (
    <div className="min-h-screen p-8 pt-32">
      <div className="container mx-auto">
        <h1 className="text-5xl font-bold mb-12 text-center text-white">My Tech Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts?.map(post => (
            <Link to={`/posts/${post.slug}`} key={post.slug} className="block group">
              <div 
                className="glass-morphism p-8 h-full transition-all duration-300 ease-in-out group-hover:border-white/20 group-hover:shadow-violet-400/20 transform group-hover:-translate-y-2"
              >
                <p className="text-sm text-gray-400 mb-2">{new Date(post.date).toLocaleDateString()}</p>
                <h2 className="text-2xl font-semibold mb-3 text-gray-100 group-hover:text-violet-300 transition-colors duration-300">{post.title}</h2>
                <p className="text-gray-300 mb-4">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2 mt-auto pt-4">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs bg-white/10 text-violet-300 px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
