import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import { getStripe } from '@/lib/stripe'

interface IntegrationStatus {
  supabase: 'checking' | 'connected' | 'error'
  stripe: 'checking' | 'connected' | 'error'
}

export default function HelloWorld(): React.JSX.Element {
  const [status, setStatus] = useState<IntegrationStatus>({
    supabase: 'checking',
    stripe: 'checking'
  })

  useEffect(() => {
    checkIntegrations()
  }, [])

  const checkIntegrations = async (): Promise<void> => {
    // Test Supabase connection
    try {
      const supabase = createSupabaseBrowserClient()
      await supabase.auth.getSession()
      setStatus(prev => ({ ...prev, supabase: 'connected' }))
    } catch (error) {
      console.error('Supabase connection error:', error)
      setStatus(prev => ({ ...prev, supabase: 'error' }))
    }

    // Test Stripe connection
    try {
      const stripe = await getStripe()
      if (stripe) {
        setStatus(prev => ({ ...prev, stripe: 'connected' }))
      } else {
        setStatus(prev => ({ ...prev, stripe: 'error' }))
      }
    } catch (error) {
      console.error('Stripe connection error:', error)
      setStatus(prev => ({ ...prev, stripe: 'error' }))
    }
  }

  const getStatusColor = (integrationStatus: string): string => {
    switch (integrationStatus) {
      case 'connected':
        return 'text-green-600 bg-green-100'
      case 'error':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-yellow-600 bg-yellow-100'
    }
  }

  const getStatusText = (integrationStatus: string): string => {
    switch (integrationStatus) {
      case 'connected':
        return '✅ Connected'
      case 'error':
        return '❌ Error'
      default:
        return '⏳ Checking...'
    }
  }

  const handleTestAction = (): void => {
    alert('Hello World! All integrations are working! 🎉')
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Hello World! 👋
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Welcome to the Coffee Shop & Yoga Studio Template. This page demonstrates all integrations working together.
        </p>
      </div>

      {/* Integration Status Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">🗄️</span>
            Supabase Integration
          </h3>
          <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status.supabase)}`}>
            {getStatusText(status.supabase)}
          </div>
          <p className="mt-3 text-gray-600">
            Database, Authentication, and Real-time features
          </p>
          {status.supabase === 'error' && (
            <p className="mt-2 text-sm text-red-600">
              Check your Supabase environment variables in .env
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">💳</span>
            Stripe Integration
          </h3>
          <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status.stripe)}`}>
            {getStatusText(status.stripe)}
          </div>
          <p className="mt-3 text-gray-600">
            Payment processing and subscription management
          </p>
          {status.stripe === 'error' && (
            <p className="mt-2 text-sm text-red-600">
              Check your Stripe environment variables in .env
            </p>
          )}
        </div>
      </div>

      {/* Tech Stack Display */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Tech Stack</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Astro', icon: '🚀' },
            { name: 'React', icon: '⚛️' },
            { name: 'TypeScript', icon: '📘' },
            { name: 'Tailwind', icon: '🎨' },
            { name: 'shadcn/ui', icon: '🧩' },
            { name: 'Supabase', icon: '🗄️' },
            { name: 'Stripe', icon: '💳' },
            { name: 'Playwright', icon: '🎭' }
          ].map((tech) => (
            <div key={tech.name} className="flex items-center gap-2 text-sm">
              <span className="text-lg">{tech.icon}</span>
              <span className="font-medium text-gray-700">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={handleTestAction} size="lg">
          Test Integration 🧪
        </Button>
        <Button onClick={checkIntegrations} variant="outline" size="lg">
          Refresh Status 🔄
        </Button>
      </div>

      {/* Features Preview */}
      <div className="bg-white rounded-lg shadow-md p-6 border">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Template Features</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">☕ Coffee Shop</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Product catalog management</li>
              <li>• Online ordering system</li>
              <li>• Loyalty points program</li>
              <li>• POS integration ready</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">🧘 Yoga Studio</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Class booking system</li>
              <li>• Instructor management</li>
              <li>• Membership subscriptions</li>
              <li>• Payment processing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}