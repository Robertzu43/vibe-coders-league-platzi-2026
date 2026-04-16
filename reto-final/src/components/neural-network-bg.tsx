"use client"

import { useEffect, useRef, useCallback } from "react"

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  baseRadius: number
}

interface Ripple {
  x: number
  y: number
  radius: number
  maxRadius: number
  strength: number
  opacity: number
}

export function NeuralNetworkBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const nodesRef = useRef<Node[]>([])
  const mouseRef = useRef<{ x: number; y: number } | null>(null)
  const ripplesRef = useRef<Ripple[]>([])
  const scrollOffsetRef = useRef(0)
  const prevScrollRef = useRef(0)

  const CONNECTION_DISTANCE = 150
  const NODE_COUNT = 65
  const NODE_COLOR = "10, 232, 138" // #0AE88A in RGB
  const NODE_OPACITY = 0.25
  const LINE_OPACITY = 0.12
  const NODE_RADIUS_MIN = 1.5
  const NODE_RADIUS_MAX = 3
  const SPEED = 0.3

  // Mouse interaction constants
  const MOUSE_ATTRACTION_RADIUS = 200
  const MOUSE_ATTRACTION_FORCE = 0.02
  const MOUSE_GLOW_RADIUS = 180
  const MOUSE_MAX_SPEED = SPEED * 3
  const RIPPLE_MAX_RADIUS = 250
  const RIPPLE_PUSH_FORCE = 4
  const RIPPLE_EXPAND_SPEED = 5
  const RIPPLE_FADE_SPEED = 0.02

  const initNodes = useCallback((width: number, height: number) => {
    const nodes: Node[] = []
    for (let i = 0; i < NODE_COUNT; i++) {
      const baseRadius =
        NODE_RADIUS_MIN + Math.random() * (NODE_RADIUS_MAX - NODE_RADIUS_MIN)
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * SPEED * 2,
        vy: (Math.random() - 0.5) * SPEED * 2,
        radius: baseRadius,
        baseRadius,
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
      ctx.resetTransform()
      resizeCanvas()
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      // Only track if mouse is within the canvas bounds
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouseRef.current = { x, y }
      } else {
        mouseRef.current = null
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = null
    }

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        ripplesRef.current.push({
          x,
          y,
          radius: 0,
          maxRadius: RIPPLE_MAX_RADIUS,
          strength: RIPPLE_PUSH_FORCE,
          opacity: 0.6,
        })
      }
    }

    const SCROLL_PARALLAX_FACTOR = 0.15

    const handleScroll = () => {
      const currentScroll = window.scrollY
      const delta = currentScroll - prevScrollRef.current
      prevScrollRef.current = currentScroll
      scrollOffsetRef.current += delta * SCROLL_PARALLAX_FACTOR
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("scroll", handleScroll, { passive: true })
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("click", handleClick)

    const animate = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      ctx.clearRect(0, 0, width, height)

      const nodes = nodesRef.current
      const mouse = mouseRef.current
      const ripples = ripplesRef.current

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i]
        ripple.radius += RIPPLE_EXPAND_SPEED
        ripple.opacity -= RIPPLE_FADE_SPEED
        if (ripple.opacity <= 0 || ripple.radius >= ripple.maxRadius) {
          ripples.splice(i, 1)
        }
      }

      // Apply scroll parallax offset to all nodes
      const scrollDelta = scrollOffsetRef.current
      if (Math.abs(scrollDelta) > 0.01) {
        for (const node of nodes) {
          node.y -= scrollDelta
        }
        scrollOffsetRef.current = 0
      }

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
          if (dist < MOUSE_ATTRACTION_RADIUS && dist > 1) {
            node.vx += (dx / dist) * MOUSE_ATTRACTION_FORCE
            node.vy += (dy / dist) * MOUSE_ATTRACTION_FORCE
            // Clamp speed
            const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy)
            if (speed > MOUSE_MAX_SPEED) {
              node.vx = (node.vx / speed) * MOUSE_MAX_SPEED
              node.vy = (node.vy / speed) * MOUSE_MAX_SPEED
            }
          }
        }

        // Ripple push effect
        for (const ripple of ripples) {
          const dx = node.x - ripple.x
          const dy = node.y - ripple.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          // Push nodes that are near the expanding ripple edge
          const rippleEdgeDist = Math.abs(dist - ripple.radius)
          if (rippleEdgeDist < 40 && dist > 1) {
            const pushStrength = ripple.strength * ripple.opacity * (1 - rippleEdgeDist / 40)
            node.vx += (dx / dist) * pushStrength
            node.vy += (dy / dist) * pushStrength
            // Clamp speed after ripple push
            const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy)
            if (speed > MOUSE_MAX_SPEED * 2) {
              node.vx = (node.vx / speed) * MOUSE_MAX_SPEED * 2
              node.vy = (node.vy / speed) * MOUSE_MAX_SPEED * 2
            }
          }
        }

        // Smooth return: dampen velocity toward base speed
        const currentSpeed = Math.sqrt(node.vx * node.vx + node.vy * node.vy)
        if (currentSpeed > SPEED) {
          const dampening = 0.995
          node.vx *= dampening
          node.vy *= dampening
        }

        // Smooth radius return to base
        node.radius += (node.baseRadius - node.radius) * 0.1
      }

      // Draw ripple rings
      for (const ripple of ripples) {
        ctx.beginPath()
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${NODE_COLOR}, ${ripple.opacity * 0.5})`
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < CONNECTION_DISTANCE) {
            let opacity = LINE_OPACITY * (1 - dist / CONNECTION_DISTANCE)

            // Connection highlighting near cursor
            if (mouse) {
              const midX = (nodes[i].x + nodes[j].x) / 2
              const midY = (nodes[i].y + nodes[j].y) / 2
              const mouseDist = Math.sqrt(
                (mouse.x - midX) * (mouse.x - midX) +
                (mouse.y - midY) * (mouse.y - midY)
              )
              if (mouseDist < MOUSE_GLOW_RADIUS) {
                const boost = (1 - mouseDist / MOUSE_GLOW_RADIUS) * 0.35
                opacity = Math.min(opacity + boost, 0.6)
              }
            }

            ctx.beginPath()
            ctx.strokeStyle = `rgba(${NODE_COLOR}, ${opacity})`
            ctx.lineWidth = 0.7
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        let opacity = NODE_OPACITY
        let drawRadius = node.radius

        // Glow on hover — increase opacity and size near mouse
        if (mouse) {
          const dx = mouse.x - node.x
          const dy = mouse.y - node.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MOUSE_GLOW_RADIUS) {
            const proximity = 1 - dist / MOUSE_GLOW_RADIUS
            opacity = NODE_OPACITY + (0.7 - NODE_OPACITY) * proximity
            // Increase size up to 2x for closest nodes
            drawRadius = node.baseRadius * (1 + proximity * 1.0)
            node.radius = drawRadius
          }
        }

        // Extra glow from ripples
        for (const ripple of ripples) {
          const dx = node.x - ripple.x
          const dy = node.y - ripple.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const rippleEdgeDist = Math.abs(dist - ripple.radius)
          if (rippleEdgeDist < 50) {
            const rippleGlow = ripple.opacity * (1 - rippleEdgeDist / 50) * 0.4
            opacity = Math.min(opacity + rippleGlow, 0.9)
          }
        }

        ctx.beginPath()
        ctx.arc(node.x, node.y, drawRadius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${NODE_COLOR}, ${opacity})`
        ctx.fill()

        // Add a soft glow halo for bright nodes
        if (opacity > 0.4) {
          ctx.beginPath()
          ctx.arc(node.x, node.y, drawRadius * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${NODE_COLOR}, ${(opacity - 0.4) * 0.15})`
          ctx.fill()
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("click", handleClick)
    }
  }, [initNodes])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
