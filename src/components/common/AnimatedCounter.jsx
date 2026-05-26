import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

export function AnimatedCounter({ value, format = (v) => Math.round(v).toLocaleString(), duration = 0.8 }) {
  const spring = useSpring(0, { stiffness: 75, damping: 20 })
  const display = useTransform(spring, (v) => format(v))
  const [text, setText] = useState(format(0))

  useEffect(() => {
    spring.set(Number(value) || 0)
    const unsub = display.on('change', (v) => setText(v))
    return () => unsub()
  }, [value, spring, display, format])

  return <motion.span>{text}</motion.span>
}
