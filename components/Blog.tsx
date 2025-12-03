import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BlogSectionProps, BlogPost } from '../types';
import SectionHeader from './SectionHeader';
import BlogCard from './BlogCard';

interface ExtendedBlogSectionProps extends BlogSectionProps {
  count?: number;
}

const Blog: React.FC<ExtendedBlogSectionProps> = ({ 
  title = "Aktuelle Einblicke",
  subtitle = "Unser Blog",
  posts: initialPosts,
  count
}) => {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts || []);

  useEffect(() => {
    if (!initialPosts && count) {
      fetch('/content/blog/index.json')
        .then(res => res.json())
        .then(data => {
          setPosts(data.slice(0, count));
        })
        .catch(console.error);
    }
  }, [initialPosts, count]);

  return (
    <section className="py-24 bg-slate-50" aria-labelledby="blog-heading">
      <div className="container mx-auto px-4 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <SectionHeader 
            title={<span data-cc-field="title">{title}</span>} 
            subtitle={<span data-cc-field="subtitle">{subtitle}</span>}
            align="left"
            id="blog-heading"
            className="mb-0" // Reset margin as it's handled by the parent flex
          />
          <Link to="/blog" className="text-orange-700 hover:text-orange-900 font-bold flex items-center gap-2 group transition-colors shrink-0">
            Alle Artikel ansehen <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
