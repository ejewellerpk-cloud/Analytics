import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary via-accent to-purple-600 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            <BarChart3 className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Shopperzz Analytics</h1>
            <p className="text-white/80 text-sm">Premium ecommerce intelligence</p>
          </div>
        </div>
        <blockquote className="text-lg font-medium leading-relaxed max-w-md">
          &ldquo;Real-time insights that turn visitors into revenue — built for modern commerce teams.&rdquo;
        </blockquote>
        <p className="text-sm text-white/60">© Shopperzz · Intelligence Platform</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}
