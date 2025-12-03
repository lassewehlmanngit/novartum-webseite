import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { BlogPost } from '../types';
import { ArrowLeft, Calendar, User, Clock, Share2, Tag, BookOpen } from 'lucide-react';
import FAQ from './FAQ';
import BlogCard from './BlogCard';
import frontMatter from 'front-matter';
import ReactMarkdown from 'react-markdown';
import SEO from './SEO';

interface BlogPostReaderProps {
  posts?: BlogPost[];
}

const BlogPostReader: React.FC<BlogPostReaderProps> = ({ posts: initialPosts }) => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Scroll to top when slug changes
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (initialPosts && slug) {
      const found = initialPosts.find(p => p.slug === slug);
      if (found) {
        setPost(found);
        setLoading(false);
        return;
      }
    }

    if (slug) {
      // Fetch markdown file
      fetch(`/content/blog/${slug}.md`)
        .then(res => {
          if (!res.ok) throw new Error('Post not found');
          return res.text();
        })
        .then(text => {
          // Parse Front Matter
          const { attributes, body } = frontMatter(text);
          // Map to BlogPost interface
          const blogPost: BlogPost = {
            id: slug,
            slug: slug,
            ...attributes as any,
            imageUrl: attributes.image || attributes.imageUrl,
            content: body // Keep body as markdown for rendering
          };
          setPost(blogPost);
          setLoading(false);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    }
  }, [slug, initialPosts]);

  // Fetch Related Posts
  useEffect(() => {
    if (post) {
        fetch('/content/blog/index.json')
            .then(res => res.json())
            .then((allPosts: BlogPost[]) => {
                // Filter out current post
                const otherPosts = allPosts.filter(p => p.slug !== post.slug);
                // Simple algorithm: same category or random
                const related = otherPosts.filter(p => p.category === post.category).slice(0, 3);
                
                // If not enough related, fill with recent
                if (related.length < 3) {
                    const remaining = 3 - related.length;
                    const recent = otherPosts.filter(p => !related.includes(p)).slice(0, remaining);
                    setRelatedPosts([...related, ...recent]);
                } else {
                    setRelatedPosts(related);
                }
            })
            .catch(console.error);
    }
  }, [post]);

  if (loading) return <div className="min-h-screen bg-white pt-32 text-center">Laden...</div>;
  if (error || !post) return <Navigate to="/blog" replace />;

  // Schema Markup (JSON-LD)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": [post.imageUrl],
    "datePublished": post.isoDate,
    "author": {
      "@type": "Person",
      "name": post.author,
      "jobTitle": post.authorRole
    },
    "publisher": {
      "@type": "Organization",
      "name": "Novartum",
      "logo": {
        "@type": "ImageObject",
        "url": "https://novartum.com/logo.png"
      }
    },
    "description": post.excerpt,
    "articleBody": post.tldr + " " + post.excerpt
  };

  const faqSchema = post.faq ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faq.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  } : null;

  return (
    <article 
      className="bg-white min-h-screen pt-32 pb-24"
      data-cc-path={`/content/blog/${slug}.md`}
    >
      <SEO 
        title={post.title} 
        description={post.excerpt}
        image={post.imageUrl}
        type="article"
        author={post.author}
        keywords={post.tags}
      />
      {/* Inject Schema into head */}
      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}

      {/* Reading Progress Bar (Visual Mockup) */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-slate-100">
        <div className="h-full bg-orange-600 w-1/3"></div>
      </div>

      <div className="container mx-auto px-4 md:px-12 max-w-4xl">
        
        {/* Breadcrumb / Back */}
        <Link to="/blog" className="inline-flex items-center text-slate-500 hover:text-orange-700 font-bold text-sm mb-8 transition-colors group">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Zurück zur Übersicht
        </Link>

        {/* Header */}
        <header className="mb-12 text-center">
           <div className="flex items-center justify-center gap-2 mb-6">
             <span 
               className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
               data-cc-field="category"
             >
               {post.category}
             </span>
             <span className="text-slate-400">•</span>
             <span className="text-slate-500 text-sm font-medium flex items-center gap-1">
                <Clock size={14}/> <span data-cc-field="readTime">{post.readTime}</span> Lesezeit
             </span>
           </div>

           <h1 
             className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-tight"
             data-cc-field="title"
           >
             {post.title}
           </h1>

           <div className="flex items-center justify-center gap-6 border-y border-slate-100 py-6">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                    <User size={24} className="text-slate-400"/>
                 </div>
                 <div className="text-left">
                    <p className="font-bold text-slate-900 text-sm" data-cc-field="author">{post.author}</p>
                    <p className="text-slate-500 text-xs" data-cc-field="authorRole">{post.authorRole}</p>
                 </div>
              </div>
              <div className="hidden md:block w-px h-10 bg-slate-200"></div>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                 <Calendar size={16} />
                 <span data-cc-field="date">{post.date}</span>
              </div>
           </div>
        </header>

        {/* Featured Image */}
        <div className="rounded-3xl overflow-hidden shadow-2xl mb-12 max-h-[500px]">
           <img 
             src={post.imageUrl} 
             alt={post.title} 
             className="w-full h-full object-cover" 
             data-cc-field="imageUrl"
           />
        </div>

        {/* AI / TLDR Box */}
        <div className="bg-slate-50 border-l-4 border-orange-500 p-6 md:p-8 rounded-r-xl mb-12 shadow-sm">
           <div className="flex items-center gap-2 text-orange-700 font-bold mb-3 uppercase tracking-widest text-xs">
              <BookOpen size={16} /> Key Takeaways
           </div>
           <p className="text-lg text-slate-700 font-medium leading-relaxed italic" data-cc-field="tldr">
             "{post.tldr}"
           </p>
        </div>

        {/* Content Body - Render Markdown */}
        <div className="prose prose-lg prose-slate mx-auto mb-16 focus:outline-none" data-cc-field="content">
          <ReactMarkdown
            components={{
                img: ({node, ...props}) => <img {...props} className="rounded-xl shadow-lg my-8" />
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Blog FAQ Section */}
        {post.faq && post.faq.length > 0 && (
          <div className="mb-16 border-t border-slate-200 pt-10">
            <FAQ 
              title="Fragen zum Thema" 
              subtitle="FAQ" 
              items={post.faq.map(f => ({ question: f.question, answer: f.answer }))}
            />
          </div>
        )}

        {/* Footer / Tags */}
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
           <div className="flex flex-wrap gap-2">
             {post.tags && post.tags.map(tag => (
               <span key={tag} className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-slate-200 transition-colors cursor-pointer">
                 <Tag size={14} className="mr-1 opacity-50"/> {tag}
               </span>
             ))}
           </div>
           
           <button className="flex items-center gap-2 text-slate-600 hover:text-orange-700 font-bold transition-colors">
              <Share2 size={18} /> Artikel teilen
           </button>
        </div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
            <div className="border-t border-slate-200 pt-16 mt-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-8">Das könnte Sie auch interessieren</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {relatedPosts.map(rp => (
                        <BlogCard key={rp.id} post={rp} />
                    ))}
                </div>
            </div>
        )}

      </div>
    </article>
  );
};

export default BlogPostReader;
