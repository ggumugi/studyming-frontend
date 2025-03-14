import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { fetchItems } from '../features/itemSlice' // ✅ 상품 목록 가져오기 액션
import { fetchUserPoints, sendPointsThunk, chargePointsThunk } from '../features/pointSlice' // ✅ 유저 포인트 조회
import ItemList from '../components/shop/ItemList'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, TextField, MenuItem } from '@mui/material'

const MingShopPage = ({ isAuthenticated, user }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const [loading, setLoading] = useState(true)

   // ✅ user가 없으면 기본값 설정
   const userRole = user?.role ?? 'USER'

   // ✅ Redux에서 현재 보유 포인트 가져오기
   const userPoints = useSelector((state) => state.points?.points ?? 0)

   // ✅ Redux에서 상품 목록 가져오기
   const items = useSelector((state) => state.items.items)

   // ✅ 모든 API 요청을 한 번에 실행하여 로딩 시간 최적화
   useEffect(() => {
      setLoading(true)
      Promise.all([dispatch(fetchItems()), dispatch(fetchUserPoints())]).finally(() => setLoading(false))
   }, [dispatch])

   const titleList = ['채팅방의 인싸템! 이모티콘', '삭막한 채팅창에 활력을! 채팅창 꾸미기', '이것만 있다면 당신도 될 수 있다 공부왕!']

   // 모달 상태 관리
   const [open, setOpen] = useState(false)
   const [receiver, setReceiver] = useState('')
   const [amount, setAmount] = useState(100)

   const pointOptions = [100, 200, 300, 400, 500]

   const handleSendPoints = () => {
      if (!receiver) {
         alert('받는 사람을 입력하세요.')
         return
      }

      dispatch(sendPointsThunk({ receiverNickname: receiver, amount }))
         .unwrap()
         .then(() => {
            alert('포인트 선물 성공!')
            setOpen(false)
            dispatch(fetchUserPoints())
         })
         .catch((error) => {
            alert(`포인트 선물 실패: ${error}`)
         })
   }

   const handleChargePoints = async () => {
      const { IMP } = window
      IMP.init('imp40778828') // 아임포트 가맹점 코드 설정

      IMP.request_pay(
         {
            pg: 'html5_inicis.INIpayTest',
            pay_method: 'card',
            merchant_uid: `mid_${new Date().getTime()}`,
            name: '포인트 충전',
            amount: 1000,
            buyer_email: user.email,
            buyer_name: user.username,
         },
         async (response) => {
            if (response.success) {
               dispatch(chargePointsThunk({ imp_uid: response.imp_uid, amount: response.paid_amount }))
            } else {
               alert(`결제 실패: ${response.error_msg}`)
            }
         }
      )
   }

   if (loading) return <Container>상품을 불러오는 중...</Container> // ✅ 로딩 중 화면 표시
   return (
      <Container>
         <Title>
            <UserPointsContainer>
               <UserPoint>현재 보유 포인트: {userPoints} 밍</UserPoint>
               <div>
                  <Button
                     variant="contained"
                     sx={{
                        backgroundColor: 'transparent',
                        fontSize: 'clamp(12px, 1vw, 14px)',
                        marginRight: '10px',
                        fontWeight: '300',
                        borderRadius: '20px',
                        border: '1px solid white',
                     }}
                     onClick={handleChargePoints}
                  >
                     포인트 충전
                  </Button>
                  <Button
                     variant="contained"
                     sx={{
                        fontSize: 'clamp(12px, 1vw, 14px)',
                        borderRadius: '20px',
                        border: '1px solid white',
                        backgroundColor: 'transparent',
                        color: 'white',
                        marginRight: '10px',
                        fontWeight: '300',
                     }}
                     onClick={() => setOpen(true)}
                  >
                     선물하기
                  </Button>
                  {userRole === 'ADMIN' && (
                     <Button
                        variant="contained"
                        sx={{
                           fontSize: 'clamp(12px, 1vw, 14px)',
                           border: '1px solid white',
                           borderRadius: '20px',
                           backgroundColor: 'transparent',
                           color: 'white',
                           marginRight: '10px',
                           fontWeight: '300',
                        }}
                        onClick={() => navigate('/mingshop/create')}
                        isAuthenticated={isAuthenticated}
                        user={user}
                     >
                        등록하기
                     </Button>
                  )}
               </div>
            </UserPointsContainer>

            {/* 선물하기 모달 */}
            <Modal open={open} onClose={() => setOpen(false)}>
               <ModalContent>
                  <h3 style={{ paddingBottom: '10px' }}>포인트 선물</h3>
                  <TextField label="받는 사람 닉네임" fullWidth value={receiver} onChange={(e) => setReceiver(e.target.value)} sx={{ marginBottom: '10px' }} />
                  <TextField select label="보낼 포인트" fullWidth value={amount} onChange={(e) => setAmount(e.target.value)} sx={{ marginBottom: '10px' }}>
                     {pointOptions.map((option) => (
                        <MenuItem sx={{ marginLeft: '20px' }} key={option} value={option}>
                           {option} 밍
                        </MenuItem>
                     ))}
                  </TextField>
                  <Button variant="contained" color="primary" fullWidth onClick={handleSendPoints}>
                     확인
                  </Button>
               </ModalContent>
            </Modal>
         </Title>

         <Title>{titleList[0]}</Title>
         <ItemList items={items.filter((item) => item.type === 'emoticon')} isAuthenticated={isAuthenticated} user={user} />
         <Title>{titleList[1]}</Title>
         <ItemList items={items.filter((item) => item.type === 'decoration')} isAuthenticated={isAuthenticated} user={user} />
         <Title>{titleList[2]}</Title>
         <ItemList items={items.filter((item) => item.type === 'studytool')} isAuthenticated={isAuthenticated} user={user} />
      </Container>
   )
}

