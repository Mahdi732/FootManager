"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { ChevronLeft, Search, ChevronDown, X, Menu, Eye, EyeOff } from "lucide-react"

const INITIAL_PLAYERS = [
  { id: 1, x: 200, y: 450, number: 11 },
  { id: 2, x: 300, y: 280, number: 7 },
  { id: 3, x: 650, y: 180, number: 9 },
  { id: 4, x: 700, y: 350, number: 8 },
  { id: 5, x: 550, y: 520, number: 4 },
]

const PLAYER_RADIUS = 25
const FIELD_PADDING = 20

export function TacticalPlanner() {
  const [players, setPlayers] = useState(INITIAL_PLAYERS)
  const [draggedPlayer, setDraggedPlayer] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [bottomMenuVisible, setBottomMenuVisible] = useState(true)
  const [navbarVisible, setNavbarVisible] = useState(true)
  const [fieldBounds, setFieldBounds] = useState({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  })
  const [previousFieldBounds, setPreviousFieldBounds] = useState({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  })

  const fieldRef = useRef(null)
  const containerRef = useRef(null)

  // Adapt player positions when field bounds change
  const adaptPlayerPositions = useCallback(
    (oldBounds, newBounds) => {
      if (draggedPlayer !== null) return // Don't adapt while dragging

      const oldWidth = oldBounds.right - oldBounds.left
      const oldHeight = oldBounds.bottom - oldBounds.top
      const newWidth = newBounds.right - newBounds.left
      const newHeight = newBounds.bottom - newBounds.top

      // Avoid division by zero
      if (oldWidth <= 0 || oldHeight <= 0 || newWidth <= 0 || newHeight <= 0) return

      setPlayers((prevPlayers) =>
        prevPlayers.map((player) => {
          // Calculate relative position (0-1) in old bounds
          const relativeX = (player.x - oldBounds.left - PLAYER_RADIUS) / (oldWidth - 2 * PLAYER_RADIUS)
          const relativeY = (player.y - oldBounds.top - PLAYER_RADIUS) / (oldHeight - 2 * PLAYER_RADIUS)

          // Calculate new absolute position
          const newX = newBounds.left + PLAYER_RADIUS + relativeX * (newWidth - 2 * PLAYER_RADIUS)
          const newY = newBounds.top + PLAYER_RADIUS + relativeY * (newHeight - 2 * PLAYER_RADIUS)

          // Ensure positions are within bounds
          const constrainedX = Math.max(newBounds.left + PLAYER_RADIUS, Math.min(newBounds.right - PLAYER_RADIUS, newX))
          const constrainedY = Math.max(newBounds.top + PLAYER_RADIUS, Math.min(newBounds.bottom - PLAYER_RADIUS, newY))

          return {
            ...player,
            x: constrainedX,
            y: constrainedY,
          }
        }),
      )
    },
    [draggedPlayer],
  )

  // Calculate field boundaries
  const updateFieldBounds = useCallback(() => {
    if (fieldRef.current) {
      const rect = fieldRef.current.getBoundingClientRect()
      const containerRect = containerRef.current?.getBoundingClientRect()

      if (containerRect) {
        const newBounds = {
          left: FIELD_PADDING,
          top: FIELD_PADDING,
          right: rect.width - FIELD_PADDING,
          bottom: rect.height - FIELD_PADDING,
        }

        // Store previous bounds before updating
        setPreviousFieldBounds(fieldBounds)
        setFieldBounds(newBounds)

        // Adapt player positions if bounds changed significantly
        const boundsChanged =
          Math.abs(fieldBounds.right - newBounds.right) > 10 ||
          Math.abs(fieldBounds.bottom - newBounds.bottom) > 10 ||
          Math.abs(fieldBounds.left - newBounds.left) > 10 ||
          Math.abs(fieldBounds.top - newBounds.top) > 10

        if (boundsChanged && fieldBounds.right > 0) {
          // Use setTimeout to ensure state updates are processed
          setTimeout(() => {
            adaptPlayerPositions(fieldBounds, newBounds)
          }, 100)
        }
      }
    }
  }, [fieldBounds, adaptPlayerPositions])

  useEffect(() => {
    updateFieldBounds()
    window.addEventListener("resize", updateFieldBounds)
    return () => window.removeEventListener("resize", updateFieldBounds)
  }, [updateFieldBounds, sidebarVisible, bottomMenuVisible, navbarVisible])

  // Constrain position within field bounds
  const constrainPosition = useCallback(
    (x, y) => {
      return {
        x: Math.max(fieldBounds.left + PLAYER_RADIUS, Math.min(fieldBounds.right - PLAYER_RADIUS, x)),
        y: Math.max(fieldBounds.top + PLAYER_RADIUS, Math.min(fieldBounds.bottom - PLAYER_RADIUS, y)),
      }
    },
    [fieldBounds],
  )

  // Panel toggle handlers with player adaptation
  const toggleSidebar = useCallback(() => {
    setSidebarVisible((prev) => !prev)
  }, [])

  const toggleBottomMenu = useCallback(() => {
    setBottomMenuVisible((prev) => !prev)
  }, [])

  const toggleNavbar = useCallback(() => {
    setNavbarVisible((prev) => !prev)
  }, [])

  // Mouse event handlers for drag functionality
  const handleMouseDown = useCallback(
    (e, playerId) => {
      e.preventDefault()
      const player = players.find((p) => p.id === playerId)
      if (!player) return

      const rect = fieldRef.current?.getBoundingClientRect()
      if (!rect) return

      setDraggedPlayer(playerId)
      setDragOffset({
        x: e.clientX - rect.left - player.x,
        y: e.clientY - rect.top - player.y,
      })
    },
    [players],
  )

  const handleMouseMove = useCallback(
    (e) => {
      if (draggedPlayer === null) return

      const rect = fieldRef.current?.getBoundingClientRect()
      if (!rect) return

      const newX = e.clientX - rect.left - dragOffset.x
      const newY = e.clientY - rect.top - dragOffset.y
      const constrainedPos = constrainPosition(newX, newY)

      setPlayers((prev) =>
        prev.map((player) => (player.id === draggedPlayer ? { ...player, ...constrainedPos } : player)),
      )
    },
    [draggedPlayer, dragOffset, constrainPosition],
  )

  const handleMouseUp = useCallback(() => {
    setDraggedPlayer(null)
    setDragOffset({ x: 0, y: 0 })
  }, [])

  // Touch event handlers for mobile support
  const handleTouchStart = useCallback(
    (e, playerId) => {
      e.preventDefault()
      const touch = e.touches[0]
      const player = players.find((p) => p.id === playerId)
      if (!player) return

      const rect = fieldRef.current?.getBoundingClientRect()
      if (!rect) return

      setDraggedPlayer(playerId)
      setDragOffset({
        x: touch.clientX - rect.left - player.x,
        y: touch.clientY - rect.top - player.y,
      })
    },
    [players],
  )

  const handleTouchMove = useCallback(
    (e) => {
      if (draggedPlayer === null) return
      e.preventDefault()

      const touch = e.touches[0]
      const rect = fieldRef.current?.getBoundingClientRect()
      if (!rect) return

      const newX = touch.clientX - rect.left - dragOffset.x
      const newY = touch.clientY - rect.top - dragOffset.y
      const constrainedPos = constrainPosition(newX, newY)

      setPlayers((prev) =>
        prev.map((player) => (player.id === draggedPlayer ? { ...player, ...constrainedPos } : player)),
      )
    },
    [draggedPlayer, dragOffset, constrainPosition],
  )

  const handleTouchEnd = useCallback(() => {
    setDraggedPlayer(null)
    setDragOffset({ x: 0, y: 0 })
  }, [])

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header - Collapsible */}
      <header
        className={`bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between transition-transform duration-300 ${
          navbarVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center gap-4">
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 p-2">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-gray-600">return</span>
          <h1 className="text-lg font-semibold">Nom de Plan</h1>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50" onClick={toggleNavbar}>
            <EyeOff className="h-4 w-4" />
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">start</button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Animate</button>
        </div>
      </header>

      {/* Main Content */}
      <div className={`flex-1 flex overflow-hidden transition-all duration-300 ${navbarVisible ? "mt-0" : "-mt-16"}`}>
        {/* Field Container */}
        <div
          ref={containerRef}
          className={`flex-1 flex flex-col transition-all duration-300 ${sidebarVisible ? "mr-80" : "mr-0"}`}
        >
          {/* Field */}
          <div className={`flex-1 p-4 transition-all duration-300 ${bottomMenuVisible ? "pb-20" : "pb-4"}`}>
            <div
              ref={fieldRef}
              className="w-full h-full bg-green-600 border-2 border-gray-300 rounded-lg relative overflow-hidden cursor-crosshair select-none"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Field Markings */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Field outline */}
                <rect
                  x="20"
                  y="20"
                  width="calc(100% - 40px)"
                  height="calc(100% - 40px)"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* Center line */}
                <line x1="50%" y1="20" x2="50%" y2="calc(100% - 20px)" stroke="#ffffff" strokeWidth="2" />

                {/* Center circle */}
                <circle cx="50%" cy="50%" r="80" fill="none" stroke="#ffffff" strokeWidth="2" />

                {/* Penalty areas */}
                <rect
                  x="20"
                  y="calc(50% - 94px)"
                  width="100"
                  height="180"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                <rect
                  x="calc(100% - 120px)"
                  y="calc(50% - 94px)"
                  width="100"
                  height="180"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* Goal areas */}
                <rect
                  x="20"
                  y="calc(50% - 54px)"
                  width="60"
                  height="100"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                <rect
                  x="calc(100% - 80px)"
                  y="calc(50% - 54px)"
                  width="60"
                  height="100"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </svg>

              {/* Players */}
              {players.map((player) => (
                <div
                  key={player.id}
                  className={`absolute w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold cursor-grab select-none transition-all duration-300 hover:scale-110 ${
                    draggedPlayer === player.id ? "cursor-grabbing scale-110 z-10" : ""
                  }`}
                  style={{
                    left: player.x - PLAYER_RADIUS,
                    top: player.y - PLAYER_RADIUS,
                    transform: draggedPlayer === player.id ? "scale(1.1)" : "scale(1)",
                  }}
                  onMouseDown={(e) => handleMouseDown(e, player.id)}
                  onTouchStart={(e) => handleTouchStart(e, player.id)}
                >
                  {player.number}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={`fixed right-0 ${navbarVisible ? "top-16" : "top-0"} bottom-0 w-80 bg-white border-l border-gray-200 transition-all duration-300 ${
            sidebarVisible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 p-2" onClick={toggleSidebar}>
                <EyeOff className="h-4 w-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10 text-right"
                placeholder="search"
              />
            </div>

            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3">
                <div className="text-sm font-medium">Player 7 – Attaquant</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3">
                <div className="text-sm font-medium">Player 10 – Milieu</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3">
                <div className="text-sm font-medium">Player 5 – Défenseur</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Menu */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 transition-transform duration-300 ${
          bottomMenuVisible ? "translate-y-0" : "translate-y-full"
        } ${sidebarVisible ? "right-80" : "right-0"}`}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 p-2"
              onClick={toggleBottomMenu}
            >
              <EyeOff className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              <X className="h-4 w-4" />
              <span className="text-sm">attack</span>
              <span className="text-sm">defence</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">plan</span>
              <span className="text-sm font-medium">4-3-3</span>
              <ChevronDown className="h-4 w-4" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm">style :</span>
              <span className="text-sm font-medium">Tiki Taka</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Toggle buttons for hidden panels */}
      {!navbarVisible && (
        <button
          className="fixed top-4 left-4 z-30 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 bg-white shadow-lg"
          onClick={toggleNavbar}
        >
          <Menu className="h-4 w-4" />
        </button>
      )}

      {!sidebarVisible && (
        <button
          className={`fixed right-4 z-20 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 bg-white shadow-lg ${
            navbarVisible ? "top-20" : "top-4"
          }`}
          onClick={toggleSidebar}
        >
          <Eye className="h-4 w-4" />
        </button>
      )}

      {!bottomMenuVisible && (
        <button
          className="fixed bottom-4 left-4 z-20 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 bg-white shadow-lg"
          onClick={toggleBottomMenu}
        >
          <Menu className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
