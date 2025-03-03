import React, { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'

// ✅ 채팅 서버 연결
const chatSocket = io(process.env.REACT_APP_CHAT_SOCKET_SERVER_URL)

const Chat = ({ studygroup, groupmembers, user }) => {
   // ✅ userId와 groupId를 studygroup과 groupmembers에서 추출
   const groupId = studygroup?.id // 스터디 그룹의 ID
   const userId = user.id // 그룹 멤버 리스트에서 첫 번째 유저 ID 가져오기

   const [message, setMessage] = useState('')
   const [messages, setMessages] = useState([])
   const [typing, setTyping] = useState(false)
   const [typingUsers, setTypingUsers] = useState(new Set()) // ✅ 입력 중인 사용자 목록
   const messagesEndRef = useRef(null)
   const [offset, setOffset] = useState(0) // ✅ 현재 로딩된 메시지 개수
   const limit = 20 // ✅ 한 번에 가져올 개수
   const chatBoxRef = useRef(null)
   const [hasMoreMessages, setHasMoreMessages] = useState(true) // ✅ 더 불러올 메시지가 있는지 확인

   // ✅ 값이 없을 경우 에러 방지
   if (!userId || !groupId) {
      console.error('❌ userId 또는 groupId가 없습니다.')
   }

   // ✅ 채팅방 참가 및 메시지 초기 로드
   useEffect(() => {
      if (groupId) {
         chatSocket.emit('join_room', { roomId: groupId })
         fetchMessages(true) // ✅ 초기 메시지 불러오기
      }

      chatSocket.on('fetch_messages', (newMessages) => {
         if (!Array.isArray(newMessages)) {
            console.error('❌ 서버에서 받은 메시지가 배열이 아님:', newMessages)
            return
         }

         console.log('📨 과거 메시지 수신:', newMessages.length, '개')

         if (newMessages.length < limit) {
            setHasMoreMessages(false) // ✅ 더 이상 불러올 메시지가 없음
         }

         setMessages((prevMessages) => [...newMessages, ...prevMessages]) // ✅ 기존 메시지 앞에 추가
      })

      chatSocket.on('receive_message', (newMessage) => {
         console.log('📩 새 메시지 수신:', newMessage)
         setMessages((prevMessages) => [...prevMessages, newMessage])
      })

      return () => {
         chatSocket.off('fetch_messages')
         chatSocket.off('receive_message')
      }
   }, [groupId])

   // ✅ 메시지 불러오기 함수 (최초 또는 추가 로드)
   const fetchMessages = (initial = false) => {
      if (!hasMoreMessages) return

      const newOffset = initial ? 0 : offset + limit
      setOffset(newOffset)
      chatSocket.emit('fetch_messages', { roomId: groupId, offset: newOffset, limit })
   }

   useEffect(() => {
      chatSocket.on('fetch_messages', (data) => {
         if (!data || !Array.isArray(data)) {
            console.error('❌ 서버에서 받은 데이터가 올바르지 않음:', data)
            return
         }

         console.log('📨 과거 메시지 수신:', data.length, '개')

         if (data.length < limit) {
            setHasMoreMessages(false) // ✅ 더 이상 불러올 메시지가 없음.
         }

         setMessages((prevMessages) => [...data, ...prevMessages]) // ✅ 기존 메시지 앞에 추가
      })

      return () => {
         chatSocket.off('fetch_messages')
      }
   }, [])

   // ✅ 무한 스크롤: 스크롤이 상단에 도달하면 추가 메시지 로드
   const handleScroll = () => {
      if (chatBoxRef.current) {
         const { scrollTop } = chatBoxRef.current
         if (scrollTop === 0) {
            // ✅ 스크롤이 맨 위면
            fetchMessages()
         }
      }
   }

   useEffect(() => {
      if (chatBoxRef.current) {
         chatBoxRef.current.addEventListener('scroll', handleScroll)
      }
      return () => {
         if (chatBoxRef.current) {
            chatBoxRef.current.removeEventListener('scroll', handleScroll)
         }
      }
   }, [offset, hasMoreMessages])

   // ✅ 메시지 수신 & 입력 상태 감지
   useEffect(() => {
      chatSocket.on('user_typing', (data) => {
         if (data.userId !== userId) {
            setTypingUsers((prev) => new Set([...prev, data.userId]))
         }
      })

      chatSocket.on('user_stopped_typing', (data) => {
         if (data.userId !== userId) {
            setTypingUsers((prev) => {
               const newTypingUsers = new Set(prev)
               newTypingUsers.delete(data.userId)
               return newTypingUsers
            })
         }
      })

      return () => {
         chatSocket.off('user_typing')
         chatSocket.off('user_stopped_typing')
      }
   }, [userId])
   // ✅ 입력 중 이벤트 처리
   // ✅ 사용자가 입력을 멈추면 자동으로 `user_stopped_typing` 전송
   const handleTyping = (e) => {
      setMessage(e.target.value)

      if (e.target.value.trim() !== '') {
         chatSocket.emit('user_typing', { roomId: groupId, userId })
      } else {
         chatSocket.emit('user_stopped_typing', { roomId: groupId, userId })
      }
   }

   // ✅ 30초 후 자동으로 `user_stopped_typing` 실행
   useEffect(() => {
      if (message.trim() !== '') {
         const timeout = setTimeout(() => {
            chatSocket.emit('user_stopped_typing', { roomId: groupId, userId })
         }, 30000) // 30초 후 자동 실행
         return () => clearTimeout(timeout)
      }
   }, [message])

   // ✅ 메시지 전송 (그룹 채팅)
   const sendMessage = () => {
      if (message.trim() !== '' && userId && groupId) {
         const chatData = {
            senderId: userId,
            groupId,
            content: message,
            messageType: 'text',
         }

         console.log('📨 메시지 전송:', chatData)
         chatSocket.emit('send_message', chatData)
         setMessage('')
      } else {
         console.error('❌ 메시지 전송 실패: userId 또는 groupId가 없음.')
      }
   }

   // // ✅ 스크롤을 하단으로 유지
   // useEffect(() => {
   //    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
   // }, [messages])

   return (
      <div className="chat-container">
         <h2>채팅</h2>

         {/* ✅ 채팅 메시지 영역 (스크롤 가능) */}
         <div ref={chatBoxRef} className="chat-box">
            {hasMoreMessages && <div className="loading">이전 메시지 불러오는 중...</div>}
            {messages.map((msg, index) => (
               <div key={index} className={`chat-message ${msg.senderId === userId ? 'mine' : 'others'}`}>
                  <strong>{msg.senderNickname || msg.senderId}:</strong> {msg.content}
               </div>
            ))}
         </div>

         {/* 입력 중 알림 */}
         <div className="typing-indicator">{typingUsers.size > 0 && <p>{[...typingUsers].join(', ')}님이 입력 중...</p>}</div>

         {/* 입력창 */}
         <div className="chat-input">
            <input type="text" value={message} onChange={handleTyping} placeholder="메시지를 입력하세요..." />
            <button onClick={sendMessage}>전송</button>
         </div>
      </div>
   )
}

export default Chat
