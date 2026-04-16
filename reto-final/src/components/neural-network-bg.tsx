"use client"

import { useEffect, useRef, useCallback } from "react"

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

export function NeuralNetworkBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const nodesRef = useRef<Node[]>([])
  const mouseRef = useRef<{ x: number; y: number } | null>(null)

  const CONNECTION_DISTANCE = 150
  const NODE_COUNT = 65
  const NODE_COLOR = "10, 232, 138" // #0AE88A in RGB
  const NODE_OPACITY = 0.25
  const LINE_OPACITY = 0.12
  const NODE_RADIUS_MIN = 1.5
  const NODE_RADIUS_MAX = 3
  const SPEED = 0.3

  const initNodes = useCallback((width: number, height: number) => {
    const nodes: Node[] = []
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * SPEED * 2,
        vy: (Math.random() - 0.5) * SPEED * 2,
        radius:
          NODE_RADIUS_MIN + Math.random() * (NODE_RADIUS_MAX - NODE_RADIUS_MIN),
      })
    }
    nodesRef.current = nodes
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.scale(dpr, dpr)

      if (nodesRef.current.length === 0) {
        initNodes(rect.width, rect.height)
      } else {
        // Reclamp existing nodes to the new dimensions
        for (const node of nodesRef.current) {
          if (node.x > rect.width) node.x = rect.width - 5
          if (node.y > rect.height) node.y = rect.height - 5
        }
      }
    }

    resizeCanvas()

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1
      ctx.resetTransform()
      resizeCanvas()
      // ctx.scale already called in resizeCanvas
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = null
    }

    window.addEventListener("resize", handleResize)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    const animate = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      ctx.clearRect(0, 0, width, height)

      const nodes = nodesRef.current
      const mouse = mouseRef.current

      // Update node positions
      for (const node of nodes) {
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x <= 0 || node.x >= width) {
          node.vx *= -1
          node.x = Math.max(0, Math.min(width, node.x))
        }
        if (node.y <= 0 || node.y >= height) {
          node.vy *= -1
          node.y = Math.max(0, Math.min(height, node.y))
        }

        // Subtle mouse attraction
        if (mouse) {
          const dx = mouse.x - node.x
          const dy = mouse.y - node.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 200 && dist > 1) {
            node.vx += (dx / dist) * 0.02
            node.vy += (dy / dist) * 0.02
            // Clamp speed
            const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy)
            if (speed > SPEED * 3) {
              node.vx = (node.vx / speed) * SPEED * 3
              node.vy = (node.vy / speed) * SPEED * 3
            }
          }
        }
      }

      // Draw connections
      ctx.lineWidth = 0.7
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < CONNECTION_DISTANCE) {
            const opacity =
              LINE_OPACITY * (1 - dist / CONNECTION_DISTANCE)
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${NODE_COLOR}, ${opacity})`
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        let opacity = NODE_OPACITY

        // Glow near mouse
        if (mouse) {
          const dx = mouse.x - node.x
          const dy = mouse.y - node.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            opacity = NODE_OPACITY + (0.5 - NODE_OPACITY) * (1 - dist / 150)
          }
        }

        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${NODE_COLOR}, ${opacity})`
        ctx.fill()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [initNodes])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
