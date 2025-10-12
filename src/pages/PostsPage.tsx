import { Link } from 'react-router-dom';
import React from 'react';

// The article content is defined as a JSX element for rich formatting
const articleContent = (
  <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed">
    <p className="lead">Yup, you're not dreaming. For the price of a latte, you can:</p>
    <ul>
      <li>Own a custom domain (like winnie-lin.space)</li>
      <li>Send and receive email using that domain (like hi@winnie-lin.space)</li>
      <li>Host a personal website (for free!)</li>
    </ul>
    <p>No monthly hosting fee. No complicated tech knowledge required. Just follow these chill steps:</p>

    <h3 className="text-2xl font-bold text-violet-300 mt-8 mb-4">Step 1: Buy a Domain (NT$37 Deal!)</h3>
    <p>Go to <a href="https://www.godaddy.com/" target="_blank" rel="noopener noreferrer">GoDaddy</a> and search for a <code>.space</code> domain—like <code>winnie-lin.space</code>. First-year price is usually NT$37!</p>
    <p className="text-sm text-amber-300/80">⚠️ <strong>Heads-up:</strong> Renewal price jumps after the first year. You can disable auto-renew if you're just testing the waters.</p>
    <p>Also, after buying, bookmark the DNS Settings page. You'll need it soon.</p>

    <h3 className="text-2xl font-bold text-violet-300 mt-8 mb-4">Step 2: Free Email Forwarding with ImprovMX</h3>
    <p>Register on <a href="https://improvmx.com/" target="_blank" rel="noopener noreferrer">improvmx.com</a>, add your domain, and forward mail to your personal mailbox. Then, update DNS on GoDaddy with these records:</p>
    <pre><code>MX Record: mx1.improvmx.com (priority 10)
MX Record: mx2.improvmx.com (priority 20)
TXT Record (SPF): v=spf1 include:improvmx.com include:_spf.google.com ~all</code></pre>
    <p>This makes sure you can receive emails sent to <code>hi@winnie-lin.space</code>.</p>

    <h3 className="text-2xl font-bold text-violet-300 mt-8 mb-4">Step 3: Send Email as hi@winnie-lin.space from Gmail</h3>
    <p>Open Gmail → Settings → Accounts and Import. Under "Send mail as", click "Add another email address" and fill in the details:</p>
    <pre><code>SMTP server: smtp.improvmx.com, Port: 587
Username: your gmail account
Password: (your gmail password)</code></pre>
    <p>Done! You can now choose <code>hi@winnie-lin.space</code> when composing emails.</p>

    <h3 className="text-2xl font-bold text-violet-300 mt-8 mb-4">Step 4: Build a Free Website with GitHub Pages</h3>
    <p>Create a GitHub Repo, upload your static site (HTML, CSS, etc.), then go to Repo Settings → Pages to enable GitHub Pages. GitHub gives you a public URL like <code>https://yourusername.github.io/blog/</code>.</p>

    <h3 className="text-2xl font-bold text-violet-300 mt-8 mb-4">Step 5: Connect to blog.winnie-lin.space</h3>
    <p>Add a <code>CNAME</code> file to your project’s root folder containing just one line: <code>blog.winnie-lin.space</code>. Then, update DNS in GoDaddy with a CNAME Record:</p>
    <pre><code>Name: blog
Value: yourusername.github.io</code></pre>

    <h3 className="text-2xl font-bold text-violet-300 mt-8 mb-4">Step 6: Enable HTTPS</h3>
    <p>GitHub handles SSL for you. In your repo settings, go to Pages and check "Enforce HTTPS".</p>

    <h3 className="text-2xl font-bold text-violet-300 mt-8 mb-4">Wrap-up: You Did It!</h3>
    <p>Let’s recap. You now have a custom domain, a professional email address, a free website, and everything is secure. Ready to show off your personal brand like a boss?</p>
  </div>
);

export const posts = [
  {
    id: 1,
    title: "Set Up Your Own Domain, Email, and Website (for just NT$37!)",
    excerpt: "For the price of a latte, you can own a custom domain, send and receive email, and host a personal website for free. No monthly hosting fee required.",
    date: "October 12, 2025",
    tags: ["Domain Setup", "Email", "GitHub Pages", "Personal Branding", "Website Hosting", "DNS"],
    content: articleContent
  },
];

export const PostsPage = () => {
  return (
    <div className="min-h-screen p-8 pt-32">
      <div className="container mx-auto animate-fade-in-up">
        <h1 className="text-5xl font-bold mb-12 text-center text-white">My Tech Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map(post => (
            <Link to={`/posts/${post.id}`} key={post.id} className="block group">
              <div 
                className="glass-morphism p-8 h-full transition-all duration-300 ease-in-out group-hover:border-white/20 group-hover:shadow-violet-400/20 transform group-hover:-translate-y-2"
              >
                <p className="text-sm text-gray-400 mb-2">{post.date}</p>
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