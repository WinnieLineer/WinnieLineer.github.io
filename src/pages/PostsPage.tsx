import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { getPosts, Post } from '../lib/api';

// ─── Shimmer Skeleton ────────────────────────────────────────────────────────
const Skeleton = () => (
    <div className="animate-pulse space-y-6">
    {/* Hero skeleton */}
    <div className="h-64 rounded-3xl bg-white/50" />
    {/* Grid skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-52 rounded-2xl bg-white/50" />
      ))}
    </div>
  </div>
);

// ─── Animated "in-view" hook ─────────────────────────────────────────────────
const useInView = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
};

// ─── Featured (first) post card ──────────────────────────────────────────────
const FeaturedCard = ({ post, index }: { post: Post; index: number }) => {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <Link to={`/posts/${post.slug}`} className="group block">
        <div className="relative rounded-3xl overflow-hidden border border-[#d98d55]/25 bg-[#fff6df]/85 backdrop-blur-sm p-8 md:p-12 transition-all duration-500 hover:border-[#ff8a4c]/60 hover:shadow-[0_18px_36px_rgba(211,119,53,0.18)] hover:-translate-y-1">
          {/* Background glow orb */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#ffb51b]/20 blur-3xl pointer-events-none group-hover:bg-[#ff8a4c]/30 transition-all duration-700" />
          {/* Scan line on hover */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff8a4c] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative flex flex-col md:flex-row md:items-center gap-8">
            {/* Index number */}
            <div
              className="shrink-0 text-[8rem] md:text-[10rem] font-black leading-none select-none pointer-events-none"
              style={{
                WebkitTextStroke: '1px rgba(126,70,34,0.22)',
                color: 'transparent',
                transition: 'all 0.4s ease',
              }}
            >
              01
            </div>

            <div className="flex-1 min-w-0">
              {/* Featured badge */}
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#b45309] bg-[#fff0bd] border border-[#f5b427]/45 px-3 py-1 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff7b54] animate-pulse" />
                Featured
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-[#62331d] group-hover:text-[#e65d49] transition-colors duration-300 mb-3 leading-snug">
                {post.title}
              </h2>
              <p className="text-[#795943] leading-relaxed mb-5 line-clamp-2">{post.excerpt}</p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm text-[#94715b]">
                  {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs bg-[#e5f5c8] border border-[#84a947]/35 text-[#557326] px-2.5 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="shrink-0 w-12 h-12 rounded-full border border-[#d98d55]/30 flex items-center justify-center text-[#94715b] group-hover:border-[#ff7b54] group-hover:text-[#e65d49] group-hover:bg-[#ffe4c6] transition-all duration-300 self-end md:self-auto">
              ↗
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

// ─── Regular post card ───────────────────────────────────────────────────────
const PostCard = ({ post, num, delay = 0 }: { post: Post; num: number; delay?: number }) => {
  const { ref, visible } = useInView();
  const numStr = String(num).padStart(2, '0');

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        transitionDelay: `${delay}ms`,
      }}
    >
      <Link to={`/posts/${post.slug}`} className="group block h-full">
        <div className="relative h-full rounded-2xl overflow-hidden border border-[#d98d55]/22 bg-[#fff8e8]/80 backdrop-blur-sm p-7 flex flex-col gap-4 transition-all duration-400 hover:border-[#ff8a4c]/55 hover:bg-[#fffdf6] hover:shadow-[0_12px_28px_rgba(211,119,53,0.15)] hover:-translate-y-1">
          {/* Corner glow */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#ffcc4d]/25 blur-2xl pointer-events-none group-hover:bg-[#ff8a4c]/25 transition-all duration-500 translate-x-8 -translate-y-8" />

          {/* Number */}
          <span
            className="text-5xl font-black leading-none select-none"
            style={{ WebkitTextStroke: '1px rgba(126,70,34,0.2)', color: 'transparent' }}
          >
            {numStr}
          </span>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            <h2 className="text-lg font-bold text-[#62331d] group-hover:text-[#e65d49] transition-colors duration-300 leading-snug mb-2">
              {post.title}
            </h2>
            <p className="text-sm text-[#795943] leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[#d98d55]/15">
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[10px] bg-[#e5f5c8] text-[#557326] px-2 py-0.5 rounded-full border border-[#84a947]/25">
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-xs text-[#94715b] shrink-0 ml-2">
              {new Date(post.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
          </div>

          {/* Bottom glow line on hover */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#ff8a4c] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </Link>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export const PostsPage = () => {
  const { data: posts, isLoading, error } = useQuery({ queryKey: ['posts'], queryFn: getPosts });

  const featured = posts?.[0];
  const rest = posts?.slice(1) ?? [];

  return (
    <div className="toyland-page relative">
      <div className="relative max-w-5xl mx-auto px-6 pt-32 pb-32">

        {/* ── Page header ────────────────────────────────── */}
        <div className="mb-16 text-center">
          <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: 'rgba(211,119,53,0.75)' }}>Writing</p>
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight leading-none" style={{ color: '#3d1f10' }}>
            Tech{' '}
            <span
              className="glitch"
              data-text="Posts"
              style={{ color: '#e07a3a' }}
            >
              Posts
            </span>
          </h1>
          <p className="max-w-md mx-auto" style={{ color: '#6b4530' }}>
            Deep dives into backend engineering, distributed systems, and fintech infrastructure.
          </p>
          {/* Divider */}
          <div className="mt-8 w-24 h-px bg-gradient-to-r from-transparent via-[#e07a3a] to-transparent mx-auto" />
        </div>

        {/* ── Loading ─────────────────────────────────────── */}
        {isLoading && <Skeleton />}

        {/* ── Error ───────────────────────────────────────── */}
        {error && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <span className="text-4xl mb-4">⚠️</span>
            <p className="text-red-400 font-semibold">Failed to load posts.</p>
            <p className="text-gray-600 text-sm mt-2">Check the console for details.</p>
          </div>
        )}

        {/* ── Empty ───────────────────────────────────────── */}
        {!isLoading && !error && posts?.length === 0 && (
          <div className="text-center py-32 text-gray-600">No posts yet — check back soon.</div>
        )}

        {/* ── Content ─────────────────────────────────────── */}
        {!isLoading && !error && posts && posts.length > 0 && (
          <div className="space-y-8">
            {/* Featured */}
            {featured && <FeaturedCard post={featured} index={0} />}

            {/* Rest grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {rest.map((post, i) => (
                  <PostCard key={post.slug} post={post} num={i + 2} delay={i * 80} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Count line */}
        {posts && posts.length > 0 && (
          <p className="text-center text-xs mt-16 tracking-widest uppercase" style={{ color: '#8b5a40' }}>
            {posts.length} article{posts.length !== 1 ? 's' : ''} published
          </p>
        )}
      </div>
    </div>
  );
};
