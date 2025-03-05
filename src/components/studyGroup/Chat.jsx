import React, { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import { TextField, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

// ✅ 채팅 서버 연결
const chatSocket = io(process.env.REACT_APP_CHAT_SOCKET_SERVER_URL)

const Chat = ({ studygroup, groupmembers, user }) => {
   const groupId = studygroup?.id
   const userId = user.id

   const [message, setMessage] = useState('')
   const [messages, setMessages] = useState([])
   const messagesEndRef = useRef(null)
   const chatBoxRef = useRef(null) // ✅ 채팅창 스크롤을 위한 ref 추가

   const [myItems, setMyItems] = useState([]) // ✅ 내 아이템 목록
   const [openItemDialog, setOpenItemDialog] = useState(false) // ✅ 아이템 선택창 상태
   const [selectedItem, setSelectedItem] = useState(null) // ✅ 선택한 아이템 미리보기
   if (!userId || !groupId) {
      console.error('❌ userId 또는 groupId가 없습니다.')
   }

   // ✅ 채팅방 참가 및 메시지 초기 로드
   useEffect(() => {
      if (groupId) {
         chatSocket.emit('join_room', { roomId: groupId })
         chatSocket.emit('fetch_messages', { roomId: groupId })
         chatSocket.emit('fetch_myitems', { userId }) // ✅ 내 아이템 목록 요청
      }

      chatSocket.on('fetch_messages', (newMessages) => {
         if (!Array.isArray(newMessages)) {
            console.error('❌ 서버에서 받은 데이터가 배열이 아님:', newMessages)
            return
         }

         console.log('📨 과거 메시지 수신:', newMessages.length, '개')

         setMessages(newMessages) // ✅ 기존 메시지를 덮어쓰기
      })

      chatSocket.on('receive_message', (newMessage) => {
         console.log('📩 새 메시지 수신:', newMessage)
         setMessages((prevMessages) => [...prevMessages, newMessage])
         scrollToBottom() // ✅ 새 메시지가 오면 스크롤 하단 유지
      })
      chatSocket.on('fetch_myitems', (items) => {
         console.log('🎁 내 아이템 목록 수신:', items)
         setMyItems(items)
      })

      return () => {
         chatSocket.off('fetch_messages')
         chatSocket.off('receive_message')
         chatSocket.off('fetch_myitems')
      }
   }, [groupId])

   // ✅ 아이템 전송
   const sendItem = (item) => {
      console.log('🛠 선택한 아이템:', item)

      setSelectedItem({
         id: item.id,
         name: item.name,
         img: `http://localhost:8000${item.img}`,
      })

      setMessage(`[아이템] ${item.id}`) // ✅ 입력창에는 아이템 ID만 저장
      setOpenItemDialog(false)
   }

   // ✅ 스크롤을 아래로 자동 이동 (새로운 메시지가 오면)
   const scrollToBottom = () => {
      if (chatBoxRef.current) {
         chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
      }
   }

   useEffect(() => {
      scrollToBottom() // ✅ 초기 메시지 로드 후 스크롤을 하단으로
   }, [messages])

   // ✅ 메시지 전송
   const sendMessage = () => {
      if (message.trim() !== '' && userId && groupId) {
         const isItem = message.startsWith('[아이템]') // ✅ 아이템 여부 확인
         const chatData = {
            senderId: userId,
            groupId,
            content: message, // ✅ 아이템 ID만 포함됨
            messageType: isItem ? 'item' : 'text',
         }

         console.log('📨 메시지 전송:', chatData)
         chatSocket.emit('send_message', chatData)
         setMessage('')
         setSelectedItem(null) // ✅ 아이템 미리보기 초기화
      } else {
         console.error('❌ 메시지 전송 실패: userId 또는 groupId가 없음.')
      }
   }

   // ✅ 엔터키로 메시지 전송
   const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
         e.preventDefault()
         sendMessage()
      }
   }

   return (
      <div className="chat-container">
         <h2>채팅</h2>

         {/* ✅ 채팅창 자체에 스크롤 적용 */}
         {/* <div
            ref={chatBoxRef}
            className="chat-box"
            style={{
               height: '600px', // ✅ 고정된 높이
               overflowY: 'auto', // ✅ 내부 스크롤 활성화
               border: '1px solid #ccc',
               padding: '10px',
               display: 'flex',
               flexDirection: 'column',
            }}
         >
            {messages.map((msg, index) => (
               <div key={index} className={`chat-message ${msg.senderId === userId ? 'mine' : 'others'}`}>
                  <strong>{msg.senderNickname || msg.senderId}:</strong> {msg.content}
               </div>
            ))}
         </div> */}

         <div
            ref={chatBoxRef}
            className="chat-box"
            style={{
               height: '400px',
               overflowY: 'auto',
               border: '1px solid #ccc',
               padding: '10px',
               display: 'flex',
               flexDirection: 'column',
            }}
         >
            {messages.map((msg, index) => (
               <div key={index} className={`chat-message ${msg.senderId === userId ? 'mine' : 'others'}`}>
                  <strong>{msg.senderNickname || msg.senderId}:</strong>

                  {msg.messageType === 'image' ? <img src={msg.content.trim()} alt="아이템 이미지" style={{ width: '100px', height: '100px' }} /> : <span style={{ color: msg.content === '[아이템이 없습니다]' ? 'red' : 'black' }}>{msg.content}</span>}
               </div>
            ))}
         </div>

         {/* ✅ 선택한 아이템 미리보기 */}
         {selectedItem && (
            <div className="item-preview" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
               <img src={selectedItem.img} alt={selectedItem.name} style={{ width: '50px', height: '50px' }} />
               <span>{selectedItem.name}</span>
            </div>
         )}

         {/* 입력창 */}
         <Box className="chat-input">
            <TextField
               fullWidth
               variant="outlined"
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               placeholder="메시지를 입력하세요"
               onKeyDown={handleKeyDown}
               sx={{
                  marginRight: 1,
                  '& .MuiInputBase-input': {
                     padding: '8px',
                  },
               }}
            />
            <Button onClick={() => setOpenItemDialog(true)}>내 아이템</Button>
            <Button onClick={sendMessage}>전송</Button>
         </Box>
         {/* ✅ 아이템 선택창 */}
         <Dialog open={openItemDialog} onClose={() => setOpenItemDialog(false)}>
            <DialogTitle>내 아이템</DialogTitle>
            <DialogContent>
               {myItems.length > 0 ? (
                  myItems.map((item) => (
                     <div key={item.id} onClick={() => sendItem(item)} style={{ cursor: 'pointer', marginBottom: '10px' }}>
                        <img src={`http://localhost:8000${item.img}`} alt={`http://localhost:8000${item.img}`} style={{ width: '100px', height: '100px' }} />
                        <p>{item.name}</p>
                        {console.log('myItems', myItems)}
                     </div>
                  ))
               ) : (
                  <p>아이템이 없습니다.</p>
               )}
            </DialogContent>
            <DialogActions>
               <Button onClick={() => setOpenItemDialog(false)}>닫기</Button>
            </DialogActions>
         </Dialog>
      </div>
   )
}

export default Chat
