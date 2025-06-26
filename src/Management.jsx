"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  Search,
  ChevronDown,
  X,
  Menu,
  Eye,
  EyeOff,
  Play,
  Square,
  Save,
  Plus,
  RotateCcw,
  Zap,
} from "lucide-react"

const INITIAL_PLAYERS = [
  // Gardien - stays in goal area
  {
    id: 1,
    x: 0.07,
    y: 0.5,
    number: 1,
    name: "Goalkeeper",
    image: "https://wallpapers.com/images/featured/aot-manga-pictures-w0t6rqqacrey5lg0.jpg",
    position: "Goalkeeper",
  },

  // Défenseurs (4) - defensive third
  { id: 2, x: 0.25, y: 0.2, number: 2, name: "Right Back", image: null, position: "Defender" },
  { id: 3, x: 0.18, y: 0.35, number: 3, name: "Center Back", image: null, position: "Defender" },
  { id: 4, x: 0.18, y: 0.65, number: 4, name: "Center Back", image: null, position: "Defender" },
  { id: 5, x: 0.25, y: 0.8, number: 5, name: "Left Back", image: null, position: "Defender" },

  // Milieux (3) - middle third, but still in our half
  { id: 6, x: 0.35, y: 0.25, number: 6, name: "Midfielder", image: null, position: "Midfielder" },
  { id: 7, x: 0.42, y: 0.5, number: 8, name: "Central Mid", image: null, position: "Midfielder" },
  { id: 8, x: 0.35, y: 0.75, number: 10, name: "Attacking Mid", image: null, position: "Midfielder" },

  // Attaquants (3) - attacking third, but still in our half
  { id: 9, x: 0.48, y: 0.2, number: 11, name: "Right Wing", image: null, position: "Forward" },
  { id: 10, x: 0.48, y: 0.8, number: 9, name: "Striker", image: null, position: "Forward" },
  { id: 11, x: 0.45, y: 0.5, number: 7, name: "Left Wing", image: null, position: "Forward" },
]

const FORMATIONS = {
  "4-3-3": [
    { id: 1, x: 0.07, y: 0.5, number: 1, name: "Goalkeeper", image: null, position: "Goalkeeper" },
    { id: 2, x: 0.25, y: 0.2, number: 2, name: "Right Back", image: null, position: "Defender" },
    { id: 3, x: 0.18, y: 0.35, number: 3, name: "Center Back", image: null, position: "Defender" },
    { id: 4, x: 0.18, y: 0.65, number: 4, name: "Center Back", image: null, position: "Defender" },
    { id: 5, x: 0.25, y: 0.8, number: 5, name: "Left Back", image: null, position: "Defender" },
    { id: 6, x: 0.35, y: 0.25, number: 6, name: "Midfielder", image: null, position: "Midfielder" },
    { id: 7, x: 0.42, y: 0.5, number: 8, name: "Central Mid", image: null, position: "Midfielder" },
    { id: 8, x: 0.35, y: 0.75, number: 10, name: "Attacking Mid", image: null, position: "Midfielder" },
    { id: 9, x: 0.48, y: 0.2, number: 11, name: "Right Wing", image: null, position: "Forward" },
    { id: 10, x: 0.48, y: 0.8, number: 9, name: "Striker", image: null, position: "Forward" },
    { id: 11, x: 0.45, y: 0.5, number: 7, name: "Left Wing", image: null, position: "Forward" },
  ],
  "3-5-2": [
    { id: 1, x: 0.07, y: 0.5, number: 1, name: "Goalkeeper", image: null, position: "Goalkeeper" },
    { id: 2, x: 0.18, y: 0.3, number: 2, name: "Center Back", image: null, position: "Defender" },
    { id: 3, x: 0.18, y: 0.5, number: 3, name: "Center Back", image: null, position: "Defender" },
    { id: 4, x: 0.18, y: 0.7, number: 4, name: "Center Back", image: null, position: "Defender" },
    { id: 5, x: 0.32, y: 0.15, number: 5, name: "Right Wing Back", image: null, position: "Midfielder" },
    { id: 6, x: 0.32, y: 0.35, number: 6, name: "Central Mid", image: null, position: "Midfielder" },
    { id: 7, x: 0.32, y: 0.5, number: 8, name: "Central Mid", image: null, position: "Midfielder" },
    { id: 8, x: 0.32, y: 0.65, number: 10, name: "Central Mid", image: null, position: "Midfielder" },
    { id: 9, x: 0.32, y: 0.85, number: 11, name: "Left Wing Back", image: null, position: "Midfielder" },
    { id: 10, x: 0.45, y: 0.4, number: 9, name: "Striker", image: null, position: "Forward" },
    { id: 11, x: 0.45, y: 0.6, number: 7, name: "Striker", image: null, position: "Forward" },
  ],
  "3-4-3": [
    { id: 1, x: 0.07, y: 0.5, number: 1, name: "Goalkeeper", image: null, position: "Goalkeeper" },
    { id: 2, x: 0.18, y: 0.3, number: 2, name: "Center Back", image: null, position: "Defender" },
    { id: 3, x: 0.18, y: 0.5, number: 3, name: "Center Back", image: null, position: "Defender" },
    { id: 4, x: 0.18, y: 0.7, number: 4, name: "Center Back", image: null, position: "Defender" },
    { id: 5, x: 0.32, y: 0.3, number: 5, name: "Central Mid", image: null, position: "Midfielder" },
    { id: 6, x: 0.32, y: 0.45, number: 6, name: "Central Mid", image: null, position: "Midfielder" },
    { id: 7, x: 0.32, y: 0.55, number: 8, name: "Central Mid", image: null, position: "Midfielder" },
    { id: 8, x: 0.32, y: 0.7, number: 10, name: "Central Mid", image: null, position: "Midfielder" },
    { id: 9, x: 0.45, y: 0.2, number: 11, name: "Right Wing", image: null, position: "Forward" },
    { id: 10, x: 0.45, y: 0.5, number: 9, name: "Striker", image: null, position: "Forward" },
    { id: 11, x: 0.45, y: 0.8, number: 7, name: "Left Wing", image: null, position: "Forward" },
  ],
}

const PLAN_EFFECTS = {
  "Attack Plan": {
    playerSpacing: 1.2,
    forwardBias: 0.04,
    aggression: "high",
  },
  "Defensive Plan": {
    playerSpacing: 0.8,
    forwardBias: -0.03,
    aggression: "low",
  },
  "Normal Plan": {
    playerSpacing: 1.0,
    forwardBias: 0,
    aggression: "medium",
  },
  "Set Piece Plan": {
    playerSpacing: 0.9,
    forwardBias: 0.015,
    aggression: "medium",
  },
  "Transition Plan": {
    playerSpacing: 1.1,
    forwardBias: 0.02,
    aggression: "high",
  },
}

const STYLE_EFFECTS = {
  "Tiki Taka": {
    compactness: 0.85,
    passingLanes: true,
    tempo: "slow",
  },
  "Counter Attack": {
    compactness: 0.7,
    forwardRush: 0.06,
    tempo: "fast",
  },
  "High Press": {
    compactness: 1.3,
    forwardBias: 0.035,
    tempo: "fast",
  },
  Possession: {
    compactness: 0.9,
    passingLanes: true,
    tempo: "slow",
  },
  "Direct Play": {
    compactness: 1.1,
    forwardBias: 0.03,
    tempo: "medium",
  },
  Gegenpressing: {
    compactness: 1.2,
    forwardBias: 0.04,
    tempo: "fast",
  },
}

const ACTION_COLORS = {
  attack: "#ef4444",
  defense: "#3b82f6",
  pass: "#22c55e",
}

const PLAYING_STYLES = ["Tiki Taka", "Counter Attack", "High Press", "Possession", "Direct Play", "Gegenpressing"]
const PLAN_TYPES = ["Attack Plan", "Defensive Plan", "Normal Plan", "Set Piece Plan", "Transition Plan"]

// Animation speed presets
const ANIMATION_SPEEDS = {
  "Very Slow": { duration: 8, label: "Very Slow", icon: "🐌" },
  Slow: { duration: 6, label: "Slow", icon: "🚶" },
  Normal: { duration: 4, label: "Normal", icon: "🏃" },
  Fast: { duration: 2.5, label: "Fast", icon: "🏃‍♂️" },
  "Very Fast": { duration: 1.5, label: "Very Fast", icon: "⚡" },
}

