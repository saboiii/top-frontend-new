'use client'

import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState, useCallback } from 'react'
import ParticleMesh from './ParticleMesh'
import Loader from './Loader'
import { ErrorBoundary } from './ErrorBoundary'
import { PerformanceMonitor } from '@react-three/drei'
import { Perf } from 'r3f-perf'

function ResponsiveCamera({ loading }: { loading: boolean }) {
  const { camera } = useThree()
  const targetZ = useRef(camera.position.z)

  const handleResize = useCallback(() => {
    if (!loading) {
      targetZ.current = window.innerWidth < 640 ? 90 : 50
    }
  }, [loading])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  useFrame(() => {
    camera.position.z += (targetZ.current - camera.position.z) * 0.08
    camera.updateProjectionMatrix()
  })

  return null
}

export default function Scene() {
  const [loading, setLoading] = useState(true)
  const [dpr, setDpr] = useState(1.5)
  const [targetDpr, setTargetDpr] = useState(1.5)

  useEffect(() => {
    let raf: number | undefined
    function animate() {
      setDpr(prev => {
        const next = prev + (targetDpr - prev) * 0.1
        if (Math.abs(next - targetDpr) < 0.01) return targetDpr
        raf = requestAnimationFrame(animate)
        return next
      })
    }
    if (dpr !== targetDpr) {
      raf = requestAnimationFrame(animate)
    }
    return () => {
      if (raf !== undefined) cancelAnimationFrame(raf)
    }
  }, [targetDpr, dpr])

  const handleIncline = useCallback(() => setTargetDpr(2), [])
  const handleDecline = useCallback(() => setTargetDpr(1), [])

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 20], fov: 80 }}
        gl={{ powerPreference: "high-performance" }}
        dpr={dpr}
        performance={{ min: 0.5 }}
      >
        <PerformanceMonitor
          onIncline={handleIncline}
          onDecline={handleDecline}
        />
        <ResponsiveCamera loading={loading} />
        <Perf position="top-left" />
        <ErrorBoundary>
          <ParticleMesh />
        </ErrorBoundary>
      </Canvas>
      <Loader onFinish={() => setLoading(false)} />
    </>
  )
}
