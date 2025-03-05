// components/studyGroup/Chat.jsx
import React, { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import styled from 'styled-components'

// 채팅 서버 연결
const chatSocket = io(process.env.REACT_APP_CHAT_SOCKET_SERVER_URL)

const Chat = ({ studygroup, groupmembers, user }) => {
   const groupId = studygroup?.id
   const userId = user?.id

   const [message, setMessage] = useState('')
   const [messages, setMessages] = useState([])
   const chatBoxRef = useRef(null)

   const [myItems, setMyItems] = useState([])
   const [openItemDialog, setOpenItemDialog] = useState(false)
   const [selectedItem, setSelectedItem] = useState(null)

   // 유효성 검사
   if (!userId || !groupId) {
      console.error('userId 또는 groupId가 없습니다.')
   }

   // 채팅방 참가 및 메시지 초기 로드
   useEffect(() => {
      if (groupId) {
         chatSocket.emit('join_room', { roomId: groupId })
         chatSocket.emit('fetch_messages', { roomId: groupId })
         chatSocket.emit('fetch_myitems', { userId })
      }

      chatSocket.on('fetch_messages', (newMessages) => {
         if (!Array.isArray(newMessages)) {
            console.error('서버에서 받은 데이터가 배열이 아님:', newMessages)
            return
         }

         console.log('과거 메시지 수신:', newMessages.length, '개')
         setMessages(newMessages)
      })

      chatSocket.on('receive_message', (newMessage) => {
         console.log('새 메시지 수신:', newMessage)
         setMessages((prevMessages) => [...prevMessages, newMessage])
         scrollToBottom()
      })

      chatSocket.on('fetch_myitems', (items) => {
         console.log('내 아이템 목록 수신:', items)
         setMyItems(items)
      })

      return () => {
         chatSocket.off('fetch_messages')
         chatSocket.off('receive_message')
         chatSocket.off('fetch_myitems')
      }
   }, [groupId, userId])

   // 아이템 전송
   const sendItem = (item) => {
      console.log('선택한 아이템:', item)

      setSelectedItem({
         id: item.id,
         name: item.name,
         img: `http://localhost:8000${item.img}`,
      })

      setMessage(`[아이템] ${item.id}`)
      setOpenItemDialog(false)
   }

   // 스크롤을 아래로 자동 이동
   const scrollToBottom = () => {
      if (chatBoxRef.current) {
         chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
      }
   }

   useEffect(() => {
      scrollToBottom()
   }, [messages])

   // 메시지 전송
   const sendMessage = () => {
      if (message.trim() !== '' && userId && groupId) {
         const isItem = message.startsWith('[아이템]')
         const chatData = {
            senderId: userId,
            groupId,
            content: message,
            messageType: isItem ? 'item' : 'text',
         }

         console.log('메시지 전송:', chatData)
         chatSocket.emit('send_message', chatData)
         setMessage('')
         setSelectedItem(null)
      } else {
         console.error('메시지 전송 실패: userId 또는 groupId가 없음.')
      }
   }

   // 엔터키로 메시지 전송
   const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
         e.preventDefault()
         sendMessage()
      }
   }

   return (
      <ChatContainer>
         <ChatTitle>채팅</ChatTitle>

         <ChatBox ref={chatBoxRef}>
            {messages.map((msg, index) => (
               <ChatMessage key={index} $isMine={msg.senderId === userId}>
                  <MessageSender>{msg.senderNickname || msg.senderId}:</MessageSender>
                  {msg.messageType === 'image' ? <MessageImage src={msg.content.trim()} alt="아이템 이미지" /> : <MessageContent $isError={msg.content === '[아이템이 없습니다]'}>{msg.content}</MessageContent>}
               </ChatMessage>
            ))}
         </ChatBox>

         {/* 선택한 아이템 미리보기 */}
         {selectedItem && (
            <ItemPreview>
               <ItemImage src={selectedItem.img} alt={selectedItem.name} />
               <ItemName>{selectedItem.name}</ItemName>
            </ItemPreview>
         )}

         {/* 입력창 - 수정된 부분 */}
         <InputContainer>
            <TextField
               fullWidth
               variant="outlined"
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               placeholder="메시지를 입력하세요"
               onKeyDown={handleKeyDown}
               sx={{
                  flex: 1,
                  '& .MuiInputBase-input': {
                     padding: '8px',
                  },
               }}
            />
            <ButtonGroup>
               <ItemButton onClick={() => setOpenItemDialog(true)}>내 아이템</ItemButton>
               <SendButton onClick={sendMessage}>전송</SendButton>
            </ButtonGroup>
         </InputContainer>

         {/* 아이템 선택창 */}
         <Dialog open={openItemDialog} onClose={() => setOpenItemDialog(false)}>
            <DialogTitle>내 아이템</DialogTitle>
            <DialogContent>
               {myItems.length > 0 ? (
                  <ItemGrid>
                     {myItems.map((item) => (
                        <ItemCard key={item.id} onClick={() => sendItem(item)}>
                           <ItemCardImage src={`http://localhost:8000${item.img}`} alt={item.name} />
                           <ItemCardName>{item.name}</ItemCardName>
                        </ItemCard>
                     ))}
                  </ItemGrid>
               ) : (
                  <NoItems>아이템이 없습니다.</NoItems>
               )}
            </DialogContent>
            <DialogActions>
               <Button onClick={() => setOpenItemDialog(false)}>닫기</Button>
            </DialogActions>
         </Dialog>
      </ChatContainer>
   )
}

