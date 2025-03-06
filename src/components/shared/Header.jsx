import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material'
import { FaRegEnvelope, FaEnvelope } from 'react-icons/fa'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { logoutUserThunk, checkAuthStatusThunk } from '../../features/authSlice'
import { setCategory } from '../../features/postSlice'
import { fetchNotificationsThunk, markNotificationAsReadThunk, deleteReadNotificationsThunk, sendNotificationThunk } from '../../features/notiSlice'

import { RxHamburgerMenu } from 'react-icons/rx' // 햄버거 아이콘 import 추가

const Header = ({ isAuthenticated, user }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const location = useLocation()

   // 알림 관련 상태
   const [notiOpen, setNotiOpen] = useState(false)
   const noti = useSelector((state) => state.noti?.items || [])
   const unreadCount = noti.filter((notifi) => !notifi.isRead).length
   const notiRef = useRef(null)

   // 쪽지 보내기 모달 상태
   const [sendMessageOpen, setSendMessageOpen] = useState(false)
   const [receiverNickname, setReceiverNickname] = useState('')
   const [messageContent, setMessageContent] = useState('')

   // 쪽지 내용 보기 모달 상태
   const [messageDetailOpen, setMessageDetailOpen] = useState(false)
   const [selectedMessage, setSelectedMessage] = useState(null)

   const [menuOpen, setMenuOpen] = useState(false)

   // 알림 데이터 불러오기
   useEffect(() => {
      if (isAuthenticated && user) {
         dispatch(fetchNotificationsThunk())
      }
   }, [dispatch, isAuthenticated, user])

   // 주기적으로 알림 데이터 새로고침 (60초마다)
   useEffect(() => {
      if (isAuthenticated && user) {
         const intervalId = setInterval(() => {
            dispatch(fetchNotificationsThunk())
         }, 60000)

         return () => clearInterval(intervalId)
      }
   }, [dispatch, isAuthenticated, user])

   // 드롭다운 외부 클릭 시 닫기
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (notiRef.current && !notiRef.current.contains(event.target)) {
            setNotiOpen(false)
         }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
         document.removeEventListener('mousedown', handleClickOutside)
      }
   }, [])

   const handleLogout = useCallback(() => {
      dispatch(logoutUserThunk())
         .unwrap()
         .then(() => {
            window.location.href = '/' // 로그아웃 후 강제 새로고침
         })
         .catch((error) => {
            alert(`로그아웃 실패: ${error}`)
         })
   }, [dispatch])

   // 알림 아이콘 클릭 시 드롭다운 열기
   const handleNotiClick = () => {
      setNotiOpen(!notiOpen)
      // 알림 목록 새로고침
      dispatch(fetchNotificationsThunk())
   }

   // 쪽지 내용 보기
   const handleMessageClick = (notification) => {
      setSelectedMessage(notification)
      setMessageDetailOpen(true)

      // 읽음 표시하기
      if (!notification.isRead) {
         dispatch(markNotificationAsReadThunk(notification.id))
      }

      setNotiOpen(false) // 알림 드롭다운 닫기
   }

   // 쪽지 보내기 모달 열기
   const handleSendMessageClick = () => {
      setSendMessageOpen(true)
      setNotiOpen(false) // 알림 드롭다운 닫기
   }

   // 쪽지 보내기 모달 닫기
   const handleSendMessageClose = () => {
      setSendMessageOpen(false)
      setReceiverNickname('')
      setMessageContent('')
   }

   // 쪽지 보내기 제출
   const handleSendMessage = () => {
      if (!receiverNickname.trim() || !messageContent.trim()) {
         alert('받는 사람과 내용을 모두 입력해주세요.')
         return
      }

      dispatch(
         sendNotificationThunk({
            receiverNickname,
            message: messageContent,
         })
      )
         .unwrap()
         .then(() => {
            alert('쪽지가 성공적으로 전송되었습니다.')
            handleSendMessageClose()
         })
         .catch((error) => {
            alert(`쪽지 전송 실패: ${error}`)
         })
   }

   // 읽은 쪽지 삭제
   const handleDeleteReadMessages = () => {
      if (noti.filter((n) => n.isRead).length === 0) {
         alert('삭제할 읽은 쪽지가 없습니다.')
         return
      }

      dispatch(deleteReadNotificationsThunk())
         .unwrap()
         .then(() => {
            alert('읽은 쪽지가 모두 삭제되었습니다.')
            setNotiOpen(false) // 알림 드롭다운 닫기
         })
         .catch((error) => {
            alert(`쪽지 삭제 실패: ${error}`)
         })
   }

   return (
      <HeaderContainer>
         <HeaderContent>
            {/* 왼쪽 영역: 로고 + 네비게이션 메뉴 */}
            <LeftSection>
               <Link to={isAuthenticated ? '/home' : '/'}>
                  <Logo src="/img/studyming-logo.png" alt="스터디밍 로고" />
               </Link>

               {/* 로그인한 사용자만 메뉴 표시 */}
               {isAuthenticated && (
                  <>
                     <NavMenu>
                        <NavItem>
                           <Link to="/study/list">스터디</Link>
                        </NavItem>
                        <NavItem>
                           <Link to="/mingshop">밍샵</Link>
                        </NavItem>

                        {/* 게시판 - 드롭다운 제거하고 직접 /board로 이동 */}
                        <NavItem>
                           <Link to="/board">게시판</Link>
                        </NavItem>

                        {/* 관리자만 "관리" 메뉴 표시 */}
                        {user?.role === 'ADMIN' && (
                           <Link to="/admin">
                              <NavItem>관리</NavItem>
                           </Link>
                        )}
                     </NavMenu>

                     {/* 모바일 메뉴 */}
                     {menuOpen && (
                        <MobileMenu>
                           {/* 닫기 버튼 */}
                           <CloseButton onClick={() => setMenuOpen(false)}>✖</CloseButton>

                           {/* 유저 정보 (스터디 위) */}
                           <MobileUserContainer>
                              <MobileUserInfo onClick={() => navigate('/mypage')}>{user?.nickname} 님</MobileUserInfo>
                           </MobileUserContainer>

                           {/* 기존 메뉴 */}
                           <NavItem>
                              <Link to="/study/list">스터디</Link>
                           </NavItem>
                           <NavItem>
                              <Link to="/mingshop">밍샵</Link>
                           </NavItem>

                           {/* 게시판 - 드롭다운 제거 */}
                           <NavItem>
                              <Link to="/board">게시판</Link>
                           </NavItem>

                           {/* 관리자 메뉴 (관리자만 보임) */}
                           {user?.role === 'ADMIN' && (
                              <NavItem>
                                 <Link to="/admin">관리</Link>
                              </NavItem>
                           )}

                           {/* 로그아웃 버튼 */}
                           <NavItem onClick={handleLogout}>로그아웃</NavItem>
                        </MobileMenu>
                     )}
                  </>
               )}
            </LeftSection>

            {/* 햄버거 메뉴 (모바일 전용) */}
            {isAuthenticated && (
               <HamburgerMenu onClick={() => setMenuOpen(!menuOpen)}>
                  <RxHamburgerMenu size={30} />
               </HamburgerMenu>
            )}

            {/* 오른쪽 영역: 알림 아이콘 + 유저 메뉴 + 로그아웃 버튼 */}
            <RightSection>
               {isAuthenticated ? (
                  <>
                     {/* 알림 아이콘 - 읽지 않은 알림이 있으면 다른 아이콘 표시 */}
                     <NotificationWrapper ref={notiRef}>
                        <NotificationIconWrapper onClick={handleNotiClick}>
                           {unreadCount > 0 ? (
                              <>
                                 <FaEnvelope style={{ fontSize: 'clamp(14px, 2vw, 20px)', color: '#ff7f00' }} />
                                 <NotificationBadge>{unreadCount}</NotificationBadge>
                              </>
                           ) : (
                              <NotificationIcon style={{ fontSize: 'clamp(14px, 2vw, 20px)' }} />
                           )}
                        </NotificationIconWrapper>

                        {/* 알림 드롭다운 메뉴 */}
                        {notiOpen && (
                           <NotiDropdownMenu>
                              {/* 알림 목록 */}
                              <NotiList>
                                 {noti.length > 0 ? (
                                    noti.map((notification) => (
                                       <NotiItem key={notification.id} onClick={() => handleMessageClick(notification)} $isRead={notification.isRead}>
                                          <strong>{notification.senderNickname}</strong> 님이 쪽지를 보냈습니다.
                                       </NotiItem>
                                    ))
                                 ) : (
                                    <NoNoti>알림이 없습니다.</NoNoti>
                                 )}
                              </NotiList>
                              {/* 하단 액션 버튼 */}
                              <NotiActions>
                                 <NotiActionButton onClick={handleSendMessageClick}>쪽지 보내기</NotiActionButton>
                                 <NotiActionButton onClick={handleDeleteReadMessages}>읽은 쪽지 삭제</NotiActionButton>
                              </NotiActions>
                           </NotiDropdownMenu>
                        )}
                     </NotificationWrapper>

                     {/* 유저 닉네임 - 드롭다운 제거하고 직접 /mypage로 이동 */}
                     <UserWrapper>
                        <UserMenu onClick={() => navigate('/mypage')}>{user?.nickname} 님</UserMenu>
                        <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
                     </UserWrapper>

                     {/* 쪽지 보내기 모달 */}
                     <Dialog open={sendMessageOpen} onClose={handleSendMessageClose} maxWidth="sm" fullWidth>
                        <DialogTitle>쪽지 보내기</DialogTitle>
                        <DialogContent>
                           <TextField autoFocus margin="dense" label="받는 사람 (닉네임)" type="text" fullWidth value={receiverNickname} onChange={(e) => setReceiverNickname(e.target.value)} variant="outlined" sx={{ mb: 2 }} />
                           <TextField margin="dense" label="내용" multiline rows={4} fullWidth value={messageContent} onChange={(e) => setMessageContent(e.target.value)} variant="outlined" />
                        </DialogContent>
                        <DialogActions>
                           <Button onClick={handleSendMessageClose} color="primary">
                              취소
                           </Button>
                           <Button onClick={handleSendMessage} color="primary" variant="contained">
                              보내기
                           </Button>
                        </DialogActions>
                     </Dialog>

                     {/* 쪽지 내용 보기 모달 */}
                     <Dialog open={messageDetailOpen} onClose={() => setMessageDetailOpen(false)} maxWidth="sm" fullWidth>
                        <DialogTitle>
                           <strong>{selectedMessage?.senderNickname}</strong> 님의 쪽지
                        </DialogTitle>
                        <DialogContent>
                           <MessageContent>{selectedMessage?.message}</MessageContent>
                        </DialogContent>
                        <DialogActions>
                           <Button onClick={() => setMessageDetailOpen(false)} color="primary">
                              닫기
                           </Button>
                        </DialogActions>
                     </Dialog>
                  </>
               ) : (
                  <Link to="/login">
                     <NavItem>로그인</NavItem>
                  </Link>
               )}
            </RightSection>
         </HeaderContent>
      </HeaderContainer>
   )
}