export default MingShopPage

// Styled Components
const UserPointsContainer = styled.div`
   color: white;
   display: flex;
   justify-content: space-between;
   align-items: center;
   width: 100%;
   max-width: 1200px;
   font-weight: 300;
   font-size: clamp(14px, 2vw, 20px);
   padding: 20px;
   background-color: rgba(255, 122, 0, 0.7);
   border-radius: 40px 0px 40px 0px;
   flex-wrap: wrap; /* 💡 요소가 너무 넓어지지 않도록 wrap 적용 */

   @media (max-width: 1024px) {
      flex-direction: column; /* 📌 태블릿에서는 세로 정렬 */
      text-align: center;
   }

   @media (max-width: 768px) {
      font-size: 14px;
      padding: 15px;
   }

   @media (max-width: 480px) {
      font-size: 12px;
      padding: 10px;
   }
`

const Container = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   padding: 50px;
   width: 100%;
   max-width: 1200px;
   margin: 0 auto;
   @media (max-width: 1024px) {
      padding: 30px;
   }

   @media (max-width: 768px) {
      padding: 20px;
   }
`

const Title = styled.h2`
   display: flex;
   justify-content: space-between; /* 🔹 좌우 정렬 */
   align-items: center; /* 🔹 세로 정렬 */
   width: 100%; /* 컨테이너의 전체 길이 */
   // max-width: 1200px; /* 최대 너비 설정 */
   text-align: left; /* 왼쪽 정렬 */
   font-weight: 300;
   font-size: clamp(14px, 2vw, 20px);
   border-bottom: 2px solid #ff7a00;
   padding-bottom: 10px;
   margin-bottom: 40px; /* 아이템과 간격 추가 */
   &:first-of-type {
      border-bottom: none;
   }
   @media (max-width: 1024px) {
      font-size: 18px;
   }

   @media (max-width: 768px) {
      font-size: 16px;
   }

   @media (max-width: 480px) {
      font-size: 14px;
      text-align: center;
   }
`
const ModalContent = styled.div`
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   background: white;
   padding: 20px;
   box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
   border-radius: 10px;
   width: 300px;
   display: flex;
   flex-direction: column;
   @media (max-width: 480px) {
      width: 250px; /* 작은 화면에서 모달 크기 조정 */
   }
`
const UserPoint = styled.div`
   @media (max-width: 1024px) {
      margin-bottom: 10px;
   }
`
