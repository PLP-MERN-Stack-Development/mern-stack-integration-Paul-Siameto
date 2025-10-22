import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { postsAPI } from '../services/api'
import { BookOpen, Calendar, User, Eye } from 'lucide-react'

const Home = () => {
  const { data: postsData, isLoading } = useQuery(
    'recent-posts',
    () => postsAPI.getPosts({ limit: 6, status: 'published' }),
    {
      select: (data) => data.data
    }
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to MERN Blog
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Discover amazing stories, share your thoughts, and connect with a community of writers and readers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/posts"
              className="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Explore Posts
            </Link>
            <Link
              to="/create-post"
              className="btn border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
            >
              Write a Post
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Recent Posts</h2>
          <Link
            to="/posts"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
          >
            <span>View All</span>
            <BookOpen className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : postsData?.data?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postsData.data.map((post) => (
              <article key={post._id} className="card hover:shadow-lg transition-shadow duration-200">
                {post.featuredImage && (
                  <div className="h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {post.category?.name}
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(post.createdAt)}</span>
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                    <Link
                      to={`/posts/${post._id}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 line-clamp-3">
                    {post.excerpt || post.content.substring(0, 150) + '...'}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <User className="w-4 h-4" />
                      <span>{post.author?.name}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>{post.views}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">No posts yet</h3>
            <p className="text-gray-400">Be the first to share your story!</p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Our Blog Platform?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Publishing</h3>
            <p className="text-gray-600">
              Create and publish your posts with our intuitive editor. No technical knowledge required.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Driven</h3>
            <p className="text-gray-600">
              Connect with other writers and readers. Share ideas and get feedback on your work.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600">
              Track your post performance with detailed analytics and insights.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