export default Chat

// 스타일 컴포넌트
const ChatContainer = styled.div`
   display: flex;
   flex-direction: column;
   height: calc(100vh - 200px);
   padding: 0;
   gap: 15px;
`

const ChatTitle = styled.h2`
   margin-top: 0;
   margin-bottom: 10px;
   color: #333;
`

const ChatBox = styled.div`
   flex: 1;
   overflow-y: auto;
   border: 1px solid #ccc;
   border-radius: 8px;
   padding: 15px;
   background-color: #f9f9f9;
   display: flex;
   flex-direction: column;
   gap: 10px;
`

const ChatMessage = styled.div`
   display: flex;
   flex-direction: column;
   align-self: ${(props) => (props.$isMine ? 'flex-end' : 'flex-start')};
   max-width: 70%;
   background-color: ${(props) => (props.$isMine ? '#ff7a00' : '#fff')};
   color: ${(props) => (props.$isMine ? '#fff' : '#333')};
   padding: 10px 15px;
   border-radius: 12px;
   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const MessageSender = styled.strong`
   font-size: 14px;
   margin-bottom: 5px;
`

const MessageContent = styled.span`
   color: ${(props) => (props.$isError ? 'red' : 'inherit')};
   word-break: break-word;
`

const MessageImage = styled.img`
   width: 100px;
   height: 100px;
   object-fit: contain;
   border-radius: 5px;
   margin-top: 5px;
`

const ItemPreview = styled.div`
   display: flex;
   align-items: center;
   gap: 10px;
   margin-bottom: 10px;
   padding: 10px;
   background-color: #f0f0f0;
   border-radius: 8px;
`

const ItemImage = styled.img`
   width: 50px;
   height: 50px;
   object-fit: contain;
   border-radius: 5px;
`

const ItemName = styled.span`
   font-weight: 500;
   color: #333;
`

// 수정된 입력 컨테이너 스타일
const InputContainer = styled.div`
   display: flex;
   align-items: center;
   gap: 10px;
   width: 100%;
`

const ButtonGroup = styled.div`
   display: flex;
   gap: 5px;
   white-space: nowrap;
`

const ItemButton = styled(Button)`
   && {
      min-width: 80px;
      height: 40px;
      background-color: #f0f0f0;
      color: #333;
      &:hover {
         background-color: #e0e0e0;
      }
   }
`

const SendButton = styled(Button)`
   && {
      min-width: 80px;
      height: 40px;
      background-color: #ff7a00;
      color: white;
      &:hover {
         background-color: #e06e00;
      }
   }
`

const ItemGrid = styled.div`
   display: grid;
   grid-template-columns: repeat(2, 1fr);
   gap: 15px;
   max-height: 400px;
   overflow-y: auto;
   padding: 10px;
`

const ItemCard = styled.div`
   cursor: pointer;
   border: 1px solid #ddd;
   border-radius: 8px;
   padding: 10px;
   transition: all 0.2s;

   &:hover {
      background-color: #f5f5f5;
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
   }
`

const ItemCardImage = styled.img`
   width: 100%;
   height: 100px;
   object-fit: contain;
   border-radius: 5px;
   margin-bottom: 8px;
`

const ItemCardName = styled.p`
   margin: 0;
   text-align: center;
   font-size: 14px;
   font-weight: 500;
`

const NoItems = styled.p`
   text-align: center;
   color: #666;
   padding: 20px;
`
