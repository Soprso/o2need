import { Link } from 'react-router-dom'
import blogPosts from '../data/blogs'
import { Clock, User } from 'lucide-react'

const Blogs = () => (
    <div>
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary to-[#1a6b38] text-white py-16 sm:py-20 text-center px-6">
            <div className="max-w-2xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium border border-white/30">
                    🌱 O2need Journal
                </div>
                <h1 className="text-4xl sm:text-5xl font-heading font-bold">Plant Care Blogs</h1>
                <p className="text-white/80 text-sm sm:text-base">
                    Expert tips, seasonal guides, and fresh ideas to help your plants — and your passion — thrive.
                </p>
            </div>
        </div>

        {/* Blog Grid */}
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {blogPosts.map(post => (
                    <Link key={post.id} to={`/blogs/${post.id}`} className="premium-card group overflow-hidden block">
                        <div className="relative h-52 overflow-hidden">
                            <img src={post.cover} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">{post.tag}</div>
                        </div>
                        <div className="p-5 sm:p-6 space-y-3">
                            <h3 className="font-heading font-bold text-text text-base sm:text-lg leading-snug group-hover:text-primary transition-colors">{post.title}</h3>
                            <p className="text-subtext text-xs sm:text-sm line-clamp-2 leading-relaxed">{post.excerpt}</p>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs text-subtext">
                                <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {post.author}</div>
                                <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    </div>
)

export default Blogs