export default function Management() {
  const [players, setPlayers] = useState(INITIAL_PLAYERS)
  const [draggedPlayer, setDraggedPlayer] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [bottomMenuVisible, setBottomMenuVisible] = useState(true)
  const [navbarVisible, setNavbarVisible] = useState(true)

  // Drawing states
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [drawingMode, setDrawingMode] = useState(false)
  const [currentAction, setCurrentAction] = useState(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawings, setDrawings] = useState([])
  const [savedPlan, setSavedPlan] = useState(null)
  const [drawingHistory, setDrawingHistory] = useState([]) // Store drawing history for undo

  // Animation states
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0)
  const [animationQueue, setAnimationQueue] = useState([])
  const [animatedPlayers, setAnimatedPlayers] = useState({})
  const [animatedBalls, setAnimatedBalls] = useState([])
  const [animationSpeed, setAnimationSpeed] = useState("Normal") // New animation speed state
  const [showSpeedDropdown, setShowSpeedDropdown] = useState(false)

  // Player creation states
  const [showPlayerCreator, setShowPlayerCreator] = useState(false)
  const [newPlayer, setNewPlayer] = useState({ name: "", number: "", image: null, position: "Midfielder" })
  const [playerImagePreview, setPlayerImagePreview] = useState(null)
  const [benchPlayers, setBenchPlayers] = useState([])

  // Bench player drag states
  const [draggedBenchPlayer, setDraggedBenchPlayer] = useState(null)
  const [draggedFromBench, setDraggedFromBench] = useState(false)

  // Search and dropdown states
  const [searchTerm, setSearchTerm] = useState("")
  const [currentFormation, setCurrentFormation] = useState("4-3-3")
  const [currentStyle, setCurrentStyle] = useState("Tiki Taka")
  const [currentPlanType, setCurrentPlanType] = useState("Normal Plan")
  const [showFormationDropdown, setShowFormationDropdown] = useState(false)
  const [showStyleDropdown, setShowStyleDropdown] = useState(false)
  const [showPlanDropdown, setShowPlanDropdown] = useState(false)

  // Add responsive states
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isTV, setIsTV] = useState(false)

  // Multi-selection states
  const [multiSelectMode, setMultiSelectMode] = useState(false)
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [selectionLayer, setSelectionLayer] = useState(null) // 'attack', 'defense', or null

  const fieldRef = useRef(null)
  const canvasRef = useRef(null)
  const animationTimeoutRef = useRef(null)
  const nextStepTimeoutRef = useRef(null)

  // Detect device type
  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      setIsTV(width >= 1920 || height >= 1080)

      // Auto-hide panels on mobile
      if (width < 768) {
        setSidebarVisible(false)
        setBottomMenuVisible(false)
      } else if (width >= 768 && width < 1024) {
        setSidebarVisible(false)
        setBottomMenuVisible(true)
      } else {
        setSidebarVisible(true)
        setBottomMenuVisible(true)
      }
    }

    checkDeviceType()
    window.addEventListener("resize", checkDeviceType)
    return () => window.removeEventListener("resize", checkDeviceType)
  }, [])

  // Get responsive player size
  const getPlayerSize = useCallback(() => {
    if (isMobile) return 32 // 8 * 4 = 32px
    if (isTablet) return 40 // 10 * 4 = 40px
    if (isTV) return 64 // 16 * 4 = 64px
    return 48 // 12 * 4 = 48px (desktop)
  }, [isMobile, isTablet, isTV])

  // Get responsive spacing
  const getSpacing = useCallback(() => {
    if (isMobile) return "p-2 gap-2"
    if (isTablet) return "p-3 gap-3"
    if (isTV) return "p-8 gap-6"
    return "p-4 gap-4"
  }, [isMobile, isTablet, isTV])

  // Get responsive text sizes
  const getTextSizes = useCallback(() => {
    if (isMobile) return { base: "text-xs", medium: "text-sm", large: "text-base" }
    if (isTablet) return { base: "text-sm", medium: "text-base", large: "text-lg" }
    if (isTV) return { base: "text-xl", medium: "text-2xl", large: "text-3xl" }
    return { base: "text-sm", medium: "text-base", large: "text-lg" }
  }, [isMobile, isTablet, isTV])

  // Filter players based on search term
  const filteredFieldPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.number.toString().includes(searchTerm) ||
      player.position.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredBenchPlayers = benchPlayers.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.number.toString().includes(searchTerm) ||
      player.position.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Convert relative coordinates to absolute coordinates
  const toAbsoluteCoords = useCallback(
    (relX, relY) => {
      if (!fieldRef.current) return { x: 0, y: 0 }

      const rect = fieldRef.current.getBoundingClientRect()
      const padding = isMobile ? 8 : isTablet ? 12 : isTV ? 32 : 20

      return {
        x: padding + relX * (rect.width - 2 * padding),
        y: padding + relY * (rect.height - 2 * padding),
      }
    },
    [isMobile, isTablet, isTV],
  )

  // Convert absolute coordinates to relative coordinates
  const toRelativeCoords = useCallback(
    (x, y) => {
      if (!fieldRef.current) return { x: 0, y: 0 }

      const rect = fieldRef.current.getBoundingClientRect()
      const padding = isMobile ? 8 : isTablet ? 12 : isTV ? 32 : 20

      return {
        x: (x - padding) / (rect.width - 2 * padding),
        y: (y - padding) / (rect.height - 2 * padding),
      }
    },
    [isMobile, isTablet, isTV],
  )

  const constrainPosition = useCallback(
    (relX, relY) => {
      const playerRadius = getPlayerSize() / 2
      const fieldRect = fieldRef.current?.getBoundingClientRect()
      if (!fieldRect) return { x: relX, y: relY }

      const padding = isMobile ? 8 : isTablet ? 12 : isTV ? 32 : 20
      const minRel = playerRadius / (fieldRect.width - 2 * padding)
      const maxRel = 1 - minRel

      return {
        x: Math.max(minRel, Math.min(0.5, relX)), // Keep players in left half (max 0.5)
        y: Math.max(minRel, Math.min(maxRel, relY)),
      }
    },
    [getPlayerSize, isMobile, isTablet, isTV],
  )

  // Apply plan and style effects to player positions
  const applyPlanEffects = useCallback(
    (baseFormation, planType, style) => {
      const formationData = FORMATIONS[baseFormation]
      if (!formationData) return players

      const planEffect = PLAN_EFFECTS[planType] || PLAN_EFFECTS["Normal Plan"]
      const styleEffect = STYLE_EFFECTS[style] || STYLE_EFFECTS["Tiki Taka"]

      return formationData.map((player, index) => {
        const existingPlayer = players[index] || player
        let newX = player.x
        let newY = player.y

        // Apply plan type effects
        if (planEffect.forwardBias !== 0) {
          newX += planEffect.forwardBias
        }

        // Apply style effects
        if (styleEffect.compactness !== 1) {
          const centerX = 0.5
          const centerY = 0.5
          const distanceFromCenterX = player.x - centerX
          const distanceFromCenterY = player.y - centerY

          newX = centerX + distanceFromCenterX * styleEffect.compactness
          newY = centerY + distanceFromCenterY * styleEffect.compactness
        }

        if (styleEffect.forwardBias) {
          newX += styleEffect.forwardBias
        }

        if (styleEffect.forwardRush && planType === "Counter Attack") {
          if (existingPlayer.position === "Forward") {
            newX += styleEffect.forwardRush
          }
        }

        // Ensure positions stay within bounds
        const constrained = constrainPosition(newX, newY)

        return {
          ...existingPlayer,
          x: constrained.x,
          y: constrained.y,
        }
      })
    },
    [players, constrainPosition],
  )

  // Change formation with plan effects
  const changeFormation = useCallback(
    (formation) => {
      const updatedPlayers = applyPlanEffects(formation, currentPlanType, currentStyle)
      setPlayers(updatedPlayers)
      setCurrentFormation(formation)
    },
    [currentPlanType, currentStyle, applyPlanEffects],
  )

  // Change playing style with effects
  const changeStyle = useCallback(
    (style) => {
      const updatedPlayers = applyPlanEffects(currentFormation, currentPlanType, style)
      setPlayers(updatedPlayers)
      setCurrentStyle(style)
    },
    [currentFormation, currentPlanType, applyPlanEffects],
  )

  // Change plan type with effects
  const changePlanType = useCallback(
    (planType) => {
      const updatedPlayers = applyPlanEffects(currentFormation, planType, currentStyle)
      setPlayers(updatedPlayers)
      setCurrentPlanType(planType)
    },
    [currentFormation, currentStyle, applyPlanEffects],
  )

  // Undo last drawing
  const undoLastDrawing = useCallback(() => {
    if (drawings.length > 0) {
      const lastDrawing = drawings[drawings.length - 1]
      setDrawingHistory((prev) => [...prev, lastDrawing])
      setDrawings((prev) => prev.slice(0, -1))
    }
  }, [drawings])

  // Redo last undone drawing
  const redoLastDrawing = useCallback(() => {
    if (drawingHistory.length > 0) {
      const lastUndone = drawingHistory[drawingHistory.length - 1]
      setDrawings((prev) => [...prev, lastUndone])
      setDrawingHistory((prev) => prev.slice(0, -1))
    }
  }, [drawingHistory])

  // Setup canvas
  useEffect(() => {
    if (canvasRef.current && fieldRef.current) {
      const canvas = canvasRef.current
      const field = fieldRef.current
      const rect = field.getBoundingClientRect()

      canvas.width = rect.width
      canvas.height = rect.height

      const ctx = canvas.getContext("2d")
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (!isAnimating) {
        drawings.forEach((drawing) => {
          ctx.strokeStyle = drawing.color
          ctx.lineWidth = isMobile ? 3 : isTablet ? 4 : isTV ? 8 : 4
          ctx.lineCap = "round"
          ctx.lineJoin = "round"

          // Add glow effect for better visibility
          ctx.shadowColor = drawing.color
          ctx.shadowBlur = isMobile ? 3 : isTablet ? 4 : isTV ? 8 : 5

          ctx.beginPath()
          drawing.points.forEach((point, index) => {
            const absCoords = toAbsoluteCoords(point.x, point.y)
            if (index === 0) {
              ctx.moveTo(absCoords.x, absCoords.y)
            } else {
              ctx.lineTo(absCoords.x, absCoords.y)
            }
          })
          ctx.stroke()

          // Draw arrow at the end
          if (drawing.points.length > 1) {
            const lastPoint = toAbsoluteCoords(
              drawing.points[drawing.points.length - 1].x,
              drawing.points[drawing.points.length - 1].y,
            )
            const secondLastPoint = toAbsoluteCoords(
              drawing.points[drawing.points.length - 2].x,
              drawing.points[drawing.points.length - 2].y,
            )

            const angle = Math.atan2(lastPoint.y - secondLastPoint.y, lastPoint.x - secondLastPoint.x)
            const arrowLength = isMobile ? 12 : isTablet ? 15 : isTV ? 25 : 18

            ctx.beginPath()
            ctx.moveTo(lastPoint.x, lastPoint.y)
            ctx.lineTo(
              lastPoint.x - arrowLength * Math.cos(angle - Math.PI / 6),
              lastPoint.y - arrowLength * Math.sin(angle - Math.PI / 6),
            )
            ctx.moveTo(lastPoint.x, lastPoint.y)
            ctx.lineTo(
              lastPoint.x - arrowLength * Math.cos(angle + Math.PI / 6),
              lastPoint.y - arrowLength * Math.sin(angle + Math.PI / 6),
            )
            ctx.stroke()
          }

          // Reset shadow
          ctx.shadowBlur = 0
        })
      }
    }
  }, [
    drawings,
    sidebarVisible,
    bottomMenuVisible,
    navbarVisible,
    toAbsoluteCoords,
    isAnimating,
    isMobile,
    isTablet,
    isTV,
  ])

  // Panel toggle handlers - FAST responsive
  const toggleSidebar = useCallback(() => {
    setSidebarVisible((prev) => !prev)
  }, [])

  const toggleBottomMenu = useCallback(() => {
    setBottomMenuVisible((prev) => !prev)
  }, [])

  const toggleNavbar = useCallback(() => {
    setNavbarVisible((prev) => !prev)
  }, [])

  // Handle action selection from navbar
  const handleActionSelect = useCallback((action) => {
    setCurrentAction(action)
    setSelectedPlayer(null)
  }, [])

  // Handle player selection
  const handlePlayerClick = useCallback(
    (e, playerId) => {
      if (draggedPlayer !== null || isAnimating) return
      if (!currentAction) return

      e.stopPropagation()

      if (multiSelectMode) {
        // Multi-selection mode
        if (selectedPlayers.includes(playerId)) {
          // If player is already selected, start drawing for this specific player
          setSelectedPlayer(playerId)
          setDrawingMode(true)
        } else {
          // Select new player
          if (selectionLayer === null) {
            setSelectionLayer(currentAction)
          }
          if (selectionLayer === currentAction) {
            setSelectedPlayers((prev) => [...prev, playerId])
          }
        }
      } else {
        // Single selection mode
        if (e.shiftKey || e.ctrlKey) {
          // Start multi-selection
          setMultiSelectMode(true)
          setSelectedPlayers([playerId])
          setSelectionLayer(currentAction)
        } else {
          // Single selection
          setSelectedPlayer(playerId)
          setDrawingMode(true)
        }
      }
    },
    [draggedPlayer, isAnimating, currentAction, multiSelectMode, selectedPlayers, selectionLayer],
  )

  // Handle drawing start
  const handleDrawingStart = useCallback(
    (e) => {
      if (!currentAction) return
      if (multiSelectMode && !selectedPlayer) return // Need a specific player selected in multi-mode
      if (!multiSelectMode && (!drawingMode || !selectedPlayer)) return

      const rect = fieldRef.current?.getBoundingClientRect()
      if (!rect) return

      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX)
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY)

      if (!clientX || !clientY) return

      const x = clientX - rect.left
      const y = clientY - rect.top

      const padding = isMobile ? 8 : isTablet ? 12 : isTV ? 32 : 20
      if (x < padding || x > rect.width - padding || y < padding || y > rect.height - padding) return

      setIsDrawing(true)
      const relativeCoords = toRelativeCoords(x, y)

      // Use a shared timestamp for multi-select movements - this is the key fix
      const timestamp = multiSelectMode ? Date.now() : Date.now()

      // Store the shared timestamp for this multi-select session
      if (multiSelectMode && !window.multiSelectTimestamp) {
        window.multiSelectTimestamp = timestamp
      }
      const finalTimestamp = multiSelectMode ? window.multiSelectTimestamp : timestamp

      // Always draw for the specific selected player (works for both single and multi-select)
      setDrawings((prev) => [
        ...prev,
        {
          id: finalTimestamp,
          playerId: selectedPlayer,
          action: currentAction,
          color: ACTION_COLORS[currentAction],
          points: [relativeCoords],
        },
      ])
    },
    [currentAction, multiSelectMode, selectedPlayer, drawingMode, toRelativeCoords, isMobile, isTablet, isTV],
  )

  // Handle drawing move
  const handleDrawingMove = useCallback(
    (e) => {
      if (!isDrawing || !selectedPlayer) return

      const rect = fieldRef.current?.getBoundingClientRect()
      if (!rect) return

      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX)
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY)

      if (!clientX || !clientY) return

      const x = clientX - rect.left
      const y = clientY - rect.top

      const padding = isMobile ? 8 : isTablet ? 12 : isTV ? 32 : 20
      if (x < padding || x > rect.width - padding || y < padding || y > rect.height - padding) return

      const relativeCoords = toRelativeCoords(x, y)

      setDrawings((prev) => {
        const newDrawings = [...prev]
        const currentDrawing = newDrawings[newDrawings.length - 1]
        if (currentDrawing && currentDrawing.playerId === selectedPlayer) {
          currentDrawing.points.push(relativeCoords)
        }
        return newDrawings
      })
    },
    [isDrawing, selectedPlayer, toRelativeCoords, isMobile, isTablet, isTV],
  )

  // Handle drawing end
  const handleDrawingEnd = useCallback(() => {
    setIsDrawing(false)
    setDrawingMode(false)
    if (multiSelectMode) {
      // In multi-select mode, clear the current player but keep selection active
      setSelectedPlayer(null)
    } else {
      // In single mode, clear everything
      setSelectedPlayer(null)
    }
  }, [multiSelectMode])

  const clearMultiSelection = useCallback(() => {
    setMultiSelectMode(false)
    setSelectedPlayers([])
    setSelectionLayer(null)
    setSelectedPlayer(null)
    setDrawingMode(false)
    // Clear the shared timestamp when exiting multi-select mode
    window.multiSelectTimestamp = null
  }, [])

  // Save plan
  const savePlan = useCallback(() => {
    setSavedPlan({
      players: [...players],
      drawings: [...drawings],
      formation: currentFormation,
      style: currentStyle,
      planType: currentPlanType,
      timestamp: Date.now(),
    })
  }, [players, drawings, currentFormation, currentStyle, currentPlanType])

  // Animate single step with configurable speed - Updated for multi-select
  const animateStep = useCallback(
    (queue, stepIndex) => {
      const currentStep = queue[stepIndex]
      const duration = ANIMATION_SPEEDS[animationSpeed].duration

      // Check if this is a group of simultaneous movements (multi-select)
      const isGroup = Array.isArray(currentStep)
      const steps = isGroup ? currentStep : [currentStep]

      // Handle different action types
      const passSteps = steps.filter((step) => step.action === "pass")
      const movementSteps = steps.filter((step) => step.action !== "pass")

      if (passSteps.length > 0) {
        // Clear any existing animations first
        setAnimatedBalls([])
        setAnimatedPlayers({})

        // Add small delay to ensure clean transition
        setTimeout(() => {
          const newBalls = passSteps.map((step, index) => ({
            id: `ball-${step.id}-${stepIndex}-${index}`,
            path: step.path,
            color: "#ffffff",
          }))
          setAnimatedBalls(newBalls)
        }, 50)
      }

      if (movementSteps.length > 0) {
        setAnimatedBalls([])
        const newAnimatedPlayers = {}
        movementSteps.forEach((step) => {
          newAnimatedPlayers[step.playerId] = {
            path: step.path,
            originalPosition: step.originalPosition,
          }
        })
        setAnimatedPlayers(newAnimatedPlayers)
      }

      animationTimeoutRef.current = setTimeout(() => {
        // Clear current animations
        setAnimatedBalls([])
        setAnimatedPlayers({})

        // Update player positions for movement steps
        if (movementSteps.length > 0) {
          setPlayers((prevPlayers) =>
            prevPlayers.map((player) => {
              const playerStep = movementSteps.find((step) => step.playerId === player.id)
              if (playerStep && playerStep.path.length > 0) {
                const finalPosition = playerStep.path[playerStep.path.length - 1]
                const finalRelative = toRelativeCoords(finalPosition.x, finalPosition.y)
                return { ...player, x: finalRelative.x, y: finalRelative.y }
              }
              return player
            }),
          )
        }

        const nextIndex = stepIndex + 1
        if (nextIndex < queue.length) {
          setCurrentAnimationIndex(nextIndex)

          nextStepTimeoutRef.current = setTimeout(() => {
            animateStep(queue, nextIndex)
          }, 300) // Delay between different phases
        } else {
          setIsAnimating(false)
          setAnimationQueue([])
          setCurrentAnimationIndex(0)

          if (savedPlan) {
            setPlayers([...savedPlan.players])
          }
        }
      }, duration * 1000)
    },
    [savedPlan, toRelativeCoords, animationSpeed],
  )

  // Start animation with improved multi-select grouping
  const startAnimation = useCallback(() => {
    if (!savedPlan) return

    // Group drawings by timestamp and action type to identify multi-select movements
    const drawingGroups = []
    const processedDrawings = new Set()

    savedPlan.drawings
      .filter((d) => d.points.length > 1)
      .forEach((drawing) => {
        if (processedDrawings.has(drawing.id)) return

        const currentPlayer = players.find((p) => p.id === drawing.playerId)
        if (!currentPlayer) return

        // Find other drawings that have the EXACT same timestamp (multi-select)
        // or were created within a very short time frame (100ms instead of 1000ms)
        const simultaneousDrawings = savedPlan.drawings.filter(
          (d) =>
            d.points.length > 1 &&
            !processedDrawings.has(d.id) &&
            (d.id === drawing.id || Math.abs(d.id - drawing.id) < 100) && // Much tighter time window
            d.action === drawing.action, // Same action type
        )

        const animationSteps = simultaneousDrawings
          .map((d) => {
            const player = players.find((p) => p.id === d.playerId)
            if (!player) return null

            const path = d.points.map((point) => {
              const absoluteCoords = toAbsoluteCoords(point.x, point.y)
              return { x: absoluteCoords.x, y: absoluteCoords.y }
            })

            const originalAbsPos = toAbsoluteCoords(player.x, player.y)

            processedDrawings.add(d.id)

            return {
              id: d.id,
              playerId: d.playerId,
              action: d.action,
              color: d.color,
              path: path,
              originalPosition: originalAbsPos,
            }
          })
          .filter(Boolean)

        // If multiple drawings were created simultaneously, group them
        if (animationSteps.length > 1) {
          drawingGroups.push(animationSteps)
        } else if (animationSteps.length === 1) {
          drawingGroups.push(animationSteps[0])
        }
      })

    setAnimationQueue(drawingGroups)
    setIsAnimating(true)
    setCurrentAnimationIndex(0)

    if (drawingGroups.length > 0) {
      animateStep(drawingGroups, 0)
    }
  }, [savedPlan, players, toAbsoluteCoords, animateStep])

  // Stop animation
  const stopAnimation = useCallback(() => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
      animationTimeoutRef.current = null
    }
    if (nextStepTimeoutRef.current) {
      clearTimeout(nextStepTimeoutRef.current)
      nextStepTimeoutRef.current = null
    }

    setIsAnimating(false)
    setAnimatedPlayers({})
    setAnimatedBalls([])
    setAnimationQueue([])
    setCurrentAnimationIndex(0)

    if (savedPlan) {
      setPlayers([...savedPlan.players])
    }
  }, [savedPlan])

  // Clear all drawings
  const clearDrawings = useCallback(() => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
      animationTimeoutRef.current = null
    }
    if (nextStepTimeoutRef.current) {
      clearTimeout(nextStepTimeoutRef.current)
      nextStepTimeoutRef.current = null
    }

    setDrawings([])
    setDrawingHistory([])
    setSavedPlan(null)
    setCurrentAction(null)
    setSelectedPlayer(null)
    setIsAnimating(false)
    setAnimatedPlayers({})
    setAnimatedBalls([])
    setAnimationQueue([])
    setCurrentAnimationIndex(0)
  }, [])

  // Mouse and touch event handlers for player dragging
  const handlePlayerStart = useCallback(
    (e, playerId) => {
      if (drawingMode || isAnimating) return

      e.preventDefault()
      const player = players.find((p) => p.id === playerId)
      if (!player) return

      const rect = fieldRef.current?.getBoundingClientRect()
      if (!rect) return

      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX)
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY)

      if (!clientX || !clientY) return

      const playerAbsPos = toAbsoluteCoords(player.x, player.y)

      setDraggedPlayer(playerId)
      setDragOffset({
        x: clientX - rect.left - playerAbsPos.x,
        y: clientY - rect.top - playerAbsPos.y,
      })
    },
    [players, drawingMode, isAnimating, toAbsoluteCoords],
  )

  const handlePlayerMove = useCallback(
    (e) => {
      if (drawingMode) {
        handleDrawingMove(e)
        return
      }

      if (draggedPlayer === null) return

      const rect = fieldRef.current?.getBoundingClientRect()
      if (!rect) return

      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX)
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY)

      if (!clientX || !clientY) return

      const newX = clientX - rect.left - dragOffset.x
      const newY = clientY - rect.top - dragOffset.y
      const relativePos = toRelativeCoords(newX, newY)
      const constrainedPos = constrainPosition(relativePos.x, relativePos.y)

      setPlayers((prev) =>
        prev.map((player) => (player.id === draggedPlayer ? { ...player, ...constrainedPos } : player)),
      )
    },
    [draggedPlayer, dragOffset, constrainPosition, drawingMode, handleDrawingMove, toRelativeCoords],
  )

  const handlePlayerEnd = useCallback(() => {
    if (drawingMode) {
      handleDrawingEnd()
      return
    }

    setDraggedPlayer(null)
    setDragOffset({ x: 0, y: 0 })
  }, [drawingMode, handleDrawingEnd])

  // Bench player drag handlers
  const handleBenchPlayerDragStart = useCallback((e, playerId) => {
    e.dataTransfer.setData("text/plain", playerId.toString())
    setDraggedBenchPlayer(playerId)
    setDraggedFromBench(true)
  }, [])

  const handleFieldPlayerDragOver = useCallback((e) => {
    e.preventDefault()
  }, [])

  const substitutePlayer = useCallback(
    (fieldPlayerId, benchPlayerId) => {
      const fieldPlayer = players.find((p) => p.id === fieldPlayerId)
      const benchPlayer = benchPlayers.find((p) => p.id === benchPlayerId)

      if (!fieldPlayer || !benchPlayer) return

      const fieldPlayerForBench = {
        id: fieldPlayer.id,
        number: fieldPlayer.number,
        name: fieldPlayer.name,
        image: fieldPlayer.image,
        position: fieldPlayer.position,
      }

      const benchPlayerForField = {
        ...benchPlayer,
        x: fieldPlayer.x,
        y: fieldPlayer.y,
      }

      setPlayers((prev) => prev.map((p) => (p.id === fieldPlayerId ? benchPlayerForField : p)))
      setBenchPlayers((prev) => prev.map((p) => (p.id === benchPlayerId ? fieldPlayerForBench : p)))
    },
    [players, benchPlayers],
  )

  const handleFieldPlayerDrop = useCallback(
    (e, fieldPlayerId) => {
      e.preventDefault()
      const benchPlayerId = Number.parseInt(e.dataTransfer.getData("text/plain"))
      if (benchPlayerId && draggedFromBench) {
        substitutePlayer(fieldPlayerId, benchPlayerId)
        setDraggedBenchPlayer(null)
        setDraggedFromBench(false)
      }
    },
    [substitutePlayer, draggedFromBench],
  )

  const handleBenchPlayerDragEnd = useCallback(() => {
    setDraggedBenchPlayer(null)
    setDraggedFromBench(false)
  }, [])

  // Handle image upload
  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target.result
        setPlayerImagePreview(imageUrl)
        setNewPlayer((prev) => ({ ...prev, image: imageUrl }))
      }
      reader.readAsDataURL(file)
    }
  }, [])

  // Create new player
  const createPlayer = useCallback(() => {
    if (!newPlayer.name || !newPlayer.number) return

    const newPlayerId = Math.max(...players.map((p) => p.id), ...benchPlayers.map((p) => p.id)) + 1
    const newPlayerData = {
      id: newPlayerId,
      number: Number.parseInt(newPlayer.number),
      name: newPlayer.name,
      image: newPlayer.image,
      position: newPlayer.position,
    }

    setBenchPlayers((prev) => [...prev, newPlayerData])
    setNewPlayer({ name: "", number: "", image: null, position: "Midfielder" })
    setPlayerImagePreview(null)
    setShowPlayerCreator(false)
  }, [players, benchPlayers, newPlayer])

  // Delete player
  const deletePlayer = useCallback(
    (playerId, isFromBench = false) => {
      if (isFromBench) {
        setBenchPlayers((prev) => prev.filter((p) => p.id !== playerId))
      } else {
        if (players.length <= 11) {
          alert("Cannot delete field players. Team must have 11 players on field.")
          return
        }
        setPlayers((prev) => prev.filter((p) => p.id !== playerId))
      }
    },
    [players],
  )

  const playerSize = getPlayerSize()
  const spacing = getSpacing()
  const textSizes = getTextSizes()

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {navbarVisible && (
        <header
          className={`bg-white border-b border-gray-200 ${isMobile ? "px-2 py-2 flex-col gap-2" : "px-4 py-3 flex-row"} flex items-center justify-between`}
        >
          <div className={`flex items-center ${isMobile ? "gap-2" : "gap-4"}`}>
            <button
              className={`${isMobile ? "px-2 py-1" : "px-3 py-1"} border border-gray-300 rounded hover:bg-gray-50`}
            >
              <ChevronLeft className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            </button>
            <span className={`${isMobile ? "text-xs" : "text-sm"} text-gray-600`}>return</span>
            <h1 className={`${isMobile ? "text-base" : isTV ? "text-2xl" : "text-lg"} font-semibold`}>Tactical Plan</h1>
          </div>

          <div className={`flex items-center ${isMobile ? "gap-1 flex-wrap justify-center" : "gap-2"}`}>
            <button
              className={`${isMobile ? "px-2 py-1" : "px-3 py-1"} border border-gray-300 rounded hover:bg-gray-50`}
              onClick={toggleNavbar}
            >
              <EyeOff className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            </button>

            {/* Action Selection - Responsive */}
            <div
              className={`flex items-center ${isMobile ? "gap-1" : "gap-2"} bg-gray-50 ${isMobile ? "px-2 py-1" : "px-3 py-1"} rounded border`}
            >
              {!isMobile && <span className="text-sm font-medium">Select Action:</span>}
              <button
                className={`${isMobile ? "px-2 py-1 text-xs" : "px-3 py-1 text-sm"} rounded ${
                  currentAction === "attack"
                    ? "bg-red-500 text-white"
                    : "bg-white border border-red-300 text-red-600 hover:bg-red-50"
                }`}
                onClick={() => handleActionSelect("attack")}
                disabled={drawingMode || isAnimating}
              >
                {isMobile ? "A" : "Attack"}
              </button>
              <button
                className={`${isMobile ? "px-2 py-1 text-xs" : "px-3 py-1 text-sm"} rounded ${
                  currentAction === "defense"
                    ? "bg-blue-500 text-white"
                    : "bg-white border border-blue-300 text-blue-600 hover:bg-blue-50"
                }`}
                onClick={() => handleActionSelect("defense")}
                disabled={drawingMode || isAnimating}
              >
                {isMobile ? "D" : "Defense"}
              </button>
              <button
                className={`${isMobile ? "px-2 py-1 text-xs" : "px-3 py-1 text-sm"} rounded ${
                  currentAction === "pass"
                    ? "bg-green-500 text-white"
                    : "bg-white border border-green-300 text-green-600 hover:bg-green-50"
                }`}
                onClick={() => handleActionSelect("pass")}
                disabled={drawingMode || isAnimating}
              >
                {isMobile ? "P" : "Pass"}
              </button>
            </div>

            {/* Animation Speed Control */}
            <div className="relative">
              <button
                className={`${isMobile ? "px-2 py-1" : "px-3 py-1"} border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1`}
                onClick={() => setShowSpeedDropdown(!showSpeedDropdown)}
                disabled={isAnimating}
              >
                <Zap className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
                {!isMobile && <span className="text-sm">{ANIMATION_SPEEDS[animationSpeed].label}</span>}
                <ChevronDown className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
              </button>
              {showSpeedDropdown && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-32">
                  {Object.entries(ANIMATION_SPEEDS).map(([key, speed]) => (
                    <button
                      key={key}
                      className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                        animationSpeed === key ? "bg-blue-50 text-blue-600" : ""
                      }`}
                      onClick={() => {
                        setAnimationSpeed(key)
                        setShowSpeedDropdown(false)
                      }}
                    >
                      <span className="mr-2">{speed.icon}</span>
                      {speed.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Drawing Controls */}
            {drawings.length > 0 && (
              <div className={`flex items-center ${isMobile ? "gap-1" : "gap-2"}`}>
                <button
                  className={`${isMobile ? "px-2 py-1" : "px-3 py-1"} border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1`}
                  onClick={undoLastDrawing}
                  disabled={drawings.length === 0 || isAnimating}
                  title="Undo last drawing"
                >
                  <RotateCcw className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
                  {!isMobile && "Undo"}
                </button>
                {drawingHistory.length > 0 && (
                  <button
                    className={`${isMobile ? "px-2 py-1" : "px-3 py-1"} border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1`}
                    onClick={redoLastDrawing}
                    disabled={drawingHistory.length === 0 || isAnimating}
                    title="Redo last undone drawing"
                  >
                    <RotateCcw className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} scale-x-[-1]`} />
                    {!isMobile && "Redo"}
                  </button>
                )}
              </div>
            )}

            {/* Multi-Selection Controls */}
            <div
              className={`flex items-center ${isMobile ? "gap-1" : "gap-2"} bg-gray-50 ${isMobile ? "px-2 py-1" : "px-3 py-1"} rounded border`}
            >
              <button
                className={`${isMobile ? "px-2 py-1 text-xs" : "px-3 py-1 text-sm"} rounded ${
                  multiSelectMode
                    ? "bg-purple-500 text-white"
                    : "bg-white border border-purple-300 text-purple-600 hover:bg-purple-50"
                }`}
                onClick={() => {
                  if (multiSelectMode) {
                    clearMultiSelection()
                  } else {
                    setMultiSelectMode(true)
                  }
                }}
                disabled={isAnimating}
              >
                {isMobile ? "Multi" : "Multi-Select"}
              </button>
              {multiSelectMode && (
                <span className={`${isMobile ? "text-xs" : "text-sm"} text-purple-600 font-medium`}>
                  {selectedPlayers.length} selected
                </span>
              )}
              {multiSelectMode && selectedPlayers.length > 0 && (
                <button
                  className={`${isMobile ? "px-2 py-1 text-xs" : "px-3 py-1 text-sm"} bg-red-500 text-white rounded hover:bg-red-600`}
                  onClick={clearMultiSelection}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Rest of buttons with responsive sizing */}
            {drawingMode && (
              <div
                className={`flex items-center ${isMobile ? "gap-1" : "gap-2"} bg-yellow-50 ${isMobile ? "px-2 py-1" : "px-3 py-1"} rounded border`}
              >
                <span className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}>
                  {isMobile
                    ? "Drawing"
                    : `Drawing ${currentAction} for Player ${players.find((p) => p.id === selectedPlayer)?.number}`}
                </span>
              </div>
            )}

            {isAnimating && (
              <div
                className={`flex items-center ${isMobile ? "gap-1" : "gap-2"} bg-blue-50 ${isMobile ? "px-2 py-1" : "px-3 py-1"} rounded border`}
              >
                <span className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}>
                  {isMobile
                    ? `${currentAnimationIndex + 1}/${animationQueue.length}`
                    : `Animating Step ${currentAnimationIndex + 1} of ${animationQueue.length} (${ANIMATION_SPEEDS[animationSpeed].label})`}
                </span>
              </div>
            )}

            <button
              className={`${isMobile ? "px-2 py-1" : "px-3 py-1"} border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1`}
              onClick={savePlan}
              disabled={drawings.length === 0}
            >
              <Save className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
              {!isMobile && "Save Plan"}
            </button>

            <button
              className={`${isMobile ? "px-2 py-1" : "px-3 py-1"} rounded flex items-center gap-1 ${
                isAnimating ? "bg-red-500 text-white hover:bg-red-600" : "bg-green-500 text-white hover:bg-green-600"
              }`}
              onClick={isAnimating ? stopAnimation : startAnimation}
              disabled={!savedPlan}
            >
              {isAnimating ? (
                <Square className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
              ) : (
                <Play className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
              )}
              {!isMobile && (isAnimating ? "Stop" : "Animate")}
            </button>

            <button
              className={`${isMobile ? "px-2 py-1 text-xs" : "px-3 py-1"} bg-gray-500 text-white rounded hover:bg-gray-600`}
              onClick={clearDrawings}
            >
              {isMobile ? "Clear" : "Clear All"}
            </button>

            <button
              className={`${isMobile ? "px-2 py-1" : "px-3 py-1"} bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1`}
              onClick={() => setShowPlayerCreator(true)}
            >
              <Plus className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
              {!isMobile && "Create Player"}
            </button>
          </div>
        </header>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Field Container */}
        <div
          className={`flex-1 flex flex-col ${sidebarVisible ? (isMobile ? "mr-0" : isTablet ? "mr-64" : "mr-80") : "mr-0"} transition-all duration-300`}
        >
          {/* Field */}
          <div className={`flex-1 ${isMobile ? "p-2" : isTV ? "p-8" : "p-4"} transition-all duration-300 min-h-0`}>
            <div
              ref={fieldRef}
              className={`w-full h-full bg-green-600 border-2 border-gray-300 rounded-lg relative overflow-hidden select-none ${
                drawingMode ? "cursor-crosshair" : currentAction && !isAnimating ? "cursor-pointer" : "cursor-default"
              }`}
              style={{ marginBottom: bottomMenuVisible && !isMobile ? (isTablet ? "48px" : "64px") : "0px" }}
              onMouseDown={drawingMode ? handleDrawingStart : undefined}
              onMouseMove={handlePlayerMove}
              onMouseUp={handlePlayerEnd}
              onMouseLeave={handlePlayerEnd}
              onTouchStart={drawingMode ? handleDrawingStart : undefined}
              onTouchMove={handlePlayerMove}
              onTouchEnd={handlePlayerEnd}
            >
              {/* Field Markings - Complete Football Field */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Outer boundary */}
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
                <circle cx="50%" cy="50%" r="2" fill="#ffffff" />

                {/* Left penalty area */}
                <rect
                  x="20"
                  y="calc(50% - 94px)"
                  width="100"
                  height="188"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* Left goal area */}
                <rect
                  x="20"
                  y="calc(50% - 54px)"
                  width="60"
                  height="108"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* Left goal */}
                <rect x="15" y="calc(50% - 24px)" width="5" height="48" fill="none" stroke="#ffffff" strokeWidth="3" />

                {/* Right penalty area */}
                <rect
                  x="calc(100% - 120px)"
                  y="calc(50% - 94px)"
                  width="100"
                  height="188"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* Right goal area */}
                <rect
                  x="calc(100% - 80px)"
                  y="calc(50% - 54px)"
                  width="60"
                  height="108"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* Right goal */}
                <rect
                  x="calc(100% - 20px)"
                  y="calc(50% - 24px)"
                  width="5"
                  height="48"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="3"
                />

                {/* Penalty spots */}
                <circle cx="80" cy="50%" r="2" fill="#ffffff" />
                <circle cx="calc(100% - 80px)" cy="50%" r="2" fill="#ffffff" />

                {/* Corner arcs */}
                <path d="M 20 20 Q 30 20 30 30" fill="none" stroke="#ffffff" strokeWidth="2" />
                <path
                  d="M calc(100% - 20px) 20 Q calc(100% - 30px) 20 calc(100% - 30px) 30"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <path
                  d="M 20 calc(100% - 20px) Q 30 calc(100% - 20px) 30 calc(100% - 30px)"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <path
                  d="M calc(100% - 20px) calc(100% - 20px) Q calc(100% - 30px) calc(100% - 20px) calc(100% - 30px) calc(100% - 30px)"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </svg>

              {/* Canvas for drawing */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 1, opacity: isAnimating ? 0 : 1 }}
              />

              {/* Instruction Text */}
              {currentAction && !drawingMode && !isAnimating && (
                <div
                  className={`absolute ${isMobile ? "top-2 left-2" : "top-4 left-4"} bg-black bg-opacity-75 text-white ${isMobile ? "px-2 py-1" : "px-3 py-2"} rounded-lg z-10`}
                >
                  <div className={`${textSizes.base} font-medium`}>
                    {isMobile ? `Tap player for ${currentAction}` : `Click on a player to draw ${currentAction}`}
                  </div>
                </div>
              )}

              {/* Plan Effect Instructions */}
              {!currentAction && !drawingMode && !isAnimating && (
                <div
                  className={`absolute ${isMobile ? "top-2 right-2" : "top-4 right-4"} bg-black bg-opacity-75 text-white ${isMobile ? "px-2 py-1" : "px-3 py-2"} rounded-lg z-10`}
                >
                  <div className={`${textSizes.base} font-medium`}>
                    {isMobile ? `${currentFormation}` : `${currentPlanType} • ${currentStyle} • ${currentFormation}`}
                  </div>
                  {benchPlayers.length > 0 && !isMobile && (
                    <div className={`${textSizes.base} mt-1 opacity-75`}>Drag substitutes to swap players</div>
                  )}
                </div>
              )}

              {/* Multi-Selection Instructions */}
              {multiSelectMode && !isAnimating && (
                <div
                  className={`absolute ${isMobile ? "top-2 left-2" : "top-4 left-4"} bg-purple-600 bg-opacity-90 text-white ${isMobile ? "px-2 py-1" : "px-3 py-2"} rounded-lg z-10`}
                >
                  <div className={`${textSizes.base} font-medium`}>
                    {isMobile
                      ? `Multi-Select: ${selectedPlayers.length} players`
                      : `Multi-Select Mode: Click selected players individually to draw ${selectionLayer || currentAction} (${selectedPlayers.length} selected)`}
                  </div>
                  {!isMobile && (
                    <div className={`${textSizes.base} opacity-75 mt-1`}>
                      Click any selected player to draw their individual movement
                    </div>
                  )}
                </div>
              )}

              {/* Players */}
              {players.map((player) => {
                const isAnimated = animatedPlayers[player.id]
                const isSelected = selectedPlayer === player.id
                const hasDrawing = drawings.some((d) => d.playerId === player.id)
                const absPos = toAbsoluteCoords(player.x, player.y)

                if (isAnimated) {
                  return (
                    <motion.div
                      key={`animated-${player.id}`}
                      className={`absolute rounded-full flex items-center justify-center text-white font-bold z-10 overflow-hidden ${hasDrawing ? "bg-green-500" : "bg-blue-500"}`}
                      style={{
                        width: playerSize,
                        height: playerSize,
                        left: isAnimated.originalPosition.x - playerSize / 2,
                        top: isAnimated.originalPosition.y - playerSize / 2,
                        fontSize: isMobile ? "10px" : isTablet ? "12px" : isTV ? "18px" : "14px",
                      }}
                      animate={{
                        x: isAnimated.path.map((point) => point.x - isAnimated.originalPosition.x),
                        y: isAnimated.path.map((point) => point.y - isAnimated.originalPosition.y),
                      }}
                      transition={{
                        duration: ANIMATION_SPEEDS[animationSpeed].duration,
                        ease: "easeInOut",
                        ...(isAnimated.path.length > 1 && {
                          times: isAnimated.path.map((_, i) => i / (isAnimated.path.length - 1)),
                        }),
                      }}
                    >
                      {player.image ? (
                        <img
                          src={player.image || "/placeholder.svg"}
                          alt={player.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        player.number
                      )}
                    </motion.div>
                  )
                }

                return (
                  <div
                    key={player.id}
                    onDragOver={handleFieldPlayerDragOver}
                    onDrop={(e) => handleFieldPlayerDrop(e, player.id)}
                    className={`absolute rounded-full flex items-center justify-center text-white font-bold select-none hover:scale-110 transition-all duration-300 overflow-hidden ${
                      hasDrawing
                        ? "bg-green-500"
                        : selectedPlayers.includes(player.id)
                          ? selectedPlayer === player.id
                            ? "bg-orange-500 ring-4 ring-orange-300" // Currently active for drawing
                            : "bg-purple-500 ring-2 ring-purple-300" // Selected but not active
                          : selectedPlayer === player.id
                            ? "bg-yellow-500 ring-2 ring-yellow-300"
                            : "bg-blue-500"
                    } ${draggedFromBench ? "ring-2 ring-yellow-400 ring-opacity-50" : ""} ${
                      draggedPlayer === player.id
                        ? "cursor-grabbing scale-110 z-10"
                        : drawingMode || isAnimating
                          ? "cursor-pointer"
                          : currentAction
                            ? "cursor-pointer hover:ring-2 hover:ring-white"
                            : "cursor-grab"
                    }`}
                    style={{
                      width: playerSize,
                      height: playerSize,
                      left: absPos.x - playerSize / 2,
                      top: absPos.y - playerSize / 2,
                      zIndex: 2,
                      fontSize: isMobile ? "10px" : isTablet ? "12px" : isTV ? "18px" : "14px",
                    }}
                    onMouseDown={drawingMode || isAnimating ? undefined : (e) => handlePlayerStart(e, player.id)}
                    onClick={drawingMode || isAnimating ? undefined : (e) => handlePlayerClick(e, player.id)}
                    onTouchStart={drawingMode || isAnimating ? undefined : (e) => handlePlayerStart(e, player.id)}
                    title={`${player.name} (#${player.number})`}
                  >
                    {player.image ? (
                      <img
                        src={player.image || "/placeholder.svg"}
                        alt={player.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      player.number
                    )}
                  </div>
                )
              })}

              {/* Animated Balls for Pass Actions */}
              <AnimatePresence>
                {animatedBalls.map((ball) => (
                  <motion.div
                    key={ball.id}
                    className="absolute rounded-full z-10"
                    style={{
                      width: isMobile ? 12 : isTablet ? 16 : isTV ? 24 : 16,
                      height: isMobile ? 12 : isTablet ? 16 : isTV ? 24 : 16,
                      backgroundColor: ball.color,
                      left: ball.path[0].x - (isMobile ? 6 : isTablet ? 8 : isTV ? 12 : 8),
                      top: ball.path[0].y - (isMobile ? 6 : isTablet ? 8 : isTV ? 12 : 8),
                    }}
                    animate={{
                      x: ball.path.map((point) => point.x - ball.path[0].x),
                      y: ball.path.map((point) => point.y - ball.path[0].y),
                    }}
                    transition={{
                      duration: ANIMATION_SPEEDS[animationSpeed].duration,
                      ease: "easeInOut",
                      ...(ball.path.length > 1 && {
                        times: ball.path.map((_, i) => i / (ball.path.length - 1)),
                      }),
                    }}
                    exit={{ opacity: 0 }}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {sidebarVisible && (
          <div
            className={`fixed right-0 top-0 bottom-0 ${isMobile ? "w-full" : isTablet ? "w-64" : "w-80"} bg-white border-l border-gray-200 overflow-y-auto z-30`}
          >
            <div className={`${spacing} space-y-4`}>
              <div className="flex items-center justify-between">
                <h2 className={`${textSizes.large} font-semibold`}>Players</h2>
                <button
                  className={`${isMobile ? "px-2 py-1" : "px-3 py-1"} border border-gray-300 rounded hover:bg-gray-50`}
                  onClick={toggleSidebar}
                >
                  <EyeOff className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
                </button>
              </div>

              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isMobile ? "h-3 w-3" : "h-4 w-4"} text-gray-400`}
                />
                <input
                  className={`w-full ${isMobile ? "px-2 py-1 pl-8" : "px-3 py-2 pl-10"} border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${textSizes.base}`}
                  placeholder="search players"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button
                className={`w-full ${isMobile ? "px-2 py-1" : "px-3 py-2"} bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center ${isMobile ? "gap-1" : "gap-2"} ${textSizes.base}`}
                onClick={() => setShowPlayerCreator(true)}
              >
                <Plus className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
                Create New Player
              </button>

              <div className="space-y-4">
                {/* Field Players */}
                <div>
                  <h3 className={`${textSizes.base} font-semibold text-gray-700 mb-2`}>Field Players (11)</h3>
                  <div className="space-y-2">
                    {filteredFieldPlayers.map((player) => (
                      <div
                        key={player.id}
                        className={`bg-green-50 border border-green-200 rounded-lg shadow-sm ${isMobile ? "p-2" : "p-3"}`}
                      >
                        <div className={`flex items-center ${isMobile ? "gap-2" : "gap-3"}`}>
                          <div
                            className={`rounded-full bg-green-500 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0`}
                            style={{
                              width: isMobile ? 24 : 32,
                              height: isMobile ? 24 : 32,
                              fontSize: isMobile ? "10px" : "12px",
                            }}
                          >
                            {player.image ? (
                              <img
                                src={player.image || "/placeholder.svg"}
                                alt={player.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              player.number
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`${textSizes.base} font-medium truncate`}>{player.name}</div>
                            <div className={`${isMobile ? "text-xs" : textSizes.base} text-gray-500`}>
                              #{player.number} • {player.position}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bench Players */}
                <div>
                  <h3 className={`${textSizes.base} font-semibold text-gray-700 mb-2`}>
                    Substitutes ({benchPlayers.length})
                  </h3>
                  <div className="space-y-2">
                    {filteredBenchPlayers.map((player) => (
                      <div
                        key={player.id}
                        className={`bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm ${isMobile ? "p-2" : "p-3"} cursor-grab hover:bg-yellow-100 transition-colors ${
                          draggedBenchPlayer === player.id ? "opacity-50" : ""
                        }`}
                        draggable={!isMobile}
                        onDragStart={!isMobile ? (e) => handleBenchPlayerDragStart(e, player.id) : undefined}
                        onDragEnd={!isMobile ? handleBenchPlayerDragEnd : undefined}
                      >
                        <div className={`flex items-center ${isMobile ? "gap-2" : "gap-3"}`}>
                          <div
                            className={`rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0`}
                            style={{
                              width: isMobile ? 24 : 32,
                              height: isMobile ? 24 : 32,
                              fontSize: isMobile ? "10px" : "12px",
                            }}
                          >
                            {player.image ? (
                              <img
                                src={player.image || "/placeholder.svg"}
                                alt={player.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              player.number
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`${textSizes.base} font-medium truncate`}>{player.name}</div>
                            <div className={`${isMobile ? "text-xs" : textSizes.base} text-gray-500`}>
                              #{player.number} • {player.position}
                            </div>
                          </div>
                          <button
                            className="text-red-500 hover:text-red-700 p-1"
                            onClick={() => deletePlayer(player.id, true)}
                            title="Delete player"
                          >
                            <X className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {filteredBenchPlayers.length === 0 && benchPlayers.length > 0 && (
                      <div className={`text-center py-4 text-gray-500 ${textSizes.base}`}>
                        No players match your search
                      </div>
                    )}

                    {benchPlayers.length === 0 && (
                      <div className={`text-center py-4 text-gray-500 ${textSizes.base}`}>No substitute players</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Plan Status */}
              {savedPlan && (
                <div className={`bg-green-50 border border-green-200 rounded-lg ${isMobile ? "p-2" : "p-3"}`}>
                  <div className={`${textSizes.base} font-medium text-green-800`}>Plan Saved</div>
                  <div className={`${isMobile ? "text-xs" : textSizes.base} text-green-600`}>
                    {drawings.length} tactical moves • {savedPlan.formation} • {savedPlan.style}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {bottomMenuVisible && !isMobile && (
        <div
          className={`bg-white border-t border-gray-200 ${sidebarVisible && !isMobile ? (isTablet ? "mr-64" : "mr-80") : "mr-0"} transition-all duration-300 flex-shrink-0`}
        >
          <div className={`${spacing} flex items-center justify-between`}>
            <div className={`flex items-center ${isTablet ? "gap-2" : "gap-4"}`}>
              <button
                className={`${isTablet ? "px-2 py-1" : "px-3 py-1"} border border-gray-300 rounded hover:bg-gray-50`}
                onClick={toggleBottomMenu}
              >
                <EyeOff className={`${isTablet ? "h-3 w-3" : "h-4 w-4"}`} />
              </button>

              {/* Plan Type Dropdown */}
              <div className="relative">
                <button
                  className={`flex items-center ${isTablet ? "gap-1" : "gap-2"} ${isTablet ? "px-2 py-1" : "px-3 py-1"} border border-gray-300 rounded hover:bg-gray-50`}
                  onClick={() => setShowPlanDropdown(!showPlanDropdown)}
                >
                  <span className={textSizes.base}>{isTablet ? currentPlanType.split(" ")[0] : currentPlanType}</span>
                  <ChevronDown className={`${isTablet ? "h-3 w-3" : "h-4 w-4"}`} />
                </button>
                {showPlanDropdown && (
                  <div
                    className={`absolute bottom-full mb-1 left-0 bg-white border border-gray-300 rounded shadow-lg z-50 ${isTablet ? "min-w-32" : "min-w-40"}`}
                  >
                    {PLAN_TYPES.map((planType) => (
                      <button
                        key={planType}
                        className={`block w-full text-left ${isTablet ? "px-2 py-1" : "px-3 py-2"} ${textSizes.base} hover:bg-gray-50`}
                        onClick={() => {
                          changePlanType(planType)
                          setShowPlanDropdown(false)
                        }}
                      >
                        {planType}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={`flex items-center ${isTablet ? "gap-2" : "gap-4"}`}>
              {/* Formation Dropdown */}
              <div className="relative">
                <button
                  className={`flex items-center ${isTablet ? "gap-1" : "gap-2"} ${isTablet ? "px-2 py-1" : "px-3 py-1"} border border-gray-300 rounded hover:bg-gray-50`}
                  onClick={() => setShowFormationDropdown(!showFormationDropdown)}
                >
                  <span className={textSizes.base}>Formation:</span>
                  <span className={`${textSizes.base} font-medium`}>{currentFormation}</span>
                  <ChevronDown className={`${isTablet ? "h-3 w-3" : "h-4 w-4"}`} />
                </button>
                {showFormationDropdown && (
                  <div className="absolute bottom-full mb-1 right-0 bg-white border border-gray-300 rounded shadow-lg z-50">
                    {Object.keys(FORMATIONS).map((formation) => (
                      <button
                        key={formation}
                        className={`block w-full text-left ${isTablet ? "px-2 py-1" : "px-3 py-2"} ${textSizes.base} hover:bg-gray-50`}
                        onClick={() => {
                          changeFormation(formation)
                          setShowFormationDropdown(false)
                        }}
                      >
                        {formation}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Style Dropdown */}
              <div className="relative">
                <button
                  className={`flex items-center ${isTablet ? "gap-1" : "gap-2"} ${isTablet ? "px-2 py-1" : "px-3 py-1"} border border-gray-300 rounded hover:bg-gray-50`}
                  onClick={() => setShowStyleDropdown(!showStyleDropdown)}
                >
                  <span className={textSizes.base}>Style:</span>
                  <span className={`${textSizes.base} font-medium`}>
                    {isTablet ? currentStyle.split(" ")[0] : currentStyle}
                  </span>
                  <ChevronDown className={`${isTablet ? "h-3 w-3" : "h-4 w-4"}`} />
                </button>
                {showStyleDropdown && (
                  <div className="absolute bottom-full mb-1 right-0 bg-white border border-gray-300 rounded shadow-lg z-50">
                    {PLAYING_STYLES.map((style) => (
                      <button
                        key={style}
                        className={`block w-full text-left ${isTablet ? "px-2 py-1" : "px-3 py-2"} ${textSizes.base} hover:bg-gray-50`}
                        onClick={() => {
                          changeStyle(style)
                          setShowStyleDropdown(false)
                        }}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Menu */}
      {isMobile && bottomMenuVisible && (
        <div className="bg-white border-t border-gray-200 p-2 flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            <button className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50" onClick={toggleBottomMenu}>
              <EyeOff className="h-3 w-3" />
            </button>

            <div className="flex items-center gap-1 flex-1">
              <div className="relative flex-1">
                <button
                  className="w-full flex items-center justify-between gap-1 px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 text-xs"
                  onClick={() => setShowFormationDropdown(!showFormationDropdown)}
                >
                  <span>{currentFormation}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                {showFormationDropdown && (
                  <div className="absolute bottom-full mb-1 left-0 right-0 bg-white border border-gray-300 rounded shadow-lg z-50 max-h-32 overflow-y-auto">
                    {Object.keys(FORMATIONS).map((formation) => (
                      <button
                        key={formation}
                        className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-50"
                        onClick={() => {
                          changeFormation(formation)
                          setShowFormationDropdown(false)
                        }}
                      >
                        {formation}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative flex-1">
                <button
                  className="w-full flex items-center justify-between gap-1 px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 text-xs"
                  onClick={() => setShowStyleDropdown(!showStyleDropdown)}
                >
                  <span>{currentStyle.split(" ")[0]}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                {showStyleDropdown && (
                  <div className="absolute bottom-full mb-1 left-0 right-0 bg-white border border-gray-300 rounded shadow-lg z-50 max-h-32 overflow-y-auto">
                    {PLAYING_STYLES.map((style) => (
                      <button
                        key={style}
                        className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-50"
                        onClick={() => {
                          changeStyle(style)
                          setShowStyleDropdown(false)
                        }}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative flex-1">
                <button
                  className="w-full flex items-center justify-between gap-1 px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 text-xs"
                  onClick={() => setShowPlanDropdown(!showPlanDropdown)}
                >
                  <span>{currentPlanType.split(" ")[0]}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                {showPlanDropdown && (
                  <div className="absolute bottom-full mb-1 left-0 right-0 bg-white border border-gray-300 rounded shadow-lg z-50 max-h-32 overflow-y-auto">
                    {PLAN_TYPES.map((planType) => (
                      <button
                        key={planType}
                        className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-50"
                        onClick={() => {
                          changePlanType(planType)
                          setShowPlanDropdown(false)
                        }}
                      >
                        {planType}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toggle buttons for hidden panels */}
      {!navbarVisible && (
        <div
          className={`fixed ${isMobile ? "top-2 left-2" : "top-4 left-4"} z-30 flex ${isMobile ? "gap-1" : "gap-2"}`}
        >
          <button
            className={`${isMobile ? "px-2 py-1" : "px-3 py-1"} border border-gray-300 rounded hover:bg-gray-50 bg-white shadow-lg`}
            onClick={toggleNavbar}
          >
            <Menu className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
          </button>

          {/* Action controls when navbar is hidden */}
          <div
            className={`flex items-center ${isMobile ? "gap-1" : "gap-2"} bg-gray-50 ${isMobile ? "px-2 py-1" : "px-3 py-1"} rounded border shadow-lg`}
          >
            <button
              className={`${isMobile ? "px-1 py-1" : "px-2 py-1"} rounded ${isMobile ? "text-xs" : "text-xs"} ${
                currentAction === "attack"
                  ? "bg-red-500 text-white"
                  : "bg-white border border-red-300 text-red-600 hover:bg-red-50"
              }`}
              onClick={() => handleActionSelect("attack")}
              disabled={drawingMode || isAnimating}
            >
              {isMobile ? "A" : "Attack"}
            </button>
            <button
              className={`${isMobile ? "px-1 py-1" : "px-2 py-1"} rounded ${isMobile ? "text-xs" : "text-xs"} ${
                currentAction === "defense"
                  ? "bg-blue-500 text-white"
                  : "bg-white border border-blue-300 text-blue-600 hover:bg-blue-50"
              }`}
              onClick={() => handleActionSelect("defense")}
              disabled={drawingMode || isAnimating}
            >
              {isMobile ? "D" : "Defense"}
            </button>
            <button
              className={`${isMobile ? "px-1 py-1" : "px-2 py-1"} rounded ${isMobile ? "text-xs" : "text-xs"} ${
                currentAction === "pass"
                  ? "bg-green-500 text-white"
                  : "bg-white border border-green-300 text-green-600 hover:bg-green-50"
              }`}
              onClick={() => handleActionSelect("pass")}
              disabled={drawingMode || isAnimating}
            >
              {isMobile ? "P" : "Pass"}
            </button>
          </div>

          <button
            className={`${isMobile ? "px-2 py-1" : "px-3 py-1"} rounded flex items-center ${isMobile ? "gap-1" : "gap-1"} shadow-lg ${
              isAnimating ? "bg-red-500 text-white hover:bg-red-600" : "bg-green-500 text-white hover:bg-green-600"
            }`}
            onClick={isAnimating ? stopAnimation : startAnimation}
            disabled={!savedPlan}
          >
            {isAnimating ? (
              <Square className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            ) : (
              <Play className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            )}
          </button>
        </div>
      )}

      {!sidebarVisible && (
        <button
          className={`fixed ${isMobile ? "right-2 top-12" : "right-4 top-20"} z-20 ${isMobile ? "px-2 py-1" : "px-3 py-1"} border border-gray-300 rounded hover:bg-gray-50 bg-white shadow-lg`}
          onClick={toggleSidebar}
        >
          <Eye className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
        </button>
      )}

      {!bottomMenuVisible && (
        <button
          className={`fixed ${isMobile ? "bottom-2 left-2" : "bottom-4 left-4"} z-20 ${isMobile ? "px-2 py-1" : "px-3 py-1"} border border-gray-300 rounded hover:bg-gray-50 bg-white shadow-lg`}
          onClick={toggleBottomMenu}
        >
          <Menu className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
        </button>
      )}

      {/* Player Creator Modal */}
      {showPlayerCreator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`bg-white rounded-lg ${isMobile ? "p-4 w-full max-w-sm" : isTablet ? "p-5 w-80" : "p-6 w-96"} max-w-90vw max-h-90vh overflow-y-auto`}
          >
            <div className={`flex items-center justify-between ${isMobile ? "mb-3" : "mb-4"}`}>
              <h3 className={`${textSizes.large} font-semibold`}>Create New Player</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setShowPlayerCreator(false)
                  setNewPlayer({ name: "", number: "", image: null, position: "Midfielder" })
                  setPlayerImagePreview(null)
                }}
              >
                <X className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} />
              </button>
            </div>

            <div className={`space-y-${isMobile ? "3" : "4"}`}>
              {/* Player Image */}
              <div className="text-center">
                <div
                  className={`mx-auto rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ${isMobile ? "mb-2" : "mb-3"}`}
                  style={{
                    width: isMobile ? 60 : isTablet ? 70 : 80,
                    height: isMobile ? 60 : isTablet ? 70 : 80,
                  }}
                >
                  {playerImagePreview ? (
                    <img
                      src={playerImagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className={`text-gray-400 ${textSizes.base}`}>No Image</span>
                  )}
                </div>
                <label
                  className={`cursor-pointer bg-blue-500 text-white ${isMobile ? "px-2 py-1" : "px-3 py-1"} rounded ${textSizes.base} hover:bg-blue-600`}
                >
                  Upload Image
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              {/* Player Name */}
              <div>
                <label className={`block ${textSizes.base} font-medium text-gray-700 mb-1`}>Player Name</label>
                <input
                  type="text"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer((prev) => ({ ...prev, name: e.target.value }))}
                  className={`w-full ${isMobile ? "px-2 py-1" : "px-3 py-2"} border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${textSizes.base}`}
                  placeholder="Enter player name"
                />
              </div>

              {/* Player Number */}
              <div>
                <label className={`block ${textSizes.base} font-medium text-gray-700 mb-1`}>Jersey Number</label>
                <input
                  type="number"
                  value={newPlayer.number}
                  onChange={(e) => setNewPlayer((prev) => ({ ...prev, number: e.target.value }))}
                  className={`w-full ${isMobile ? "px-2 py-1" : "px-3 py-2"} border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${textSizes.base}`}
                  placeholder="Enter jersey number"
                  min="1"
                  max="99"
                />
              </div>

              {/* Player Position */}
              <div>
                <label className={`block ${textSizes.base} font-medium text-gray-700 mb-1`}>Position</label>
                <select
                  value={newPlayer.position}
                  onChange={(e) => setNewPlayer((prev) => ({ ...prev, position: e.target.value }))}
                  className={`w-full ${isMobile ? "px-2 py-1" : "px-3 py-2"} border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${textSizes.base}`}
                >
                  <option value="Goalkeeper">Goalkeeper</option>
                  <option value="Defender">Defender</option>
                  <option value="Midfielder">Midfielder</option>
                  <option value="Forward">Forward</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className={`flex ${isMobile ? "gap-2" : "gap-3"} pt-4`}>
                <button
                  className={`flex-1 ${isMobile ? "px-3 py-1" : "px-4 py-2"} border border-gray-300 rounded hover:bg-gray-50 ${textSizes.base}`}
                  onClick={() => {
                    setShowPlayerCreator(false)
                    setNewPlayer({ name: "", number: "", image: null, position: "Midfielder" })
                    setPlayerImagePreview(null)
                  }}
                >
                  Cancel
                </button>
                <button
                  className={`flex-1 ${isMobile ? "px-3 py-1" : "px-4 py-2"} bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 ${textSizes.base}`}
                  onClick={createPlayer}
                  disabled={!newPlayer.name || !newPlayer.number}
                >
                  Create Player
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(showFormationDropdown || showStyleDropdown || showPlanDropdown || showSpeedDropdown) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowFormationDropdown(false)
            setShowStyleDropdown(false)
            setShowPlanDropdown(false)
            setShowSpeedDropdown(false)
          }}
        />
      )}
    </div>
  )
}
