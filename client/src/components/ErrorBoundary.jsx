import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-4xl mx-auto py-12 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong rendering this page</h2>
          <pre className="whitespace-pre-wrap text-left bg-gray-100 p-4 rounded">{String(this.state.error)}</pre>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
