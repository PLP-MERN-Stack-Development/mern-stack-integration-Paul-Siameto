import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { postsAPI, categoriesAPI, uploadAPI } from '../services/api'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const EditPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm()

  // image upload state
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [uploading, setUploading] = useState(false)


  const { data: postData, isLoading } = useQuery(
    ['post', id],
    () => postsAPI.getPost(id),
    {
      select: (data) => data.data,
      enabled: !!id,
      onSuccess: (data) => {
        const post = data
        setValue('title', post.title)
        setValue('content', post.content)
        setValue('category', post.category._id)
        setValue('tags', post.tags?.join(', ') || '')
        setValue('status', post.status)
        setValue('featuredImage', post.featuredImage || '')
        setPreviewUrl(post.featuredImage || '')
      }
    }
  )

  const { data: categoriesData } = useQuery(
    'categories',
    () => categoriesAPI.getCategories(),
    {
      select: (data) => data.data
    }
  )

  const updatePostMutation = useMutation(
    (data) => postsAPI.updatePost(id, data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['post', id])
        queryClient.invalidateQueries('posts')
        toast.success('Post updated successfully!')
        navigate(`/posts/${id}`)
      },
      onError: (error) => {
        console.error('EditPost error response:', error.response || error.message)
        const serverErrors = error.response?.data?.errors
        if (serverErrors) {
          serverErrors.forEach(e => toast.error(e.msg))
        } else {
          toast.error(error.response?.data?.message || 'Failed to update post')
        }
      },
      onSettled: () => {
        setIsSubmitting(false)
      }
    }
  )

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    
    // Process tags
    const tags = data.tags
      ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      : []

    const postData = {
      ...data,
      tags,
      category: data.category
    }

    updatePostMutation.mutate(postData)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    try {
      const res = await uploadAPI.uploadImage(selectedFile)
      const url = res.data.url || res.data.data?.url || (res.data && res.data.url)
      if (url) {
        setValue('featuredImage', url)
        setPreviewUrl(url)
        toast.success('Image uploaded')
      } else {
        toast.error('Upload succeeded but no URL returned')
      }
    } catch (err) {
      console.error('Upload failed', err)
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!postData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h2>
        <p className="text-gray-600 mb-6">The post you're trying to edit doesn't exist.</p>
        <button onClick={() => navigate('/posts')} className="btn btn-primary">
          Back to Posts
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Post</h1>
        <p className="text-gray-600">Update your post content and settings</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input
            type="text"
            {...register('title', { 
              required: 'Title is required',
              minLength: { value: 1, message: 'Title must be at least 1 character' },
              maxLength: { value: 100, message: 'Title cannot exceed 100 characters' }
            })}
            className={`input ${errors.title ? 'border-red-500' : ''}`}
            placeholder="Enter post title..."
          />
          {errors.title && (
            <p className="form-error">{errors.title.message}</p>
          )}
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="form-label">Category *</label>
          <select
            {...register('category', { required: 'Category is required' })}
            className={`input ${errors.category ? 'border-red-500' : ''}`}
          >
            <option value="">Select a category</option>
            {categoriesData?.data?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="form-error">{errors.category.message}</p>
          )}
        </div>

        {/* Featured Image */}
        <div className="form-group">
          <label className="form-label">Featured Image URL</label>
          <input
            type="url"
            {...register('featuredImage')}
            className="input"
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-sm text-gray-500 mt-1">
            Optional: Add a URL to a featured image for your post
          </p>
          <div className="mt-3">
            <label className="form-label">Or upload an image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {previewUrl && (
              <div className="mt-2">
                <img src={previewUrl} alt="preview" className="w-48 h-32 object-cover rounded" />
              </div>
            )}
            <div className="mt-2">
              <button type="button" className="btn btn-secondary mr-2" onClick={handleUpload} disabled={!selectedFile || uploading}>
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="form-group">
          <label className="form-label">Content *</label>
          <textarea
            {...register('content', { 
              required: 'Content is required',
              minLength: { value: 10, message: 'Content must be at least 10 characters' }
            })}
            rows={12}
            className={`textarea ${errors.content ? 'border-red-500' : ''}`}
            placeholder="Write your post content here..."
          />
          {errors.content && (
            <p className="form-error">{errors.content.message}</p>
          )}
        </div>

        {/* Tags */}
        <div className="form-group">
          <label className="form-label">Tags</label>
          <input
            type="text"
            {...register('tags')}
            className="input"
            placeholder="tag1, tag2, tag3"
          />
          <p className="text-sm text-gray-500 mt-1">
            Separate tags with commas
          </p>
        </div>

        {/* Status */}
        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            {...register('status')}
            className="input"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Draft posts are saved but not visible to others
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate(`/posts/${id}`)}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Updating...' : 'Update Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditPost
