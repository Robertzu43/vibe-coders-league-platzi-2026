"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"

interface BinaryImageRevealProps {
  src: string
  alt: string
  fill?: boolean
  className?: string
  preload?: boolean
}

export function BinaryImageReveal({ src, alt, fill, className, preload }: BinaryImageRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [revealComplete, setRevealComplete] = useState(false)
  const animationRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)

  const REVEAL_DURATION = 1800 // ms
  const CHAR_SIZE = 12
  const BINARY_COLOR = "#0AE88A"

  const animate = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const elapsed = Date.now() - startTimeRef.current
    const progress = Math.min(elapsed / REVEAL_DURATION, 1)

    // Eased progress (ease-out cubic)
    const eased = 1 - Math.pow(1 - progress, 3)

    ctx.clearRect(0, 0, width, height)

    // Dark background
    ctx.fillStyle = "#141414"
    ctx.fillRect(0, 0, width, height)

    const cols = Math.ceil(width / CHAR_SIZE)
    const rows = Math.ceil(height / CHAR_SIZE)

    ctx.font = `${CHAR_SIZE - 2}px monospace`

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * CHAR_SIZE
        const y = row * CHAR_SIZE + CHAR_SIZE

        // Calculate reveal from center outward
        const centerX = width / 2
        const centerY = height / 2
        const distFromCenter = Math.sqrt(
          Math.pow((x - centerX) / width, 2) +
          Math.pow((y - centerY) / height, 2)
        ) * 2 // normalize to ~0-1

        const cellProgress = Math.max(0, (eased - distFromCenter * 0.5) / 0.5)

        if (cellProgress >= 1) {
          // Fully revealed — don't draw binary here
          continue
        }

        // Draw binary characters
        const char = Math.random() > 0.5 ? "1" : "0"
        const flickerOpacity = 0.3 + Math.random() * 0.7

        if (cellProgress > 0) {
          // Transitioning — bright green, fading out
          const fadeOut = 1 - cellProgress
          ctx.fillStyle = `rgba(10, 232, 138, ${flickerOpacity * fadeOut})`
        } else {
          // Not yet reached — dim binary rain
          const dimness = 0.1 + Math.random() * 0.2
          ctx.fillStyle = `rgba(10, 232, 138, ${dimness})`
        }

        ctx.fillText(char, x, y)
      }
    }

    // Draw some "falling" binary streams for extra effect
    if (progress < 0.8) {
      const streamCount = 15
      for (let s = 0; s < streamCount; s++) {
        const streamX = ((s * 73 + elapsed * 0.05) % width)
        const streamLength = 5 + Math.floor(Math.random() * 8)
        const streamY = ((elapsed * 0.3 + s * 137) % (height + streamLength * CHAR_SIZE)) - streamLength * CHAR_SIZE

        for (let c = 0; c < streamLength; c++) {
          const charY = streamY + c * CHAR_SIZE
          if (charY < 0 || charY > height) continue
          const opacity = (1 - c / streamLength) * (1 - progress) * 0.8
          ctx.fillStyle = `rgba(10, 232, 138, ${opacity})`
          ctx.fillText(Math.random() > 0.5 ? "1" : "0", streamX, charY)
        }
      }
    }

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(() =>
        animate(ctx, width, height)
      )
    } else {
      setRevealComplete(true)
    }
  }, [])

  useEffect(() => {
    if (!imageLoaded) return

    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = container.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`
    ctx.scale(dpr, dpr)

    startTimeRef.current = Date.now()
    animate(ctx, rect.width, rect.height)

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [imageLoaded, animate])

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Actual image — hidden until reveal, then shown */}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={`${className} transition-opacity duration-500 ${
          revealComplete ? "opacity-100" : "opacity-0"
        }`}
        preload={preload}
        onLoad={() => setImageLoaded(true)}
      />

      {/* Binary matrix overlay */}
      {imageLoaded && !revealComplete && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 10 }}
        />
      )}

      {/* Show shimmer while image hasn't loaded yet */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-card animate-pulse flex items-center justify-center">
          <span className="text-primary font-mono text-sm opacity-50">01010...</span>
        </div>
      )}
    </div>
  )
}
