import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { AnalyticsProvider } from '@/contexts/AnalyticsContext'
import { EnvConfigProvider } from '@/contexts/EnvConfigContext'
import { TooltipProvider } from '@/components/ui/tooltip'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
    },
  },
})

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <EnvConfigProvider>
            <AnalyticsProvider>
              <TooltipProvider delayDuration={300}>
                {children}
              </TooltipProvider>
            </AnalyticsProvider>
          </EnvConfigProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
