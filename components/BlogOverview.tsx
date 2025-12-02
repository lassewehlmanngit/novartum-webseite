import React, { useState, useEffect } from 'react';
import { BlogData, BlogPost } from '../types';
import BlogCard from './BlogCard';
import { Search } from 'lucide-react';

interface BlogOverviewProps {
  data?: BlogData;
}

const BlogOverview: React.FC<BlogOverviewProps> = ({ data: initialData }) => {
  const [posts, setPosts] = useState<BlogPost[]>(initialData?.posts || []);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!initialData) {
      fetch('/content/blog/index.json')
        .then(res => res.json())
        .then(setPosts)
        .catch(console.error);
    }
  }, [initialData]);

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];

  // Filter posts
  const filteredPosts = posts.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  return (
    <div className="bg-slate-50 min-h-screen pb-24" id="latest">
      {/* Header Section */}
      <div className="container mx-auto px-4 md:px-12 pt-12 mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
             {categories.map(cat => (
               <button
                 key={cat}
                 onClick={() => setSelectedCategory(cat)}
                 className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                   selectedCategory === cat 
                   ? 'bg-orange-700 text-white shadow-md' 
                   : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                 }`}
               >
                 {cat}
               </button>
             ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
             <input 
               type="text" 
               placeholder="Artikel suchen..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
             />
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-12">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Featured Post (Only show if 'All' is selected or it matches category) */}
          {featuredPost && (
            <BlogCard post={featuredPost} featured={true} />
          )}

          {/* Regular Posts */}
          {regularPosts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-slate-500 text-lg">Keine Artikel in dieser Kategorie gefunden.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogOverview;
