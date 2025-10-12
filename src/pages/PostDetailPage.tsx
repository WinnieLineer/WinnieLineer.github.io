import { useParams, useNavigate } from 'react-router-dom';
import { posts } from './PostsPage';

export const PostDetailPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const post = posts.find(p => p.id === Number(postId));

  const handleBack = () => {
    navigate(-1); // Go back to the previous page in history
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 pt-24">
        <div className="glass-morphism p-12 text-center animate-fade-in-up">
          <h1 className="text-4xl font-bold text-red-400 mb-4">Post Not Found</h1>
          <p className="text-lg text-gray-300 mb-8">Sorry, we couldn't find the post you're looking for.</p>
          {/* Add relative and z-10 to ensure the button is clickable */}
          <button onClick={handleBack} className="relative z-10 bg-violet-600/50 hover:bg-violet-500/50 border border-violet-400 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105">
            ← Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 pt-32">
      <div className="container mx-auto max-w-3xl animate-fade-in-up">
        <div className="glass-morphism p-8 md:p-12">
          {/* Add relative and z-10 to ensure the button is clickable */}
          <button onClick={handleBack} className="relative z-10 text-violet-300 hover:text-white transition-colors mb-8 inline-block">
            &larr; Back to Blog
          </button>
          <article>
            <header className="mb-8 border-b border-white/10 pb-8">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{post.title}</h1>
              <p className="text-md text-gray-400">{post.date}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs bg-white/10 text-violet-300 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </header>
            
            {post.content}

          </article>
        </div>
      </div>
    </div>
  );
};