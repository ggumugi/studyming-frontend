// src/services/socketService.js
import io from 'socket.io-client'

let socket = null
const SERVER_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8002'

export const initSocket = () => {
   if (!socket) {
      socket = io(SERVER_URL, {
         transports: ['websocket', 'polling'],
         reconnection: true,
         reconnectionAttempts: 5,
         reconnectionDelay: 1000,
      })

      socket.on('connect', () => {
         console.log('Socket.IO 연결 성공:', socket.id)
      })

      socket.on('connect_error', (error) => {
         console.error('Socket.IO 연결 오류:', error)
      })
   }

   return socket
}

export const getSocket = () => {
   if (!socket) {
      return initSocket()
   }
   return socket
}

export const disconnectSocket = () => {
   if (socket) {
      socket.disconnect()
      socket = null
   }
}
