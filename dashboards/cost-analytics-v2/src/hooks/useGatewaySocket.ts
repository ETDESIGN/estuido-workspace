import { useEffect, useRef, useState, useCallback } from 'react'

interface GatewayMessage {
  type: 'session_update' | 'cost_update' | 'ping' | 'connect'
  payload?: any
  timestamp?: number
}

interface UseGatewaySocketOptions {
  onMessage?: (message: GatewayMessage) => void
  onConnect?: () => void
  onDisconnect?: () => void
  reconnectInterval?: number
}

export function useGatewaySocket(options: UseGatewaySocketOptions = {}) {
  const { onMessage, onConnect, onDisconnect, reconnectInterval = 5000 } = options
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<GatewayMessage | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const connect = useCallback(() => {
    // Skip WebSocket on Vercel (different host)
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      console.log('[Gateway] WebSocket disabled on production, using polling')
      setIsConnected(false)
      return
    }
    
    // Get token from localStorage or config
    const token = localStorage.getItem('openclaw_token') || 'cd0e7665-2b1e-4a7e-81d4-d4aa54d77012'
    
    try {
      const ws = new WebSocket(`ws://127.0.0.1:18789?token=${token}`)
      
      ws.onopen = () => {
        console.log('[Gateway] Connected')
        setIsConnected(true)
        onConnect?.()
        
        // Subscribe to session updates
        ws.send(JSON.stringify({
          type: 'subscribe',
          channels: ['sessions', 'costs']
        }))
      }
      
      ws.onmessage = (event) => {
        try {
          const message: GatewayMessage = JSON.parse(event.data)
          setLastMessage(message)
          onMessage?.(message)
        } catch (err) {
          console.error('[Gateway] Failed to parse message:', err)
        }
      }
      
      ws.onclose = () => {
        console.log('[Gateway] Disconnected')
        setIsConnected(false)
        onDisconnect?.()
        
        // Auto-reconnect
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('[Gateway] Reconnecting...')
          connect()
        }, reconnectInterval)
      }
      
      ws.onerror = (error) => {
        console.error('[Gateway] Error:', error)
      }
      
      wsRef.current = ws
    } catch (err) {
      console.error('[Gateway] Failed to connect:', err)
    }
  }, [onConnect, onDisconnect, onMessage, reconnectInterval])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    wsRef.current?.close()
  }, [])

  const send = useCallback((message: GatewayMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    }
  }, [])

  useEffect(() => {
    connect()
    return disconnect
  }, [connect, disconnect])

  return { isConnected, lastMessage, send, connect, disconnect }
}
