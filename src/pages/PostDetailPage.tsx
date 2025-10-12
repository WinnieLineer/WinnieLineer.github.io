import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import { getPostBySlug } from '../lib/api';

export const PostDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Fetch the single post using its slug
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => getPostBySlug(slug!),
    enabled: !!slug, // Only run the query if the slug exists
  });

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading post...</div>;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 pt-24">
        <div className="glass-morphism p-12 text-center">
          <h1 className="text-4xl font-bold text-red-400 mb-4">Post Not Found</h1>
          <p className="text-lg text-gray-300 mb-8">Sorry, we couldn't find the post you're looking for.</p>
          <button onClick={handleBack} className="relative z-10 bg-violet-600/50 hover:bg-violet-500/50 border border-violet-400 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105">
            ← Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 pt-32">
      <div className="container mx-auto max-w-3xl">
        <div className="glass-morphism p-8 md:p-12">
          <button onClick={handleBack} className="relative z-10 text-violet-300 hover:text-white transition-colors mb-8 inline-block">
            &larr; Back to Blog
          </button>
          <article>
            <header className="mb-8 border-b border-white/10 pb-8">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{post.title}</h1>
              <p className="text-md text-gray-400">{new Date(post.date).toLocaleDateString()}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs bg-white/10 text-violet-300 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </header>
            
            <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

          </article>
        </div>
      </div>
    </div>
  );
};