export default Header

// 스타일 컴포넌트

const HeaderContainer = styled.header`
   width: 100%;
   height: 60px;
   background-color: #f8f8f8;
   display: flex;
   align-items: center;
   justify-content: center;
   border-bottom: 1px solid #ddd;

   @media (max-width: 580px) {
      justify-content: space-between;
      padding: 0 15px;
   }
`

const HeaderContent = styled.div`
   width: 90%;
   display: flex;
   justify-content: space-between;
   align-items: center;

   @media (max-width: 580px) {
      width: 100%;
   }
`

const LeftSection = styled.div`
   display: flex;
   align-items: center;

   @media (max-width: 580px) {
      flex: 1;
   }
`

const Logo = styled.img`
   height: 25px;
   margin-right: clamp(20px, 4vw, 100px);

   @media (max-width: 580px) {
      margin-right: 0;
   }
`

const RightSection = styled.div`
   display: flex;
   align-items: center;
   gap: clamp(10px, 2vw, 50px);

   @media (max-width: 580px) {
      gap: 10px;
   }
`

const NotificationIconWrapper = styled.div`
   cursor: pointer;

   @media (max-width: 580px) {
      order: 2;
   }
`

// 네비게이션 메뉴
const NavMenu = styled.ul`
   display: flex;
   gap: clamp(20px, 4vw, 80px);
   align-items: center;

   @media (max-width: 580px) {
      display: none;
   }
`

