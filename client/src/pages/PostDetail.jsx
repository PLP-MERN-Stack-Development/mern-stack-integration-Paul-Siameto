import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { postsAPI } from '../services/api'
import { Calendar, User, Eye, Tag, ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import Comments from '../components/Comments'
import ErrorBoundary from '../components/ErrorBoundary'

const PostDetail = () => {
  const { id } = useParams()
  const { user, isAdmin } = useAuth()

  const { data: postData, isLoading, refetch } = useQuery(
    ['post', id],
    () => postsAPI.getPost(id),
    {
      // postsAPI.getPost returns the raw axios response, whose `data` is the server response
      // server response shape: { success: true, data: post }
      // we want the actual post object, so select res.data.data
      select: (res) => res.data.data,
      enabled: !!id
    }
  )

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      await postsAPI.deletePost(id)
      toast.success('Post deleted successfully')
      // Redirect to posts list
      window.location.href = '/posts'
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete post')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!postData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h2>
        <p className="text-gray-600 mb-6">The post you're looking for doesn't exist or has been removed.</p>
        <Link to="/posts" className="btn btn-primary">
          Back to Posts
        </Link>
      </div>
    )
  }

  const post = postData
  const canEdit = !!user && ((post.author?._id === user.id) || (post.author?.id === user.id) || isAdmin)

  // Debugging: log post object in dev for diagnosis when post content seems missing
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('PostDetail: post data =', post)
  }

  return (
    <ErrorBoundary>
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        to="/posts"
        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Posts</span>
      </Link>


      {/* Post Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {post.category?.name}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              post.status === 'published' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {post.status}
            </span>
          </div>
          
          {canEdit && (
            <div className="flex items-center space-x-2">
              <Link
                to={`/edit-post/${post._id}`}
                className="btn btn-secondary flex items-center space-x-1"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </Link>
              <button
                onClick={handleDelete}
                className="btn btn-danger flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>By {post.author?.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>
              {post.publishedAt 
                ? `Published ${formatDate(post.publishedAt)}`
                : `Created ${formatDate(post.createdAt)}`
              }
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>{post.views} views</span>
          </div>
          {post.updatedAt !== post.createdAt && (
            <div className="flex items-center space-x-2">
              <span>Updated {formatDateTime(post.updatedAt)}</span>
            </div>
          )}
        </div>
      </header>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="mb-8">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Post Content */}
      <article className="prose prose-lg max-w-none">
        <div 
          className="text-gray-800 leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: String(post.content || '').replace(/\n/g, '<br>') }}
        />
      </article>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Author Info */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            {post.author?.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {post.author?.name}
            </h3>
            {post.author?.bio && (
              <p className="text-gray-600 mb-2">{post.author.bio}</p>
            )}
            <p className="text-sm text-gray-500">
              Author of this post
            </p>
          </div>
        </div>
      </div>

      {/* Comments Section - Placeholder for future implementation */}

      <div className="mt-12 pt-8 border-t border-gray-200">
        <Comments postId={post._id} />
      </div>
    </div>
    </ErrorBoundary>
  )
}

export default PostDetail
