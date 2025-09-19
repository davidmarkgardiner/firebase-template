import type { APIRoute } from 'astro'

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  services: {
    [key: string]: {
      status: 'ok' | 'warning' | 'error'
      response_time?: number
      message?: string
    }
  }
  version?: string
  environment?: string
}

async function checkDatabase(): Promise<{ status: 'ok' | 'warning' | 'error', response_time: number, message?: string }> {
  const start = Date.now()
  try {
    // In development, we'll simulate a database check
    // In production, this would be a real Supabase health check
    if (import.meta.env.MODE === 'development') {
      await new Promise(resolve => setTimeout(resolve, 10)) // Simulate delay
      return {
        status: 'ok',
        response_time: Date.now() - start,
        message: 'Simulated database connection in development'
      }
    }

    // Production database check would go here
    return {
      status: 'warning',
      response_time: Date.now() - start,
      message: 'Database check not implemented for production'
    }
  } catch (error) {
    return {
      status: 'error',
      response_time: Date.now() - start,
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function checkStripe(): Promise<{ status: 'ok' | 'warning' | 'error', response_time: number, message?: string }> {
  const start = Date.now()
  try {
    // In development, check if Stripe keys are configured
    const hasPublicKey = !!import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY
    const hasSecretKey = !!import.meta.env.STRIPE_SECRET_KEY

    if (!hasPublicKey || !hasSecretKey) {
      return {
        status: 'warning',
        response_time: Date.now() - start,
        message: 'Stripe keys not configured'
      }
    }

    return {
      status: 'ok',
      response_time: Date.now() - start,
      message: 'Stripe configuration detected'
    }
  } catch (error) {
    return {
      status: 'error',
      response_time: Date.now() - start,
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function checkSupabase(): Promise<{ status: 'ok' | 'warning' | 'error', response_time: number, message?: string }> {
  const start = Date.now()
  try {
    const hasUrl = !!import.meta.env.PUBLIC_SUPABASE_URL
    const hasAnonKey = !!import.meta.env.PUBLIC_SUPABASE_ANON_KEY

    if (!hasUrl || !hasAnonKey) {
      return {
        status: 'warning',
        response_time: Date.now() - start,
        message: 'Supabase configuration incomplete'
      }
    }

    return {
      status: 'ok',
      response_time: Date.now() - start,
      message: 'Supabase configuration detected'
    }
  } catch (error) {
    return {
      status: 'error',
      response_time: Date.now() - start,
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export const GET: APIRoute = async () => {
  try {
    const [database, stripe, supabase] = await Promise.all([
      checkDatabase(),
      checkStripe(),
      checkSupabase()
    ])

    const health: HealthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database,
        stripe,
        supabase
      },
      version: '1.0.0',
      environment: import.meta.env.MODE
    }

    // Determine overall health status
    const serviceStatuses = Object.values(health.services).map(service => service.status)
    if (serviceStatuses.includes('error')) {
      health.status = 'unhealthy'
    } else if (serviceStatuses.includes('warning')) {
      health.status = 'degraded'
    }

    const statusCode = health.status === 'healthy' ? 200 :
                      health.status === 'degraded' ? 200 : 503

    return new Response(JSON.stringify(health, null, 2), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    const errorHealth: HealthStatus = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        system: {
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown system error'
        }
      },
      environment: import.meta.env.MODE
    }

    return new Response(JSON.stringify(errorHealth, null, 2), {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  }
}