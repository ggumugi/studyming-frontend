import React, { useEffect, useState, useRef } from 'react'
import io from 'socket.io-client'

const socket = io(process.env.REACT_APP_SOCKET_SERVER_URL)

const Chat = ({ userId, groupId }) => {
   const [message, setMessage] = useState('')
   const [messages, setMessages] = useState([])
   const [typing, setTyping] = useState(false) // 입력 중 상태
   const messagesEndRef = useRef(null) // 스크롤 하단 고정

   // 과거 채팅 내역 불러오기
   useEffect(() => {
      socket.emit('fetch_messages', { roomId: groupId })

      socket.on('fetch_messages', (history) => {
         setMessages(history)
      })

      return () => {
         socket.off('fetch_messages')
      }
   }, [groupId])

   // 새 메시지 수신
   useEffect(() => {
      socket.on('receive_message', (newMessage) => {
         setMessages((prevMessages) => [...prevMessages, newMessage])
      })

      socket.on('user_typing', (data) => {
         if (data.userId !== userId) {
            setTyping(true)
         }
      })

      socket.on('user_stopped_typing', (data) => {
         if (data.userId !== userId) {
            setTyping(false)
         }
      })

      return () => {
         socket.off('receive_message')
         socket.off('user_typing')
         socket.off('user_stopped_typing')
      }
   }, [userId])

   // 메시지 전송
   const sendMessage = () => {
      if (message.trim() !== '') {
         const chatData = {
            senderId: userId,
            groupId,
            content: message,
            messageType: 'text',
         }
         socket.emit('send_message', chatData)
         setMessage('')
      }
   }

   // 입력 감지
   const handleTyping = (e) => {
      setMessage(e.target.value)

      if (e.target.value.trim() !== '') {
         socket.emit('user_typing', { roomId: groupId, userId })
      } else {
         socket.emit('user_stopped_typing', { roomId: groupId, userId })
      }
   }

   // 스크롤을 하단으로 유지
   useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
   }, [messages])

   return (
      <div className="chat-container">
         <h2>채팅</h2>

         {/* 메시지 출력 영역 */}
         <div className="chat-box">
            {messages.map((msg, index) => (
               <div key={index} className={`chat-message ${msg.senderId === userId ? 'mine' : 'others'}`}>
                  <strong>{msg.senderId}:</strong> {msg.content}
               </div>
            ))}
            <div ref={messagesEndRef} />
         </div>

         {/* 입력 중 알림 */}
         {typing && <p className="typing-indicator">상대방이 입력 중입니다...</p>}

         {/* 입력창 */}
         <div className="chat-input">
            <input type="text" value={message} onChange={handleTyping} placeholder="메시지를 입력하세요..." />
            <button onClick={sendMessage}>전송</button>
         </div>
      </div>
   )
}

export default Chat