// 햄버거 메뉴 버튼 (모바일 전용)
const HamburgerMenu = styled.div`
   display: none;
   cursor: pointer;

   @media (max-width: 580px) {
      display: block;
   }
`

const NavItem = styled.li`
   font-size: clamp(14px, 1vw, 20px);
   font-weight: 300;
   color: #000;
   cursor: pointer;
   display: flex;
   align-items: center;
   gap: 3px;
   &:hover {
      color: #ff7f00;
   }
`

const NotificationIcon = styled(FaRegEnvelope)`
   font-size: 22px;
   color: #ff7f00;
   cursor: pointer;
   &:hover {
      color: #e66a00;
   }
`

const NotificationWrapper = styled.div`
   position: relative;
`

const NotiDropdownMenu = styled.div`
   position: absolute;
   top: 100%;
   right: 0;
   width: 300px;
   background-color: white;
   border: 1px solid #ddd;
   border-radius: 5px;
   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
   z-index: 100;
   margin-top: 5px;
   max-height: 400px;
   display: flex;
   flex-direction: column;
   overflow: hidden; /* 내부 항목이 테두리를 넘지 않도록 */
`

const NotiList = styled.div`
   overflow-y: auto;
   max-height: 350px;
   padding: 0; /* 패딩 제거 */
`

