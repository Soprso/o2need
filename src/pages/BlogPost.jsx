import { useParams, Link, useNavigate } from 'react-router-dom'
import blogPosts from '../data/blogs'
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react'

const BlogPost = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const post = blogPosts.find(p => p.id === id)

    if (!post) return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 space-y-4">
            <p className="text-2xl font-heading font-bold text-text">Article not found</p>
            <Link to="/blogs" className="btn-primary">Back to Blogs</Link>
        </div>
    )

    const related = blogPosts.filter(p => p.id !== id).slice(0, 3)

    return (
        <div>
            {/* Cover */}
            <div className="relative h-64 sm:h-80 md:h-[480px] overflow-hidden">
                <img src={post.cover} alt={post.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white max-w-3xl mx-auto">
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">{post.tag}</span>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold mt-3 leading-tight">{post.title}</h1>
                </div>
            </div>

            {/* Meta */}
            <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
                <div className="flex flex-wrap items-center gap-4 text-sm text-subtext py-5 border-b border-gray-100">
                    <div className="flex items-center gap-1.5"><User className="w-4 h-4 text-primary" /> {post.author}</div>
                    <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> {post.date}</div>
                    <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> {post.readTime}</div>
                </div>

                {/* Excerpt */}
                <p className="text-base sm:text-lg text-subtext leading-relaxed pt-8 pb-4 italic border-l-4 border-secondary pl-4 sm:pl-6">
                    {post.excerpt}
                </p>

                {/* Content Sections */}
                <div className="space-y-8 pb-20">
                    {post.content.map((section, i) => (
                        <div key={i} className="space-y-3">
                            <h2 className="text-xl sm:text-2xl font-heading font-bold text-primary">{section.heading}</h2>
                            <p className="text-subtext leading-relaxed text-sm sm:text-base">{section.body}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Related */}
            <div className="bg-background py-16 sm:py-20">
                <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
                    <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text mb-8">More Articles</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {related.map(r => (
                            <Link key={r.id} to={`/blogs/${r.id}`} className="premium-card group overflow-hidden block">
                                <div className="h-40 overflow-hidden">
                                    <img src={r.cover} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="p-4 space-y-1">
                                    <span className="text-xs text-primary font-bold">{r.tag}</span>
                                    <p className="font-heading font-bold text-text text-sm leading-snug group-hover:text-primary transition-colors">{r.title}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogPost
