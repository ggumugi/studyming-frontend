import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { fetchItems } from '../features/itemSlice' // ✅ 상품 목록 가져오기 액션
import { fetchUserPoints, sendPointsThunk } from '../features/pointSlice' // ✅ 유저 포인트 조회
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

   const titleList = ['이 모든 매력적인 상품을 쉽고 빠르게 구매할 수 있는 방법', '채팅방의 인싸템! 이모티콘', '삭막한 채팅창에 활력을! 채팅창 꾸미기', '이것만 있다면 당신도 될 수 있다 공부왕!']

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

   if (loading) return <Container>상품을 불러오는 중...</Container> // ✅ 로딩 중 화면 표시
   return (
      <Container>
         <Title>
            현재 보유 포인트: {userPoints} 밍
            <div>
               <Button variant="contained" sx={{ borderRadius: '20px', backgroundColor: '#FF5733', color: '#fff', marginRight: '10px' }} onClick={() => setOpen(true)}>
                  선물하기
               </Button>
               {userRole === 'ADMIN' && (
                  <Button
                     variant="contained"
                     sx={{
                        borderRadius: '20px',
                        backgroundColor: '#FF5733',
                        color: '#fff',
                        marginRight: '10px',
                        '&:hover': { backgroundColor: '#E74C3C' },
                     }}
                     onClick={() => navigate('/mingshop/create')}
                     isAuthenticated={isAuthenticated}
                     user={user}
                  >
                     등록하기
                  </Button>
               )}
            </div>
            {/* 선물하기 모달 */}
            <Modal open={open} onClose={() => setOpen(false)}>
               <ModalContent>
                  <h3 style={{ paddingBottom: '10px' }}>포인트 선물</h3>
                  <TextField label="받는 사람 닉네임" fullWidth value={receiver} onChange={(e) => setReceiver(e.target.value)} sx={{ marginBottom: '10px' }} />
                  <TextField select label="보낼 포인트" fullWidth value={amount} onChange={(e) => setAmount(e.target.value)} sx={{ marginBottom: '10px' }}>
                     {pointOptions.map((option) => (
                        <MenuItem key={option} value={option}>
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
         <ItemList items={items.filter((item) => item.type === 'cash')} isAuthenticated={isAuthenticated} user={user} />
         <Title>{titleList[1]}</Title>
         <ItemList items={items.filter((item) => item.type === 'emoticon')} isAuthenticated={isAuthenticated} user={user} />
         <Title>{titleList[2]}</Title>
         <ItemList items={items.filter((item) => item.type === 'decoration')} isAuthenticated={isAuthenticated} user={user} />
         <Title>{titleList[3]}</Title>
         <ItemList items={items.filter((item) => item.type === 'studytool')} isAuthenticated={isAuthenticated} user={user} />
      </Container>
   )
}

export default MingShopPage

// Styled Components
const Container = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   padding: 50px;
   width: 100%;
`

const Title = styled.h2`
   display: flex;
   justify-content: space-between; /* 🔹 좌우 정렬 */
   align-items: center; /* 🔹 세로 정렬 */
   width: 100%; /* 컨테이너의 전체 길이 */
   max-width: 1200px; /* 최대 너비 설정 */
   text-align: left; /* 왼쪽 정렬 */
   font-weight: 300;
   font-size: 32px;
   border-bottom: 2px solid #ff7a00;
   padding-bottom: 10px;
   margin-bottom: 40px; /* 아이템과 간격 추가 */
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
`

const ItemGrid = styled.div`
   display: grid;
   grid-template-columns: repeat(4, 1fr); /* 한 줄에 네 개씩 */
   gap: 20px;
   max-width: 1200px; /* 최대 너비 설정 */
   width: 100%;
   margin: 0 auto; /* 가운데 정렬 */
   margin-bottom: 50px; /* 다음 title과 간격 추가 */
`

const ItemCard = styled.div`
   background-color: #fff; /* 흰색 배경 */
   border-radius: 8px;
   padding: 20px;
   text-align: center;
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   height: 300px; /* 아이템 카드 고정 높이 설정 */
   max-width: 325px;
`

const ImageWrapper = styled.div`
   width: 100%;
   max-width: 280px;
   height: 200px; /* 고정된 이미지 높이 */
   margin-bottom: 10px;
   box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
   border-radius: 16px; /* 부드러운 곡선 */
   overflow: hidden;
`

const ItemImage = styled.img`
   width: 100%;
   height: 100%;
   object-fit: contain; /* 이미지를 잘라서 박스에 맞게 크기 조정 */
   transform: scale(0.6);
`

const ItemTitle = styled.h3`
   font-size: 18px;
   margin-bottom: 5px;
`

const ItemDescription = styled.p`
   font-size: 14px;
   color: #999;
   margin-bottom: 5px;
`

const ItemDate = styled.p`
   font-size: 12px;
   color: #999;
`
