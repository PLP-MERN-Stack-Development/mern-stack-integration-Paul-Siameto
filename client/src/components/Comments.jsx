import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { commentsAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Comments = ({ postId }) => {
  const { user, isAuthenticated } = useAuth()
  const params = useParams()
  const effectivePostId = postId || params.id
  const queryClient = useQueryClient()
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { data: commentsData, isLoading } = useQuery(
    ['comments', effectivePostId],
    () => commentsAPI.getCommentsByPost(effectivePostId),
    {
      select: (res) => res.data,
      enabled: !!effectivePostId
    }
  )

  const createMutation = useMutation((newComment) => commentsAPI.createComment(newComment), {
    onMutate: async (newComment) => {
      // optimistic update
    await queryClient.cancelQueries(['comments', effectivePostId])
    const previous = queryClient.getQueryData(['comments', effectivePostId])

    // previous might be an object like { success, data: [] } or already an array.
    // Normalize to an array safely to avoid attempting to spread non-iterables.
    const prevArray = Array.isArray(previous)
      ? previous
      : Array.isArray(previous?.data)
      ? previous.data
      : []

    const optimistic = {
      success: true,
      data: [
        ...prevArray,
        {
          _id: 'temp-' + Date.now(),
          content: newComment.content,
          author: { name: user?.name, avatar: user?.avatar, id: user?.id },
          post: effectivePostId,
          createdAt: new Date().toISOString()
        }
      ]
    }

    queryClient.setQueryData(['comments', effectivePostId], optimistic)
    return { previous }
    },
    onError: (err, newComment, context) => {
      queryClient.setQueryData(['comments', effectivePostId], context.previous)
      const serverMessage = err.response?.data?.message || err.message || 'Failed to post comment'
      const serverErrors = err.response?.data?.errors
      console.error('Create comment error:', err.response || err.message)
      if (serverErrors && Array.isArray(serverErrors)) {
        const msgs = serverErrors.map(e => e.msg).join('; ')
        toast.error(msgs)
      } else {
        toast.error(serverMessage)
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['comments', effectivePostId])
      toast.success('Comment posted')
      setContent('')
    }
  })

  const deleteMutation = useMutation((id) => commentsAPI.deleteComment(id), {
    onMutate: async (id) => {
      await queryClient.cancelQueries(['comments', effectivePostId])
      const previous = queryClient.getQueryData(['comments', effectivePostId])
      queryClient.setQueryData(['comments', effectivePostId], (old) => {
        return {
          ...old,
          data: (old?.data || []).filter(c => c._id !== id)
        }
      })
      return { previous }
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['comments', effectivePostId], context.previous)
      toast.error('Failed to delete comment')
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', effectivePostId])
      toast.success('Comment deleted')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('You must be logged in to comment')
      return
    }
    if (!effectivePostId) {
      toast.error('Cannot post comment: missing post id')
      console.error('Comments.handleSubmit: missing postId, params=', params, 'prop postId=', postId)
      return
    }

    if (!content.trim()) return

    setSubmitting(true)
    const payload = { content: content.trim(), post: effectivePostId }
    console.log('Posting comment', payload)
    createMutation.mutate(payload)
    setSubmitting(false)
  }

  const handleDelete = (id) => {
    if (!window.confirm('Delete this comment?')) return
    deleteMutation.mutate(id)
  }

  if (isLoading) {
    return <div className="py-6">Loading comments...</div>
  }

  const comments = commentsData?.data || []

  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Comments ({comments.length})</h3>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="textarea w-full"
          rows={3}
          placeholder={isAuthenticated ? 'Write a comment...' : 'Log in to leave a comment'}
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isAuthenticated || submitting}
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c._id} className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                {c.author?.avatar ? (
                  <img src={c.author.avatar} alt={c.author.name} className="w-10 h-10 object-cover" />
                ) : (
                  <span className="text-gray-500">{(c.author?.name||'U')[0]}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">{c.author?.name || 'Unknown'}</div>
                  <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
                </div>
                <div className="mt-2 text-gray-700 whitespace-pre-wrap">{c.content}</div>
                <div className="mt-3 text-sm text-gray-500 flex items-center space-x-3">
                  {user && ((user.id && (user.id === c.author?._id || user.id === c.author?.id)) || (user?.id === c.author?._id)) && (
                    <button className="text-red-500" onClick={() => handleDelete(c._id)}>Delete</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Comments
