/**
 * Laravel Echo / Pusher stub — enable when VITE_ECHO_ENABLED=true
 * npm install laravel-echo pusher-js
 */
export function initEcho() {
  if (import.meta.env.VITE_ECHO_ENABLED !== 'true') {
    return null
  }

  // Example wiring (uncomment after installing packages):
  // import Echo from 'laravel-echo'
  // import Pusher from 'pusher-js'
  // window.Pusher = Pusher
  // return new Echo({
  //   broadcaster: 'pusher',
  //   key: import.meta.env.VITE_PUSHER_APP_KEY,
  //   cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  //   wsHost: import.meta.env.VITE_PUSHER_HOST,
  //   wsPort: import.meta.env.VITE_PUSHER_PORT,
  //   forceTLS: import.meta.env.VITE_PUSHER_SCHEME === 'https',
  //   authEndpoint: `${import.meta.env.VITE_API_URL}/api/broadcasting/auth`,
  //   auth: { headers: { Authorization: `Bearer ${localStorage.getItem('sz_analytics_token')}` } },
  // })

  console.info('[Analytics] Echo disabled — set VITE_ECHO_ENABLED=true')
  return null
}
