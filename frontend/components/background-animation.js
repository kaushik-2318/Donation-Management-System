"use client"

import { useEffect, useRef } from "react"

export default function BackgroundAnimation() {
  const canvasRef = useRef < HTMLCanvasElement > (null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Particle class
    class Particle {
      // x: number
      // y: number
      // size: number
      // speedX: number
      // speedY: number
      // color: string
      // opacity: number
      // growing: boolean

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 5 + 1
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        this.color = `rgba(66, 133, 244, ${Math.random() * 0.2 + 0.05})`
        this.opacity = Math.random() * 0.5 + 0.1
        this.growing = Math.random() > 0.5
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Boundary check
        if (this.x > canvas.width) this.x = 0
        else if (this.x < 0) this.x = canvas.width

        if (this.y > canvas.height) this.y = 0
        else if (this.y < 0) this.y = canvas.height

        // Pulsate size
        if (this.growing) {
          this.size += 0.03
          if (this.size > 5) this.growing = false
        } else {
          this.size -= 0.03
          if (this.size < 1) this.growing = true
        }

        // Pulsate opacity
        this.opacity = Math.sin(Date.now() * 0.001 + this.x * 0.01) * 0.2 + 0.3
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = `rgba(66, 133, 244, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles
    const particlesArray = []
    const numberOfParticles = Math.min(80, Math.floor(window.innerWidth / 20))

    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle())
    }

    // Connect particles with lines
    function connect() {
      if (!ctx) return
      const maxDistance = 150

      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x
          const dy = particlesArray[a].y - particlesArray[b].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance
            ctx.strokeStyle = `rgba(66, 133, 244, ${opacity * 0.15})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y)
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y)
            ctx.stroke()
          }
        }
      }
    }

    // Add floating elements
    class FloatingElement {
      // x: number
      // y: number
      // size: number
      // speedX: number
      // speedY: number
      // rotation: number
      // rotationSpeed: number
      // shape: string
      // color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 20 + 10
        this.speedX = Math.random() * 0.3 - 0.15
        this.speedY = Math.random() * 0.3 - 0.15
        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() * 0.01 - 0.005) * (Math.random() > 0.5 ? 1 : -1)
        this.shape = ["circle", "square", "triangle"][Math.floor(Math.random() * 3)]
        this.color = `rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 255)}, 0.1)`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        this.rotation += this.rotationSpeed

        // Boundary check
        if (this.x > canvas.width + this.size) this.x = -this.size
        else if (this.x < -this.size) this.x = canvas.width + this.size

        if (this.y > canvas.height + this.size) this.y = -this.size
        else if (this.y < -this.size) this.y = canvas.height + this.size
      }

      draw() {
        if (!ctx) return
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        ctx.fillStyle = this.color

        if (this.shape === "circle") {
          ctx.beginPath()
          ctx.arc(0, 0, this.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (this.shape === "square") {
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
        } else if (this.shape === "triangle") {
          ctx.beginPath()
          ctx.moveTo(0, -this.size / 2)
          ctx.lineTo(this.size / 2, this.size / 2)
          ctx.lineTo(-this.size / 2, this.size / 2)
          ctx.closePath()
          ctx.fill()
        }

        ctx.restore()
      }
    }

    // Create floating elements
    const floatingElements = []
    const numberOfElements = Math.min(15, Math.floor(window.innerWidth / 100))

    for (let i = 0; i < numberOfElements; i++) {
      floatingElements.push(new FloatingElement())
    }

    // Animation loop
    function animate() {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw floating elements first (background)
      for (let i = 0; i < floatingElements.length; i++) {
        floatingElements[i].update()
        floatingElements[i].draw()
      }

      // Then draw particles and connections
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
        particlesArray[i].draw()
      }

      connect()
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 opacity-50" />
}

