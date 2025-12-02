import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, ArrowRight, Tag } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  if (featured) {
    return (
      <article className="col-span-1 md:col-span-2 lg:col-span-3 bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row group hover:shadow-2xl transition-shadow duration-300 border border-slate-100">
        <div className="md:w-1/2 relative overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              Featured
            </span>
          </div>
        </div>
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
            <span className="text-orange-600 font-bold uppercase tracking-wider">{post.category}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock size={14}/> {post.readTime}</span>
          </div>
          
          <Link to={`/blog/${post.slug}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 group-hover:text-orange-700 transition-colors">
              {post.title}
            </h2>
          </Link>
          
          <p className="text-slate-600 text-lg mb-6 line-clamp-3">
            {post.excerpt}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                 <User size={20} />
               </div>
               <div>
                 <p className="text-sm font-bold text-slate-900">{post.author}</p>
                 <p className="text-xs text-slate-500">{post.date}</p>
               </div>
            </div>
            <Link 
              to={`/blog/${post.slug}`}
              className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-orange-700 group-hover:border-orange-700 group-hover:text-white transition-all"
              aria-label="Artikel lesen"
            >
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform duration-300">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-2 py-1 rounded-md shadow-sm">
            {post.category}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1"><Clock size={12}/> {post.readTime}</span>
          <span>•</span>
          <span>{post.date}</span>
        </div>

        <Link to={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-orange-700 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-grow">
          {post.excerpt}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
           <span className="text-xs font-medium text-slate-500">{post.author}</span>
           <Link 
             to={`/blog/${post.slug}`} 
             className="text-orange-700 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all"
           >
             Lesen <ArrowRight size={14} />
           </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;