const NotiItem = styled.div`
   padding: 12px 16px;
   border-bottom: 1px solid #eee;
   font-size: 14px;
   color: ${(props) => (props.$isRead ? '#888' : '#000')};
   background-color: ${(props) => (props.$isRead ? '#f0f0f0' : '#fff')};
   cursor: pointer;
   margin: 0; /* 마진 제거 */

   &:last-child {
      border-bottom: none; /* 마지막 항목의 하단 테두리 제거 */
   }

   &:hover {
      background-color: ${(props) => (props.$isRead ? '#e8e8e8' : '#f0f0f0')};
   }

   strong {
      color: #ff7f00;
   }
`

const NoNoti = styled.div`
   padding: 20px;
   text-align: center;
   color: #888;
   font-size: 14px;
`

const NotiActions = styled.div`
   display: flex;
   justify-content: space-between;
   padding: 12px 16px;
   border-top: 1px solid #ddd;
   background-color: white; /* 배경색 추가 */
`

const NotiActionButton = styled.button`
   background: none;
   border: none;
   color: #ff7f00;
   font-size: 14px;
   font-weight: 500;
   cursor: pointer;
   padding: 5px 10px;

   &:hover {
      text-decoration: underline;
   }
`

const NotificationBadge = styled.span`
   position: absolute;
   top: -8px;
   right: -8px;
   background-color: red;
   color: white;
   font-size: 10px;
   font-weight: bold;
   width: 16px;
   height: 16px;
   border-radius: 50%;
   display: flex;
   align-items: center;
   justify-content: center;
`

const UserWrapper = styled.div`
   display: flex;
   align-items: center;
   gap: clamp(10px, 2vw, 50px);
`

const UserMenu = styled.div`
   font-size: clamp(14px, 1vw, 20px);
   font-weight: 600;
   color: #000;
   cursor: pointer;
   display: flex;
   align-items: center;

   &:hover {
      color: #ff7f00;
   }
   @media (max-width: 580px) {
      display: none;
   }
`

const LogoutButton = styled.button`
   background: none;
   border: none;
   font-size: clamp(14px, 1vw, 20px);
   color: red;
   cursor: pointer;
   &:hover {
      text-decoration: underline;
   }
   @media (max-width: 580px) {
      display: none;
   }
`

const MessageContent = styled.div`
   margin-top: 10px;
   padding: 15px;
   background-color: #f9f9f9;
   border-radius: 8px;
   font-size: 16px;
   line-height: 1.5;
   min-height: 100px;
   white-space: pre-wrap;
`
const MobileMenu = styled.div`
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100vh;
   background: orange;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   z-index: 100;
`

const CloseButton = styled.div`
   position: absolute;
   top: 20px;
   right: 20px;
   font-size: 24px;
   cursor: pointer;
   color: white;
`
// 모바일 전용 유저 정보 스타일
const MobileUserContainer = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   width: 100%;
   padding: 15px;
   background-color: white;
   border-bottom: 1px solid #ddd;
   position: relative;
   z-index: 101;
`

const MobileUserInfo = styled.div`
   font-size: 16px;
   font-weight: 600;
   color: #000;
   cursor: pointer;
   padding: 10px;
   &:hover {
      color: #ff7f00;
   }
`
