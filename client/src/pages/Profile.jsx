import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useForm } from 'react-hook-form'
import { User, Mail, Save } from 'lucide-react'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
      avatar: user?.avatar || ''
    }
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    const result = await updateProfile(data)
    setIsSubmitting(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar */}
          <div className="form-group">
            <label className="form-label">Profile Picture</label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="url"
                  {...register('avatar')}
                  className="input"
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter a URL to your profile picture
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                },
                maxLength: {
                  value: 50,
                  message: 'Name cannot exceed 50 characters'
                }
              })}
              className={`input ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="form-error">{errors.name.message}</p>
            )}
          </div>

          {/* Email - Read Only */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input pl-10 bg-gray-50 text-gray-500"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>

          {/* Bio */}
          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea
              {...register('bio', {
                maxLength: {
                  value: 200,
                  message: 'Bio cannot exceed 200 characters'
                }
              })}
              rows={4}
              className={`textarea ${errors.bio ? 'border-red-500' : ''}`}
              placeholder="Tell us about yourself..."
            />
            {errors.bio && (
              <p className="form-error">{errors.bio.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Optional: A brief description about yourself
            </p>
          </div>

          {/* Role */}
          <div className="form-group">
            <label className="form-label">Account Type</label>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user?.role === 'admin' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {user?.role === 'admin' ? 'Administrator' : 'User'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Your account role and permissions
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Account Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {user?.postsCount || 0}
          </div>
          <div className="text-sm text-gray-600">Posts Published</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {user?.viewsCount || 0}
          </div>
          <div className="text-sm text-gray-600">Total Views</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600 mb-2">
            {user?.likesCount || 0}
          </div>
          <div className="text-sm text-gray-600">Total Likes</div>
        </div>
      </div>
    </div>
  )
}

export default Profile
