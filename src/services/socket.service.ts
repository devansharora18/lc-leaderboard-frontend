import { io, Socket } from 'socket.io-client'
import { authService } from './auth.service'

type ReceiveMessagePayload = {
  id: string
  groupId: string
  message: string
  sender: { id: string; username: string }
  timestamp: string | Date
}

type MessageListener = (msg: ReceiveMessagePayload) => void

class SocketService {
  private socket: Socket | null = null
  private listeners = new Set<MessageListener>()
  private joinedGroups = new Set<string>()
  private connecting = false

  private getSocketUrl(): string {
    const api = process.env.NEXT_PUBLIC_BACKEND_URL || ''
    try {
      const url = new URL(api)
      const cleaned = url.pathname.replace(/\/?api\/?$/, '/')
      url.pathname = cleaned
      return url.toString().replace(/\/$/, '')
    } catch {
      return api
    }
  }

  async ensureConnected(): Promise<void> {
    if (this.socket && this.socket.connected) return
    if (this.connecting) return new Promise((res) => {
      const check = () => {
        if (this.socket && this.socket.connected) {
          res()
        } else {
          setTimeout(check, 50)
        }
      }
      check()
    })

    this.connecting = true
    const token = authService.getStoredToken()
    const baseUrl = this.getSocketUrl()
    this.socket = io(baseUrl, {
      transports: ['websocket'],
      auth: { token },
      autoConnect: true,
      withCredentials: true,
    })

    this.socket.on('connect', () => {
      this.connecting = false
    })
    this.socket.on('connect_error', () => {
      this.connecting = false
    })

    this.socket.on('receive_message', (payload: ReceiveMessagePayload) => {
      this.listeners.forEach((cb) => cb(payload))
    })
  }

  onMessage(cb: MessageListener) {
    this.listeners.add(cb)
    return () => {
      this.listeners.delete(cb)
    }
  }

  async joinGroup(groupId: string) {
    await this.ensureConnected()
    if (!this.socket) return
    if (this.joinedGroups.has(groupId)) return
    this.socket.emit('join_group', groupId)
    this.joinedGroups.add(groupId)
  }

  leaveGroup(groupId: string) {
    if (!this.socket) return
    if (!this.joinedGroups.has(groupId)) return
    this.socket.emit('leave_group', groupId)
    this.joinedGroups.delete(groupId)
  }

  async sendMessage(groupId: string, message: string, sender?: { id: string; username: string }): Promise<boolean> {
    await this.ensureConnected()
    if (!this.socket) return false
    try {
      this.socket.emit('send_message', { groupId, message, sender })
      return true
    } catch {
      return false
    }
  }

  disconnect() {
    if (this.socket) {
      try { this.socket.disconnect() } catch {}
    }
    this.socket = null
    this.joinedGroups.clear()
    this.listeners.clear()
    this.connecting = false
  }
}

export const socketService = new SocketService()
